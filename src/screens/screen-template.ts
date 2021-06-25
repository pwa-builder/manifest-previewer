import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { FullScreenController } from '../fullscreen-controller';
import type { Platform } from '../models';

export abstract class ScreenTemplate extends LitElement {
  protected fsController = new FullScreenController(this);

  @property() platform: Platform = 'windows';

  
}