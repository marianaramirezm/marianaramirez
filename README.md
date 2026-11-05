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

Real team listings are separate from the sample files above. Add one Markdown file per listing in `src/content/team-listings/`. Each text field has `en` and `es`. They appear under Team Listings, not in the sample sections.

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
status: previously-listed
statusLabel:
  en: Previously listed by the team
  es: Publicada antes por el equipo
price:
  en: Offered at $1,000,000
  es: Ofrecida en $1,000,000
beds:
  en: "2"
  es: "2"
baths:
  en: "2"
  es: "2"
sqft:
  en: "1,200"
  es: "1,200"
description:
  en: Description from the official source.
  es: Descripción tomada de la fuente oficial.
agents:
  en: Nile Lundgren and Scott Porter
  es: Nile Lundgren y Scott Porter
photos:
  - src: ../../assets/listings/example.jpg
    alt:
      en: Living room of the residence.
      es: Sala de la residencia.
officialUrl: https://example.com/official-listing
credit: "Nile Lundgren Team at SERHANT."
order: 1
---
```

`status` is `sold` or `previously-listed`. `statusLabel` is the phrase shown on the page. Omit `baths` when the count should not be published. `photos` may be an empty list; the card then stays typographic until images are added. `credit` must be exactly `Nile Lundgren Team at SERHANT.` `officialUrl` is the official source. Do not invent an address or a figure.

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

Posts are written by Mariana’s assistant, approved by Mariana, and added by hand as Markdown. Copy `src/content/blog/_template.md` into a matching pair:

- `src/content/blog/en/YYYY-MM-DD-slug.md`
- `src/content/blog/es/YYYY-MM-DD-slug.md`

`slug` is lowercase words separated by hyphens. The filename slug, `translationKey`, and `date` (`YYYY-MM-DD`) must match in both files. `lang` is `en` in the English file and `es` in the Spanish file.

```yaml
---
title: "How does the Fed rate affect prices in Brickell?"
description: "One or two sentences for the listing page, the meta description, and Open Graph."
date: 2026-11-04
lang: en
translationKey: fed-rate-brickell
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

The Spanish file uses the same `date`, `translationKey`, `category`, and `draft`, with its own question title, description, body, hero alt, and sources. Example title: `¿Cómo afecta la tasa de la Fed a los precios en Brickell?`

`category` is `real-estate` (the core category), `economy`, `policy`, `culture`, or `business`.

`sources` is a list of `title`, `url`, and `publisher`. A post with `draft: false` and an empty `sources` list fails the build. Drafts may leave `sources` empty. The body is Markdown after the frontmatter, in the language of the folder.

Public URLs are `/blog/slug/` and `/es/blog/slug/` (the date is not in the URL). The listing is newest first, six posts per page (`/blog/page/2/` and `/es/blog/page/2/`). Feeds are `/rss.xml` and `/es/rss.xml`.

`draft: true` posts are omitted from a production build, including `main`. They are included only when `CF_PAGES_BRANCH` is set to a branch other than `main`. To preview them locally: `CF_PAGES_BRANCH=preview npm run build`.

## Refresh the Miami neighborhood map

Active SERHANT. brokerage listings for the map live in `src/data/serhant-miami-active.json`. The file is a snapshot of public serhant.com data: neighborhood, address, unit, coordinates, price or monthly rent, beds, baths, square feet, listing agents, the official URL, photo URLs, and whether the listing is on Nile Lundgren’s team.

To refresh it, replace that file with a new export that uses the same fields and only active sale and rental rows. Do not add estimates or edit the numbers. Neighborhood shapes are in `src/data/map-areas.ts`. Rebuild after replacing the file.

Key Biscayne rows in the file are SERHANT. office listings with status FOR_SALE or For Lease from the public serhant.com property search. That search had no active Fisher Island or Venetian Islands rows, so those areas use the empty state.

The basemap is Esri’s World Dark Gray Canvas (no API key). CARTO’s public `dark_all` tiles currently return an “API key required” watermark, so they are not used.

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
