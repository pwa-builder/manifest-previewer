import { LitElement, css, html } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import './install-screen.js';
import './splash-screen.js';
import './name-screen.js';
import './shortname-screen.js';
import './themecolor-screen.js';
import './shortcuts-screen.js';
import { platform, Manifest, PreviewStage } from './models';

@customElement('manifest-previewer')
export class ManifestPreviewer extends LitElement {
  static styles = css`
    .container {
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .card {
      background: #FFF;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 6px;
      height: 792px;
      position: relative;
      display: none;
      font-family: Hind;
      font-style: normal;
      z-index: 0;
    }

    .title {
      position: absolute;
      left: calc(50% - 33px);
      top: 23px;
      margin: 0;
      width: 66px;
      font-weight: 700;
      font-size: 18px;
      line-height: 24px;
      color: #292C3A;
      text-decoration: underline solid #292C3A;
      text-underline-position: under;
      text-decoration-thickness: 2px;
    }

    .buttons-div {
      display: flex;
      justify-content: center;
      position: absolute;
      top: 71px;
      left: calc(50% - 88.5px);
      width: 177px;
    }

    .buttons-div > :nth-child(2) {
      margin-left: 16px;
    }

    button {
      height: 35px;
      border-radius: 33.2847px;
      border: none;
      font-family: Hind;
      font-style: normal;
      font-weight: 700;
      font-size: 12.5751px;
      line-height: 19px;
      width: 80.5px;
      background: #FFF;
      box-shadow: 0px 3px 3.02588px rgba(0, 0, 0, 0.25);
      color: #292C3A;
    }

    button.selected {
      background: #292C3A;
      box-shadow: 0px 0.75647px 3.02588px rgba(0, 0, 0, 0.25);
      color: #FFF;
    }

    .name {
      background: rgba(194, 194, 194, 0.4);
      border-radius: 4px;
      height: 24px;
      font-weight: 700;
      font-size: 16px;
      line-height: 25px;
      text-align: center;
      color: #000;
      margin: 134.54px auto 0;
      width: fit-content;
      padding: 0 5px;
    }

    .preview-title {
      margin: 10px auto;
      width: fit-content;
      font-weight: 600;
      font-size: 14px;
    }

    .preview-info {
      margin: 0 auto;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      color: #808080;
      width: 280px;
    }

    .preview-text {
      position: absolute;
      bottom: 25px;
      left: calc(50% - 52px);
      font-weight: 400;
      font-size: 10px;
      line-height: 16px;
      text-align: center;
      color: #808080;
      width: 104px;
    }

    img.nav-arrow {
      position: absolute;
      width: 19px;
      height: 38px;
      top: 377px;
      right: 16px;
    }

    /* The card is hidden for smaller screens */
    @media(min-width: 800px) {
      .card {
        display: block;
      }
    }

    /* 800 designs */
    @media(min-width: 800px) and (max-width: 1024px) {
      .card {
        width: 354px;
      }
    }

    /* 1024 designs */
    @media(min-width: 1024px) and (max-width: 1366px) {
      .card {
        width: 366px;
      }
    }

    /* 1366 designs */
    @media(min-width: 1366px) {
      .card {
        width: 479.03px;
      }

      img.nav-arrow {
        right: 50px;
      }
    }
  `;

  /**
   * The website's URL
   */
  @state()
  _siteUrl: string | undefined;

  /**
   * The website's URL
   */
  @state()
  _iconUrl: string | undefined;

  /**
   * Thekind of preview currently shown.
   */
  @property({ type: Number })
  stage: PreviewStage = PreviewStage.Shortcuts;

  /**
   * The input web manifest.
   */
  @property({ 
    type: Object,
    converter: value => {
      if (!value) {
        return undefined;
      }
      
      return JSON.parse(value);
    }
  })
  manifest = {} as Manifest;

  /**
   * The url where the manifest resides.
   */
  @property()
  manifestUrl = '';

  /**
   * The platform currently being previewed.
   */
  @property()
  selectedPlatform: platform = 'android';

  /**
   * @returns The site's URL, assuming it can be derived from the manifest's URL.
   */
  @property()
  get siteUrl() {
    if (typeof this._siteUrl === 'undefined') {
      this._siteUrl = this.manifestUrl.substring(0, this.manifestUrl.lastIndexOf('manifest.json'));
    }

    return this._siteUrl;
  }

  /**
   * @returns The URL for icon previews, or undefined if the manifest specifies no icons.
   */
  @property()
  get iconUrl() {
    if (typeof this._iconUrl === 'undefined' && this.manifest.icons) {
      // Try to get the icon for Android Chrome, or the first one by default
      let iconUrl = this.manifest.icons[0].src;
      for (const icon of this.manifest.icons) {
        if (icon.sizes?.includes('192x192')) {
          iconUrl = icon.src;
          break;
        }
      }
      const absoluteUrl = new URL(iconUrl, this.manifestUrl).href;
      this._iconUrl = `https://pwabuilder-safe-url.azurewebsites.net/api/getsafeurl?url=${absoluteUrl}`;
    }

    return this._iconUrl;
  }

  private getScreenContent() {
    switch (this.stage) {
      case PreviewStage.Install:
        return html`
          <img 
          src="../assets/images/nav_arrow.svg" 
          alt="Navigate right" 
          class="nav-arrow"
          @click=${() => { this.stage = PreviewStage.Splashscreen; }} />
          <p class="preview-title">Installation dialog</p>
          <p class="preview-info">
            The icon, app name, and website URL will be included when installing 
            the PWA.
          </p>
          <install-screen
          .selectedPlatform=${this.selectedPlatform}
          .iconUrl=${this.iconUrl}
          .siteUrl=${this.siteUrl}
          .appName=${this.manifest.name}
          .appShortName=${this.manifest.short_name}>
          </install-screen>
        `;
      case PreviewStage.Splashscreen:
        return html`
          <img 
          src="../assets/images/nav_arrow.svg" 
          alt="Navigate right" 
          class="nav-arrow"
          @click=${() => { this.stage = PreviewStage.Name; }} />
          <p class="preview-title">Splash screen</p>
          <p class="preview-info">
            In some browsers, a splash screen is shown when the PWA is launched and while 
            its content is loading.
          </p>
          <splash-screen
          .selectedPlatform=${this.selectedPlatform}
          .iconUrl=${this.iconUrl}
          .backgroundColor=${this.manifest.background_color}
          .themeColor=${this.manifest.theme_color}
          .appName=${this.manifest.name}>
          </splash-screen>
        `;
      case PreviewStage.Name:
        return html`
          <img 
          src="../assets/images/nav_arrow.svg" 
          alt="Navigate right" 
          class="nav-arrow"
          @click=${() => { this.stage = PreviewStage.Shortname; }} />
          <p class="preview-title">The name attribute</p>
          <p class="preview-info">
            The name of the web application is displayed on menus, system preferences, dialogs, etc.
          </p>
          <name-screen
          .selectedPlatform=${this.selectedPlatform}
          .appName=${this.manifest.name}
          .iconUrl=${this.iconUrl}>
          </name-screen>
        `;
      case PreviewStage.Shortname:
        return html`
          <img 
          src="../assets/images/nav_arrow.svg" 
          alt="Navigate right" 
          class="nav-arrow"
          @click=${() => { this.stage = PreviewStage.Themecolor; }} />
          <p class="preview-title">The short name attribute</p>
          <p class="preview-info">
            The short name member is used when there is no enough space to display the 
            entire name of the application (e.g., as a label for an icon on the phone home 
            screen).
          </p>
          <shortname-screen
          .selectedPlatform=${this.selectedPlatform}
          .appShortName=${this.manifest.short_name}
          .iconUrl=${this.iconUrl}>
          </shortname-screen>
        `;
      case PreviewStage.Themecolor:
        return html`
          <img 
          src="../assets/images/nav_arrow.svg" 
          alt="Navigate right" 
          class="nav-arrow"
          @click=${() => { this.stage = PreviewStage.Shortcuts; }} />
          <p class="preview-title">The theme color attribute</p>
          <p class="preview-info">
            The theme color defines the default color theme for the application, and affects
            how the site is displayed.
          </p>
          <themecolor-screen
          .selectedPlatform=${this.selectedPlatform}
          .themeColor=${this.manifest.theme_color}
          .appName=${this.manifest.name}
          .iconUrl=${this.iconUrl}>
          </themecolor-screen>
        `;
      case PreviewStage.Shortcuts:
        return html`
          <img 
          src="../assets/images/nav_arrow.svg" 
          alt="Navigate right" 
          class="nav-arrow"
          @click=${() => { this.stage = PreviewStage.Install; }} />
          <p class="preview-title">The shortcuts attribute</p>
          <p class="preview-info">
            This attribute defines an array of shortcuts/links to key tasks or pages 
            within a web app, assembling a context menu when a user interacts with the app's icon.
          </p>
          <shortcuts-screen
          .selectedPlatform=${this.selectedPlatform}
          .shortcuts=${this.manifest.shortcuts}
          .iconUrl=${this.iconUrl}
          .manifestUrl=${this.manifestUrl}>
          </shortcuts-screen>
        `;
      default:
        return null;
    }
  }

  render() {
    return html`
      <div class="container">
        <div class="card">
          <h4 class="title">Preview</h4>
          <div class="buttons-div">
            <button 
            class=${classMap({ selected: this.selectedPlatform === 'windows' })} 
            @click=${() => { this.selectedPlatform = 'windows'; }}>
              Windows
            </button>
            <button 
            class=${classMap({ selected: this.selectedPlatform === 'android' })} 
            @click=${() => { this.selectedPlatform = 'android'; }}>
              Android
            </button>
          </div>
          <div class="name">${this.manifest.name}</div>
          ${this.getScreenContent()}
          <p class="preview-text">Click to enlarge Preview</p>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'manifest-previewer': ManifestPreviewer;
  }
}
