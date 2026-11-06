import { getCollection } from 'astro:content';
import type { GuideData, GuideEntry, TeamListingData, TeamListingEntry } from './types';

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

export async function getTeamListings(): Promise<TeamListingEntry[]> {
  const all = await getCollection('teamListings');
  return all
    .map((entry) => ({ id: entry.id, data: entry.data as TeamListingData }))
    .sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}
