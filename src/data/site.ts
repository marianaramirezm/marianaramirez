export type ProfileId = 'serhant' | 'instagram' | 'tiktok';

export type ProfileLink = {
  id: ProfileId;
  href: string;
};

export const site = {
  name: 'Mariana Ramírez',
  /**
   * Public phone from her SERHANT. profile. Not the form recipient.
   * Source: https://serhant.com/agents/mariana-ramirez
   */
  publicPhone: '(561) 825-7355',
  /**
   * Public email from her SERHANT. profile. Not the form recipient.
   * Source: https://serhant.com/agents/mariana-ramirez
   */
  publicEmail: 'mariana_ramirez@serhant.com',
  /**
   * Shown on the site if set. Leave empty until a real office address should be published.
   * TODO: add only the address compliance requires. The SERHANT. profile does not list a street address.
   */
  officeAddress: '',
  profiles: [
    { id: 'serhant', href: 'https://serhant.com/agents/mariana-ramirez' },
    { id: 'instagram', href: 'https://www.instagram.com/marianar.serhantmiami/' },
    { id: 'tiktok', href: 'https://www.tiktok.com/@marianar.serhantmiami' },
  ] satisfies ProfileLink[],
  /** Handle shared by the Instagram and TikTok accounts above. */
  handle: '@marianar.serhantmiami',
  license: {
    en: 'Licensed Real Estate Salesperson · Florida SL3625059',
    es: 'Licensed Real Estate Salesperson · Florida SL3625059',
  },
  /**
   * TODO compliance: legal brokerage name, exactly as it must appear in advertising.
   */
  brokerageName: '',
  /**
   * TODO compliance: path in /public to an approved Equal Housing Opportunity logo.
   * Example: "/equal-housing.svg". Leave empty to keep the text placeholder.
   */
  equalHousingLogo: '',
};
