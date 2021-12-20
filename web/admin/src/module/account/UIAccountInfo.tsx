import React from "react";
import { app, widget, server } from 'components';

import { WComponentProps, WComponent } from "core/widget/WLayout";
import { WEntityEditor, WEntityEditorProps } from "core/widget/entity";

import { T, AccountRestURL } from "./Dependency";
import { UIProfile } from './UIProfile';
import { BeanObserver } from "core/widget";

const { TabPane, Tab } = widget.layout;
const { VSplit, VSplitPane } = widget.component;
const { FAButton } = widget.fa;

export interface IUIAccountInfoPlugin {
  createAdditionalTabs: (appContext: app.AppContext, pageContext: app.PageContext, loginId: string) => Array<any>;
}

interface UIAccountInfoProps extends WEntityEditorProps {
  plugin?: IUIAccountInfoPlugin;
  onModifiedData?: () => void
}
export class UIAccountInfo extends WEntityEditor<UIAccountInfoProps> {
  render() {
    let { appContext, plugin, pageContext, observer } = this.props;
    const writeCap = this.hasWriteCapability();
    const profile = observer.getMutableBean();

    let uiAccountInfo = (
      <VSplit>
        <VSplitPane className='pr-1' width={450}>
          <UIProfile appContext={appContext} pageContext={pageContext} profile={profile} readOnly={!writeCap} />
        </VSplitPane>
        <VSplitPane>
          Comming soon
        </VSplitPane>
      </VSplit>
    );

    if (plugin) {
      let pluginTabs = plugin.createAdditionalTabs(appContext, pageContext, profile.loginId);
      let html = (
        <TabPane storeId={`account-employee-detail`}>
          <Tab key={'accountModule'} name="accountModule" label={T("Account Info")} active={true}>
            {uiAccountInfo}
          </Tab>
          {pluginTabs}
        </TabPane>
      );
      return html;
    }
    return uiAccountInfo;
  }
}

export interface UILoadableAccountInfoProps extends WComponentProps {
  plugin?: IUIAccountInfoPlugin;
  loginId: string
}
export class UILoadableAccountInfo extends WComponent<UILoadableAccountInfoProps> {
  observer: BeanObserver = new BeanObserver({});

  constructor(props: UILoadableAccountInfoProps) {
    super(props);
    this.markLoading(true);

    let { appContext, loginId } = this.props;
    let callBack = (response: server.rest.RestResponse) => {
      const profile = response.data;
      this.observer.replaceWith(profile);
      this.markLoading(false)
      this.forceUpdate();
    }
    appContext.serverGET(AccountRestURL.profile.load(loginId), {}, callBack);
  }

  render() {
    if (this.isLoading()) return this.renderLoading();
    let { appContext, pageContext, plugin } = this.props;
    const writeCap = this.hasWriteCapability();

    return (
      <div className='flex-vbox'>
        <UIAccountInfo appContext={appContext} pageContext={pageContext} plugin={plugin}
          observer={this.observer} readOnly={!writeCap} />
        {this.renderRemoteButton()}
      </div>
    );
  }

  renderRemoteButton() {
    let onHelloRemote = () => {
      /*
      const SaleApp = React.lazy(() => import("logistics/SaleApp"));
      let uiRemote = (
        <React.Suspense fallback="Loading Button">
          <SaleApp config={{hello: 'Hello Config From Host'}} />
        </React.Suspense>
      );
      widget.layout.showDialog('Hello Remote', 'md', uiRemote);
      */
    }

    let html = (
      <FAButton onClick={onHelloRemote}>Hello Remote</FAButton>
    )
    return html;
  }
}
