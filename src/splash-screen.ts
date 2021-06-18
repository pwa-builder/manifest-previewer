import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { FullScreenController } from './fullscreen-controller';
import { getContrastingColor } from './utils';
import type { Platform } from './models';

@customElement('splash-screen')
export class SplashScreen extends LitElement {
  static styles = css`
    .container {
      position: relative;
      width: 220px;
      margin: 10px auto 0;
    }

    .android .phone {
      position: absolute;
      width: 100%;
      height: 480px;
      top: 0;
      background: #FFF;
      box-shadow: 0px 3px 5.41317px rgba(0, 0, 0, 0.25);
      border-radius: 8.11976px;
      object-fit: cover;
      z-index: -1;
    }

    .android .screen {
      position: absolute;
      width: 100%;
      height: 400px;
      top: 29px;
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

    .container.ios {
      margin-top: 30px;
    }

    .ios .phone {
      width: 100%;
      position: absolute;
      top: 0;
    }

    .ios .screen {
      height: 280px;
      width: 188px;
      position: absolute;
      top: 66px;
      left: 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: var(--ios-font-family);
    }

    .ios .icon {
      margin: 0 0 10px;
      width: 80px;
      height: 80px;
    }
  `;

  private fsController = new FullScreenController(this);

  @property()
  platform: Platform = 'windows';

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
    switch (this.platform) {
      case 'windows':
        return html`
          <p style=${styleMap({ margin: '100px auto' })}>
            Not sure of what to show here
          </p>
        `;
      case 'android':
        return html`
        <div style=${styleMap({ transform: `scale(${this.fsController.isInFullScreen ? 1.7 : 1})` })} class="container android">
          <img class="phone" alt="Application mobile preview" src="../assets/images/android/background.svg" />
          <div class="screen" style=${styleMap({ backgroundColor: this.backgroundColor || '#FFF' })}>
            <div 
            class="phone-bar"
            style=${styleMap({ backgroundColor: this.themeColor || '#000' })}></div>
            <img 
            class="icon" 
            src=${this.iconUrl || '../assets/images/android/noicon.svg'} 
            alt="App's splash screen" />
            <h5 
            class="appName" 
            style=${styleMap({ 
              color: this.backgroundColor ? getContrastingColor(this.backgroundColor) : '#000'
            })}>
              ${this.appName || 'PWA App'}
            </h5>
            <div class="phone-bar" style=${styleMap({ backgroundColor: this.themeColor || '#000' })}></div>
          </div>
        </div>
        `;
      case 'iOS':
        return html`
          <div style=${styleMap({ transform: `scale(${this.fsController.isInFullScreen ? 1.5 : 1})` })} class="container ios"> 
            <img class="phone" alt="Iphone" src="../assets/images/ios/iphone.svg" />
            <div class="screen" style=${styleMap({ backgroundColor: this.backgroundColor || '#FFF' })}>
              ${this.iconUrl ? 
                html`<img class="icon" src=${this.iconUrl} alt="App's splash screen" />` : null}
              <h5 
              class="appName" 
              style=${styleMap({ 
                color: this.backgroundColor ? getContrastingColor(this.backgroundColor) : '#000'
              })}>
                ${this.appName || 'PWA App'}
              </h5>
            </div>
          </div>
        `;
      default: return null;
    }
  }
}