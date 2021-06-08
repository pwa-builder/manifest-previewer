import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { Manifest, Platform } from './models';

@customElement('device-preview')
export class DevicePreview extends LitElement {
  static styles = css`
    .android-preview {
      position: absolute;
      width: 219px;
      height: 504px;
      top: 226px;
      left: calc(50% - 109.5px);
      background: #FFF;
      box-shadow: 0px 3px 5.41317px rgba(0, 0, 0, 0.25);
      border-radius: 8.11976px;
      object-fit: cover;
      z-index: -1;
    }

    .windows-preview {
      position: absolute;
      width: 222px;
      height: 204px;
      top: 294px;
      left: calc(50% - 111px);
    }
    
    .android-add-dialog {
      width: 207.17px;
      height: 108.29px;
      margin: 255px auto 0;
      background: #FFF;
      box-shadow: 0px 3.13889px 3.13889px rgba(0, 0, 0, 0.25);
      border-radius: 4.70833px;
      box-sizing: border-box;
      padding: 14px;
    }

    .android-add-dialog .dialog-title {
      font-family: Roboto;
      font-weight: 400;
      font-size: 14.125px;
      color: rgba(0, 0, 0, 0.9);
      margin: 0;
    } 

    .android-add-dialog .app-info {
      margin: 14px 0 0;
      display: flex;
      line-height: 12px;
      align-items: center;
    }

    .android-add-dialog .app-info .icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }

    .android-add-dialog .app-info .app-name {
      font-family: Roboto;
      font-weight: 600;
      font-size: 10.9861px;
      margin: 0;
    }

    .android-add-dialog .app-info .app-url {
      font-family: Roboto;
      font-weight: 400;
      font-size: 7.84722px;
      margin: 0;
    }

    .android-add-dialog .dialog-actions {
      display: flex;
      margin: 7.85px 0 0 108px;
    }

    .android-add-dialog .dialog-actions span {
      font-family: Roboto;
      font-weight: 500;
      font-size: 9.41667px;
      color: #1F7CC6;
      margin-right: 20px;
    }

    /* 1366 designs */
    @media(min-width: 1366px) {
      .android-preview {
        width: 231px;
        height: 510px;
        left: calc(50% - 115.5px);
      }
    }
  `;

  /**
   * The input web manifest.
   */
  @property({ 
    type: Object,
    converter: value => {
      if (!value) {
        return undefined;
      }
      return JSON.parse(value);
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
   * @returns The icon to use for the Android icon preview.
   */
  private getAndroidIconUrl() {
    // Try to get the icon for Android Chrome, or the first one by default
    let iconUrl = this.manifest.icons[0].src;
    for (const icon of this.manifest.icons) {
      if (icon.sizes === '192x192') {
        iconUrl = icon.src;
        break;
      }
    }

    const absoluteUrl = new URL(iconUrl, this.manifestUrl).href;
    return `https://pwabuilder-safe-url.azurewebsites.net/api/getsafeurl?url=${absoluteUrl}`;
  }

  render() {
    switch (this.selectedPlatform) {
      case Platform.Windows:
        return html`
          <img 
          class="windows-preview"
          alt="Application mobile preview" 
          src="../assets/images/windows_background.svg" />
        `;
      case Platform.Android:
        return html`
          <div class="android-add-dialog">
            <p class="dialog-title">Add to Home screen</p>
            <div class="app-info">
              ${this.manifest.icons.length > 0 ? 
                html`<img class="icon" alt="App's Android icon" src=${this.getAndroidIconUrl()} />` : 
                html`<div class="icon" style=${styleMap({ backgroundColor: '#C4C4C4' })}></div>`}
              <div>
                <p class="app-name">${this.manifest.short_name || this.manifest.name}</p>
                <p class="app-url">
                  ${this.manifestUrl.substring(0, this.manifestUrl.lastIndexOf('.com'))}.com
                </p>
              </div>
            </div>
            <div class="dialog-actions">
              <span>Cancel</span>
              <span>Add</span>
            </div>
          </div>
          <img 
          class="android-preview"
          alt="Application mobile preview" 
          src="../assets/images/android_background.svg" />
        `;
      default: return null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'device-preview': DevicePreview;
  }
}
