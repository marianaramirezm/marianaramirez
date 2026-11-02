import { getCollection } from 'astro:content';
import type { GuideData, GuideEntry, ListingData, ListingEntry } from './types';

export async function getListings(): Promise<ListingEntry[]> {
  const all = await getCollection('listings');
  return all
    .map((entry) => ({ id: entry.id, data: entry.data as ListingData }))
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getNeighborhoods(): Promise<GuideEntry[]> {
  const all = await getCollection('neighborhoods');
  return all
    .map((entry) => ({ id: entry.id, data: entry.data as GuideData }))
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getResidences(): Promise<GuideEntry[]> {
  const all = await getCollection('residences');
  return all
    .map((entry) => ({ id: entry.id, data: entry.data as GuideData }))
    .sort((a, b) => a.data.order - b.data.order);
}
