/**
 * Build one bilingual blog draft from the RSS feeds in blog-feeds.json.
 * Writes Markdown only. Does not commit, push, or merge.
 *
 * Exits 0 with status=skipped when there is nothing to do.
 * Exits 1 when a model response cannot be checked against the sources.
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATEGORIES = ['economy', 'real-estate', 'business', 'culture', 'policy'];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FALLBACK_IMAGE = '../../../assets/guides/downtown-skyline.jpg';
const FALLBACK_ALT = {
  en: 'Downtown Miami skyline, with One Thousand Museum at the center.',
  es: 'El skyline del centro de Miami, con One Thousand Museum en el centro.',
};
const FALLBACK_CREDIT =
  'Photo: Phillip Pessar, CC BY 2.0, via Wikimedia Commons (https://commons.wikimedia.org/wiki/File:One_Thousand_Museum_Tower_Downtown_Miami_-_Tower.jpg)';

const SYSTEM = `You write one bilingual blog draft for Mariana Ramírez, a luxury real estate advisor at SERHANT. in Miami.

Rules:
- Use only facts, numbers, and quotations that appear in the source items. If it is not in those items, leave it out.
- Cite every source you rely on. Every URL in sources must be copied exactly from the source items. Do not add any other URL.
- Do not invent prices, statistics, dates, quotes, or market claims.
- Tone: polished, calm, and non-partisan. No slogans and no realtor clichés.
- Politics only as policy and economic impact: rates, taxes, and housing policy. No partisan opinion. Do not praise or attack a party, politician, or candidate.
- Write the Spanish as natural prose, not a word-for-word translation of the English.
- The body is Markdown paragraphs. Do not include frontmatter or a title heading.
- Output one JSON object and nothing else, with this shape:
{
  "translationKey": "lowercase-hyphen-slug",
  "category": "economy",
  "en": { "title": "", "description": "", "body": "" },
  "es": { "title": "", "description": "", "body": "" },
  "sources": [{ "url": "" }]
}
category is one of: economy, real-estate, business, culture, policy.
description is one or two sentences.`;

function output(key, value) {
  const line = `${key}=${String(value).replace(/\n/g, ' ')}`;
  console.log(line);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${line}\n`);
}

function skip(reason) {
  console.log(reason);
  output('status', 'skipped');
  process.exit(0);
}

function decode(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tagText(block, names) {
  for (const name of names) {
    const pattern = new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, 'i');
    const match = pattern.exec(block);
    if (match) return decode(match[1]);
  }
  return '';
}

function linkFrom(block) {
  const text = tagText(block, ['link']);
  if (text.startsWith('http')) return text;
  const href = /<link\b[^>]*href=["']([^"']+)["']/i.exec(block);
  return href ? href[1].trim() : '';
}

export function parseFeed(xml) {
  const blocks = xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/gi) || [];
  return blocks
    .map((block) => {
      const title = tagText(block, ['title']);
      const url = linkFrom(block);
      const summary = tagText(block, ['description', 'summary', 'content']);
      const when = tagText(block, ['pubDate', 'published', 'updated', 'dc:date']);
      const date = when ? new Date(when) : null;
      if (!title || !url || !date || Number.isNaN(date.getTime())) return null;
      return { title, url, summary: summary.slice(0, 1200), date };
    })
    .filter(Boolean);
}

function numberTokens(text) {
  return new Set((text.match(/\d+(?:[.,]\d+)*%?/g) || []).map((token) => token.replace(/,/g, '').replace(/%$/, '')));
}

function nyDateKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function isSevenAmNewYork() {
  const hour = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    hourCycle: 'h23',
  }).format(new Date());
  return hour === '07';
}

async function fetchText(url, headers = {}) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'MarianaRamirezBlog/1.0 (+https://marianaramirezrealestate.com)', ...headers },
    signal: AbortSignal.timeout(20000),
    redirect: 'follow',
  });
  const text = await response.text();
  return { ok: response.ok, status: response.status, text, headers: response.headers };
}

async function loadItems(config) {
  const cutoff = Date.now() - config.maxAgeHours * 60 * 60 * 1000;
  const items = [];
  for (const feed of config.feeds) {
    try {
      const result = await fetchText(feed.url);
      if (!result.ok || !/<(rss|feed|item|entry)\b/i.test(result.text)) {
        console.log(`Feed ${feed.id} skipped: HTTP ${result.status}, not an RSS or Atom document.`);
        continue;
      }
      const parsed = parseFeed(result.text);
      const fresh = parsed.filter((item) => item.date.getTime() >= cutoff);
      console.log(`Feed ${feed.id}: ${fresh.length} item(s) in the last ${config.maxAgeHours} hours.`);
      for (const item of fresh) items.push({ ...item, publisher: feed.publisher });
    } catch (error) {
      console.log(`Feed ${feed.id} skipped: ${error instanceof Error ? error.message : 'request failed'}.`);
    }
  }
  items.sort((a, b) => b.date.getTime() - a.date.getTime());
  return items.slice(0, 8);
}

function yamlQuote(value) {
  return JSON.stringify(String(value).replace(/\s+/g, ' ').trim());
}

function articleFile({ lang, date, key, article, category, image, alt, credit, sources }) {
  const sourceYaml = sources
    .map(
      (source) =>
        `  - title: ${yamlQuote(source.title)}\n    url: ${yamlQuote(source.url)}\n    publisher: ${yamlQuote(source.publisher)}`,
    )
    .join('\n');
  return `---
title: ${yamlQuote(article.title)}
description: ${yamlQuote(article.description)}
date: ${date}
lang: ${lang}
translationKey: ${key}
category: ${category}
heroImage: ${image}
heroAlt: ${yamlQuote(alt)}
imageCredit: ${yamlQuote(credit)}
sources:
${sourceYaml}
draft: true
---

${article.body.trim()}
`;
}

function validate(draft, items) {
  const errors = [];
  if (!draft || typeof draft !== 'object') return { errors: ['The model did not return an object.'], resolved: [] };
  if (!SLUG.test(draft.translationKey || '')) errors.push('translationKey must be a lowercase hyphenated slug.');
  if (!CATEGORIES.includes(draft.category)) errors.push(`category must be one of ${CATEGORIES.join(', ')}.`);
  const byUrl = new Map(items.map((item) => [item.url.replace(/\/$/, ''), item]));
  const cited = Array.isArray(draft.sources) ? draft.sources : [];
  if (cited.length === 0) errors.push('sources is empty.');
  const resolved = [];
  for (const source of cited) {
    const url = String(source?.url || '').trim();
    const item = byUrl.get(url.replace(/\/$/, ''));
    if (!item) errors.push(`Source URL is not in the fetched items: ${url}`);
    else resolved.push(item);
  }
  const corpus = items.map((item) => `${item.title}\n${item.summary}\n${item.date.toISOString()}`).join('\n');
  const allowed = numberTokens(corpus);
  for (const lang of ['en', 'es']) {
    const article = draft[lang];
    if (!article?.title || !article?.description || !article?.body) {
      errors.push(`${lang} title, description, and body are required.`);
      continue;
    }
    const extra = [...numberTokens(`${article.title}\n${article.description}\n${article.body}`)].filter(
      (token) => !allowed.has(token),
    );
    if (extra.length) errors.push(`${lang} uses numbers that are not in the sources: ${extra.join(', ')}`);
    const urls = article.body.match(/https?:\/\/[^\s)]+/g) || [];
    for (const url of urls) {
      if (!byUrl.has(url.replace(/\/$/, ''))) errors.push(`${lang} body links to a URL that was not fetched: ${url}`);
    }
  }
  return { errors, resolved };
}

async function askOpenAI(items) {
  const model = process.env.OPENAI_MODEL || 'gpt-5.4-mini';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_completion_tokens: 4000,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: JSON.stringify(items, null, 2) },
      ],
    }),
    signal: AbortSignal.timeout(90000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`OpenAI HTTP ${response.status}: ${payload.error?.message || 'request failed'}`);
  }
  return payload.choices?.[0]?.message?.content || '';
}

async function askAnthropic(items) {
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5';
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4000,
      temperature: 0.2,
      system: SYSTEM,
      messages: [{ role: 'user', content: JSON.stringify(items, null, 2) }],
    }),
    signal: AbortSignal.timeout(90000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Anthropic HTTP ${response.status}: ${payload.error?.message || 'request failed'}`);
  }
  return (payload.content || []).map((block) => block.text || '').join('');
}

function parseModelJson(text) {
  const trimmed = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  return JSON.parse(trimmed);
}

async function heroImage(key) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.log('UNSPLASH_ACCESS_KEY is not set. Using the existing downtown Miami skyline photograph.');
    return { image: FALLBACK_IMAGE, alt: FALLBACK_ALT, credit: FALLBACK_CREDIT };
  }
  try {
    const search = new URL('https://api.unsplash.com/search/photos');
    search.searchParams.set('query', 'Miami architecture skyline');
    search.searchParams.set('orientation', 'landscape');
    search.searchParams.set('content_filter', 'high');
    search.searchParams.set('per_page', '1');
    const found = await fetchText(search.href, { authorization: `Client-ID ${accessKey}` });
    const data = JSON.parse(found.text);
    const photo = data.results?.[0];
    if (!found.ok || !photo?.urls?.regular) {
      console.log(`Unsplash search failed (HTTP ${found.status}). Using the existing skyline photograph.`);
      return { image: FALLBACK_IMAGE, alt: FALLBACK_ALT, credit: FALLBACK_CREDIT };
    }
    await fetchText(photo.links.download_location, { authorization: `Client-ID ${accessKey}` });
    const file = await fetch(photo.urls.regular, { signal: AbortSignal.timeout(20000) });
    if (!file.ok) throw new Error(`image HTTP ${file.status}`);
    const bytes = Buffer.from(await file.arrayBuffer());
    const relative = `../../../assets/blog/${key}.jpg`;
    const destination = path.join(root, 'src/assets/blog', `${key}.jpg`);
    mkdirSync(path.dirname(destination), { recursive: true });
    writeFileSync(destination, bytes);
    const profile = `${photo.user.links.html}?utm_source=marianaramirez&utm_medium=referral`;
    const photoLink = `${photo.links.html}?utm_source=marianaramirez&utm_medium=referral`;
    return {
      image: relative,
      alt: {
        en: photo.alt_description || 'Miami photograph from Unsplash.',
        es: photo.alt_description || 'Fotografía de Miami en Unsplash.',
      },
      credit: `Photo: ${photo.user.name} on Unsplash (${profile}). ${photoLink}`,
    };
  } catch (error) {
    console.log(`Unsplash failed (${error instanceof Error ? error.message : 'request failed'}). Using the existing skyline photograph.`);
    return { image: FALLBACK_IMAGE, alt: FALLBACK_ALT, credit: FALLBACK_CREDIT };
  }
}

function selfCheck() {
  const xml = `<rss><channel><item>
    <title><![CDATA[Rate decision]]></title>
    <link><![CDATA[https://www.federalreserve.gov/example]]></link>
    <description>The rate is 4.50%.</description>
    <pubDate>Thu, 29 Oct 2026 20:30:00 GMT</pubDate>
  </item></channel></rss>`;
  const items = parseFeed(xml);
  if (items.length !== 1 || items[0].title !== 'Rate decision' || !items[0].url.includes('federalreserve')) {
    throw new Error('Feed parser failed.');
  }
  const good = validate(
    {
      translationKey: 'rate-decision',
      category: 'economy',
      en: { title: 'What did the Fed say?', description: 'The rate is 4.50%.', body: 'The source says 4.50%.' },
      es: { title: '¿Qué dijo la Fed?', description: 'La tasa es 4.50%.', body: 'La fuente dice 4.50%.' },
      sources: [{ url: 'https://www.federalreserve.gov/example' }],
    },
    [{ ...items[0], publisher: 'Federal Reserve' }],
  );
  if (good.errors.length) throw new Error(good.errors.join(' '));
  const bad = validate(
    {
      translationKey: 'rate-decision',
      category: 'economy',
      en: { title: 'A claim', description: 'Prices rose 12%.', body: 'See https://example.com/invented' },
      es: { title: 'Un dato', description: 'Subió 12%.', body: 'Texto.' },
      sources: [{ url: 'https://example.com/invented' }],
    },
    [{ ...items[0], publisher: 'Federal Reserve' }],
  );
  if (!bad.errors.length) throw new Error('Validation accepted an invented source.');
  console.log('self-check ok');
}

async function main() {
  if (process.argv.includes('--self-check')) {
    selfCheck();
    return;
  }
  if (process.env.GITHUB_EVENT_NAME === 'schedule' && !isSevenAmNewYork()) {
    skip('Not 07:00 America/New_York. Skipping this cron tick.');
  }
  if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    skip('No OPENAI_API_KEY or ANTHROPIC_API_KEY is set. Exiting without a draft.');
  }
  const config = JSON.parse(readFileSync(path.join(root, 'scripts/blog-feeds.json'), 'utf8'));
  const items = await loadItems(config);
  if (!items.length) skip('No current items from the configured feeds. Exiting without a draft.');

  const raw = process.env.OPENAI_API_KEY ? await askOpenAI(items) : await askAnthropic(items);
  let draft;
  try {
    draft = parseModelJson(raw);
  } catch {
    console.error('The model did not return JSON.');
    process.exit(1);
  }
  const { errors, resolved } = validate(draft, items);
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  const date = nyDateKey();
  const key = draft.translationKey;
  const enPath = path.join(root, 'src/content/blog/en', `${date}-${key}.md`);
  const esPath = path.join(root, 'src/content/blog/es', `${date}-${key}.md`);
  if (existsSync(enPath) || existsSync(esPath)) {
    skip(`A draft for ${key} on ${date} already exists. Exiting without a new pull request.`);
  }
  const hero = await heroImage(key);
  const sources = resolved.map((item) => ({ title: item.title, url: item.url, publisher: item.publisher }));
  writeFileSync(
    enPath,
    articleFile({
      lang: 'en',
      date,
      key,
      article: draft.en,
      category: draft.category,
      image: hero.image,
      alt: hero.alt.en,
      credit: hero.credit,
      sources,
    }),
  );
  writeFileSync(
    esPath,
    articleFile({
      lang: 'es',
      date,
      key,
      article: draft.es,
      category: draft.category,
      image: hero.image,
      alt: hero.alt.es,
      credit: hero.credit,
      sources,
    }),
  );
  console.log(`Wrote ${path.relative(root, enPath)} and ${path.relative(root, esPath)}.`);
  output('status', 'created');
  output('date', date);
  output('slug', key);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Blog draft failed.');
  process.exit(1);
});
