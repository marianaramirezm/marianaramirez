import type { APIRoute } from 'astro';
import { getBlogPosts } from '../lib/blog';
import { rssDocument } from '../lib/rss';
import { ui } from '../i18n/ui';

export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL('https://marianaramirezrealestate.com');
  const posts = await getBlogPosts('en');
  const body = rssDocument({
    site: origin,
    locale: 'en',
    title: ui.en['meta.blog.title'],
    description: ui.en['meta.blog.description'],
    posts,
  });
  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
