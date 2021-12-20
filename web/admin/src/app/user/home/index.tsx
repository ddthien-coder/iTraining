import React from 'react';
import { app } from 'components'

import { UILoadableAccountInfo } from 'module/account/UIAccountInfo';
import { UILoadableEmployeeInfo } from 'module/company/hr';
import { UIDirectoryList } from 'module/storage/UIDirectoryList';
import { VGridEntityListPlugin } from 'core/widget/vgrid';

const session = app.host.session;
class UIApplication extends app.UIMenuApplication {
  createNavigation(_appContext: app.AppContext, pageContext: app.PageContext) {
    let loginId = session.getAccountAcl().getLoginId();
    const writeCap = pageContext.hasUserWriteCapability();
    let navigation: app.NavigationConfig = {
      defaultScreen: 'my-profile',
      screens: [
       
      ],
      sections: [
        {
          label: 'Others', indentLevel: 1,
          screens: [
            {
              id: "my-storage", label: "My Storage",
              createUI: (appContext: app.AppContext, pageContext: app.PageContext) => {
                return (
                  <UIDirectoryList
                    plugin={new VGridEntityListPlugin()}
                    appContext={appContext} pageContext={pageContext} />
                );
              }
            },
            {
              id: "my-profile", label: "My Profile",
              createUI: (appContext: app.AppContext, pageContext: app.PageContext) => {
                return (<UILoadableAccountInfo appContext={appContext} pageContext={pageContext} loginId={loginId}
                  readOnly={!writeCap} />)
              }
            },
            {
              id: "my-company", label: "My Company",
              createUI: (appContext: app.AppContext, pageContext: app.PageContext) => {
                return (
                  <UILoadableEmployeeInfo appContext={appContext} pageContext={pageContext}
                    loginId={loginId} readOnly={true} />
                )
              }
            }
          ]
        },
      ]
    }
    return navigation;
  }
}

export class HomeAppRegistry extends app.BaseAppRegistry {
  module = 'user';
  name = 'my-space';
  label = 'My Space';
  description = 'My Space';
  requiredAppCapability: app.AppCapability = app.READ;

  createUI(ctx: app.OSContext) { return <UIApplication osContext={ctx} appRegistry={this} />; };
}