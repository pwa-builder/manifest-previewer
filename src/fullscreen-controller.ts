import { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * Used by the preview screens to style accordingly when in full screen.
 */
export class FullScreenController implements ReactiveController {
  private host: ReactiveControllerHost;
  isInFullScreen = false;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  private handleFullScreenChange = () => {
    this.isInFullScreen = Boolean(document.fullscreenElement);
    this.host.requestUpdate();
  }

  hostConnected() {
    document.addEventListener('fullscreenchange', this.handleFullScreenChange);
  }

  hostDisconnected() {
    document.removeEventListener('fullscreenchange', this.handleFullScreenChange);
  }
}