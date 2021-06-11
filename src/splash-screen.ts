import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import type { platform } from './models';

@customElement('splash-screen')
export class SplashScreen extends LitElement {
  static styles = css`
    .android-phone {
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

    .android-screen {
      position: absolute;
      width: 219px;
      height: 413px;
      top: 260px;
      left: calc(50% - 109.5px);
      border-radius: 8.12px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .phone-bar {
      padding: 7px 0;
      width: 100%;
    }

    .icon {
      margin: auto;
      width: 90px;
      height: 90px;
      margin-top: calc(50% + 45px);
    }

    .appName {
      width: fit-content;
      margin: 0 auto 30px;
      font-size: 16px;
    }
  `;

  /**
   * The color to use for the app's title, in such a way that
   * it contrasts with the background color.
   */
  @state()
  _appNameColor = '';

  /**
   * The platform currently being previewed.
   */
  @property()
  selectedPlatform: platform = 'windows';

  /**
   * Background color attribute on the manifest.
   */
  @property()
  backgroundColor: string | undefined;

  /**
   * Theme color attribute on the manifest.
   */
  @property()
  themeColor: string | undefined;

  /**
   * The URL to use for icon previews, or undefined if the manifest has no
   * icons.
   */
  @property()
  iconUrl: string | undefined;

  /**
   * Name attribute on the manifest.
   */
  @property()
  appName: string | undefined;

  @property()
  get appNameColor() {
    if (!this._appNameColor) {
      if (!this.backgroundColor) {
        // If the manifest doesn't specify a background color, just use black for the title
        // since the background will be white.
        this._appNameColor = '#000';
      } else {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext('2d')!;
        context.fillStyle = this.backgroundColor;
        context.fillRect(0, 0, 1, 1);
        const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
        // From the RGB values, compute the perceived lightness using the sRGB Luma method.
        const perceived_lightness = ((red * 0.2126) + (green * 0.7152) + (blue * 0.0722)) / 255;
        this._appNameColor = `hsl(0, 0%, ${(perceived_lightness - 0.5) * - 10000000}%)`;
      }
    }

    return this._appNameColor;
  }

  render() {
    switch (this.selectedPlatform) {
      case 'windows':
        return html`
          <p style=${styleMap({ margin: '100px auto' })}>
            Not sure of what to show here
          </p>
        `;
      case 'android':
        return html`
          <img 
          class="android-phone"
          alt="Application mobile preview" 
          src="../assets/images/android_background.svg" />
          <div 
          class="android-screen" 
          style=${styleMap({ backgroundColor: this.backgroundColor || '#FFF' })}>
            <div 
            class="phone-bar"
            style=${styleMap({ backgroundColor: this.themeColor || '#000' })}></div>
            <img 
            class="icon" 
            src=${this.iconUrl || '../assets/images/noicon_android.svg'} 
            alt="App's splash screen" />
            <h5 class="appName" style=${styleMap({ color: this.appNameColor })}>
              ${this.appName || 'PWA App'}
            </h5>
            <div
            class="phone-bar"
            style=${styleMap({ backgroundColor: this.themeColor || '#000' })}></div>
          </div>
        `;
    
      default: return null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'splash-screen': SplashScreen;
  }
}