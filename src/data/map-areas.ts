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
      [25.7845, -80.184],
      [25.7845, -80.156],
      [25.7965, -80.15],
      [25.7995, -80.162],
      [25.7935, -80.184],
    ],
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
      [25.7918, -80.156],
      [25.7918, -80.138],
      [25.8015, -80.138],
      [25.8015, -80.156],
    ],
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
      [25.766, -80.15],
      [25.766, -80.116],
      [25.872, -80.116],
      [25.872, -80.152],
      [25.8015, -80.152],
      [25.8015, -80.138],
      [25.7918, -80.138],
      [25.7918, -80.15],
    ],
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
      [25.72, -80.268],
      [25.72, -80.212],
      [25.746, -80.212],
      [25.746, -80.255],
      [25.734, -80.268],
    ],
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
      [25.688, -80.292],
      [25.688, -80.248],
      [25.72, -80.248],
      [25.72, -80.292],
    ],
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
      [25.744, -80.214],
      [25.744, -80.18],
      [25.7696, -80.18],
      [25.7696, -80.208],
      [25.756, -80.214],
    ],
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
      [25.7916, -80.202],
      [25.7916, -80.178],
      [25.814, -80.178],
      [25.814, -80.202],
    ],
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
      [25.7696, -80.202],
      [25.7696, -80.18],
      [25.7916, -80.18],
      [25.7916, -80.202],
    ],
  },
];
