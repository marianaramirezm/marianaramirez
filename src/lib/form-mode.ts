export type FormMode = 'preview' | 'netlify' | 'endpoint';

export function formEndpoint(): string {
  return import.meta.env.PUBLIC_FORM_ENDPOINT || '';
}

/** How the contact form delivers a lead. No recipient address lives in the repo. */
export function formMode(): FormMode {
  const endpoint = formEndpoint();
  const requested = import.meta.env.PUBLIC_FORM_MODE || 'preview';
  if (endpoint) return 'endpoint';
  if (requested === 'netlify') return 'netlify';
  return 'preview';
}
