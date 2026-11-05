import L from 'leaflet';
import type { MapAreaId } from '../data/map-areas';
import type { MapPin } from '../lib/active-listings';

export type MapBoot = {
  areas: {
    id: MapAreaId;
    name: string;
    polygon: [number, number][];
    color: string;
    tagline: string;
    labelAt: [number, number];
    labelTransform: string;
    detailLabel: boolean;
  }[];
  pins: MapPin[];
};

type Filter = 'all' | 'sale' | 'rental';

function areaStyle(id: string, color: string, fillOpacity: number, weight: number): L.PathOptions {
  return {
    color,
    weight,
    opacity: 1,
    fillColor: color,
    fillOpacity,
    className: `neon-area neon-${id}`,
  };
}

const salePin: L.CircleMarkerOptions = {
  radius: 4.5,
  weight: 1.5,
  color: '#1a140c',
  fillColor: '#f7f3ea',
  fillOpacity: 1,
  pane: 'markerPane',
};

const rentPin: L.CircleMarkerOptions = {
  radius: 4.5,
  weight: 1.75,
  color: '#f7f3ea',
  fillColor: '#f7f3ea',
  fillOpacity: 0,
  pane: 'markerPane',
};

export function mount(config: MapBoot): void {
  const container = document.getElementById('neighborhood-map');
  if (!container) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current: string | null = null;
  let filter: Filter = 'all';
  const map = L.map(container, {
    center: [25.78, -80.2],
    zoom: 11,
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true,
  });

  const tileOptions: L.TileLayerOptions = {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19,
    maxNativeZoom: 18,
    tileSize: 256,
    zoomOffset: 0,
    detectRetina: false,
    crossOrigin: 'anonymous',
    keepBuffer: 3,
  };
  const imagery = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    tileOptions,
  );
  const canvas = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    { ...tileOptions, maxZoom: 16, maxNativeZoom: 16 },
  );
  let usingImagery = true;
  imagery.addTo(map);
  container.classList.add('is-imagery');

  let imageryLoaded = 0;
  imagery.on('tileload', () => {
    imageryLoaded += 1;
  });
  imagery.on('tileerror', (event) => {
    const tile = event.tile as HTMLImageElement | undefined;
    if (!tile || tile.dataset.retried === '1') return;
    tile.dataset.retried = '1';
    const src = tile.getAttribute('src');
    if (src) window.setTimeout(() => {
      tile.src = src;
    }, 500);
  });
  window.setTimeout(() => {
    if (usingImagery && imageryLoaded < 2) useCanvas();
  }, 4500);

  function useCanvas(): void {
    if (!usingImagery) return;
    usingImagery = false;
    map.removeLayer(imagery);
    canvas.addTo(map);
    container.classList.remove('is-imagery');
  }

  if (window.matchMedia('(min-width: 900px)').matches) {
    map.scrollWheelZoom.enable();
  }

  const shapes = new Map<string, L.Polygon>();
  const bounds = L.latLngBounds([]);

  const compactLabels: L.Marker[] = [];

  for (const area of config.areas) {
    const polygon = L.polygon(area.polygon, areaStyle(area.id, area.color, 0.22, 2.5)).addTo(map);
    const stack = document.createElement('span');
    stack.className = 'area-label-stack';
    stack.style.transform = area.labelTransform;
    const title = document.createElement('span');
    title.className = 'area-label-name';
    title.textContent = area.name;
    const sub = document.createElement('span');
    sub.className = 'area-label-sub';
    sub.textContent = area.tagline;
    stack.append(title, sub);
    const labelMarker = L.marker(area.labelAt, {
      interactive: false,
      keyboard: false,
      pane: 'tooltipPane',
      icon: L.divIcon({
        className: area.detailLabel ? 'area-name is-detail' : 'area-name',
        html: stack,
        iconSize: [0, 0],
      }),
    }).addTo(map);
    if (area.detailLabel) {
      compactLabels.push(labelMarker);
      polygon.bindTooltip(`${area.name} — ${area.tagline}`, {
        sticky: true,
        className: 'area-tip',
        opacity: 1,
      });
    }
    polygon.on('click', () => openArea(area.id));
    polygon.on('mouseover', () => {
      if (current !== area.id) polygon.setStyle(areaStyle(area.id, area.color, 0.38, 3));
    });
    polygon.on('mouseout', () => {
      polygon.setStyle(
        current === area.id
          ? areaStyle(area.id, area.color, 0.5, 3.25)
          : areaStyle(area.id, area.color, 0.22, 2.5),
      );
    });
    shapes.set(area.id, polygon);
    bounds.extend(polygon.getBounds());
  }

  shapes.get('sunset-harbour')?.bringToFront();
  shapes.get('venetian-islands')?.bringToFront();

  const markers: { marker: L.CircleMarker; pin: MapPin }[] = [];
  for (const pin of config.pins) {
    const marker = L.circleMarker([pin.lat, pin.lng], pin.tx === 'sale' ? salePin : rentPin);
    marker.bindTooltip(pin.label, { direction: 'top', opacity: 1, className: 'pin-tip' });
    marker.on('click', () => {
      openArea(pin.area);
      const card = document.getElementById(`listing-${pin.id}`);
      card?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    });
    marker.addTo(map);
    markers.push({ marker, pin });
  }

  const backdrop = document.querySelector<HTMLButtonElement>('.map-backdrop');
  const dock = document.querySelector<HTMLElement>('.map-dock');

  function frameAll(): void {
    if (!bounds.isValid()) return;
    map.invalidateSize({ animate: false, pan: false });
    map.fitBounds(bounds, { padding: [16, 16], animate: false, maxZoom: 15 });
    map.setMaxBounds(bounds.pad(0.25));
    const fitted = map.getBoundsZoom(bounds, false);
    map.setMinZoom(Math.max(fitted - 1, 9));
  }

  function styleShapes(): void {
    for (const area of config.areas) {
      const polygon = shapes.get(area.id);
      if (!polygon) continue;
      polygon.setStyle(
        area.id === current
          ? areaStyle(area.id, area.color, 0.5, 3.25)
          : areaStyle(area.id, area.color, 0.22, 2.5),
      );
    }
  }

  function syncDetailLabels(): void {
    const show = map.getZoom() >= 13;
    for (const marker of compactLabels) {
      const el = marker.getElement();
      if (el) el.style.visibility = show ? 'visible' : 'hidden';
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
    dock?.classList.add('has-sheet');
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
    dock?.classList.remove('has-sheet');
    if (backdrop) backdrop.hidden = true;
    styleShapes();
    frameAll();
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

  window.addEventListener('resize', () => {
    if (current) map.invalidateSize();
    else frameAll();
  });
  map.on('zoomend', syncDetailLabels);
  applyFilter();
  frameAll();
  syncDetailLabels();
  const sized = { w: container.clientWidth, h: container.clientHeight };
  window.requestAnimationFrame(() => {
    if (container.clientWidth !== sized.w || container.clientHeight !== sized.h) frameAll();
  });
}
