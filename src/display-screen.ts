import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { Platform } from './models';

@customElement('display-screen')
export class DisplayScreen extends LitElement {
  static styles = css``;

  @property()
  platform: Platform = 'windows';

  render() {
    switch(this.platform) {
      case 'windows':
        return html`
        `;
      case 'android':
        return html`
        `;
      default: return null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'display-screen': DisplayScreen;
  }
}