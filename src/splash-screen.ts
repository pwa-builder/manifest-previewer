import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { getContrastingColor } from './utils';
import type { platform } from './models';

@customElement('splash-screen')
export class SplashScreen extends LitElement {
  static styles = css`
    .android-phone {
      position: absolute;
      width: 219px;
      height: 480px;
      top: 240px;
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
      height: 415px;
      top: 255px;
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
   * The splash screen's icon.
   */
  @property()
  iconUrl: string | undefined;

  /**
   * Name attribute on the manifest.
   */
  @property()
  appName: string | undefined;

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
            <h5 
            class="appName" 
            style=${styleMap({ 
              color: this.backgroundColor ? getContrastingColor(this.backgroundColor) : '#000'
            })}>
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