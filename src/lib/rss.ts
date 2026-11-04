import type { Locale } from '../i18n/ui';
import { absolute, blogPath, pathFor } from './routes';
import type { BlogPost } from './blog';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function rssDocument(options: {
  site: URL;
  locale: Locale;
  title: string;
  description: string;
  posts: BlogPost[];
}): string {
  const { site, locale, title, description, posts } = options;
  const page = absolute(site, pathFor('blog', locale));
  const self = absolute(site, locale === 'es' ? '/es/rss.xml' : '/rss.xml');
  const items = posts
    .map((post) => {
      const link = absolute(site, blogPath(post.slug, locale));
      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
      <description>${escapeXml(post.data.description)}</description>
      <category>${escapeXml(post.data.category)}</category>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(page)}</link>
    <description>${escapeXml(description)}</description>
    <language>${locale}</language>
    <atom:link href="${escapeXml(self)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}
