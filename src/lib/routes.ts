import type { Locale } from '../i18n/ui';

export type NavKey = 'home' | 'about' | 'listings' | 'neighborhoods' | 'residences' | 'contact';

const pages: Record<NavKey | 'thanks', Record<Locale, string>> = {
  home: { en: '/', es: '/es/' },
  about: { en: '/about/', es: '/es/about/' },
  listings: { en: '/listings/', es: '/es/listings/' },
  neighborhoods: { en: '/neighborhoods/', es: '/es/neighborhoods/' },
  residences: { en: '/residences/', es: '/es/residences/' },
  contact: { en: '/contact/', es: '/es/contact/' },
  thanks: { en: '/thank-you/', es: '/es/thank-you/' },
};

export const mainNav = ['about', 'listings', 'neighborhoods', 'residences', 'contact'] as const;

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

export function absolute(site: URL, path: string): string {
  return new URL(path, site).href;
}
