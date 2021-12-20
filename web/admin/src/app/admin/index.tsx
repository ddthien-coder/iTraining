import React from 'react';
import { app } from 'components';

import { T } from './Dependency';

import { UIAccountList, UIAccountListPlugin } from 'module/account/UIAccountList';
import { SystemStorage } from 'module/storage/Storage';
import { UIStoragePage } from 'module/storage/UIStorage';
import { UIAppList, UIAppListPlugin } from './permission/UIAppList';
import { UILoadableCompany } from 'module/company/UICompany';

class UIApplication extends app.UIMenuApplication {
  createNavigation(appContext: app.AppContext, pageContext: app.PageContext) {
    let navigation: app.NavigationConfig = {
      defaultScreen: 'my-company',
      screens: [
  
      ],
      sections: [
        {
          label: T('Other'), indentLevel: 1, requiredCapability: app.READ,
          screens: [
            {
              id: "my-company", label: T("My Company"),
              ui: (<UILoadableCompany appContext={appContext} pageContext={pageContext} />)
            },
            {
              id: "users", label: T("Users"),
              ui: (
                <UIAccountList
                  appContext={appContext} pageContext={pageContext} type='page' plugin={new UIAccountListPlugin()} />)
            },
            {
              id: "app-permissions", label: T("App Permissions"), requiredCapability: app.WRITE,
              ui: (<UIAppList plugin={new UIAppListPlugin()} appContext={appContext} pageContext={pageContext} />),
            },
            {
              id: "storage-system", label: T("Storage"), requiredCapability: app.ADMIN,
              ui: (<UIStoragePage context={this.context} appContext={appContext} pageContext={pageContext} storage={new SystemStorage()} />)
            }
          ]
        }
      ]
    }
    return navigation;
  }
}

export class AdminAppRegistry extends app.BaseAppRegistry {
  module = 'admin';
  name = 'admin';
  label = 'Admin';
  description = 'Admin App';
  requiredAppCapability = app.ADMIN;

  createUI(ctx: app.OSContext) { return (<UIApplication osContext={ctx} appRegistry={this} />); };
}