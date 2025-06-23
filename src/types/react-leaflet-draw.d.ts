// src/@types/react-leaflet-draw.d.ts
declare module 'react-leaflet-draw' {
    import { Control } from 'leaflet';
    import { FeatureGroup } from 'react-leaflet';
  
    export interface EditControlProps {
      onCreated?: (e: any) => void;
      onEdited?: (e: any) => void;
      onDeleted?: (e: any) => void;
      draw?: {
        polygon?: boolean;
        rectangle?: boolean;
        circle?: boolean;
        marker?: boolean;
      };
      edit?: {
        edit?: boolean;
        remove?: boolean;
      };
      position?: 'topright' | 'topleft';
    }
  
    export class EditControl extends Control {}
  }