import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import type { Platform } from './models';

@customElement('install-screen')
export class InstallScreen extends LitElement {
  static styles = css`
    .container {
      position: relative;
      width: 220px;
      margin: 80px auto 0;
    }

    .container.android {
      margin-top: 12px;
    }

    .android .preview-img {
      position: absolute;
      width: 219px;
      height: 480px;
      top: 0;
      margin: 0 auto;
      background: #FFF;
      box-shadow: 0px 3px 5.41317px rgba(0, 0, 0, 0.25);
      border-radius: 8.11976px;
      object-fit: cover;
      z-index: -1;
    }

    .android .url-bar {
      background-color: #D7D7D7;
      opacity: 0.5;
      width: fit-content;
      position: absolute;
      top: 48px;
      left: 64px;
      font-size: 6.5px;
      width: 100px;
      overflow-x: hidden;
      white-space: nowrap;
    }

    .android .add-dialog {
      width: 205px;
      height: 108.29px;
      background: #FFF;
      box-shadow: 0px 3.13889px 3.13889px rgba(0, 0, 0, 0.25);
      border-radius: 4.70833px;
      box-sizing: border-box;
      padding: 14px;
      position: absolute;
      top: 180px;
      left: 8px;
    }

    .android .add-dialog .dialog-title {
      font-family: Roboto;
      font-weight: 400;
      font-size: 14.125px;
      color: rgba(0, 0, 0, 0.9);
      margin: 0;
    } 

    .android .add-dialog .app-info {
      margin: 14px 0 0;
      display: flex;
      line-height: 12px;
      align-items: center;
    }

    .android .add-dialog .app-info .icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }

    .android .add-dialog .app-info .app-name {
      font-family: Roboto;
      font-weight: 600;
      font-size: 10.9861px;
      margin: 0;
    }

    .android .add-dialog .dialog-actions {
      display: flex;
      margin: 7.85px 0 0 108px;
    }

    .android .add-dialog .dialog-actions span {
      font-family: Roboto;
      font-weight: 500;
      font-size: 9.41667px;
      color: #1F7CC6;
      margin-right: 20px;
    }

    .windows .preview-img {
      position: absolute;
      width: 100%;
      height: 204px;
      top: 0;
    }

    .windows .add-dialog {
      background-color: #FFF;
      width: 208px;
      height: 118px;
      position: absolute;
      top: 36px;
      left: 6px;
      z-index: 1;
      padding: 12px;
      box-sizing: border-box;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 6px;
    }

    .windows .add-dialog .header {
      display: flex;
    }

    .windows .add-dialog .icon {
      width: 17.5px;
      height: 17.5px;
      border-radius: 50%;
    }

    .windows .add-dialog .dialog-title {
      margin: 0 0 0 7px;
      font-size: 12px;
      font-weight: 600;
    }

    .windows .add-dialog .dialog-text {
      margin: 0 0 7px 25px;
      font-size: 7px;
    } 

    .dialog-text {
      font-family: Roboto;
      font-weight: 400;
      font-size: 7.84722px;
      margin: 0;
    }

    /* 1366 designs */
    @media(max-width: 1366px) {
      
    }
  `;

  @property()
  platform: Platform = 'windows';

  /**
   * The URL to use for icon previews, or undefined if the manifest has no
   * icons.
   */
  @property()
  iconUrl: string | undefined;

  /**
   * The website's URL.
   */
  @property() 
  siteUrl = '';

  /**
   * Name attribute on the manifest.
   */
  @property()
  appName: string | undefined;

  /**
   * Short name attribute on the manifest.
   */
  @property()
  appShortName: string | undefined;

  render() {
    switch (this.platform) {
      case 'windows':
        return html`
          <div class="container windows">
            <div class="add-dialog">
              <div class="header">
                ${this.iconUrl ? 
                html`<img class="icon" alt="App's Windows icon" src=${this.iconUrl} />` :
                html`<div class="icon"></div>`}
                <p class="dialog-title">Install ${this.appName || 'PWA App'}</p>
              </div>
              <p class="dialog-text">Publisher: ${this.siteUrl}</p>
              <p class="dialog-text">
                This site can be installed as an application. It will open in its own window and 
                safely integrate with Window Features.
              </p>
            </div>
            <img  
            class="preview-img"
            alt="Application mobile preview" 
            src="../assets/images/windows/background.svg" />
          </div>
        `;
      case 'android':
        return html`
          <div class="container android">
            <div class="url-bar">${this.siteUrl}</div>
            <div class="add-dialog">
              <p class="dialog-title">Add to Home screen</p>
              <div class="app-info">
                ${this.iconUrl ? 
                  html`<img class="icon" alt="App's Android icon" src=${this.iconUrl} />` : 
                  html`<div class="icon" style=${styleMap({ backgroundColor: '#C4C4C4' })}></div>`}
                <div>
                  <p class="app-name">${this.appShortName || this.appName || 'PWA App'}</p>
                  <p class="dialog-text">${this.siteUrl}</p>
                </div>
              </div>
              <div class="dialog-actions">
                <span>Cancel</span>
                <span>Add</span>
              </div>
            </div>
            <img 
            class="preview-img"
            alt="Application mobile preview" 
            src="../assets/images/android/background.svg" />
          </div>
        `;
      default: return null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'install-screen': InstallScreen;
  }
}
