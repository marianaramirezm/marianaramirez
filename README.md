# Mariana Ramírez

Personal site for Mariana Ramírez, a luxury real estate advisor with SERHANT. on Nile Lundgren’s team in Miami. English is the default (`/`). Spanish is under `/es/`.

The site is a static Astro build prepared for Cloudflare Pages at `https://marianaramirezrealestate.com`. Nothing here is deployed. Netlify and Vercel configs remain if you ever need them.

## Run it locally

```bash
npm install
npm run dev
```

The dev server prints a local URL. Production output:

```bash
npm run build
npm run preview
```

`npm run check` runs the TypeScript check.

## Before launch

Set these in the host’s environment, not in the repo:

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Canonical origin, no path. Production value: `https://marianaramirezrealestate.com`. Used for the sitemap, canonical URLs, Open Graph, and JSON-LD. |
| `PUBLIC_FORM_MODE` | `preview` (local only), `netlify`, or `endpoint`. |
| `PUBLIC_FORM_ENDPOINT` | Formspree-style URL. Leave empty until a provider is chosen. This is not an email address. |

See `.env.example`. On Cloudflare Pages, set `PUBLIC_FORM_ENDPOINT` (Cloudflare does not capture Netlify Forms) and keep `SITE_URL` as `https://marianaramirezrealestate.com`. Build command: `npm run build`. Output directory: `dist`. `wrangler.toml` names that directory. `public/_headers` sets caching and security headers. Do not put a recipient address in this repository.

`netlify.toml` sets `PUBLIC_FORM_MODE=netlify` only if you build on Netlify instead. On Vercel, set `PUBLIC_FORM_ENDPOINT` as well.

## Edit the words

UI copy for both languages lives in `src/i18n/ui.ts`. Each key exists in `en` and `es`. Spanish should read naturally, not as a line-by-line translation.

## Edit listings

Files: `src/content/listings/*.md`.

The two files there are samples. They are labeled “Example listing – replace” and are not real properties. Replace them. Do not invent an address or a specification.

| Field | Notes |
| --- | --- |
| `title`, `address`, `price`, `beds`, `baths`, `sqft` | Each has `en` and `es`. |
| `neighborhood` | Slug of a file in `src/content/neighborhoods/` (`brickell`, `miami-beach`, …). |
| `status` | `active` or `sold`. |
| `photos` | Paths to images, relative to the markdown file. At least one. |
| `officialUrl` | The official listing URL, or `""` if it is not ready. |
| `example` | `true` keeps the example label and `noindex`. Set `false` for a real listing. |
| `order` | Sort order. Lower numbers come first. |

Sample URLs that contain `/example-` are left out of the sitemap. Rename the file when the listing is real.

### Team listings

Real team listings are separate from the sample files above. Add one Markdown file per listing in `src/content/team-listings/`. No sample entries are included. Each text field has `en` and `es`.

```yaml
---
name:
  en: Residence name
  es: Nombre de la residencia
address:
  en: Street address
  es: Dirección
area:
  en: Coconut Grove
  es: Coconut Grove
status: active
price:
  en: Price as published
  es: Precio publicado
beds:
  en: "2"
  es: "2"
baths:
  en: "2"
  es: "2"
sqft:
  en: Area as published
  es: Superficie publicada
description:
  en: Description from the official source.
  es: Descripción tomada de la fuente oficial.
photos:
  - ../../assets/guides/coconut-grove.jpg
officialUrl: https://example.com/official-listing
credit: "Listed by Nile Lundgren Team at SERHANT."
order: 1
---
```

`status` is `active`, `sold`, or `leased`. `officialUrl` is the official source URL. `credit` must be exactly `Listed by Nile Lundgren Team at SERHANT.` `photos` may be omitted until images are ready. Do not invent an address or a figure.

## Edit guides

Neighborhoods: `src/content/neighborhoods/*.md`.

Branded residences: `src/content/residences/*.md`.

Each file has `name`, `description` (used as the meta description), `summary`, `intro`, `regionLabel`, `image`, and `order`. Neighborhoods also have `group`: `miami` or `beyond`.

`officialUrl` stays empty until there is a real page to cite. `facts` stays an empty list until each fact has a source URL. The page template prints a TODO until then. Do not add specs, prices, unit counts, completion dates, or amenities without that source.

```yaml
facts:
  - label:
      en: Architect
      es: Arquitecto
    value:
      en: Name as published
      es: Nombre publicado
    source: https://example.com/official-page
```

`place` is optional. Use it only for a city you are willing to state. It feeds the Place schema. It is not a substitute for a sourced fact in the body.

`/neighborhoods/coconut-grove/` and `/es/neighborhoods/coconut-grove/` are the guide URLs. `public/_redirects` sends the previous slugs there.

## Blog

English posts are `/blog/` and `/blog/<translationKey>/`. Spanish posts are `/es/blog/` and `/es/blog/<translationKey>/`. The listing is newest first, six posts per page. Later pages are `/blog/page/2/` and `/es/blog/page/2/`. Feeds are `/rss.xml` and `/es/rss.xml`.

Add a pair by copying `src/content/blog/_template.md`:

- `src/content/blog/en/YYYY-MM-DD-slug.md`
- `src/content/blog/es/YYYY-MM-DD-slug.md`

The filename slug, `translationKey`, and `date` match. `lang` is `en` or `es` and must match the folder.

```yaml
---
title: "What question should this post ask?"
description: "One or two sentences for the listing page, the meta description, and Open Graph."
date: 2026-11-04
lang: en
translationKey: layout-placeholder
category: real-estate
heroImage: ../../../assets/guides/downtown-skyline.jpg
heroAlt: "Downtown Miami skyline, with One Thousand Museum at the center."
imageCredit: "Photo: Phillip Pessar, CC BY 2.0, via Wikimedia Commons"
sources:
  - title: Name of the document or page
    url: https://example.com/official-page
    publisher: Publisher name
draft: false
---
```

`category` is `economy`, `real-estate`, `business`, `culture`, or `policy`. `sources` entries are `title`, `url`, and `publisher`. A post with `draft: false` and an empty `sources` list fails the build. The body is Markdown after the frontmatter.

`draft: true` posts are omitted from production builds, including a build of `main`. They are included only when `CF_PAGES_BRANCH` is set to something other than `main` (a Cloudflare Pages preview). To preview drafts locally: `CF_PAGES_BRANCH=preview npm run build`.

### Daily draft

`.github/workflows/blog-draft.yml` runs at about 7:00 AM America/New_York and from Actions → Blog draft → Run workflow. It reads the feeds in `scripts/blog-feeds.json` (Federal Reserve press releases, Bureau of Labor Statistics, Census economic indicators, The Real Deal Miami, plus Miami Herald, Associated Press, and Reuters when those feeds respond). It asks an LLM for one bilingual draft, checks that every cited URL and every number came from those items, and opens a pull request titled `Blog draft: YYYY-MM-DD`. The posts are `draft: true`. The workflow pushes that review branch only. It does not push to `main` and it does not merge.

GitHub runs a scheduled workflow only after the workflow file is on the default branch. Until this pull request is merged, the schedule does not run.

Secrets, in the repository settings:

| Secret | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | One of these two | Drafts the post. Default model `gpt-5.4-mini`. |
| `ANTHROPIC_API_KEY` | One of these two | Used when `OPENAI_API_KEY` is not set. Default model `claude-sonnet-4-5`. |
| `UNSPLASH_ACCESS_KEY` | No | Hero photo with Unsplash attribution. Without it, the draft uses the existing downtown Miami skyline photo and its license line. |

If neither model key is set, the job logs that and exits without opening a pull request. Optional repository variables `OPENAI_MODEL` and `ANTHROPIC_MODEL` override the model ids.

## Edit social links, phone, and compliance lines

`src/data/site.ts` is the only file for:

- SERHANT. profile, Instagram, and TikTok live in `profiles` in `src/data/site.ts`. Phone, email, and the Florida license line are filled from her public SERHANT. profile. `officeAddress` is still empty.
- `publicPhone` and `publicEmail`, if they should appear on the page. These are not the form recipient.
- `brokerageName` and `licenseLine`, after a compliance review.
- `equalHousingLogo`, a path in `public/` such as `/equal-housing.svg`, after a compliance review. Until then the footer shows an “EHO” text slot.

The SERHANT. name is set in type, not as a logo file. Do not add the logo until compliance says to.

## Photos

Neighborhood and residence photographs are licensed files in `src/assets/guides/`. Each guide’s frontmatter stores `credit.author`, `credit.license`, `credit.licenseUrl`, and `credit.source`. The page prints that credit. If a building has no licensed photograph, the file uses a neighborhood or skyline image and says so in `imageNote`. Do not drop in a developer, listing, or press photo.

`public/og.jpg` is the social share image. `public/favicon.svg`, `public/favicon.ico`, and `public/apple-touch-icon.png` are the icons.

`scripts/make-placeholders.py` can regenerate the stand-in images. It is not part of the site build.

## Form

`src/lib/validate.ts` is the rule set for the browser and for any server you add later. Posted fields:

`name`, `email`, `phone`, `language`, `interest`, `neighborhood`, `budget`, `message`, `consent` (`yes`), and `bot-field` (honeypot; must stay empty).

`language`, `interest`, `budget`, and `neighborhood` are sent in English so the inbox is consistent. The labels on the page follow the page language.

In `preview` mode a valid form opens `/thank-you/` or `/es/thank-you/` and nothing is emailed. The contact page says so. Netlify mode posts to Netlify Forms. Endpoint mode POSTs `multipart/form-data` to `PUBLIC_FORM_ENDPOINT` and expects a 2xx response.

## Hosting

- Netlify: `netlify.toml` builds the site and publishes `dist/`. Set the form notification email in the Netlify UI.
- Vercel: `vercel.json` points at the Astro build. Set `PUBLIC_FORM_ENDPOINT` in the project settings, and `SITE_URL` in both places.

Do not deploy from this repo until `SITE_URL`, the form delivery, the license line, and the example listings have been replaced.
