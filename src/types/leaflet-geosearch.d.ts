// src/@types/leaflet-geosearch/index.d.ts
import 'leaflet';

declare module 'leaflet-geosearch' {
  import { Control } from 'leaflet';

  export interface BaseProviderOptions {
    params?: Record<string, string>;
  }

  export class OpenStreetMapProvider {
    constructor(options?: BaseProviderOptions);
    search(options: { query: string }): Promise<SearchResult>;
  }

  export interface SearchResult {
    results: Array<{
      x: number;
      y: number;
      label: string;
      bounds: [[number, number], [number, number]];
    }>;
  }

  export interface GeoSearchControlOptions {
    provider: OpenStreetMapProvider;
    style?: string;
    showMarker?: boolean;
    autoClose?: boolean;
    retainZoomLevel?: boolean;
    searchLabel?: string;
  }

  export class GeoSearchControl extends Control {
    constructor(options: GeoSearchControlOptions);
    onAdd(map: Map): HTMLElement;
  }
}