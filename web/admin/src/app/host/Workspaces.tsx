import { app, util } from 'components';

const DEFAULT_WS_LABEL = 'Home'
const WORKSPACES_STATE_KEY = 'webos:workspaces';
const {session} = app.host;

export class PathContext {
  wsId: string;

  constructor(path: string) {
    this.wsId = DEFAULT_WS_LABEL;
    let pathSeg = path.split('/');
    // let ctxPath  = pathSeg[1];
    if (pathSeg[2]) {
      if (pathSeg[2].startsWith('ws:')) {
        let wsToken = pathSeg[2].split(":");
        this.wsId = wsToken[1];
      }
    }
  }

  getWSId() { return this.wsId; }
}

export class WorkspaceModel {
  id: string;
  label: string;
  selected: boolean;
  currentAppId?: string;

  constructor(label: string) {
    this.label = label;
    if (label == 'WS') {
      this.id = 'WS-' + util.common.IDTracker.next();
    } else {
      this.id = label.replace(/ /g, '-');
    }
    this.selected = false;
  }
}

export class Workspace {
  model: WorkspaceModel;
  _uiContent: any;
  _appRegistry?: app.IAppRegistry;

  constructor(data: string | WorkspaceModel) {
    if (typeof data === 'string') {
      this.model = new WorkspaceModel(data);
    } else {
      this.model = data;
    }
  }

  getWSLabel() {
    let label = this.model.label;
    if (this._appRegistry) label += `[${this._appRegistry.label}]`;
    return label;
  }

  getId() { return this.model.id; }

  isSelected() { return this.model.selected; }

  setSelected(b: boolean) { this.model.selected = b; }

  getPath() { return `/app/ws:${this.model.id}`; }

  getUIContent() { return this._uiContent; }
  setUIContent(uiContent: any, registry?: app.IAppRegistry) {
    this._appRegistry = registry;
    this._uiContent = uiContent;
  }

  setCurrentAppId(appId: string) {
    this.model.currentAppId = appId;
    this._uiContent = null;
  }
}

export class Workspaces {
  _workspaces: Record<string, Workspace> = {};

  constructor() {
    let models: Record<string, WorkspaceModel> = session.getStorable().getState(WORKSPACES_STATE_KEY, {});
    this.withStoreModels(models);
  }

  getSelectedWorkspace() {
    for (let id in this._workspaces) {
      let ws = this._workspaces[id];
      if (ws.isSelected()) return ws;
    }
    return this.getFirstWorkspace();
  }

  getFirstWorkspace() {
    let id = Object.keys(this._workspaces)[0];
    return this._workspaces[id];
  }

  getWorkspaces() {
    let workspaces = new Array<Workspace>();
    for (let id in this._workspaces) {
      let ws = this._workspaces[id];
      workspaces.push(ws);
    }
    return workspaces;
  }

  setSelectWorkspace(location: null | string) {
    let wsId = '_restore_';
    if (location) {
      let pathCtx = new PathContext(location);
      wsId = pathCtx.getWSId();
    }
    let selWS: Workspace | null = null;
    if (wsId == '_restore_') {
      for (let id in this._workspaces) {
        let ws = this._workspaces[id];
        if (!selWS) selWS = ws;
        if (ws.isSelected()) {
          selWS = ws;
          break;
        }
      }
    } else {
      selWS = this._workspaces[wsId];
      for (let id in this._workspaces) {
        let ws = this._workspaces[id];
        ws.setSelected(false);
        if (ws.getId() == wsId) {
          ws.setSelected(true);
        }
      }
    }
    if (!selWS) {
      if (wsId == '_restore_') wsId = DEFAULT_WS_LABEL;
      this.addNewWorkspace();
    }
    return selWS;
  }

  changeApp(appId: string) {
    for (let id in this._workspaces) {
      let ws = this._workspaces[id];
      if (ws.isSelected()) {
        ws.setCurrentAppId(appId);
        break;
      }
    }
  }

  addNewWorkspace(name: string = DEFAULT_WS_LABEL) {
    for (let id in this._workspaces) {
      let ws = this._workspaces[id];
      ws.setSelected(false);
    }
    let ws = new Workspace(name);
    ws.setSelected(true);
    this._workspaces[ws.getId()] = ws;
    return ws;
  }

  removeWorkspace(wsId: string) {
    if (this._workspaces[wsId]) {
      delete this._workspaces[wsId];
      let size = Object.keys(this._workspaces).length;
      if (size == 0) {
        this.addNewWorkspace();
      }
    }
  }

  clearWorkspaces() {
    this._workspaces = {};
    this.addNewWorkspace();
  }

  getStoreModels() {
    let models: Array<WorkspaceModel> = [];
    for (let id in this._workspaces) {
      let ws = this._workspaces[id];
      models.push(ws.model);
    }
    return models;
  }

  withStoreModels(models: Record<string, WorkspaceModel>) {
    this._workspaces = {};
    let countWs = 0;
    for (let id in models) {
      let model = models[id];
      let ws = new Workspace(model);
      this._workspaces[id] = ws;
      countWs++;
    }
    if (countWs == 0) {
      this.addNewWorkspace();
    }
    return this;
  }

  save() {
    let models: Record<string, WorkspaceModel> = {};
    for (let id in this._workspaces) {
      let ws = this._workspaces[id];
      models[id] = ws.model;
    }
    session.getStorable().setState(WORKSPACES_STATE_KEY, models);
  }
}