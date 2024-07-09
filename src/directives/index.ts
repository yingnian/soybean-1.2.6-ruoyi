import type { App } from 'vue';
import dragDirective from './drag';
import setupPremiDirective from './premi';
import setupWaterDirective from './watermark';

/** setup custom vue directives. - [安装自定义的vue指令] */
export function setupDirectives(app: App) {
  setupPremiDirective(app);
  dragDirective(app);
  setupWaterDirective(app);
}
