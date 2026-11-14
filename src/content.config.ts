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
      group: z.enum(['mariana', 'active', 'lease', 'sold', 'previously']),
      status: z.enum(['mariana-sale', 'for-sale', 'for-lease', 'sold', 'previously-listed']),
      statusLabel: text,
      price: text,
      beds: text,
      baths: text.optional(),
      sqft: text.optional(),
      soldDate: text.optional(),
      description: text.optional(),
      agents: text.optional(),
      photos: z
        .array(
          z.object({
            src: image(),
            alt: text,
          }),
        )
        .max(4)
        .default([]),
      officialUrl: z.url(),
      credit: z.literal(teamCredit).default(teamCredit),
      order: z.number().default(0),
      featured: z.boolean().default(false),
      featureOrder: z.number().optional(),
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
        category: z.enum(['economy', 'real-estate', 'business', 'culture', 'policy', 'innovation']),
        impact: z.enum(['global', 'miami', 'both']).optional(),
        heroImage: image(),
        heroAlt: z.string().min(1),
        imageCredit: z.string().min(1),
        heroCredit: z
          .object({
            author: z.string().min(1),
            license: z.string().min(1),
            licenseUrl: z.url(),
            sourceUrl: z.url(),
          })
          .optional(),
        figures: z
          .array(
            z.object({
              src: image(),
              alt: z.string().min(1),
              credit: z.object({
                author: z.string().min(1),
                license: z.string().min(1),
                licenseUrl: z.url(),
                sourceUrl: z.url(),
              }),
            }),
          )
          .default([]),
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

export const collections = { neighborhoods, residences, teamListings, blog };
