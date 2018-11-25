import deepAssign from 'deep-assign';

import baseConfig from './baseConfig';

const extendBaseConfig = (configurator = (s: any) => ({})) => (s: any) => {
  return deepAssign(baseConfig(s), configurator(s));
};

export { extendBaseConfig };
