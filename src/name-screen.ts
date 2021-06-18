import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { FullScreenController } from './fullscreen-controller';
import type { Platform } from './models';

@customElement('name-screen')
export class NameScreen extends LitElement {
  static styles = css`
    :host {
      --windows-background: #3C3B3B;
    }

    .container {
      position: relative;
      margin: 70px auto 0;
    }

    .menu-img {
      width: 100%;
    }

    .windows .hidden {
      background-color: var(--windows-background);
      position: absolute;
      height: 50px;
    }
    .windows .app-initial {
      background-color: var(--windows-background);
      color: #FFF;
      position: absolute;
      width: 20px;
      font-size: 12px;
    }

    .windows .app-name {
      background-color: var(--windows-background);
      position: absolute;
      color: rgba(255, 255, 255, 0.7);
      top: 105px;
      left: 89px;
      font-size: 10px;
    }

    .windows .app-icon {
      position: absolute;
    }

    .android .app-icon {
      position: absolute;
      width: 55px;
      height: 55px;
      left: calc(50% - 27.5px);
    }

    .android .app-name {
      position: absolute;
      width: 100%;
      background-color: #FFF;
      text-align: center;
      font-size: 16px;
    }

    @media(min-width: 1366px) {
      .container {
        width: 280px;
      }

      .windows .hidden {
        bottom: 46px;
        width: calc(100% - 50px);
        left: 50px;
      }

      .windows .app-initial {
        top: 75px;
        left: 65px;
      }

      .windows .app-name {
        top: 105px;
        left: 87px;
      }

      .windows .app-icon {
        height: 28px;
        width: 28px;
        top: 98px;
        left: 57px;
      }

      .android .app-icon {
        top: 60px;
      }

      .android .app-name {
        top: 115px;
      }
    }

    @media(max-width: 1366px) {
      .container {
        width: 250px;
      }

      .windows .hidden {
        bottom: 42px;
        width: calc(100% - 45px);
        left: 45px;
      }

      .windows .app-initial {
        top: 65px;
        left: 58px;
      }

      .windows .app-name {
        top: 96px;
        left: 78px;
      }

      .windows .app-icon {
        height: 25px;
        width: 25px;
        top: 90px;
        left: 50px;
      }

      .android .app-icon {
        top: 50px;
      }

      .android .app-name {
        top: 105px;
      }
    }
  `;

  private fsController = new FullScreenController(this);

  @property()
  platform: Platform = 'windows';

  /**
   * Name attribute on the manifest.
   */
  @property()
  appName: string | undefined;

  /**
   * The URL to use for icon previews, or undefined if the manifest has no
   * icons.
   */
  @property()
  iconUrl: string | undefined;

  render() {
    switch (this.platform) {
      case 'windows':
        return html`
          <div 
          style=${styleMap({ 
            transform: `scale(${this.fsController.isInFullScreen ? 2.2 : 1})`,
            marginTop: this.fsController.isInFullScreen ? '30vh' : '70px'
          })} 
          class="windows container">
            <img alt="Windows start menu" src="../assets/images/windows/startmenu.png" class="menu-img" />
            ${this.iconUrl ?
              html`<img alt="Application's icon" src=${this.iconUrl} class="app-icon" />` : 
              null}
            <div class="hidden"></div>
            <div class="app-initial">${this.appName ? this.appName.slice(0, 1) : 'A'}</div>
            <div class="app-name">${this.appName || 'PWA App'}</div>
          </div>
        `;
      case 'android':
        return html`
          <div 
          style=${styleMap({ 
            transform: `scale(${this.fsController.isInFullScreen ? 2.2 : 1})`,
            marginTop: this.fsController.isInFullScreen ? '30vh' : '70px'
          })} 
          class="android container">
            <img alt="Android app info" src="../assets/images/android/appinfo.png" class="menu-img" />
            ${this.iconUrl ?
              html`<img alt="Application's icon" src=${this.iconUrl} class="app-icon" />` : 
              null}
            <div class="app-name">${this.appName || 'PWA App'}</div>
          </div>
        `;
      default: return null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'name-screen': NameScreen;
  }
}