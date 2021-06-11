// TODO: Delete this file later and use the already defined types

/**
 * Possible stages of the preview component
 */
export type PreviewStage = 'Install' | 'Splashscreen' | 'Name';

/**
 * Supported platforms
 */
export type platform = 'windows' | 'android' | 'samsung';

/**
 * Reference: https://www.w3.org/TR/image-resource/#dom-imageresource
 */
 export type ImageResource = {
  src: string;
  sizes?: string;
  type?: string;
  label?: string;
}

/**
 * Web app manifest
 */
export interface Manifest {
  name: string;
  short_name?: string;
  icons: ImageResource[];
  display?: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  orientation?: 'any' | 'natural' | 'landscape' | 'landscape-primary' | 'landscape-secondary' | 'portrait' | 'portrait-primary' | 'portrait-secondary';
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
  theme_color?: string;
  related_applications?: {
    platform?: string;
    url?: string;
    id?: string;
  }[];
  prefer_related_applications?: boolean;
  background_color?: string;
  shortcuts?: {
    name: string;
    url: string;
    short_name?: string;
    description?: string;
    icons?: ImageResource[];
  }[];
  categories?: string[];
  description?: string;
  screenshots?: ImageResource[];
  iarc_rating_id?: string;
}