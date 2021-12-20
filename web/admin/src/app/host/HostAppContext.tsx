import { Component } from 'react';
import { app } from 'components'

import { Workspaces } from './Workspaces';

import UserAppRegistryManager = app.host.UserAppRegistryManager
export class HostAppContext {
  appRegistryManager: UserAppRegistryManager;
  osContext: app.OSContext;
  workspaces: Workspaces;
  defaultAppName: string = 'my space';

  constructor(uiOS: Component) {
    let configModel = app.host.CONFIG.getModel();
    this.appRegistryManager = new UserAppRegistryManager();
    let serverCtx = new app.ServerContext(configModel.hosting.domain, configModel.serverUrl, configModel.restUrl);
    this.osContext = new app.OSContext(uiOS, serverCtx);
    this.workspaces = new Workspaces();
  }

  getDefaultAppName() { return this.defaultAppName; }

  getAppRegistryManager() { return this.appRegistryManager; }
}
