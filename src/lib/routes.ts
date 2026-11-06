import type { Locale } from '../i18n/ui';

export type NavKey = 'home' | 'about' | 'listings' | 'neighborhoods' | 'map' | 'residences' | 'blog' | 'contact';

const pages: Record<NavKey | 'thanks', Record<Locale, string>> = {
  home: { en: '/', es: '/es/' },
  about: { en: '/about/', es: '/es/about/' },
  listings: { en: '/listings/', es: '/es/listings/' },
  neighborhoods: { en: '/neighborhoods/', es: '/es/neighborhoods/' },
  map: { en: '/map/', es: '/es/map/' },
  residences: { en: '/residences/', es: '/es/residences/' },
  blog: { en: '/blog/', es: '/es/blog/' },
  contact: { en: '/contact/', es: '/es/contact/' },
  thanks: { en: '/thank-you/', es: '/es/thank-you/' },
};

export const mainNav = ['about', 'listings', 'neighborhoods', 'map', 'residences', 'blog', 'contact'] as const;

export function pathFor(page: keyof typeof pages, locale: Locale): string {
  return pages[page][locale];
}

export function listingPath(slug: string, locale: Locale): string {
  return `${locale === 'es' ? '/es/listings/' : '/listings/'}${slug}/`;
}

export function neighborhoodPath(slug: string, locale: Locale): string {
  return `${locale === 'es' ? '/es/neighborhoods/' : '/neighborhoods/'}${slug}/`;
}

export function residencePath(slug: string, locale: Locale): string {
  return `${locale === 'es' ? '/es/residences/' : '/residences/'}${slug}/`;
}

export function blogPath(slug: string, locale: Locale): string {
  return `${locale === 'es' ? '/es/blog/' : '/blog/'}${slug}/`;
}

export function blogPagePath(page: number, locale: Locale): string {
  if (page <= 1) return pathFor('blog', locale);
  return `${locale === 'es' ? '/es/blog/page/' : '/blog/page/'}${page}/`;
}

export function rssPath(locale: Locale): string {
  return locale === 'es' ? '/es/rss.xml' : '/rss.xml';
}

export function absolute(site: URL, path: string): string {
  return new URL(path, site).href;
}
