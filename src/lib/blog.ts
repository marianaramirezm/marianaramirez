import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/ui';
import type { BlogData } from './types';

const ID_PATTERN = /^(en|es)\/(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$/;

export const BLOG_PAGE_SIZE = 6;

export type BlogPost = {
  id: string;
  locale: Locale;
  slug: string;
  dateKey: string;
  data: BlogData;
  entry: CollectionEntry<'blog'>;
};

function envValue(name: string): string | undefined {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  return env?.[name];
}

/** Drafts are included only when Cloudflare Pages is building a branch other than main. */
export function includeDrafts(): boolean {
  const branch = envValue('CF_PAGES_BRANCH');
  return Boolean(branch) && branch !== 'main';
}

function utcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function toPost(entry: CollectionEntry<'blog'>): BlogPost {
  const match = ID_PATTERN.exec(entry.id);
  if (!match) {
    throw new Error(
      `Blog file "${entry.id}" must be named en/YYYY-MM-DD-slug.md or es/YYYY-MM-DD-slug.md`,
    );
  }
  const locale = match[1] as Locale;
  const dateKey = match[2];
  const slug = match[3];
  const data = entry.data as BlogData;
  if (data.lang !== locale) {
    throw new Error(`Blog file "${entry.id}" has lang "${data.lang}" but lives in the ${locale} folder`);
  }
  if (data.translationKey !== slug) {
    throw new Error(
      `Blog file "${entry.id}" has translationKey "${data.translationKey}", which must match the filename slug "${slug}"`,
    );
  }
  if (utcDateKey(data.date) !== dateKey) {
    throw new Error(
      `Blog file "${entry.id}" has date ${utcDateKey(data.date)}, which does not match ${dateKey}`,
    );
  }
  return { id: entry.id, locale, slug, dateKey, data, entry };
}

export async function getBlogPosts(locale: Locale): Promise<BlogPost[]> {
  const showDrafts = includeDrafts();
  const all = await getCollection('blog');
  return all
    .map(toPost)
    .filter((post) => post.locale === locale && (showDrafts || !post.data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.slug.localeCompare(b.slug));
}

export function blogPageCount(total: number): number {
  return Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE));
}

export function postsForPage(posts: BlogPost[], page: number): BlogPost[] {
  const start = (page - 1) * BLOG_PAGE_SIZE;
  return posts.slice(start, start + BLOG_PAGE_SIZE);
}

export function formatBlogDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es' : 'en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
