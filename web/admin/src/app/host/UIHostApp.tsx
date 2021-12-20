import { withRouter, RouteComponentProps } from "react-router-dom";
import { util, storage, React } from 'components'

import { HostAppContext } from './HostAppContext'
import { UIBanner } from './UIBanner'
import { Workspace } from './Workspaces'

import "./stylesheet.scss";

const { IDTracker } = util;

interface UIHostProps { }
interface UIHostState { }
class UIHostApp extends React.Component<UIHostProps & RouteComponentProps<{}>, UIHostState> {
  state = { location: null };

  renderId: number = IDTracker.next();
  hostAppContext: HostAppContext;

  constructor(props: any) {
    super(props);
    this.hostAppContext = new HostAppContext(this);
  }

  static getDerivedStateFromProps(nextProps: any, _prevState: any) {
    let path = nextProps.location.pathname;
    return { location: path };
  }

  getWorkspaceUIContent(ctx: HostAppContext, ws: Workspace) {
    let uiContent = ws.getUIContent();
    if (uiContent) return uiContent;
    let appId = ws.model.currentAppId;
    if (!appId) appId = ctx.getDefaultAppName();
    let appRegistry = ctx.getAppRegistryManager().get(appId, true);
    let { osContext } = ctx;
    if (appRegistry) {
      uiContent = appRegistry.createUI(osContext);
      ws.setUIContent(uiContent, appRegistry);
    } else {
      uiContent = (<div>No App Available</div>);
      ws.setUIContent(uiContent, undefined);
    }
    return uiContent;
  }

  render() {
    const webosCtx = this.hostAppContext;
    const osContext = webosCtx.osContext;

    let { location } = this.state;

    let event = osContext.getEvent();
    let workspaces = webosCtx.workspaces;;

    if (event && event.isTarget('webos:app:launch')) {
      let appName = event.data.appName;
      workspaces.changeApp(appName);
      workspaces.save();
      osContext.consumeEvent();
    } else if (event && event.isTarget('webos:change:company')) {
      this.renderId = IDTracker.next();
      workspaces.clearWorkspaces();
      workspaces.setSelectWorkspace(location);
      workspaces.save();
      osContext.consumeEvent();
    } else if (event && event.isTarget('webos:change:language')) {
      this.renderId = IDTracker.next();
      osContext.consumeEvent();
    } else {
      workspaces.setSelectWorkspace(location);
      workspaces.save();
    }

    let wsScreens = [];
    for (let ws of workspaces.getWorkspaces()) {
      let uiAppHtml = this.getWorkspaceUIContent(this.hostAppContext, ws);
      let style = undefined;
      if (!ws.isSelected()) style = { display: 'none' };
      wsScreens.push(
        <div key={`ws-${ws.getId()}-${this.renderId}`} className='flex-vbox' style={style}>{uiAppHtml}</div>);
    }
    let theme = storage.sessionGet('laf:theme', 'light');
    let html = (
      <div key={this.renderId} className={`${theme}-theme flex-vbox`}>
        <div className={'ui-webos flex-vbox body-bg body-color'}>
          <UIBanner webosContext={this.hostAppContext} />
          <div className='ui-screens flex-vbox'> {wsScreens} </div>
        </div>
      </div>
    );
    return html;
  }
}
export default withRouter(UIHostApp);