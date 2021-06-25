import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import '../preview-info.js';
import { FullScreenController } from '../fullscreen-controller';
import type { Platform } from '../models';

@customElement('name-screen')
export class NameScreen extends LitElement {
  static styles = css`
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

    .windows .app-container {
      background-color: #E5EBEC;
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      top: 33px;
      right: 95px;
      min-width: 30px;
    }

    .windows .app-name {
      color: rgba(0, 0, 0, 0.8);
      font-size: 4.5px;
      font-weight: 600;
      letter-spacing: -0.07px;
      margin-top: 2.5px;
      font-family: var(--windows-font-family); 
    }

    .windows .app-icon {
      width: 15px;
      height: 15px;
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

  @property() platform: Platform = 'windows';

  /**
   * Name attribute on the manifest.
   */
  @property() appName?: string;

  /**
   * The URL to use for icon previews, or undefined if the manifest has no
   * icons.
   */
  @property() iconUrl?: string;

  render() {
    switch (this.platform) {
      case 'windows':
        return html`
          <preview-info>
            The name of the web application is displayed on Window's start menu, application 
            preferences, title bar, etc.
          </preview-info>
          <div 
          style=${styleMap({ 
            transform: `scale(${this.fsController.isInFullScreen ? 2.2 : 1})`,
            marginTop: this.fsController.isInFullScreen ? '30vh' : '70px'
          })} 
          class="windows container">
            <img alt="Windows start menu" src="../assets/images/windows/startmenu.png" class="menu-img" />
            <div class="app-container">
              ${this.iconUrl ?
                html`<img alt="Application's icon" src=${this.iconUrl} class="app-icon" />` : 
                null}
              <div class="app-name">${this.appName || 'PWA App'}</div>
            </div>
          </div>
        `;
      case 'android':
        return html`
          <preview-info>
            The name of the web application will be included in the app info screen on Android.
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
            On iOS, the name of the web application will be used on settings.
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