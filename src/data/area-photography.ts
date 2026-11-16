/**
 * Editorial photographs for the neighborhood guides.
 * Only images already published on this site by the owner’s team are shown.
 * Listing prices, status, and other teams’ MLS files are not part of this module.
 * The private decision record is src/data/area-photo-provenance.ts and is not imported by a page.
 */

export type AreaShot = {
  local: 'villa-pool' | 'villa-stair';
  kind: { en: string; es: string };
  alt: { en: string; es: string };
  credit: string;
};

export type AreaGallery = {
  heading: { en: string; es: string };
  intro: { en: string; es: string };
  shots: AreaShot[];
};

export const areaGalleries: Record<string, AreaGallery> = {
  'coral-gables': {
    heading: { en: 'Gables Estates', es: 'Gables Estates' },
    intro: {
      en: 'Gables Estates is a guard-gated enclave in Coral Gables. It is not the rest of the city. This is a house there.',
      es: 'Gables Estates es un enclave cerrado con vigilancia dentro de Coral Gables. No es el resto de la ciudad. Esta es una casa de allí.',
    },
    shots: [
      {
        local: 'villa-pool',
        kind: { en: 'House', es: 'Casa' },
        alt: {
          en: 'Pool and house in Gables Estates.',
          es: 'Piscina y casa en Gables Estates.',
        },
        credit: 'Nile Lundgren Team at SERHANT.',
      },
      {
        local: 'villa-stair',
        kind: { en: 'House', es: 'Casa' },
        alt: {
          en: 'Entry stair of a house in Gables Estates.',
          es: 'Escalera de entrada de una casa en Gables Estates.',
        },
        credit: 'Nile Lundgren Team at SERHANT.',
      },
    ],
  },
};
