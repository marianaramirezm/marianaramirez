import type { ImageMetadata } from 'astro';

export type Localized = { en: string; es: string };

export type Fact = {
  label: Localized;
  value: Localized;
  source: string;
};

export type PhotoCredit = {
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
};

export type GuideData = {
  name: Localized;
  description: Localized;
  summary: Localized;
  intro: Localized;
  regionLabel: Localized;
  group?: 'miami' | 'beyond';
  place?: {
    locality: string;
    region: string;
    country: string;
  };
  officialUrl: string;
  facts: Fact[];
  image: ImageMetadata;
  imageAlt: Localized;
  imageNote?: Localized;
  credit: PhotoCredit;
  order: number;
};

export type GuideEntry = { id: string; data: GuideData };

export type TeamListingPhoto = {
  src: ImageMetadata;
  alt: Localized;
};

export type TeamListingGroup = 'mariana' | 'active' | 'lease' | 'sold' | 'previously';

export type TeamListingData = {
  name: Localized;
  address: Localized;
  area: Localized;
  group: TeamListingGroup;
  status: 'mariana-sale' | 'for-sale' | 'for-lease' | 'sold' | 'previously-listed';
  statusLabel: Localized;
  price: Localized;
  beds: Localized;
  baths?: Localized;
  sqft?: Localized;
  soldDate?: Localized;
  description?: Localized;
  agents?: Localized;
  photos: TeamListingPhoto[];
  officialUrl: string;
  credit: 'Nile Lundgren Team at SERHANT.';
  order: number;
  featured?: boolean;
  featureOrder?: number;
};

export type TeamListingEntry = { id: string; data: TeamListingData };

export type BlogCategory = 'real-estate' | 'economy' | 'policy' | 'culture' | 'business' | 'innovation';
export type BlogImpact = 'global' | 'miami' | 'both';

export type BlogSource = { title: string; url: string; publisher: string };

export type BlogImageCredit = {
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
};

export type BlogData = {
  title: string;
  description: string;
  date: Date;
  lang: 'en' | 'es';
  translationKey: string;
  category: BlogCategory;
  heroImage: ImageMetadata;
  heroAlt: string;
  imageCredit: string;
  heroCredit?: BlogImageCredit;
  figures?: { src: ImageMetadata; alt: string; credit: BlogImageCredit }[];
  sources: BlogSource[];
  draft: boolean;
  /** Whether the note is about the world, Miami, or both. Optional until a post is approved. */
  impact?: BlogImpact;
};
