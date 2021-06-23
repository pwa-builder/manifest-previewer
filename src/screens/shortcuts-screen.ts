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
      width: 290px;
      position: relative;
      margin: 40px auto 0;
    }

    .menu-img {
      width: 100%;
    }

    .windows .app-icon {
      position: absolute;
      width: 17px;
      height: 17px;
      bottom: 11px;
      right: 77px;
    }

    .windows .menu {
      background-color: #3F3C40;
      position: absolute;
      bottom: 55px;
      right: 18px;
      width: 136px;
      height: 110px;
    }

    .windows .shortcut-list {
      list-style: none;
      padding: 0;
      color: rgba(255, 255, 255, 0.5);
      font-size: 7px;
    }

    .windows .shortcut-list li {
      padding: 0 0 0 4px;
      margin: 0 0 5px;
      display: flex;
      align-items: center;
    }

    .windows .shortcut-list .icon {
      width: 12px;
      height: 12px;
      margin-right: 5px;
      display: inline-block;
    }

    .android .app-icon {
      position: absolute;
      width: 55px;
      top: 48px;
      left: 21px;
    }

    .android .chrome-icon {
      position: absolute;
      width: 28px;
      top: 82px;
      left: 55px;
      z-index: 1;
    }

    .android .menu {
      background-color: #FFF;
      position: absolute;
      right: 40px;
      width: 223px;
      height: 159px;
      bottom: 30px;
    }

    .android .shortcut-list {
      list-style: none;
      padding: 0;
      margin: 0;
      color: #000;
      font-size: 14px;
    }

    .android .shortcut-list li {
      padding: 0;
      margin: 0 0 10px;
      display: flex;
      align-items: center;
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

    @media(max-width: 1366px) {
      .container {
        width: 250px;
      }

      .windows .app-icon {
        width: 14px;
        height: 14px;
        right: 67px;
      }

      .windows .menu {
        bottom: 43px;
        right: 16px;
        width: 117px;
        height: 100px;
      }

      .android .app-icon {
        width: 47px;
        height: 47px;
        top: 41px;
        left: 19px;
      }

      .android .chrome-icon {
        top: 65px;
        left: 42px;
      }

      .android .menu {
        right: 33px;
        width: 188px;
        height: 133px;
        bottom: 30px;
      }

      .android .shortcut-list .icon {
        width: 22px;
        height: 22px;
      }
    }
  `;

  private fsController = new FullScreenController(this);

  @property()
  platform: Platform = 'windows';

  /**
   * The url where the manifest resides.
   */
  @property()
  manifestUrl = '';

  /**
   * The shortcuts attribute on the manifest
   */
  @property({ type: Array })
  shortcuts: Shortcut[] | undefined;

  /**
   * The application's icon.
   */
  @property()
  iconUrl: string | undefined;

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
        return html`
          <preview-info>
            This attribute defines an array of shortcuts/links to key tasks or pages 
            within a web app, assembling a context menu when a user interacts with the app's icon.
          </preview-info>
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
            This attribute defines an array of shortcuts/links to key tasks or pages 
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