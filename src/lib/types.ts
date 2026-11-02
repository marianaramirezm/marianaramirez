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
  status: 'active' | 'sold';
  price: Localized;
  beds: Localized;
  baths: Localized;
  sqft: Localized;
  photos: ImageMetadata[];
  officialUrl: string;
  example: boolean;
  order: number;
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
  order: number;
};

export type ListingEntry = { id: string; data: ListingData };
export type GuideEntry = { id: string; data: GuideData };
