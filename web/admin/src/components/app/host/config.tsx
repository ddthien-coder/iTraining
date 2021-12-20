import {ServerContext} from 'components/app/app';
declare global {
  interface Window { CONFIG: any; }
}

export interface ConfigModel {
  environment: 'prod' | 'dev',
  build: string,
  hosting: {
    domain: string
  },
  serverUrl: string
  restUrl: string
}

class HostAppConfig {
  tenant: string = 'default';
  model: ConfigModel;
  devMode: boolean;
  //theme = 'light';

  constructor(model: ConfigModel) {
    this.model = model;
    this.devMode = model.environment == 'dev';
    let hostname = window.location.hostname;
    if (hostname.endsWith('.' + model.hosting.domain)) {
      this.tenant = hostname.substring(0, hostname.indexOf('.'));
    }
  }

  getModel() { return this.model; }

  getTenant() { return this.tenant; }

  isDevEnvirontment() { return this.getModel().environment === 'dev'; }

  getServerUrl() { return this.model.serverUrl; }

  createServerLink(path: string) {
    if (this.devMode) return this.model.serverUrl + path;
    return path;
  }

  createServerContext() {
    let serverCtx = new ServerContext(model.hosting.domain, model.serverUrl, model.restUrl);
    return serverCtx;
  }
}

let serverUrl = window.location.origin;
let restUrl = window.location.origin + '/rest/v1.0.0';
let environment: 'dev' | 'prod' = 'prod';
if (restUrl.indexOf(':3000') > 0) {
  environment = 'dev';
  serverUrl = serverUrl.replace(/:3000/, ":7080");
  restUrl = restUrl.replace(/:3000/, ":7080");
}

let model: ConfigModel = {
  environment: environment,
  build: 'latest',
  hosting: {
    domain: 'dev-demo.website'
  },
  serverUrl: serverUrl,
  restUrl: restUrl
}

if (window.CONFIG) {
  model = { ...model, ...window.CONFIG }
  window.CONFIG = null;
}

let CONFIG = new HostAppConfig(model);

export { CONFIG };
