import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { getContrastingColor } from './utils';
import type { Platform } from './models';

@customElement('themecolor-screen')
export class ThemecolorScreen extends LitElement {
  static styles = css`
    .container {
      position: relative;
      width: 225px;
      margin: 120px auto 0;
    }

    .windows .titlebar-img {
      position: absolute;
      top: 0;
      width: 100%;
    }

    .windows .titlebar {
      position: absolute;
      height: 15px;
      width: calc(100% - 1px);
      bottom: 20px;
      display: flex;
      align-items: center;
      border: 0.5px solid grey;
    }

    .windows .titlebar-actions {
      margin-right: 3px; 
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 50px;
    }

    .windows .titlebar-actions .collapse {
      width: 8px;
      height: 1px;
    }

    .windows .titlebar-actions .enlarge {
      width: 7px;
      height: 7px;
      border-width: 1px;
      border-style: solid;
    }

    .windows .app-name {
      font-size: 9px;
      width: fit-content;
      margin: 0 auto;
      display: inline-block;
    }

    .android .switcher-img {
      width: 100%;
      position: absolute; 
      top: 0;
    }

    .android .app-box {
      width: 188px;
      position: absolute;
      top: 39px;
      height: 47px;
      left: 50px;
      border-radius: 3px 3px 0 0;
      display: flex;
    }

    .android .app-icon {
      border-radius: 50%;
      width: 30px;
      height: 30px;
      margin: -15px auto 0;
      background-color: #FFF;
    }

    .android .menu-actions {
      display: flex;
      width: 100%;
      justify-content: space-evenly;
      position: absolute;
      bottom: 4px;
      font-family: Roboto;
      font-size: 10px;
      letter-spacing: 0.3px;
      opacity: 0.7;
    }

    .android .menu-actions span:first-child {
      text-decoration: underline;
    }

    @media(max-width: 1366px) {
      .windows .titlebar {
        bottom: 16px;
      }

      .android .app-box {
        width: 144px;
        top: 30px;
        height: 36px;
        left: 38px;
      }

      .android .app-icon {
        width: 25px;
        height: 25px;
        margin: -12px auto 0;
      }

      .android .menu-actions {
        font-size: 8px;
      }
    }
  `;

  @property()
  platform: Platform = 'windows';

  /**
   * Theme color attribute on the manifest.
   */
  @property()
  themeColor: string | undefined;

  /**
   * Name attribute on the manifest.
   */
  @property()
  appName: string | undefined;

  /**
   * The icon to use for Android's task switcher.
   */
  @property()
  iconUrl: string | undefined;

  /**
   * The color to use on top of the theme color, such that the text is visible.
   */
  @state()
  private _contrastingColor = '';

  @state()
  private get contrastingColor() {
    if (!this._contrastingColor) {
      this._contrastingColor = this.themeColor ? getContrastingColor(this.themeColor) : '#FFF';
    }
    return this._contrastingColor;
  }

  render() {
    switch(this.platform) {
      case 'windows':
        return html`
          <div class="container windows">
            <img alt="Windows' title bar" src="../assets/images/windows/titlebar.png" class="titlebar-img" />
            <div 
            class="titlebar" 
            style=${styleMap({ 
              backgroundColor: this.themeColor || '#1F59A1'
            })}>
              <p class="app-name" style=${styleMap({ color: this.contrastingColor })}>
                ${this.appName || 'PWA App'}
              </p>
              <div class="titlebar-actions">
                <div class="collapse" style=${styleMap({ backgroundColor: this.contrastingColor })}></div>
                <div class="enlarge" style=${styleMap({ borderColor: this.contrastingColor })}></div>
                <svg class="close" width="8px" height="8px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
                  <g><path style="fill:${this.contrastingColor}" d="M990,61.2L933.3,5.1L500,443.3L66.7,5.1L10,61.2L443.9,500L10,938.8l56.7,56.1L500,556.7l433.3,438.2l56.7-56.1L556.1,500L990,61.2z"/></g>
                </svg>
              </div>
            </div>
          </div>
        `;
      case 'android':
        return html`
          <div class="container android">
            <img alt="Android's app switcher" src="../assets/images/android/appswitcher.jpg" class="switcher-img" />
            <div 
            class="app-box" 
            style=${styleMap({ 
              backgroundColor: this.themeColor || '#1F59A1'
            })}>
              <img class="app-icon" alt="Application's icon" src=${this.iconUrl || '../assets/images/android/noicon.svg'} />
              <div class="menu-actions" style=${styleMap({ color: this.contrastingColor })}>
                <span>HOME</span>
                <span>PROFILE</span>
                <span>SETTINGS</span>
              </div>
            </div>
          </div>
        `;
      default: return null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'themecolor-screen': ThemecolorScreen;
  }
}