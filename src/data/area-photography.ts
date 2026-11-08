/**
 * Neighborhood photography checked on 2026-11-08 against public serhant.com
 * listing pages. Remote images stay on the official SERHANT. CDN. They are
 * MLS photographs (watermarked SEFMLS or Miami MLS) and are not rehosted.
 * None of these active rows is Mariana’s own listing.
 *
 * Not shown:
 * - Sunset Harbour: no active SERHANT. house. 1900 Sunset Harbour Dr #2214
 *   returned 404. #1411 is a leased condominium whose own photos are interiors.
 * - Gables Estates: no active SERHANT. listing. 221 Casuarina Concourse’s
 *   serhant.com page returned 404. The house photo below is the one already
 *   published on this site for that previous team listing. 7910 Los Pinos Cir
 *   is Cocoplum, not Gables Estates, and is not used here.
 * - 3015 Grand Ave is a commercial storefront and marina view, not a house.
 */

export type RemotePhoto = {
  src: string;
  width: number;
  height: number;
};

export type AreaShot = {
  address: string;
  kind: { en: string; es: string };
  status: { en: string; es: string };
  price: string;
  agents: string;
  alt: { en: string; es: string };
  officialUrl: string;
  creditNote: { en: string; es: string };
  image: RemotePhoto | { local: 'villa-pool' };
  provenance: {
    checkedOn: '2026-11-08';
    brokerage: string;
    mlsId: string;
    watermark: string;
    photoUrl: string;
    pageStatus: number;
  };
};

export type AreaGallery = {
  heading: { en: string; es: string };
  intro: { en: string; es: string };
  shots: AreaShot[];
  gap?: { en: string; es: string; href?: string; label?: { en: string; es: string } };
};

const mls = 'Photograph published on the official SERHANT. listing. Watermark on the file:';

export const areaGalleries: Record<string, AreaGallery> = {
  'coconut-grove': {
    heading: { en: 'Houses', es: 'Casas' },
    intro: {
      en: 'A house and a townhouse from current SERHANT. brokerage listings in Coconut Grove. The townhouse is not a detached house.',
      es: 'Una casa y una casa adosada de anuncios vigentes de la correduría SERHANT. en Coconut Grove. La casa adosada no es una casa independiente.',
    },
    shots: [
      {
        address: '3232 Emathla St',
        kind: { en: 'House', es: 'Casa' },
        status: { en: 'For lease', es: 'En alquiler' },
        price: '$32,500/mo',
        agents: 'Angel Nicolas',
        alt: {
          en: 'Front of the house at 3232 Emathla Street in Coconut Grove.',
          es: 'Fachada de la casa en 3232 Emathla Street, Coconut Grove.',
        },
        officialUrl:
          'https://serhant.com/properties/3232-emathla-st-miami-fl-us-33133-f9927c03ec9a72d07c38b5c9287a4cc4',
        creditNote: {
          en: `${mls} SEFMLS © 2026.`,
          es: 'Fotografía publicada en el anuncio oficial de SERHANT. Marca de agua: SEFMLS © 2026.',
        },
        image: {
          src: 'https://dlajgvw9htjpb.cloudfront.net/cms/b26ab618-2b1e-4a17-8868-498b96b52dc0/A12102522/555737968883007640.jpg',
          width: 1600,
          height: 1066,
        },
        provenance: {
          checkedOn: '2026-11-08',
          brokerage: 'Serhant',
          mlsId: 'A12102522',
          watermark: 'SEFMLS © 2026',
          photoUrl:
            'https://dlajgvw9htjpb.cloudfront.net/cms/b26ab618-2b1e-4a17-8868-498b96b52dc0/A12102522/555737968883007640.jpg',
          pageStatus: 200,
        },
      },
      {
        address: '3232 Emathla St',
        kind: { en: 'House', es: 'Casa' },
        status: { en: 'For lease', es: 'En alquiler' },
        price: '$32,500/mo',
        agents: 'Angel Nicolas',
        alt: {
          en: 'Pool court of the house at 3232 Emathla Street in Coconut Grove.',
          es: 'Patio con piscina de la casa en 3232 Emathla Street, Coconut Grove.',
        },
        officialUrl:
          'https://serhant.com/properties/3232-emathla-st-miami-fl-us-33133-f9927c03ec9a72d07c38b5c9287a4cc4',
        creditNote: {
          en: `${mls} SEFMLS © 2026.`,
          es: 'Fotografía publicada en el anuncio oficial de SERHANT. Marca de agua: SEFMLS © 2026.',
        },
        image: {
          src: 'https://dlajgvw9htjpb.cloudfront.net/cms/b26ab618-2b1e-4a17-8868-498b96b52dc0/A12102522/6409454937981691951.jpg',
          width: 1600,
          height: 1066,
        },
        provenance: {
          checkedOn: '2026-11-08',
          brokerage: 'Serhant',
          mlsId: 'A12102522',
          watermark: 'SEFMLS © 2026',
          photoUrl:
            'https://dlajgvw9htjpb.cloudfront.net/cms/b26ab618-2b1e-4a17-8868-498b96b52dc0/A12102522/6409454937981691951.jpg',
          pageStatus: 200,
        },
      },
      {
        address: '3073 Carter St #3073',
        kind: { en: 'Townhouse', es: 'Casa adosada' },
        status: { en: 'For sale', es: 'En venta' },
        price: '$1,699,999',
        agents: 'Jacibe Areces',
        alt: {
          en: 'Street front of the townhouse at 3073 Carter Street in Coconut Grove.',
          es: 'Fachada de la casa adosada en 3073 Carter Street, Coconut Grove.',
        },
        officialUrl:
          'https://serhant.com/properties/3073-carter-st-3073-miami-fl-us-33133-1fd3ec733b11aefc382d97d0125251c1',
        creditNote: {
          en: `${mls} SEFMLS © 2026.`,
          es: 'Fotografía publicada en el anuncio oficial de SERHANT. Marca de agua: SEFMLS © 2026.',
        },
        image: {
          src: 'https://dlajgvw9htjpb.cloudfront.net/cms/b26ab618-2b1e-4a17-8868-498b96b52dc0/A12055720/2647492350838961300.jpg',
          width: 960,
          height: 1200,
        },
        provenance: {
          checkedOn: '2026-11-08',
          brokerage: 'Serhant',
          mlsId: 'A12055720',
          watermark: 'SEFMLS © 2026',
          photoUrl:
            'https://dlajgvw9htjpb.cloudfront.net/cms/b26ab618-2b1e-4a17-8868-498b96b52dc0/A12055720/2647492350838961300.jpg',
          pageStatus: 200,
        },
      },
    ],
  },
  'sunny-isles': {
    heading: { en: 'Condominiums', es: 'Condominios' },
    intro: {
      en: 'Sunny Isles Beach on these pages is a condominium market. These are condominiums, not detached houses.',
      es: 'Sunny Isles Beach en estas páginas es un mercado de condominios. Son condominios, no casas independientes.',
    },
    shots: [
      {
        address: '18201 Collins Avenue PH 5109',
        kind: { en: 'Condominium', es: 'Condominio' },
        status: { en: 'For sale', es: 'En venta' },
        price: '$4,195,000',
        agents: 'Evan Sophir, Shane Aronson, Brandon Bogard',
        alt: {
          en: 'Oceanfront condominium towers at 18201 Collins Avenue, Sunny Isles Beach.',
          es: 'Torres de condominios frente al mar en 18201 Collins Avenue, Sunny Isles Beach.',
        },
        officialUrl:
          'https://serhant.com/properties/18201-collins-avenue-ph-5109-sunny-isles-beach-fl-us-33160-b26058146',
        creditNote: {
          en: 'Photograph published on the official SERHANT. listing.',
          es: 'Fotografía publicada en el anuncio oficial de SERHANT.',
        },
        image: {
          src: 'https://dlajgvw9htjpb.cloudfront.net/cms/b26ab618-2b1e-4a17-8868-498b96b52dc0/B26058146/-4088912846590750009.jpg',
          width: 1920,
          height: 1440,
        },
        provenance: {
          checkedOn: '2026-11-08',
          brokerage: 'Serhant',
          mlsId: 'B26058146',
          watermark: 'none visible on this frame',
          photoUrl:
            'https://dlajgvw9htjpb.cloudfront.net/cms/b26ab618-2b1e-4a17-8868-498b96b52dc0/B26058146/-4088912846590750009.jpg',
          pageStatus: 200,
        },
      },
      {
        address: '15701 Collins Ave #802',
        kind: { en: 'Condominium', es: 'Condominio' },
        status: { en: 'For sale', es: 'En venta' },
        price: '$4,999,999',
        agents: 'Matt Van Wie',
        alt: {
          en: 'Living room of the condominium at 15701 Collins Avenue, unit 802, Sunny Isles Beach.',
          es: 'Sala del condominio en 15701 Collins Avenue, unidad 802, Sunny Isles Beach.',
        },
        officialUrl:
          'https://serhant.com/properties/15701-collins-ave-802-sunny-isles-beach-fl-us-33160-070b2986ca72a42526d1edc7342aae7e',
        creditNote: {
          en: `${mls} SEFMLS © 2026.`,
          es: 'Fotografía publicada en el anuncio oficial de SERHANT. Marca de agua: SEFMLS © 2026.',
        },
        image: {
          src: 'https://dlajgvw9htjpb.cloudfront.net/cms/b26ab618-2b1e-4a17-8868-498b96b52dc0/A12116312/966429500949965274.jpg',
          width: 1600,
          height: 1066,
        },
        provenance: {
          checkedOn: '2026-11-08',
          brokerage: 'Serhant',
          mlsId: 'A12116312',
          watermark: 'SEFMLS © 2026',
          photoUrl:
            'https://dlajgvw9htjpb.cloudfront.net/cms/b26ab618-2b1e-4a17-8868-498b96b52dc0/A12116312/966429500949965274.jpg',
          pageStatus: 200,
        },
      },
      {
        address: '19370 Collins Ave #220',
        kind: { en: 'Condominium', es: 'Condominio' },
        status: { en: 'For sale', es: 'En venta' },
        price: '$550,000',
        agents: 'SERHANT.',
        alt: {
          en: 'Ocean view from the condominium at 19370 Collins Avenue, unit 220, Sunny Isles Beach.',
          es: 'Vista al mar desde el condominio en 19370 Collins Avenue, unidad 220, Sunny Isles Beach.',
        },
        officialUrl:
          'https://serhant.com/properties/19370-collins-ave-220-sunny-isles-beach-fl-us-33160-37a9f738a1c118914701459145613340',
        creditNote: {
          en: `${mls} SEFMLS © 2026. No agent name was printed on the page.`,
          es: 'Fotografía publicada en el anuncio oficial de SERHANT. Marca de agua: SEFMLS © 2026. La página no mostraba el nombre de un agente.',
        },
        image: {
          src: 'https://dlajgvw9htjpb.cloudfront.net/cms/b26ab618-2b1e-4a17-8868-498b96b52dc0/A12112422/7287963625559108253.jpg',
          width: 1600,
          height: 1065,
        },
        provenance: {
          checkedOn: '2026-11-08',
          brokerage: 'Serhant',
          mlsId: 'A12112422',
          watermark: 'SEFMLS © 2026',
          photoUrl:
            'https://dlajgvw9htjpb.cloudfront.net/cms/b26ab618-2b1e-4a17-8868-498b96b52dc0/A12112422/7287963625559108253.jpg',
          pageStatus: 200,
        },
      },
    ],
  },
  'coral-gables': {
    heading: { en: 'Gables Estates', es: 'Gables Estates' },
    intro: {
      en: 'Gables Estates is a guard-gated enclave in Coral Gables. It is not the rest of the city. No active SERHANT. listing there was online. This is the house already on this site from a previous team listing.',
      es: 'Gables Estates es un enclave cerrado con vigilancia dentro de Coral Gables. No es el resto de la ciudad. No había un anuncio activo de SERHANT. en línea. Esta es la casa que ya está en este sitio, de un listado anterior del equipo.',
    },
    shots: [
      {
        address: '221 Casuarina Concourse',
        kind: { en: 'House', es: 'Casa' },
        status: { en: 'Previously listed', es: 'Publicada antes' },
        price: '$27,500,000',
        agents: 'Nile Lundgren and Scott Porter',
        alt: {
          en: 'Pool and house at 221 Casuarina Concourse in Gables Estates.',
          es: 'Piscina y casa en 221 Casuarina Concourse, Gables Estates.',
        },
        officialUrl: 'https://www.villadecasuarina.com/',
        creditNote: {
          en: 'Photograph already published on this site for the previous team listing. The serhant.com page for this address returned 404 on 2026-11-08.',
          es: 'Fotografía que ya estaba publicada en este sitio para el listado anterior del equipo. La página de serhant.com de esta dirección devolvió 404 el 2026-11-08.',
        },
        image: { local: 'villa-pool' },
        provenance: {
          checkedOn: '2026-11-08',
          brokerage: 'Nile Lundgren Team at SERHANT.',
          mlsId: '',
          watermark: 'none on the site file',
          photoUrl: 'src/assets/listings/villa-de-casuarina-pool.webp',
          pageStatus: 404,
        },
      },
    ],
  },
  'sunset-harbour': {
    heading: { en: 'Houses', es: 'Casas' },
    intro: {
      en: 'Sunset Harbour is the bayfront pocket west of the oceanfront strip, not the rest of Miami Beach.',
      es: 'Sunset Harbour es el recinto frente a la bahía, al oeste de la franja del océano, no el resto de Miami Beach.',
    },
    shots: [],
    gap: {
      en: 'No active SERHANT. house listing was available. The only live official page found was a leased condominium at 1900 Sunset Harbour Dr #1411. Its photographs are of the unit interior, so they are not shown here as houses. 1900 Sunset Harbour Dr #2214 returned 404.',
      es: 'No había una casa activa de SERHANT. La única página oficial vigente era un condominio ya alquilado en 1900 Sunset Harbour Dr #1411. Sus fotografías son del interior de la unidad, así que no se muestran aquí como casas. 1900 Sunset Harbour Dr #2214 devolvió 404.',
      href: 'https://serhant.com/properties/1900-sunset-harbour-dr-1411-miami-beach-fl-us-33139-8346428ff11d5254cd9c638882d65ef6',
      label: { en: 'Leased condominium', es: 'Condominio alquilado' },
    },
  },
};
