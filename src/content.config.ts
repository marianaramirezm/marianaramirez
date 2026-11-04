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
      status: z.enum(['active', 'sold', 'leased']),
      price: text,
      beds: text,
      baths: text,
      sqft: text,
      photos: z.array(image()).min(1),
      officialUrl: urlOrEmpty,
      source: z.url(),
      example: z.boolean(),
      order: z.number(),
      credit: z.object({
        author: z.string(),
        license: z.string(),
        licenseUrl: z.url(),
        source: z.url(),
      }),
      imageNote: text,
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
    imageAlt: text,
    imageNote: text.optional(),
    credit: z.object({
      author: z.string(),
      license: z.string(),
      licenseUrl: z.url(),
      source: z.url(),
    }),
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

const teamCredit = 'Nile Lundgren Team at SERHANT.';

const teamListings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team-listings' }),
  schema: ({ image }: SchemaContext) =>
    z.object({
      name: text,
      address: text,
      area: text,
      status: z.enum(['sold', 'previously-listed']),
      statusLabel: text,
      price: text,
      beds: text,
      baths: text.optional(),
      sqft: text,
      description: text,
      agents: text,
      photos: z
        .array(
          z.object({
            src: image(),
            alt: text,
          }),
        )
        .default([]),
      officialUrl: z.url(),
      credit: z.literal(teamCredit).default(teamCredit),
      order: z.number().default(0),
    }),
});

const blogSource = z.object({
  title: z.string().min(1),
  url: z.url(),
  publisher: z.string().min(1),
});

const blog = defineCollection({
  loader: glob({ pattern: '{en,es}/*.md', base: './src/content/blog' }),
  schema: ({ image }: SchemaContext) =>
    z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
        date: z.coerce.date(),
        lang: z.enum(['en', 'es']),
        translationKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        category: z.enum(['economy', 'real-estate', 'business', 'culture', 'policy']),
        heroImage: image(),
        heroAlt: z.string().min(1),
        imageCredit: z.string().min(1),
        sources: z.array(blogSource).default([]),
        draft: z.boolean().default(false),
      })
      .superRefine((data, ctx) => {
        if (!data.draft && data.sources.length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: 'sources must include at least one entry when draft is false',
            path: ['sources'],
            input: data.sources,
          });
        }
      }),
});

export const collections = { listings, neighborhoods, residences, teamListings, blog };
