import { configureApp, getConfig } from './configurator';
declare global {
  interface Window {
    APP_CONFIG: any;
  }
}

import { extendBaseConfig } from './config';

configureApp(extendBaseConfig(window.APP_CONFIG));

export default getConfig();
