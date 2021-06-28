import { LitElement, css, html } from 'lit';
import { customElement, state, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';

import './screens/install-screen.js';
import './screens/splash-screen.js';
import './screens/name-screen.js';
import './screens/shortname-screen.js';
import './screens/themecolor-screen.js';
import './screens/shortcuts-screen.js';
import './screens/display-screen.js';
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
      display: none;
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
      color: var(--font-color);
      text-decoration: underline solid var(--secondary-font-color);
      text-underline-position: under;
      text-decoration-thickness: 2px;
    }

    .buttons-div {
      display: flex;
      justify-content: space-between;
      margin: 71px auto 0;
      width: 272px;
    }

    fast-button.platform-button {
      height: 35px;
      border-radius: 33px;
      font-size: 12.5751px;
      line-height: 19px;
      width: 80px;
      background: #FFF;
      box-shadow: 0px 3px 3.02588px rgba(0, 0, 0, 0.25);
      color: var(--font-color);
    }
    
    fast-button::part(control) {
      font-weight: 700;
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

    .preview-text {
      position: absolute;
      bottom: 25px;
      left: calc(50% - 55px);
      font-weight: 400;
      font-size: 10px;
      line-height: 16px;
      text-align: center;
      color: var(--secondary-font-color);
      width: 110px;
    }

    img.nav-arrow-right {
      position: absolute;
      width: 19px;
      height: 38px;
      top: 377px;
      right: 16px;
      cursor: pointer;
    }
    
    img.nav-arrow-left {
      position: absolute;
      width: 19px;
      height: 38px;
      top: 377px;
      left: 16px;
      transform: rotate(180deg);
      cursor: pointer;
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

      img.nav-arrow-right {
        right: 30px;
      }

      img.nav-arrow-left {
        left: 30px;
      }
    }
  `;

  /**
   * The website's URL.
   */
  @state() private siteUrl = '';

  /**
   * The URL used for icon previews.
   */
  @state() private iconUrl = '';

  /**
   * If true, the preview content is displayed in full screen.
   */
  @state() isInFullScreen = false;

  /**
   * The kind of preview currently shown.
   */
  @property({ type: Number }) stage: PreviewStage = PreviewStage.Name;

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
  @property() manifestUrl = '';

  /**
   * The currently selected platform.
   */
  @property() platform: Platform = 'android';

  /**
   * The content to display when in full screen.
   */
  @query('#content') content!: Element;

  firstUpdated() {
    // Set the icon URL.
    if (this.manifest.icons) {
      // Try to get the largest icon so that it looks good everywhere, or the first one by default
      let iconUrl = this.manifest.icons[0].src;
      for (const icon of this.manifest.icons) {
        if (icon.sizes?.includes('192x192')) {
          iconUrl = icon.src;
          break;
        }
      }
      const absoluteUrl = new URL(iconUrl, this.manifestUrl).href;
      this.iconUrl = `https://pwabuilder-safe-url.azurewebsites.net/api/getsafeurl?url=${absoluteUrl}`;
    }

    // Set the site URL (assuming it can be derived from the manifest's URL)
    this.siteUrl = this.manifestUrl.substring(0, this.manifestUrl.lastIndexOf('manifest.json'));
  }

  /**
   * Changes the platform currently being previewed.
   */
  private handlePlatformChange(event: Event) {
    const platform = (event.target as HTMLButtonElement).name;
    this.platform = platform as Platform;
  }

  /**
   * Navigates to the next preview screen.
   */
  private handleNavigateRight() {
    const numStages = Object.keys(PreviewStage).length / 2;
    this.stage = (this.stage + 1) % numStages;
  }

  /**
   * Navigates to the previous preview screen.
   */
  private handleNavigateLeft() {
    const numStages = Object.keys(PreviewStage).length / 2;
    this.stage = (this.stage + numStages - 1) % numStages;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('fullscreenchange', this.handleFullScreenChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('fullscreenchange', this.handleFullScreenChange);
  }

  private handleFullScreenChange = () => {
    this.isInFullScreen = Boolean(document.fullscreenElement);
  }

  private handleToggleEnlarge() {
    this.content.requestFullscreen();
  }

  private screenContent() {
    switch (this.stage) {
      case PreviewStage.Install:
        return html`
          <install-screen
          .isInFullScreen=${this.isInFullScreen}
          .platform=${this.platform}
          .iconUrl=${this.iconUrl}
          .siteUrl=${this.siteUrl}
          .appName=${this.manifest.name}
          .appShortName=${this.manifest.short_name}
          .description=${this.manifest.description}
          .screenshots=${this.manifest.screenshots}
          .manifestUrl=${this.manifestUrl}>
            <p slot="title">Installation dialog</p>
            <p slot="info-windows">
              Windows includes the application's icon, name, and website URL in its
              installation dialog.
            </p>
            <p slot="info-android">
              When installing a PWA on Android, the description, name, icon and screenshots are used for
              giving a preview of the application.
            </p>
            <p slot="info-iOS">
              iOS uses the application's icon, name, and website URL in its
              installation screen.
            </p>
          </install-screen>
        `;
      case PreviewStage.Splashscreen:
        return html`
          <splash-screen
          .isInFullScreen=${this.isInFullScreen}
          .platform=${this.platform}
          .iconUrl=${this.iconUrl}
          .backgroundColor=${this.manifest.background_color}
          .themeColor=${this.manifest.theme_color}
          .appName=${this.manifest.name}>
            <p slot="title">Splash screen</p>
            <p slot="info-windows">
              While the PWA is loading, Windows uses the background color, name and 
              icon for displaying the splash screen.
            </p>
            <p slot="info-android">
              When launching the PWA, Android uses the background color, theme color, name and 
              icon for displaying the splash screen.
            </p>
            <p slot="info-iOS">
              When launching the PWA, iOS uses the background color, name and icon for displaying
              the splash screen while the content loads.
            </p>
          </splash-screen>
        `;
      case PreviewStage.Name:
        return html`
          <name-screen
          .isInFullScreen=${this.isInFullScreen}
          .platform=${this.platform}
          .appName=${this.manifest.name}
          .iconUrl=${this.iconUrl}>
            <p slot="title">The name attribute</p>
            <p slot="info-windows">
              The name of the web application is displayed on Window's start menu, application 
              preferences, title bar, etc.
            </p>
            <p slot="info-android">
              The name of the web application will be included in the app info screen on Android.
            </p>
            <p slot="info-iOS">
              On iOS, the name of the web application will be used on settings.
            </p>
          </name-screen>
        `;
      case PreviewStage.Shortname:
        return html`
          <shortname-screen
          .isInFullScreen=${this.isInFullScreen}
          .platform=${this.platform}
          .appShortName=${this.manifest.short_name}
          .iconUrl=${this.iconUrl}>
            <p slot="title">The short name attribute</p>
            <p slot="info-windows">
              The short name member is used when there is not enough space to display the 
              entire name of the application.
            </p>
            <p slot="info-android">
              On Android, the application's short name is used in the home screen as a label for 
              the icon.
            </p>
            <p slot="info-iOS">
              On iOS, the application's short name is used in the home screen as a label for 
              the icon.
            </p>
          </shortname-screen>
        `;
      case PreviewStage.Themecolor:
        return html`
          <themecolor-screen
          .isInFullScreen=${this.isInFullScreen}
          .platform=${this.platform}
          .themeColor=${this.manifest.theme_color}
          .appName=${this.manifest.name}
          .iconUrl=${this.iconUrl}>
            <p slot="title">The theme color attribute</p>
            <p slot="info-windows">
              The theme color defines the default color theme for the application, and is used 
              for the PWA's title bar.
            </p>
            <p slot="info-android">
              The theme color defines the default color theme for the application, and affects
              how the site is displayed.
            </p>
            <p slot="info-iOS">
              The theme color defines the default color theme for the PWA, and defines the 
              background color of the status bar when using the application.
            </p>
          </themecolor-screen>
        `;
      case PreviewStage.Shortcuts:
        return html`
          <shortcuts-screen
          .isInFullScreen=${this.isInFullScreen}
          .platform=${this.platform}
          .shortcuts=${this.manifest.shortcuts}
          .iconUrl=${this.iconUrl}
          .manifestUrl=${this.manifestUrl}>
            <p slot="title">The shortcuts attribute</p>
            <p slot="info-windows">
              This attribute (A.K.A. jump list) assembles a context menu that is shows when a user 
              right-clicks on the app's icon on the taskbar.
            </p>
            <p slot="info-android">
              This attribute (A.K.A. jump list) assembles a context menu that is shows when a user 
              long-presses the app's icon on the home screen.
            </p>
            <p slot="info-iOS">
              This attribute (A.K.A. jump list) defines a list of shortcuts/links to key tasks or pages 
              within a web app, assembling a context menu when a user interacts with the app's icon.
            </p>
          </shortcuts-screen>
        `;
      case PreviewStage.Display:
        return html`
          <display-screen
          .isInFullScreen=${this.isInFullScreen}
          .platform=${this.platform}
          .display=${this.manifest.display} 
          .themeColor=${this.manifest.theme_color}
          .backgroundColor=${this.manifest.background_color}
          .iconUrl=${this.iconUrl}
          .appName=${this.manifest.name}
          .siteUrl=${this.siteUrl}>
            <p slot="title">The display attribute</p>
            <p slot="info-windows">
              The display mode changes how much of the browser's UI is shown to the user. It can 
              range from browser (the full browser window is shown) to fullscreen (the app is 
              full-screened).
            </p>
            <p slot="info-android">
              The display mode changes how much of the browser's UI (like the status bar and
              navigation buttons) is shown to the user. 
            </p>
            <p slot="info-iOS">
              The display mode changes how much of the browser's UI is shown to the user. It can 
              range from browser (the full browser window is shown) to fullscreen (the app is 
              full-screened).
            </p>
          </display-screen>
        `;
      default: return null;
    }
  }

  render() {
    return html`
      <div class="container">
        <fast-card class="card">
          <h4 class="title">Preview</h4>
          <div class="buttons-div">
            <fast-button 
            class=${classMap({ 
              'platform-button': true, 
              selected: this.platform === 'windows' 
            })} 
            name="windows"
            @click=${this.handlePlatformChange}>
              Windows
            </fast-button>
            <fast-button 
            class=${classMap({ 
              'platform-button': true, 
              selected: this.platform === 'android' 
            })} 
            name="android"
            @click=${this.handlePlatformChange}>
              Android
            </fast-button>
            <fast-button
            class=${classMap({
              'platform-button': true,
              selected: this.platform === 'iOS'
            })}
            name="iOS"
            @click=${this.handlePlatformChange}>
              iOS
            </fast-button>
          </div>
          <div class="name">${this.manifest.name}</div>
          <div id="content">${this.screenContent()}</div>
          <img 
          src="../assets/images/nav_arrow.svg" 
          alt="Navigate right" 
          class="nav-arrow-right"
          @click=${this.handleNavigateRight} />
          <img 
          src="../assets/images/nav_arrow.svg" 
          alt="Navigate left" 
          class="nav-arrow-left"
          @click=${this.handleNavigateLeft} />
          <p 
          class="preview-text" 
          style=${styleMap({ cursor: 'pointer' })} 
          @click=${this.handleToggleEnlarge}>
            Click to enlarge Preview
          </p>
        </fast-card>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'manifest-previewer': ManifestPreviewer;
  }
}
