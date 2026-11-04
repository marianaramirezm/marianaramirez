import type { ImageMetadata } from 'astro';

export type Localized = { en: string; es: string };

export type Fact = {
  label: Localized;
  value: Localized;
  source: string;
};

export type ListingData = {
  title: Localized;
  address: Localized;
  neighborhood: string;
  status: 'active' | 'sold' | 'leased';
  price: Localized;
  beds: Localized;
  baths: Localized;
  sqft: Localized;
  photos: ImageMetadata[];
  officialUrl: string;
  source: string;
  example: boolean;
  order: number;
  credit: PhotoCredit;
  imageNote: Localized;
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

export type ListingEntry = { id: string; data: ListingData };
export type GuideEntry = { id: string; data: GuideData };

export type TeamListingPhoto = {
  src: ImageMetadata;
  alt: Localized;
};

export type TeamListingData = {
  name: Localized;
  address: Localized;
  area: Localized;
  status: 'sold' | 'previously-listed';
  statusLabel: Localized;
  price: Localized;
  beds: Localized;
  baths?: Localized;
  sqft: Localized;
  description: Localized;
  agents: Localized;
  photos: TeamListingPhoto[];
  officialUrl: string;
  credit: 'Nile Lundgren Team at SERHANT.';
  order: number;
};

export type TeamListingEntry = { id: string; data: TeamListingData };

export type BlogCategory = 'real-estate' | 'economy' | 'policy' | 'culture' | 'business';

export type BlogSource = { title: string; url: string; publisher: string };

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
  sources: BlogSource[];
  draft: boolean;
};
