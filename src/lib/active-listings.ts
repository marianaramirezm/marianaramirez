import raw from '../data/serhant-miami-active.json';
import { mapAreas, type MapAreaId } from '../data/map-areas';

export type ActiveListing = {
  neighborhood: string;
  address: string;
  unit: string | null;
  city: string;
  zip: string;
  lat: number;
  lng: number;
  status: string;
  transaction_type: 'sale' | 'rental';
  list_price: number | null;
  monthly_rent: number | null;
  beds: number;
  baths: number | null;
  interior_sqft: string | null;
  listing_agents: string[];
  serhant_url: string;
  photo_urls: string[];
  is_team_listing: boolean;
  mls_id: string;
};

export const activeListings = raw as ActiveListing[];

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export function priceLabel(item: ActiveListing, perMonth: string): string | null {
  if (item.transaction_type === 'rental') {
    if (item.monthly_rent == null) return null;
    return `${money.format(item.monthly_rent)}${perMonth}`;
  }
  if (item.list_price == null) return null;
  return money.format(item.list_price);
}

export function specLine(
  item: ActiveListing,
  labels: { bed: string; bath: string; sqft: string },
): string {
  const parts = [`${item.beds} ${labels.bed}`];
  if (item.baths != null) parts.push(`${item.baths} ${labels.bath}`);
  if (item.interior_sqft) {
    const parsed = Number(item.interior_sqft);
    if (Number.isFinite(parsed)) parts.push(`${number.format(parsed)} ${labels.sqft}`);
  }
  return parts.join(' · ');
}

export function listingsFor(sourceName: string): ActiveListing[] {
  return activeListings
    .filter((item) => item.neighborhood === sourceName)
    .sort((a, b) => {
      if (a.is_team_listing !== b.is_team_listing) return a.is_team_listing ? -1 : 1;
      if (a.transaction_type !== b.transaction_type) return a.transaction_type === 'sale' ? -1 : 1;
      const aPrice = a.list_price ?? a.monthly_rent ?? 0;
      const bPrice = b.list_price ?? b.monthly_rent ?? 0;
      return bPrice - aPrice;
    });
}

export function countFor(sourceName: string): number {
  return activeListings.filter((item) => item.neighborhood === sourceName).length;
}

export type MapPin = {
  id: string;
  area: MapAreaId;
  lat: number;
  lng: number;
  tx: 'sale' | 'rental';
  label: string;
};

export function listingDomId(item: ActiveListing): string {
  const index = activeListings.indexOf(item);
  return `${item.mls_id}-${index}`;
}

export function mapPins(): MapPin[] {
  const byName = new Map(mapAreas.map((area) => [area.sourceName, area.id]));
  return activeListings.flatMap((item) => {
    const area = byName.get(item.neighborhood);
    if (!area) return [];
    return [
      {
        id: listingDomId(item),
        area,
        lat: item.lat,
        lng: item.lng,
        tx: item.transaction_type,
        label: item.address,
      },
    ];
  });
}
