import { LitElement, css, html} from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * Brief description of the content being previewed.
 */
@customElement('preview-info')
export class PreviewInfo extends LitElement {
  static styles = css`
    .info-text {
      margin: 0 auto;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      color: var(--secondary-font-color);
      width: 230px;
    }
  `;

  render() {
    return html`<p class="info-text"><slot></slot></p>`;
  }
}