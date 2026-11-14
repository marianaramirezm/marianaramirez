import type { APIRoute } from 'astro';
import { getPublishedBlogPosts } from '../../lib/blog';
import { rssDocument } from '../../lib/rss';
import { ui } from '../../i18n/ui';

export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL('https://marianaramirezrealestate.com');
  const posts = await getPublishedBlogPosts('es');
  const body = rssDocument({
    site: origin,
    locale: 'es',
    title: ui.es['meta.blog.title'],
    description: ui.es['meta.blog.description'],
    posts,
  });
  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
