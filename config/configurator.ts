// eslint-disable-next-line lines-around-directive, strict
'use strict';

import clone from 'clone';
import deepAssign from 'deep-assign';

import defaultConfig from './defaults/defaultConfig';
import defaultSharedVars from './defaults/defaultSharedVars';

// shared config context
let config: any = defaultConfig;
// shared vars
let sharedVars: any = defaultSharedVars;
// user defined app config
let appConfig: any;
// list of replayable module configuration functions
let configurators: any;

let appConfiguredPromiseResolve: any;
const appConfiguredPromise = new Promise(resolve => {
  appConfiguredPromiseResolve = resolve;
});

const getBaseObject = () => ({
  modules: {},
});

// remove all props from config,
// and reassign with defaultConfig
const resetConfig = () => {
  Object.keys(config).forEach((key: any) => {
    delete config[key];
  });

  deepAssign(config, getBaseObject(), defaultConfig(sharedVars));
};

const reset = () => {
  // create new config context
  config = {};
  // remove loaded appConfig
  appConfig = getBaseObject();
  // remove configurators
  configurators = {};

  resetConfig();
};

// apply initial values
reset();

// APPLY MODULE CONFIGURATOR
const applyConfigurator = (moduleName: any, configurator: any) => {
  // make sure module name exists
  if (config.modules && config.modules[moduleName] == null) {
    config.modules[moduleName] = {};
  }

  const moduleConfig = config.modules[moduleName];
  const appModuleConfig = appConfig.modules[moduleName];

  // assign appConfig and moduleConfig on top of defaultConfig
  // while *maintaining the reference*

  deepAssign(moduleConfig, configurator(sharedVars), appModuleConfig);
};

// ADD MODULE CONFIGURATOR
const addModuleConfigurator = (moduleName: any, configurator: any) => {
  configurators[moduleName] = configurator;

  applyConfigurator(moduleName, configurator);
};

// APPLY MODULE CONFIGURATORS
const applyConfigurators = () => {
  Object.keys(configurators).forEach(moduleName => {
    const configurator = configurators[moduleName];

    applyConfigurator(moduleName, configurator);
  });
};

// get return context
const getReturnValue = (moduleName: any) => {
  return {
    app: config,
    module: config.modules[moduleName],
  };
};

// CONFIGURE APP
// should only be called once, or
// call reset() to clean contexts
const configureApp = (_newAppConfig: any) => {
  // apply new shared vars

  let newAppConfig;
  if (typeof _newAppConfig === 'function') {
    newAppConfig = _newAppConfig(sharedVars);
  } else {
    newAppConfig = _newAppConfig;
  }

  // set appConfig,
  // ensure modules object
  appConfig = deepAssign(getBaseObject(), newAppConfig);

  // reapply configurators
  applyConfigurators();

  // assign appConfig on top of defaultConfig
  // while *maintaining the reference*
  const appConfigClone = clone(appConfig);
  delete appConfigClone.modules;
  deepAssign(config, appConfigClone);

  appConfiguredPromiseResolve();

  return getReturnValue('').app;
};

// CONFIGURE MODULE
const configureModule = (moduleName: any, moduleConfigurator: any) => {
  addModuleConfigurator(moduleName, moduleConfigurator);

  return getReturnValue(moduleName);
};

// EXPORT

const getConfig = () => getReturnValue('').app;

export { configureApp, configureModule, appConfiguredPromise, reset, getConfig };
