import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import '../preview-info.js';
import '../disclaimer-message.js';
import { FullScreenController } from '../fullscreen-controller';
import type { Shortcut, ImageResource, Platform } from '../models';

@customElement('shortcuts-screen')
export class ShortcutsScreen extends LitElement {
  static styles = css`
    .container {
      width: 260px;
      position: relative;
      margin: 40px auto 0;
    }

    .container.windows {
      font-family: var(--windows-font-family);
    }

    .menu-img {
      width: 100%;
    }

    .windows .app-icon {
      position: absolute;
      width: 14px;
      height: 14px;
      bottom: 7px;
      right: 59.5px;
    }

    .windows .menu {
      position: absolute;
      bottom: 41px;
      right: 13px;
      width: 105px;
      height: 100px;
    }

    .windows .shortcut-list {
      list-style: none;
      padding: 0;
      color: rgba(0, 0, 0, 0.6);
      font-size: 6px;
      font-weight: 600;
      background-color: #D9E8F0;
      height: 100%;
    }

    .windows .shortcut-list li {
      padding: 0 0 0 4px;
      margin: 0 0 10px;
      display: flex;
      align-items: center;
    }

    .windows .shortcut-list .icon {
      width: 10px;
      height: 10px;
      margin-right: 5px;
      display: inline-block;
    }

    .android .app-icon {
      position: absolute;
      width: 50px;
      height: 50px;
      top: 41px;
      left: 18px;
    }

    .android .chrome-icon {
      position: absolute;
      width: 27px;
      height: 27px;
      top: 69px;
      left: 45px;
      z-index: 1;
    }

    .android .menu {
      background-color: #FFF;
      position: absolute;
      right: 40px;
      width: 195px;
      height: 145px;
      bottom: 30px;
    }

    .android .shortcut-list {
      list-style: none;
      padding: 0;
      margin: 0;
      color: #000;
      font-size: 12px;
    }

    .android .shortcut-list li {
      padding: 0;
      margin: 0 0 10px;
      display: flex;
      align-items: center;
      height: 25px;
    }

    .android .shortcut-list .icon {
      width: 25px;
      height: 25px;
      margin-right: 15px;
      display: inline-block;
    }

    .ios-message {
      margin: 100px auto 0px;
      width: 70%;
    }
  `;

  private fsController = new FullScreenController(this);

  @property() platform: Platform = 'windows';

  /**
   * The URL where the manifest resides.
   */
  @property() manifestUrl = '';

  /**
   * The shortcuts attribute on the manifest
   */
  @property({ type: Array }) shortcuts?: Shortcut[];

  /**
   * The application's icon.
   */
  @property() iconUrl?: string;

  /**
   * @param iconSet - The icons property of the shortcut
   * @returns The icon URL for the respective shortcut
   */
  private getShortcutIcon(iconSet: ImageResource[]) {
    // Use first icon by default
    const iconUrl = iconSet[0].src;
    const absoluteUrl = new URL(iconUrl, this.manifestUrl).href;
    return `https://pwabuilder-safe-url.azurewebsites.net/api/getsafeurl?url=${absoluteUrl}`;
  }

  render() {
    switch(this.platform) {
      case 'windows':
      case 'android':
        const previewInfo = this.platform === 'windows' ? 
          "This attribute (A.K.A. jump list) assembles a context menu that is shows when a user right-clicks on the app's icon on the taskbar." :
          "This attribute (A.K.A. jump list) assembles a context menu that is shows when a user long-presses the app's icon on the home screen.";
        return html`
          <preview-info>${previewInfo}</preview-info>
          <div 
          style=${styleMap({ 
            transform: `scale(${this.fsController.isInFullScreen ? 2.5 : 1})`,
            marginTop: this.fsController.isInFullScreen ? '30vh' : '40px'
          })} 
          class="container ${this.platform}">
            <img 
            class="menu-img" 
            alt="Application shortcuts" 
            src="../assets/images/${this.platform}/shortcutsmenu.png" />
            ${this.platform === 'android' ?
              html`<img alt="Chrome" class="chrome-icon" src="../assets/images/chrome-icon.png" />` : null}
            ${this.iconUrl ? 
              html`<img class="app-icon" alt="Application's icon" src=${this.iconUrl} />`: null}
            <div class="menu">
              <ul class="shortcut-list">
                ${this.shortcuts?.slice(0, 5).map((shortie) => 
                  html`
                    <li>
                      ${shortie.icons ?
                      html`<img class="icon" alt=${shortie.name} src=${this.getShortcutIcon(shortie.icons)} />` :
                      html`<div class="icon"></div>`}
                      <span>${shortie.name}</span>
                    </li>`)}
              </ul>
            </div>
          </div>
        `;
      case 'iOS':
        return html`
          <preview-info>
            This attribute (A.K.A. jump list) defines a list of shortcuts/links to key tasks or pages 
            within a web app, assembling a context menu when a user interacts with the app's icon.
          </preview-info>
          <div class="ios-message">
            <disclaimer-message>
              iOS does not support the shortcuts feature.
            </disclaimer-message>
          </div>
        `;
      default: return null;
    }
  }
}