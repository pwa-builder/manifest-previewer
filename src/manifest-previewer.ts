import { LitElement, css, html } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import './install-screen.js';
import './splash-screen.js';
import './name-screen.js';
import './shortname-screen.js';
import './themecolor-screen.js';
import './shortcuts-screen.js';
import './display-screen.js';
import { Manifest, PreviewStage, Platform } from './models';

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
      justify-content: space-between;
      margin: 71px auto 0;
      width: 272px;
    }

    .platform-button {
      height: 35px;
      border-radius: 33.2847px;
      border: none;
      font-family: Hind;
      font-style: normal;
      font-weight: 700;
      font-size: 12.5751px;
      line-height: 19px;
      width: 80px;
      background: #FFF;
      box-shadow: 0px 3px 3.02588px rgba(0, 0, 0, 0.25);
      color: #292C3A;
    }

    .platform-button.selected {
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
      margin: 20px auto 0;
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
   * The website's URL.
   */
  @state()
  private _siteUrl: string | undefined;

  /**
   * The URL used for icon previews.
   */
  @state()
  private _iconUrl: string | undefined;

  /**
   * Callback fired when clicking the navigation arrow.
   */
  @state()
  private navigationAction = () => {};

  /**
   * The kind of preview currently shown.
   */
  @property({ type: Number })
  stage: PreviewStage = PreviewStage.Themecolor;

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
   * The currently selected platform.
   */
  @property()
  platform: Platform = 'windows';

  /**
   * @returns The site's URL, assuming it can be derived from the manifest's URL.
   */
  @state()
  private get siteUrl() {
    if (typeof this._siteUrl === 'undefined') {
      this._siteUrl = this.manifestUrl.substring(0, this.manifestUrl.lastIndexOf('manifest.json'));
    }

    return this._siteUrl;
  }

  /**
   * @returns The URL for icon previews, or undefined if the manifest specifies no icons.
   */
  @state()
  private get iconUrl() {
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

  /**
   * Dispatches the platform change event for all screens to update
   * accordingly.
   */
  private handlePlatformChange(event: Event) {
    const platform = (event.target as HTMLButtonElement).name;
    this.platform = platform as Platform;
  }

  /**
   * Enlarges the preview content.
   */
  private handleEnlargePreview() {
    this.renderRoot.querySelector('#fullscreen-content')!.requestFullscreen();
  }

  private screenContent() {
    switch (this.stage) {
      case PreviewStage.Install:
        this.navigationAction = () => { this.stage = PreviewStage.Splashscreen; }
        return html`
          <p class="preview-title">Installation dialog</p>
          <p class="preview-info">
            The icon, app name, and website URL will be included when installing 
            the PWA.
          </p>
          <div id="fullscreen-content">
            <install-screen
            .platform=${this.platform}
            .iconUrl=${this.iconUrl}
            .siteUrl=${this.siteUrl}
            .appName=${this.manifest.name}
            .appShortName=${this.manifest.short_name}>
            </install-screen>
          </div>
        `;
      case PreviewStage.Splashscreen:
        this.navigationAction = () => { this.stage = PreviewStage.Name; }
        return html`
          <p class="preview-title">Splash screen</p>
          <p class="preview-info">
            In some browsers, a splash screen is shown when the PWA is launched and while 
            its content is loading.
          </p>
          <div id="fullscreen-content">
            <splash-screen
            .platform=${this.platform}
            .iconUrl=${this.iconUrl}
            .backgroundColor=${this.manifest.background_color}
            .themeColor=${this.manifest.theme_color}
            .appName=${this.manifest.name}>
            </splash-screen>
          </div>
        `;
      case PreviewStage.Name:
        this.navigationAction = () => { this.stage = PreviewStage.Shortname; }
        return html`
          <p class="preview-title">The name attribute</p>
          <p class="preview-info">
            The name of the web application is displayed on menus, system preferences, dialogs, etc.
          </p>
          <div id="fullscreen-content">
            <name-screen
            .platform=${this.platform}
            .appName=${this.manifest.name}
            .iconUrl=${this.iconUrl}>
            </name-screen>
          </div>
        `;
      case PreviewStage.Shortname:
        this.navigationAction = () => { this.stage = PreviewStage.Themecolor; }
        return html`
          <p class="preview-title">The short name attribute</p>
          <p class="preview-info">
            The short name member is used when there is no enough space to display the 
            entire name of the application (e.g., as a label for an icon on the phone home 
            screen).
          </p>
          <div id="fullscreen-content">
            <shortname-screen
            .platform=${this.platform}
            .appShortName=${this.manifest.short_name}
            .iconUrl=${this.iconUrl}>
            </shortname-screen>
          </div>
        `;
      case PreviewStage.Themecolor:
        this.navigationAction = () => { this.stage = PreviewStage.Shortcuts; }
        return html`
          <p class="preview-title">The theme color attribute</p>
          <p class="preview-info">
            The theme color defines the default color theme for the application, and affects
            how the site is displayed.
          </p>
          <div id="fullscreen-content">
            <themecolor-screen
            .platform=${this.platform}
            .themeColor=${this.manifest.theme_color}
            .appName=${this.manifest.name}
            .iconUrl=${this.iconUrl}>
            </themecolor-screen>
          </div>
        `;
      case PreviewStage.Shortcuts:
        this.navigationAction = () => { this.stage = PreviewStage.Display; }
        return html`
          <p class="preview-title">The shortcuts attribute</p>
          <p class="preview-info">
            This attribute defines an array of shortcuts/links to key tasks or pages 
            within a web app, assembling a context menu when a user interacts with the app's icon.
          </p>
          <div id="fullscreen-content">
            <shortcuts-screen
            .platform=${this.platform}
            .shortcuts=${this.manifest.shortcuts}
            .iconUrl=${this.iconUrl}
            .manifestUrl=${this.manifestUrl}>
            </shortcuts-screen>
          </div>
        `;
      case PreviewStage.Display:
        this.navigationAction = () => { this.stage = PreviewStage.Install; }
        return html`
          <p class="preview-title">The display attribute</p>
          <p class="preview-info">
            The display mode changes how much of the browser's UI is shown to the user. It can 
            range from browser (the full browser window is shown) to fullscreen (the app is 
            full-screened).
          </p>
          <div id="fullscreen-content">
            <display-screen
            .platform=${this.platform}>
            </display-screen>
          </div>
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
            class=${classMap({ 
              'platform-button': true, 
              selected: this.platform === 'windows' 
            })} 
            name="windows"
            @click=${this.handlePlatformChange}>
              Windows
            </button>
            <button 
            class=${classMap({ 
              'platform-button': true, 
              selected: this.platform === 'android' 
            })} 
            name="android"
            @click=${this.handlePlatformChange}>
              Android
            </button>
            <button
            class=${classMap({
              'platform-button': true,
              selected: this.platform === 'iOS'
            })}
            name="iOS"
            @click=${this.handlePlatformChange}>
              iOS
            </button>
          </div>
          <div class="name">${this.manifest.name}</div>
          ${this.screenContent()}
          <img 
          src="../assets/images/nav_arrow.svg" 
          alt="Navigate right" 
          class="nav-arrow"
          @click=${this.navigationAction} />
          <p class="preview-text" @click=${this.handleEnlargePreview}>Click to enlarge Preview</p>
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
