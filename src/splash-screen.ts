import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { PreviewMixin } from './preview-mixin';

@customElement('splash-screen')
export class Splashscreen extends PreviewMixin(LitElement) {
  static styles = css`
    .android-phone {
      position: absolute;
      width: 219px;
      height: 504px;
      top: 226px;
      left: calc(50% - 109.5px);
      box-shadow: 0px 3px 5.41317px rgba(0, 0, 0, 0.25);
      border-radius: 8.12px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .phone-bar {
      padding: 7px 0;
      width: 100%;
    }

    .icon {
      margin: auto;
      width: 90px;
      height: 90px;
      margin-top: calc(50% + 45px);
    }

    .appName {
      width: fit-content;
      margin: 0 auto 30px;
      font-size: 16px;
    }
  `;

  /**
   * Computes the color to use for the app's title, in such a way that
   * it contrasts with the background color.
   * 
   * @param color - The background color indicated in the manifest
   * @returns The color to use for the app's name
   */
  private getAppNameColor(color?: string){
    // If the manifest doesn't specify background_color, just use black for the title
    // since the background will be white.
    if (!color) {
      return '#000';
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext('2d')!;
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
    // From the RGB values, compute the perceived lightness using the sRGB Luma method.
    const perceived_lightness = ((red * 0.2126) + (green * 0.7152) + (blue * 0.0722)) / 255;
    return `hsl(0, 0%, ${(perceived_lightness - 0.5) * - 10000000}%)`;
  }

  render() {
    return html`
      <div 
      class="android-phone" 
      style=${styleMap({ backgroundColor: this.manifest.background_color || '#FFF' })}>
        <div 
        class="phone-bar"
        style=${styleMap({ 
          backgroundColor: this.manifest.theme_color || '#FFF',
          borderRadius: '8.12px 8.12px 0 0' 
        })}></div>
        <img class="icon" src=${this.getIconUrl()} alt="App's splash screen" />
        <h5 class="appName" style=${styleMap({ color: this.getAppNameColor(this.manifest.background_color) })}>
          ${this.manifest.name}
        </h5>
        <div
        class="phone-bar"
        style=${styleMap({ 
          backgroundColor: this.manifest.theme_color || '#FFF',
          borderRadius: '0 0 8.12px 8.12px' 
        })}></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'splash-screen': Splashscreen;
  }
}