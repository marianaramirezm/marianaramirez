import L from 'leaflet';
import type { MapAreaId } from '../data/map-areas';
import type { MapPin } from '../lib/active-listings';

export type MapBoot = {
  areas: { id: MapAreaId; name: string; polygon: [number, number][] }[];
  pins: MapPin[];
};

type Filter = 'all' | 'sale' | 'rental';

const baseStyle: L.PathOptions = {
  color: '#9bb4ff',
  weight: 1.5,
  opacity: 0.95,
  fillColor: '#9bb4ff',
  fillOpacity: 0.14,
};

const activeStyle: L.PathOptions = {
  color: '#c5d2ff',
  weight: 2.25,
  opacity: 1,
  fillColor: '#9bb4ff',
  fillOpacity: 0.32,
};

export function mount(config: MapBoot): void {
  const container = document.getElementById('neighborhood-map');
  if (!container) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current: string | null = null;
  let filter: Filter = 'all';
  const map = L.map(container, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true,
  });

  // CARTO dark_all now returns an API-key watermark on every tile. This dark
  // canvas is a no-key basemap and stays readable under the blue areas.
  L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      maxZoom: 16,
    },
  ).addTo(map);

  if (window.matchMedia('(min-width: 900px)').matches) {
    map.scrollWheelZoom.enable();
  }

  const shapes = new Map<string, L.Polygon>();
  const bounds = L.latLngBounds([]);

  for (const area of config.areas) {
    const polygon = L.polygon(area.polygon, baseStyle).addTo(map);
    polygon.bindTooltip(area.name, {
      sticky: true,
      direction: 'center',
      className: 'area-label',
      opacity: 1,
    });
    polygon.on('click', () => openArea(area.id));
    polygon.on('mouseover', () => {
      if (current !== area.id) polygon.setStyle({ ...baseStyle, fillOpacity: 0.24 });
    });
    polygon.on('mouseout', () => {
      polygon.setStyle(current === area.id ? activeStyle : baseStyle);
    });
    shapes.set(area.id, polygon);
    bounds.extend(polygon.getBounds());
  }

  const markers: { marker: L.CircleMarker; pin: MapPin }[] = [];
  for (const pin of config.pins) {
    const sale = pin.tx === 'sale';
    const marker = L.circleMarker([pin.lat, pin.lng], {
      radius: 6,
      weight: 1.5,
      color: sale ? '#f7f3ea' : '#9bb4ff',
      fillColor: sale ? '#9bb4ff' : '#f7f3ea',
      fillOpacity: 0.95,
      pane: 'markerPane',
    });
    marker.bindTooltip(pin.label, { direction: 'top', opacity: 1, className: 'pin-tip' });
    marker.on('click', () => {
      openArea(pin.area);
      const card = document.getElementById(`listing-${pin.id}`);
      card?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    });
    marker.addTo(map);
    markers.push({ marker, pin });
  }

  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [28, 28], animate: false, maxZoom: 13 });
  }

  const backdrop = document.querySelector<HTMLButtonElement>('.map-backdrop');

  function styleShapes(): void {
    for (const [id, polygon] of shapes) {
      polygon.setStyle(id === current ? activeStyle : baseStyle);
    }
  }

  function applyFilter(): void {
    document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => {
      button.setAttribute('aria-pressed', button.dataset.filter === filter ? 'true' : 'false');
    });
    document.querySelectorAll<HTMLElement>('[data-tx]').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.tx !== filter;
    });
    for (const entry of markers) {
      const show = filter === 'all' || entry.pin.tx === filter;
      if (show) entry.marker.addTo(map);
      else entry.marker.remove();
    }
    document.querySelectorAll<HTMLElement>('.map-sheet').forEach((sheet) => {
      const cards = [...sheet.querySelectorAll<HTMLElement>('[data-tx]')];
      const note = sheet.querySelector<HTMLElement>('.map-none');
      if (!note) return;
      const anyVisible = cards.some((card) => !card.hidden);
      note.hidden = cards.length === 0 || anyVisible || filter === 'all';
    });
  }

  function openArea(id: string): void {
    current = id;
    document.querySelectorAll<HTMLElement>('.map-sheet').forEach((sheet) => {
      const on = sheet.id === `sheet-${id}`;
      sheet.classList.toggle('is-open', on);
      sheet.hidden = !on;
    });
    document.querySelectorAll<HTMLButtonElement>('[data-open]').forEach((button) => {
      const on = button.dataset.open === id;
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const prompt = document.querySelector<HTMLElement>('.map-choose');
    if (prompt) prompt.hidden = true;
    if (backdrop) backdrop.hidden = false;
    styleShapes();
    applyFilter();
    const sheet = document.getElementById(`sheet-${id}`);
    const focusTarget = sheet?.querySelector<HTMLElement>('h2');
    focusTarget?.focus();
    const shape = shapes.get(id);
    if (shape) {
      map.fitBounds(shape.getBounds(), {
        padding: [36, 36],
        animate: !reduce,
        maxZoom: 14,
        duration: 0.4,
      });
    }
    window.setTimeout(() => map.invalidateSize(), 60);
  }

  function closeArea(): void {
    current = null;
    document.querySelectorAll<HTMLElement>('.map-sheet').forEach((sheet) => {
      sheet.classList.remove('is-open');
      sheet.hidden = true;
    });
    document.querySelectorAll<HTMLButtonElement>('[data-open]').forEach((button) => {
      button.setAttribute('aria-pressed', 'false');
    });
    const prompt = document.querySelector<HTMLElement>('.map-choose');
    if (prompt) prompt.hidden = false;
    if (backdrop) backdrop.hidden = true;
    styleShapes();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [28, 28], animate: !reduce, maxZoom: 13 });
    }
  }

  document.querySelectorAll<HTMLButtonElement>('[data-open]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.open;
      if (!id) return;
      if (current === id) closeArea();
      else openArea(id);
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      const next = button.dataset.filter;
      if (next === 'all' || next === 'sale' || next === 'rental') {
        filter = next;
        applyFilter();
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-close-sheet]').forEach((button) => {
    button.addEventListener('click', () => closeArea());
  });
  backdrop?.addEventListener('click', () => closeArea());

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && current) closeArea();
  });

  window.addEventListener('resize', () => map.invalidateSize());
  applyFilter();
}
