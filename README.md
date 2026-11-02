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

## Edit social links, phone, and compliance lines

`src/data/site.ts` is the only file for:

- Instagram, LinkedIn, YouTube, and TikTok (`social[].href`). An empty `href` renders the name with a TODO and does not link anywhere.
- `publicPhone` and `publicEmail`, if they should appear on the page. These are not the form recipient.
- `brokerageName` and `licenseLine`, after a compliance review.
- `equalHousingLogo`, a path in `public/` such as `/equal-housing.svg`, after a compliance review. Until then the footer shows an “EHO” text slot.

The SERHANT. name is set in type, not as a logo file. Do not add the logo until compliance says to.

## Photos

Placeholder images are in `src/assets/placeholders/`. They are neutral color fields, not photographs of properties or of Mariana. Replace the files, or point the content frontmatter at new files under `src/assets/`. The site optimizes them with `astro:assets`.

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
