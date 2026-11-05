/**
 * Approximate neighborhood shapes for the map.
 * Coordinates are [latitude, longitude]. Polygons are simple and non-overlapping
 * so a click lands on one area. They are drawn to contain the active listings
 * in src/data/serhant-miami-active.json. Venetian Islands and Sunset Harbour
 * have no active rows in that file; their shapes follow the causeway and the
 * west side of Miami Beach.
 */
export type MapAreaId =
  | 'venetian-islands'
  | 'sunset-harbour'
  | 'miami-beach'
  | 'coconut-grove'
  | 'coral-gables'
  | 'brickell'
  | 'edgewater'
  | 'downtown-miami';

export type MapArea = {
  id: MapAreaId;
  /** Neighborhood value in the SERHANT. listings file. */
  sourceName: string;
  /** Slug of the neighborhood guide. */
  guide: string;
  name: { en: string; es: string };
  description: { en: string; es: string };
  polygon: [number, number][];
  /** Neon stroke and tint. */
  color: string;
  /** Short second line under the area name. */
  tagline: { en: string; es: string };
  /** Where the name sits, in [latitude, longitude]. */
  labelAt: [number, number];
  /** CSS transform so the name clears its neighbors. */
  labelTransform: string;
  /** Small areas: name appears on hover, and when zoomed in. */
  detailLabel?: boolean;
};

export const mapAreas: MapArea[] = [
  {
    id: 'venetian-islands',
    sourceName: 'Venetian Islands',
    guide: 'venetian-islands',
    name: { en: 'Venetian Islands', es: 'Venetian Islands' },
    description: {
      en: 'The Venetian Islands are a chain of residential islands in Biscayne Bay, along the Venetian Causeway between the Miami mainland and Miami Beach.',
      es: 'Las Venetian Islands son una cadena de islas residenciales en Biscayne Bay, sobre la Venetian Causeway, entre el continente de Miami y Miami Beach.',
    },
    polygon: [
      [25.7892, -80.1836],
      [25.7898, -80.171],
      [25.7906, -80.16],
      [25.7918, -80.1512],
      [25.7928, -80.1472],
      [25.7944, -80.1486],
      [25.7934, -80.1575],
      [25.7922, -80.17],
      [25.7908, -80.1846],
    ],
    color: '#2ee6c7',
    tagline: { en: 'Island homes on the causeway', es: 'Casas en las islas' },
    labelAt: [25.7972, -80.166],
    labelTransform: 'translate(-50%, -130%)',
    detailLabel: true,
  },
  {
    id: 'sunset-harbour',
    sourceName: 'Sunset Harbour',
    guide: 'sunset-harbour',
    name: { en: 'Sunset Harbour', es: 'Sunset Harbour' },
    description: {
      en: 'Sunset Harbour is a small bayfront pocket on the west side of Miami Beach, near the Venetian Causeway.',
      es: 'Sunset Harbour es un recinto pequeño frente a la bahía, en el lado oeste de Miami Beach, cerca de la Venetian Causeway.',
    },
    polygon: [
      [25.7936, -80.1478],
      [25.7934, -80.1402],
      [25.7966, -80.1392],
      [25.7998, -80.1404],
      [25.8006, -80.145],
      [25.798, -80.1482],
    ],
    color: '#ff4d8d',
    tagline: { en: 'Bayside village', es: 'Barrio frente a la bahía' },
    labelAt: [25.7974, -80.1386],
    labelTransform: 'translate(6px, -50%)',
    detailLabel: true,
  },
  {
    id: 'miami-beach',
    sourceName: 'Miami Beach',
    guide: 'miami-beach',
    name: { en: 'Miami Beach', es: 'Miami Beach' },
    description: {
      en: 'Miami Beach is the barrier island east of Biscayne Bay, with the Atlantic on its eastern shore. It runs from the southern tip of the island north through several distinct areas.',
      es: 'Miami Beach es la isla barrera al este de Biscayne Bay, con el Atlántico en su orilla este. Va desde el extremo sur de la isla hacia el norte, en varias zonas distintas.',
    },
    polygon: [
      [25.765, -80.136],
      [25.7656, -80.1276],
      [25.784, -80.1278],
      [25.804, -80.1215],
      [25.82, -80.1185],
      [25.842, -80.1178],
      [25.858, -80.1188],
      [25.8635, -80.124],
      [25.8632, -80.14],
      [25.842, -80.1475],
      [25.818, -80.142],
      [25.8024, -80.1368],
      [25.8014, -80.1488],
      [25.7934, -80.149],
      [25.793, -80.1386],
      [25.7872, -80.146],
      [25.776, -80.14],
    ],
    color: '#3ee0ff',
    tagline: { en: 'Oceanfront living', es: 'Frente al mar' },
    labelAt: [25.828, -80.128],
    labelTransform: 'translate(-50%, -50%)',
  },
  {
    id: 'coconut-grove',
    sourceName: 'Coconut Grove',
    guide: 'coconut-grove',
    name: { en: 'Coconut Grove', es: 'Coconut Grove' },
    description: {
      en: 'Coconut Grove is a Miami neighborhood on Biscayne Bay, south of Brickell and beside Coral Gables.',
      es: 'Coconut Grove es un barrio de Miami sobre Biscayne Bay, al sur de Brickell y junto a Coral Gables.',
    },
    polygon: [
      [25.748, -80.246],
      [25.7462, -80.224],
      [25.742, -80.216],
      [25.7365, -80.2205],
      [25.73, -80.232],
      [25.722, -80.248],
      [25.7245, -80.2615],
      [25.736, -80.259],
      [25.7448, -80.2525],
    ],
    color: '#39ff7a',
    tagline: { en: 'Calm and green', es: 'Tranquilo y verde' },
    labelAt: [25.732, -80.248],
    labelTransform: 'translate(-50%, -50%)',
  },
  {
    id: 'coral-gables',
    sourceName: 'Coral Gables',
    guide: 'coral-gables',
    name: { en: 'Coral Gables', es: 'Coral Gables' },
    description: {
      en: 'Coral Gables is a city southwest of Coconut Grove. Its streets are mostly houses, with a compact downtown.',
      es: 'Coral Gables es una ciudad al suroeste de Coconut Grove. Sus calles son sobre todo de casas, con un downtown compacto.',
    },
    polygon: [
      [25.751, -80.274],
      [25.7465, -80.2555],
      [25.73, -80.254],
      [25.714, -80.2565],
      [25.7, -80.2585],
      [25.692, -80.268],
      [25.6905, -80.286],
      [25.708, -80.2975],
      [25.73, -80.2925],
      [25.7475, -80.286],
    ],
    color: '#f5b942',
    tagline: { en: 'Tree-lined estates', es: 'Calles arboladas y residencias' },
    labelAt: [25.704, -80.286],
    labelTransform: 'translate(-50%, -50%)',
  },
  {
    id: 'brickell',
    sourceName: 'Brickell',
    guide: 'brickell',
    name: { en: 'Brickell', es: 'Brickell' },
    description: {
      en: 'Brickell is the financial district south of the Miami River, on the mainland side of Biscayne Bay. Most homes here are condominium towers.',
      es: 'Brickell es el distrito financiero al sur del río Miami, en el lado continental de Biscayne Bay. Casi toda la vivienda son torres de condominio.',
    },
    polygon: [
      [25.7706, -80.2042],
      [25.7698, -80.1968],
      [25.7696, -80.1904],
      [25.77, -80.1862],
      [25.7642, -80.184],
      [25.7572, -80.1846],
      [25.7512, -80.1876],
      [25.7466, -80.1975],
      [25.7456, -80.2072],
      [25.754, -80.2092],
      [25.764, -80.2064],
    ],
    color: '#3d8bff',
    tagline: { en: 'Financial district high-rises', es: 'Torres del distrito financiero' },
    labelAt: [25.758, -80.191],
    labelTransform: 'translate(-50%, -50%)',
  },
  {
    id: 'edgewater',
    sourceName: 'Edgewater',
    guide: 'edgewater',
    name: { en: 'Edgewater', es: 'Edgewater' },
    description: {
      en: 'Edgewater is the bayfront neighborhood directly north of downtown Miami, on the west shore of Biscayne Bay.',
      es: 'Edgewater es el barrio frente a la bahía, justo al norte de downtown Miami, en la orilla oeste de Biscayne Bay.',
    },
    polygon: [
      [25.7922, -80.1924],
      [25.7918, -80.1852],
      [25.7962, -80.1822],
      [25.803, -80.1828],
      [25.8106, -80.1852],
      [25.8114, -80.192],
      [25.8035, -80.193],
    ],
    color: '#22e0ee',
    tagline: { en: 'Bayfront towers', es: 'Torres frente a la bahía' },
    labelAt: [25.803, -80.1942],
    labelTransform: 'translate(-100%, -50%)',
  },
  {
    id: 'downtown-miami',
    sourceName: 'Downtown Miami',
    guide: 'downtown-miami',
    name: { en: 'Downtown Miami', es: 'Downtown Miami' },
    description: {
      en: 'Downtown Miami is the mainland core north of the Miami River and west of Biscayne Bay. The streets mix civic buildings, offices, and residential towers.',
      es: 'Downtown Miami es el centro continental al norte del río Miami y al oeste de Biscayne Bay. En las calles se mezclan edificios cívicos, oficinas y torres residenciales.',
    },
    polygon: [
      [25.7702, -80.2022],
      [25.77, -80.196],
      [25.7702, -80.19],
      [25.7704, -80.1866],
      [25.7748, -80.1844],
      [25.7835, -80.1836],
      [25.7898, -80.184],
      [25.7916, -80.1888],
      [25.7914, -80.1988],
      [25.785, -80.203],
      [25.7762, -80.2036],
    ],
    color: '#c084fc',
    tagline: { en: 'Bayfront skyline', es: 'Skyline frente a la bahía' },
    labelAt: [25.78, -80.196],
    labelTransform: 'translate(-50%, -50%)',
  },
];
