import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import '../preview-info.js';
import { FullScreenController } from '../fullscreen-controller';
import type { Platform } from '../models';

@customElement('name-screen')
export class NameScreen extends LitElement {
  static styles = css`
    :host {
      --windows-background: #3C3B3B;
    }

    .container {
      position: relative;
      margin: 70px auto 0;
      width: 260px;
    }

    .menu-img {
      position: absolute;
      top: 0;
      width: 100%;
    }

    .windows .hidden {
      background-color: var(--windows-background);
      position: absolute;
      width: calc(100% - 50px);
      left: 50px;
      height: 50px;
      top: 121.5px;
    }
    .windows .app-initial {
      background-color: var(--windows-background);
      color: #FFF;
      position: absolute;
      width: 20px;
      font-size: 12px;
      top: 69px;
      left: 61px;
    }

    .windows .app-name {
      background-color: var(--windows-background);
      position: absolute;
      color: rgba(255, 255, 255, 0.7);
      top: 99px;
      left: 82px;
      font-size: 10px;
    }

    .windows .app-icon {
      position: absolute;
      width: 26px;
      height: 26px;
      top: 92px;
      left: 51px;
    }

    .android .app-icon {
      position: absolute;
      top: 62px;
      width: 42px;
      height: 42px;
      left: calc(50% - 21px);
    }

    .android .app-name {
      position: absolute;
      width: 100%;
      background-color: #FFF;
      text-align: center;
      font-size: 14px;
      top: 106px;
    }

    .ios .app-icon {
      position: absolute;
      background-color: #000;
      top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 21px;
      height: 21px;
      top: 143px;
      left: 10px;
      border-radius: 5px;
    }

    .ios .app-icon img {
      width: 80%;
    }

    .ios .app-name {
      font-family: var(--ios-font-family);
      background-color: #F4F4F4;
      position: absolute;
      top: 146px;
      left: 41px;
      font-size: 13px;
      font-weight: 600;
      min-width: 50px;
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
          <preview-info>
            The name of the web application is displayed on menus, system preferences, dialogs, etc.
          </preview-info>
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
           <preview-info>
            The name of the web application is displayed on menus, system preferences, dialogs, etc.
          </preview-info>
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
      case 'iOS':
        return html`
          <preview-info>
            The name of the web application is displayed on menus, system preferences, dialogs, etc.
          </preview-info>
          <div 
          style=${styleMap({ 
            transform: `scale(${this.fsController.isInFullScreen ? 2.2 : 1})`,
            marginTop: this.fsController.isInFullScreen ? '20vh' : '70px'
          })} 
          class="container ios">
            <img class="menu-img" alt="iOS settings" src="../assets/images/ios/appsettings.jpg" />
            ${this.iconUrl ?
              html`<div class="app-icon"><img alt="Application's icon" src=${this.iconUrl} /></div>` : 
              null}
            <div class="app-name">${this.appName || 'PWA App'}</div>
          </div>
        `;
      default: return null;
    }
  }
}