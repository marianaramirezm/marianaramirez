import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const text = z.object({
  en: z.string(),
  es: z.string(),
});

const fact = z.object({
  label: text,
  value: text,
  source: z.url(),
});

const urlOrEmpty = z.union([z.literal(''), z.url()]).default('');

const listings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/listings' }),
  schema: ({ image }: SchemaContext) =>
    z.object({
      title: text,
      address: text,
      neighborhood: z.string(),
      status: z.enum(['active', 'sold']),
      price: text,
      beds: text,
      baths: text,
      sqft: text,
      photos: z.array(image()).min(1),
      officialUrl: urlOrEmpty,
      example: z.boolean(),
      order: z.number(),
    }),
});

function guideSchema({ image }: SchemaContext) {
  return z.object({
    name: text,
    description: text,
    summary: text,
    intro: text,
    regionLabel: text,
    group: z.enum(['miami', 'beyond']).optional(),
    place: z
      .object({
        locality: z.string(),
        region: z.string(),
        country: z.string(),
      })
      .optional(),
    officialUrl: urlOrEmpty,
    facts: z.array(fact).default([]),
    image: image(),
    order: z.number(),
  });
}

const neighborhoods = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/neighborhoods' }),
  schema: guideSchema,
});

const residences = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/residences' }),
  schema: guideSchema,
});

export const collections = { listings, neighborhoods, residences };
