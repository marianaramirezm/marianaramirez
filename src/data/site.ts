export type SocialLink = {
  /** Visible label. */
  label: string;
  /**
   * Full profile URL. Leave empty until the real profile exists.
   * TODO: replace each href. Do not point these at a placeholder account.
   */
  href: string;
};

export const site = {
  name: 'Mariana Ramírez',
  /**
   * Shown on the site if set. This is not the form recipient.
   * TODO: add a public phone only if it should appear on the page.
   */
  publicPhone: '',
  /**
   * Shown on the site if set. This is not the form recipient.
   * TODO: add a public email only if it should appear on the page.
   */
  publicEmail: '',
  /**
   * Shown on the site if set. Leave empty until a real office address should be published.
   * TODO: add only the address compliance requires.
   */
  officeAddress: '',
  social: [
    { label: 'Instagram', href: '' },
    { label: 'LinkedIn', href: '' },
    { label: 'YouTube', href: '' },
    { label: 'TikTok', href: '' },
  ] satisfies SocialLink[],
  /**
   * TODO compliance: legal brokerage name, exactly as it must appear in advertising.
   */
  brokerageName: '',
  /**
   * TODO compliance: license number(s) and state(s), exactly as required.
   */
  licenseLine: '',
  /**
   * TODO compliance: path in /public to an approved Equal Housing Opportunity logo.
   * Example: "/equal-housing.svg". Leave empty to keep the text placeholder.
   */
  equalHousingLogo: '',
};
