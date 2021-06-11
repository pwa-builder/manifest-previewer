import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { Manifest, Platform } from './models';

interface PreviewMixinInterface {
  manifest: Manifest;
  manifestUrl: string;
  selectedPlatform: Platform;
  getIconUrl(): string;
  getSiteUrl(): string;
}

type Constructor<T = {}> = new (...args: any[]) => T;

export const PreviewMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  class PreviewMixinClass extends superClass implements PreviewMixinInterface {
    /**
     * The input web manifest.
     */
    @property({ 
      type: Object,
      converter: value => {
        if (!value) {
          return undefined;
        }
        
        const parsedManifest = JSON.parse(value);
        parsedManifest.name = parsedManifest.name || 'My app';
        parsedManifest.icons = parsedManifest.icons || [];

        return parsedManifest;
      }
    })
    manifest: Manifest = {
      name: 'My app',
      icons: []
    }

    /**
     * The url where the manifest resides.
     */
    @property({ type: String })
    manifestUrl = "";

    /**
     * The platform currently being previewed.
     */
    @property()
    selectedPlatform = Platform.Windows;

    /**
     * @returns The URL to use for the Android icon preview.
     */
    getIconUrl() {
      // Try to get the icon for Android Chrome, or the first one by default
      let iconUrl = this.manifest.icons[0].src;
      for (const icon of this.manifest.icons) {
        if (icon.sizes?.includes('192x192')) {
          iconUrl = icon.src;
          break;
        }
      }

      const absoluteUrl = new URL(iconUrl, this.manifestUrl).href;
      return `https://pwabuilder-safe-url.azurewebsites.net/api/getsafeurl?url=${absoluteUrl}`;
    }

    /**
     * @returns The website's URL (assuming it can be derived from the manifest's URL).
     */
    getSiteUrl() {
      return this.manifestUrl.substring(0, this.manifestUrl.lastIndexOf('manifest.json'));
    }
  }

  return PreviewMixinClass as Constructor<PreviewMixinInterface> & T;
}