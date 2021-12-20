import { app } from 'components/index';
import React from 'react';
import { Component } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

import { IDTracker } from 'components/util/common'
import { fas, FAButton, FAIcon } from 'components/widget/fa'
import { BreadcumbsPage, BreadcumbsPageProps } from 'components/widget/layout'
import { AppContext, PageContext, AppEvent, ApplicationProps, OSProps } from './app'
import { IAppRegistry } from './AppRegistry';
import { AppCapability, NONE, ADMIN } from './permission';
export interface ScreenModel {
  id: string;
  label: string;
  icon?: String;
  hint?: String;
  requiredCapability?: AppCapability;
  ui?: any;
  createUI?: (appContext: app.AppContext, pageContext: app.PageContext) => any;
}

export interface NavigationSection {
  label: string;
  indentLevel: 1 | 2 | 3;
  screens: Array<ScreenModel>,
  requiredCapability?: AppCapability
}

export interface NavigationConfig {
  navWidth?: number,
  defaultScreen: string,
  screens?: Array<ScreenModel>,
  sections?: Array<NavigationSection>
  collapse?: boolean;
  requiredCapability?: AppCapability
}

interface UINavigationProps extends ApplicationProps {
  navigation: NavigationConfig
}

export function changeScreen(appContext: AppContext, screen: string) {
  let data = { screen: screen }
  appContext.broadcast(new AppEvent('UINavigation', 'app:change:screen', data, appContext));
}

export function findScreenModel(navigation: NavigationConfig, id: string) {
  if (navigation.screens) {
    let screens = navigation.screens;
    for (let j = 0; j < screens.length; j++) {
      if (screens[j].id == id) return screens[j];
    }
  }
  if (navigation.sections) {
    let sections = navigation.sections;
    for (let i = 0; i < sections.length; i++) {
      let screens = sections[i].screens;
      for (let j = 0; j < screens.length; j++) {
        if (screens[j].id == id) return screens[j];
      }
    }
  }
  return null;
}

interface UIApplicationProps extends OSProps {
  appRegistry: IAppRegistry
}
export class UIApplication extends Component<UIApplicationProps> {
  appContext: AppContext;
  pageContext: PageContext;
  navigation: NavigationConfig;

  constructor(props: any) {
    super(props);
    const { osContext, appRegistry } = props;
    this.appContext = new AppContext(this, osContext);
    this.appContext.setAppRegistry(appRegistry);
    this.pageContext = this.appContext.createPageContext(null);
    this.navigation = this.createAllowedNavigation(this.appContext, this.pageContext);
  }

  createAllowedNavigation(appContext: AppContext, pageContext: PageContext): NavigationConfig {
    let navigation = this.createNavigation(appContext, pageContext);
    let userCap = null;
    let app = appContext.getAppRegistry();
    if (app.getUserAppCapability) {
      userCap = app.getUserAppCapability();
    }
    if (userCap == null) userCap = ADMIN;

    let navRequiredCap = navigation.requiredCapability;
    if (!navRequiredCap) navRequiredCap = NONE;
    let sections = navigation.sections;
    if (sections) {
      let allowedSections = [];
      for (let i = 0; i < sections.length; i++) {
        let section = sections[i];
        let sectionRequiredCap = section.requiredCapability;
        if (!sectionRequiredCap) sectionRequiredCap = navRequiredCap;
        let allowedScreens = [];
        for (let j = 0; j < section.screens.length; j++) {
          let screen = section.screens[j];
          let screenRequiredCap = screen.requiredCapability;
          if (!screenRequiredCap) screenRequiredCap = sectionRequiredCap;
          if (userCap.hasCapability(screenRequiredCap)) {
            allowedScreens.push(screen);
          }
        }
        if (allowedScreens.length > 0) {
          section.screens = allowedScreens;
          allowedSections.push(section);
        }
      }
      navigation.sections = allowedSections;
    }
    return navigation;
  }

  createNavigation(_appContext: AppContext, _pageContext: PageContext): NavigationConfig {
    throw Error('This method need to override');
  }
}

export class UINavigation extends Component<UINavigationProps> {
  constructor(props: any) {
    super(props);
    this.state = { collapse: false };
  }

  toggleNav() {
    let { navigation } = this.props;
    navigation.collapse = !navigation.collapse;
    let { appContext } = this.props;
    appContext.broadcast(new AppEvent('UINavigation', 'app:update', {}, appContext));
  }

  renderScreenGroup(section: NavigationSection) {
    let { appContext } = this.props;
    let screenModels = section.screens;
    let screenLinks = [];
    for (let i = 0; i < screenModels.length; i++) {
      let screen = screenModels[i];
      screenLinks.push(
        <FAButton
          key={i} color='link' onClick={() => changeScreen(appContext, screen.id)}>{screen.label}</FAButton>
      );
    }
    return screenLinks;
  }

  renderSections(nav: NavigationConfig) {
    if (nav.collapse) return null;
    let sectionUIs = [];
    if (nav.sections) {
      let sections: Array<NavigationSection> = nav.sections;
      for (let i = 0; i < sections.length; i++) {
        let section = sections[i];
        if (section.indentLevel == 1) {
          sectionUIs.push(
            <div key={i} className="screen-group">
              <h5 className='border-bottom mb-1'>{section.label}</h5>
              {this.renderScreenGroup(section)}
            </div>
          );
        } else if (section.indentLevel == 2) {
          sectionUIs.push(
            <div key={i} className="screen-group pl-3">
              <h6 className='mb-1'>{section.label}</h6>
              {this.renderScreenGroup(section)}
            </div>
          );
        }
      }
    }
    return sectionUIs;
  }

  renderBanner(nav: NavigationConfig) {
    let { appContext } = this.props;
    if (nav.collapse) {
      return (
        <FAButton style={{ padding: '0px 2px' }} icon={fas.faPlus} outline onClick={() => this.toggleNav()} />
      );
    }
    let html = (
      <div className='banner d-flex justify-content-between p-1'>
        <strong>{appContext.getAppRegistry().label}</strong>
        <FAButton style={{ padding: '0px 2px' }} icon={fas.faTrashAlt} outline onClick={() => this.toggleNav()} />
      </div>
    );
    return html;
  }

  render() {
    let { navigation } = this.props;
    let html = (
      <div>
        {this.renderBanner(navigation)}
        {this.renderSections(navigation)}
      </div>
    );
    return html;
  }
}
interface UIBodyProps extends BreadcumbsPageProps {
  appContext: AppContext; pageContext: PageContext; navigation: NavigationConfig;
}
export class UIApplicationBody extends BreadcumbsPage<UIBodyProps> {
  componentDidMount() {
    this.clear();
    let { appContext, pageContext } = this.props;
    let screenModel = this.selectScreenModel(appContext.getEvent());
    let uiScreen = null;
    if (screenModel.createUI) {
      let pageContext = appContext.createPageContext(this);
      pageContext.clearPageStorage();
      uiScreen = screenModel.createUI(appContext, pageContext);
    } else if (screenModel.ui) {
      pageContext.withBreadcumbs(this);
      uiScreen = screenModel.ui;
    } else {
      uiScreen = <div>No Screen</div>
    }
    this.push('root', screenModel.label, uiScreen);
  }

  selectScreenModel(event: null | AppEvent) {
    let { navigation } = this.props;
    let uiScreen = null;
    if (event && event.data && event.name == 'app:change:screen') {
      let data = event.data;
      uiScreen = findScreenModel(navigation, data.screen);
    }
    if (!uiScreen) {
      uiScreen = findScreenModel(navigation, navigation.defaultScreen);
    }
    if (!uiScreen) {
      throw new Error(`Cannot find the screen`);
    }
    return uiScreen;
  }
}
export class UIMenuApplicationBody extends UIApplicationBody {
  renderMenuSections(appContext: AppContext, navigation: NavigationConfig) {
    if (!navigation.sections) return null;
    let sectionUIs = [];
    for (let i = 0; i < navigation.sections.length; i++) {
      let section = navigation.sections[i];
      let screens = section.screens;
      let screenButtons = [];
      for (let j = 0; j < screens.length; j++) {
        let screen = section.screens[j];
        screenButtons.push(
          <div key={j} className='border m-1' style={{ width: 120 }}>
            <FAButton color='link' onClick={() => changeScreen(appContext, screen.id)}>{screen.label}</FAButton>
          </div>
        );
      }
      sectionUIs.push(
        <div key={i}>
          <strong className='px-2'>{section.label}</strong>
          <div className='d-flex flex-row flex-wrap'>
            {screenButtons}
          </div>
        </div>
      );
    }
    return sectionUIs;
  }

  renderNavigationMenu() {
    let { appContext, navigation } = this.props;
    if (!navigation.sections) return null;
    let html = (
      <UncontrolledDropdown>
        <DropdownToggle nav caret className='px-2 text-white'>
          <FAIcon icon={fas.faTh} />Menu
        </DropdownToggle>
        <DropdownMenu right>
          <div className='p-1' style={{ width: 390 }}>
            {this.renderMenuSections(appContext, navigation)}
          </div>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
    return html;
  }

  renderScreens() {
    let { appContext, navigation } = this.props;
    if (!navigation.screens) return null;
    let screenModels = navigation.screens;
    let screenBtns = [];
    for (let i = 0; i < screenModels.length; i++) {
      let screen = screenModels[i];
      let iconEle: any = null;
      if (screen.icon) {
        iconEle = (<span className={`${screen.icon}`} title={`${screen.hint}`} />)
      }
      screenBtns.push(
        <FAButton key={i} className='text-white' color='link'
          onClick={() => changeScreen(appContext, screen.id)}>{iconEle} {screen.label}</FAButton>);
    }
    return (
      <div className='d-flex'>
        {screenBtns}
      </div>
    );
  }

  render() {
    let html = (
      <div className='flex-vbox'>
        <div className='flex-hbox-grow-0 justify-content-between bg-secondary'>
          <div className='flex-hbox'> {this.createBreadcumbPaths()} </div>
          <div className='flex-hbox-grow-0'>
            {this.renderScreens()}
            {this.renderNavigationMenu()}
          </div>
        </div>
        <div className='flex-vbox'>{this.createBreadcumbContent()} </div>
      </div>
    );
    return html;
  }
}

export class UIMenuApplication extends UIApplication {
  render() {
    let appContext = this.appContext;
    let renderId = IDTracker.next();
    let html = (
      <div className='ui-menu-application flex-vbox'>
        <div className='ui-body flex-vbox'>
          <UIMenuApplicationBody
            key={renderId} appContext={appContext} pageContext={this.pageContext} navigation={this.navigation} />
        </div>
      </div>
    );
    return html;
  }
}