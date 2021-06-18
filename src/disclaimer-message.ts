import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';


@customElement('disclaimer-message')
export class DisclaimerMessage extends LitElement {
  static styles = css`
    :host {
      font-style: italic;
      font-size: 14px;
      opacity: 0.8;
      color: var(--secondary-font-color);
      font-weight: 600;
      margin: 0;
    }
  `;

  render() {
    return html`<p><slot></slot></p>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'disclaimer-message': DisclaimerMessage;
  }
}