import { app, widget, reactstrap, storage, i18n, React } from 'components'

import { HostAppContext } from './HostAppContext'

const  T  = i18n.getT([]);
const { fas, FAIcon, FAButton } = widget.fa;
const { UncontrolledDropdown, DropdownToggle, DropdownMenu } = reactstrap
const { TabPane, Tab } = widget.layout;

interface WebosProps { webosContext: HostAppContext; }
interface WBannerAppState {
  open: boolean;
}
export class UIAppMenu extends React.Component<WebosProps, WBannerAppState> {
  state = { open: false }
  registries: Array<app.IAppRegistry>;

  constructor(props: WebosProps) {
    super(props);
    this.registries = [];
    let { webosContext } = props;
    let appRegistryManager = webosContext.getAppRegistryManager();
    for (let name in appRegistryManager.appRegistries) {
      let registry = appRegistryManager.appRegistries[name];
      this.registries.push(registry);
    }
  }

  toggle = () => {
    this.setState({ open: !this.state.open });
  }

  changeTheme = (name: string) => {
    storage.sessionPut('laf:theme', name);
    let { webosContext } = this.props;
    let osContext = webosContext.osContext;
    osContext.broadcast(new app.OSEvent('Banner', 'webos:refresh', {}, osContext));
  }

  renderApp(registry: app.IAppRegistry, broadcastChangeApp: (appName: string) => void) {
    let html = (
      <div key={registry.name} className='app border' style={{ width: 140 }}>
        <FAButton color='link' onClick={() => broadcastChangeApp(registry.name)}>{registry.label}</FAButton>
        <div className={'text-dark'}>{registry.description}</div>
      </div>
    );
    return html;
  }

  onSelectAppGroup(groupName: string) {
    let { webosContext } = this.props;
    let appRegistryManager = webosContext.getAppRegistryManager();
    let registries = [];
    if (!groupName) {
      for (let name in appRegistryManager.appRegistries) {
        let registry = appRegistryManager.appRegistries[name];
        registries.push(registry);
      }
    } else {
      let group = appRegistryManager.appRegistryGroups[groupName];
      for (let name in group.registries) {
        let registry = group.registries[name];
        registries.push(registry);
      }
    }
    this.registries = registries;
    this.forceUpdate();
  }

  renderThemeSelector() {
    let themes = ['light', 'dark'];
    let themeLbs = [T('Light Theme'), T('Dark Theme')];
    let uiThemes = [];
    for (let i = 0; i < themes.length; i++) {
      let layout = (
        <div key={`${themes[i]}`} className={'flex-vbox m-2'} style={{ height: 150 }}>
          <div className='p-2'>
            <FAButton color='link' onClick={() => this.changeTheme(themes[i])}>{themeLbs[i]}</FAButton>
          </div>
          <div className={`flex-vbox ${themes[i]}-theme`}>
            <div className={`flex-vbox border`}>
              <div className='border-bottom bg-primary' style={{ height: 20 }} />
              <div className='flex-hbox body-bg'>
                <div className='bg-light border-right' style={{ width: 40 }} />
                <div className='flex-vbox' />
              </div>
              <div className='border-top' style={{ height: 20 }} />
            </div>
          </div>
        </div>
      );
      uiThemes.push(layout);
    }
    let ui = (
      <div className='flex-hbox justify-content-between'>
        {uiThemes}
      </div>
    );
    return ui;
  }

  renderAppMemu() {
    let { webosContext } = this.props;
    const broadcastChangeApp = (appName: string) => {
      let data = { appName: appName };
      let osContext = webosContext.osContext;
      osContext.broadcast(new app.OSEvent('Banner', 'webos:app:launch', data, osContext));
      this.setState({ open: false });
    }
    let appRegistryManager = webosContext.getAppRegistryManager();
    let groupButtons = [];
    groupButtons.push(
      <FAButton key={'all'} className='px-0 text-left' color='link' onClick={() => this.onSelectAppGroup('')}>
        All
      </FAButton>
    );
    for (let groupName in appRegistryManager.appRegistryGroups) {
      let group = appRegistryManager.appRegistryGroups[groupName];
      groupButtons.push(
        <FAButton key={groupName} className='px-0 text-left' color='link' onClick={() => this.onSelectAppGroup(groupName)}>
          {group.label}
        </FAButton>
      );
    }
    let appButtons = [];
    for (let i = 0; i < this.registries.length; i++) {
      let registry = this.registries[i];
      appButtons.push(this.renderApp(registry, broadcastChangeApp));
    }
    let ui = (
      <div className='flex-hbox'>
        <div className='flex-vbox p-1' style={{ minWidth: 150, maxWidth: 150 }}> {groupButtons} </div>
        <div className='d-flex flex-wrap flex-grow-1 justify-content-between p-1'> {appButtons} </div>
      </div>
    );
    return ui;
  }

  render() {
    return (
      <UncontrolledDropdown isOpen={this.state.open} toggle={this.toggle}>
        <DropdownToggle className='w-logo text-white' nav caret>
          <FAIcon icon={fas.faTh} title={'Apps Menu'} /> IT
        </DropdownToggle>
        <DropdownMenu className='p-0 m-0' style={{ width: 600, maxHeight: 500, outline: 'none' }}>
          <div className='ui-webos-app-menu flex-vbox bg-light'>
            <TabPane>
              <Tab name='apps' label={'Apps'} active>
                {this.renderAppMemu()}
              </Tab>
              <Tab name='themes' label={'Themes'}>
                {this.renderThemeSelector()}
              </Tab>
            </TabPane>
          </div>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}