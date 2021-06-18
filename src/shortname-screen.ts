import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { FullScreenController } from './fullscreen-controller';
import type { Platform } from './models';

@customElement('shortname-screen')
export class ShortnameScreen extends LitElement {
  static styles = css`
    .windows-message {
      margin: 100px auto 0px;
      width: 70%;
      font-style: italic;
      font-size: 14px;
      color: rgba(128, 128, 128, 0.8);
      font-weight: 600;
    }

    .container {
      position: relative;
      margin: 70px auto 0;
    }

    .android .homescreen {
      width: 100%;
      border-radius: 10px;
    }

    .android .background {
      background: linear-gradient(#bc8aa3 0%,#eaa4c3 100%);
      width: 100%;
      position: absolute;
      top: 20px;
      bottom: 0;
      border-radius: 0 0 10px 10px;
    }

    .android .icon-container {
      display: flex;
      align-items: center;
      position: absolute;
      flex-direction: column;
      top: 50px;
      left: 10px;
    }

    .android .app-icon {
      border-radius: 50%;
      width: 50px;
      height: 50px;
    }

    .android .app-name {
      text-align: center;
      color: #FFF;
      font-size: 14px;
      text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.46);
    }

    @media(max-width: 1366px) {
      .container {
        width: 250px;
      }
    }

    @media(min-width: 1366px) {
      .container {
        width: 280px;
      }
    }
  `;

  private fsController = new FullScreenController(this);

  @property()
  platform: Platform = 'windows';

  /**
   * Short name attribute on the manifest.
   */
  @property()
  appShortName: string | undefined;
 
  /**
   * The URL to use for icon previews, or undefined if the manifest has no
   * icons.
   */
  @property()
  iconUrl: string | undefined;

  render() {
    switch(this.platform) {
      case 'windows':
        return html`
          <p class="windows-message">
            Windows always uses the application's name and ignores
            its short name.
          </p>
        `;
      case 'android':
        return html`
          <div 
          style=${styleMap({ 
            transform: `scale(${this.fsController.isInFullScreen ? 2.5 : 1})`,
            marginTop: this.fsController.isInFullScreen ? '30vh' : '70px'
          })} 
          class="android container">
            <div class="background"></div>
            <div class="icon-container">
              ${this.iconUrl ?
                html`<img alt="Application's icon" src=${this.iconUrl} class="app-icon" />` : 
                null}
              <div class="app-name">${this.appShortName || 'PWA App'}</div>
            </div>
            <img class="homescreen" alt="Android's home screen" src="../assets/images/android/homescreen.png" />
          </div>
        `;
      default: return null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'shortname-screen': ShortnameScreen;
  }
}