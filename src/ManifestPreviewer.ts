import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * Supported platforms for the preview component
 */
enum Platform {
  Windows = 'windows', 
  Android = 'android'
}

/**
 * Reference: https://www.w3.org/TR/image-resource/#dom-imageresource
 */
type ImageResource = {
  src?: string;
  sizes?: string;
  type?: string;
  label?: string;
}

/**
 * Web app manifest
 */
interface Manifest {
  name: string;
  short_name?: string;
  icons: ImageResource[];
  display?: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  orientation?: 'any' | 'natural' | 'landscape' | 'landscape-primary' | 'landscape-secondary' | 'portrait' | 'portrait-primary' | 'portrait-secondary';
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
  theme_color?: string;
  related_applications?: {
    platform?: string;
    url?: string;
    id?: string;
  }[];
  prefer_related_applications?: boolean;
  background_color?: string;
  shortcuts?: {
    name: string;
    url: string;
    short_name?: string;
    description?: string;
    icons?: ImageResource[];
  }[];
  categories?: string[];
  description?: string;
  screenshots?: ImageResource[];
  iarc_rating_id?: string;
}

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
      position: absolute;
      top: 71px;
      left: calc(50% - 88.5px);
      width: 177px;
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

    .name-text {
      position: absolute;
      top: 171px;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      color: #808080;
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

    img.windows-preview {
      position: absolute;
      width: 222px;
      height: 204px;
      top: 294px;
      left: calc(50% - 111px);
    }

    img.android-preview {
      position: absolute;
      width: 219px;
      height: 504px;
      top: 226px;
      left: calc(50% - 109.5px);
    }

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

      .name-text {
        width: 273px;
        left: calc(50% - 136.5px);
      }
    }

    /* 1024 designs */
    @media(min-width: 1024px) and (max-width: 1366px) {
      .card {
        width: 366px;
      }

      .name-text {
        width: 282px;
        left: calc(50% - 141px);
      }
    }

    /* 1366 designs */
    @media(min-width: 1366px) {
      .card {
        width: 479.03px;
      }

      .name-text {
        width: 282px;
        left: calc(50% - 141px);
      }

      img.nav-arrow {
        right: 50px;
      }

      img.android-preview {
        width: 231px;
        height: 510px;
        left: calc(50% - 115.5px);
      }
    }
  `;

  /**
   * The input web manifest.
   */
  @property({ 
    type: Object,
    converter: value => {
      if (value === null) {
        return null;
      }
      return JSON.parse(value);
    }
  })
  manifest = {} as Manifest;

  /**
   * The platform currently being previewed.
   */
  @property({ type: String})
  selectedPlatform = Platform.Windows;

  render() {
    return html`
      <div class="container">
        <div class="card">
          <img src="../assets/images/nav_arrow.png" alt="Navigate right" class="nav-arrow" />
          <h4 class="title">Preview</h4>
          <div class="buttons-div">
            <button 
            class=${classMap({ selected: this.selectedPlatform === Platform.Windows })} 
            @click=${() => this.handlePlatformButtonClick(Platform.Windows)}>
              Windows
            </button>
            <button 
            class=${classMap({ selected: this.selectedPlatform === Platform.Android })} 
            @click=${() => this.handlePlatformButtonClick(Platform.Android)}>
              Android
            </button>
          </div>
          <div class="name">${this.manifest.name}</div>
          <p class="name-text">
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
            sed quia consequuntur.
          </p>
          <img 
          alt="Application mobile preview"
          src="../assets/images/${this.selectedPlatform}_preview_placeholder.png"
          class=${classMap({ 
            'windows-preview': this.selectedPlatform === Platform.Windows, 
            'android-preview': this.selectedPlatform === Platform.Android
            })
          } />
          <p class="preview-text">Click to enlarge Preview</p>
        </div>
      </div>
    `;
  }

  /**
   * Based on the buttom clicked, change the platform to preview.
   * 
   * @param platform - Platform corresponding to the selected button
   */
  private handlePlatformButtonClick(platform: Platform) {
    this.selectedPlatform = platform;
  }
}
