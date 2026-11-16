import { site as siteConfig } from '../data/site';
import { ui, type Locale, type UiKey } from '../i18n/ui';
import { absolute, pathFor } from './routes';
import type { BlogSource } from './types';

export type Crumb = { name: string; path: string };

export function graph(...nodes: Record<string, unknown>[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

export function agentNode(site: URL, locale: Locale): Record<string, unknown> {
  return {
    '@type': ['RealEstateAgent', 'Person'],
    '@id': `${absolute(site, '/')}#mariana-ramirez`,
    name: 'Mariana Ramírez',
    url: absolute(site, pathFor('home', locale)),
    jobTitle: ui[locale]['schema.jobTitle'],
    worksFor: {
      '@type': 'Organization',
      name: 'SERHANT.',
    },
    memberOf: {
      '@type': 'Organization',
      name: "Nile Lundgren's team",
    },
    workLocation: {
      '@type': 'Place',
      name: 'Miami',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Miami',
        addressRegion: 'FL',
        addressCountry: 'US',
      },
    },
    birthPlace: {
      '@type': 'Place',
      name: 'Barranquilla',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Barranquilla',
        addressCountry: 'CO',
      },
    },
    nationality: {
      '@type': 'Country',
      name: 'Colombia',
    },
    knowsLanguage: ['en', 'es', 'de'],
    telephone: siteConfig.publicPhone,
    email: siteConfig.publicEmail,
    sameAs: siteConfig.profiles.map((item) => item.href),
    identifier: 'SL3625059',
    areaServed: [
      { '@type': 'City', name: 'Miami' },
      { '@type': 'Place', name: 'Coconut Grove' },
      { '@type': 'City', name: 'New York' },
    ],
    image: absolute(site, '/og.jpg'),
    description: ui[locale]['meta.home.description'],
  };
}

export function faqNode(locale: Locale): Record<string, unknown> {
  const questions = [1, 2, 3, 4, 5, 6].map((index) => ({
    '@type': 'Question',
    name: ui[locale][`faq.q${index}` as UiKey],
    acceptedAnswer: {
      '@type': 'Answer',
      text: ui[locale][`faq.a${index}` as UiKey],
    },
  }));
  return {
    '@type': 'FAQPage',
    mainEntity: questions,
  };
}

export function breadcrumbNode(site: URL, items: Crumb[]): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(site, item.path),
    })),
  };
}

export function placeNode(options: {
  site: URL;
  path: string;
  name: string;
  description: string;
  address?: { locality: string; region: string; country: string };
}): Record<string, unknown> {
  const node: Record<string, unknown> = {
    '@type': 'Place',
    name: options.name,
    description: options.description,
    url: absolute(options.site, options.path),
  };
  if (options.address) {
    node.address = {
      '@type': 'PostalAddress',
      addressLocality: options.address.locality,
      addressRegion: options.address.region,
      addressCountry: options.address.country,
    };
  }
  return node;
}

export function blogNode(options: {
  site: URL;
  path: string;
  name: string;
  description: string;
  locale: Locale;
}): Record<string, unknown> {
  return {
    '@type': 'Blog',
    name: options.name,
    description: options.description,
    url: absolute(options.site, options.path),
    inLanguage: options.locale,
    author: { '@id': `${absolute(options.site, '/')}#mariana-ramirez` },
  };
}

export function blogPostingNode(options: {
  site: URL;
  path: string;
  title: string;
  description: string;
  locale: Locale;
  published: Date;
  category: string;
  image: string;
  sources: BlogSource[];
}): Record<string, unknown> {
  const published = options.published.toISOString();
  const node: Record<string, unknown> = {
    '@type': ['BlogPosting', 'Article'],
    headline: options.title,
    description: options.description,
    datePublished: published,
    dateModified: published,
    inLanguage: options.locale,
    articleSection: options.category,
    mainEntityOfPage: absolute(options.site, options.path),
    url: absolute(options.site, options.path),
    author: {
      '@type': 'Person',
      name: 'Mariana Ramírez',
      url: absolute(options.site, pathFor('about', options.locale)),
    },
    publisher: {
      '@type': 'Organization',
      name: 'SERHANT.',
    },
    image: options.image,
  };
  if (options.sources.length > 0) {
    node.citation = options.sources.map((source) => ({
      '@type': 'CreativeWork',
      name: source.title,
      url: source.url,
      publisher: { '@type': 'Organization', name: source.publisher },
    }));
  }
  return node;
}
