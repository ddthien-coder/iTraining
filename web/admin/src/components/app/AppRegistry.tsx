import * as app from './app'
import {AppCapability, NONE} from './permission'

export interface IAppPlugin {
  targetModule: string;
  targetAppName: string;
  pluginType?: string;

  pluginName: string;
  pluginLabel: string;
  pluginDescription: string;
}

export interface IAppRegistry {
  module: string;
  name: string;
  label: string;
  description: string;
  createUI: (ctx: app.OSContext) => any;

  getRequiredAppCapability: () => AppCapability;
  setRequiredAppCapability: (permission: AppCapability) => void;

  getUserAppCapability: () => AppCapability;
  setUserAppCapability: (permission: AppCapability) => void;
}

export class BaseAppRegistry implements IAppRegistry {
  module: string = 'unknown';
  name: string = 'unknown';
  label: string = 'Unknown';
  description: string = '';

  requiredAppCapability: AppCapability = NONE;
  userAppCapability: AppCapability = NONE;

  getRequiredAppCapability() { return this.requiredAppCapability; }

  setRequiredAppCapability(capability: AppCapability) {
    this.requiredAppCapability = capability;
  }

  getUserAppCapability() { return this.userAppCapability; }

  setUserAppCapability(capability: AppCapability) {
    this.userAppCapability = capability;
  }

  createUI(_ctx: app.OSContext) {
    throw new Error('You need to override this method');
  };
}

