/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_FORM_MODE?: string;
  readonly PUBLIC_FORM_ENDPOINT?: string;
  readonly SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
