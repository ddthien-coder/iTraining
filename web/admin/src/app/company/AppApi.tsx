import React from 'react';
import { app } from 'components';

import { T } from 'core/widget/Dependency';

import { UIEmployeeList, UIEmployeeListPlugin } from 'module/company/hr/UIEmployeeList';
export class UIApplication extends app.UIMenuApplication {
  createNavigation(appContext: app.AppContext, pageContext: app.PageContext) {
    let navigation: app.NavigationConfig = {
      defaultScreen: 'employees',
      screens: [
  
      ],
      sections: [
        {
          label: T('Comming soon'), indentLevel: 1,
          screens: [
          
          ]
        },

        {
          label: T('Other'), indentLevel: 1,
          screens: [
            {
              id: "employees", label: T("Employees"),
              ui: (<UIEmployeeList appContext={appContext} pageContext={pageContext}
                type='page' plugin={new UIEmployeeListPlugin()} />)
            },
            {
              id: "storage-company", label: T("Company Storage"),
              // ui: (<UIStoragePage context={this.context} appContext={appContext} pageContext={pageContext} storage={new CompanyStorage()} />),
            }
          ]
        },
      ]
    }
    return navigation;
  }
}

export class CompanyAppRegistry extends app.BaseAppRegistry {
  module: string = 'company';
  name: string = 'company';
  label: string = 'Company';
  description: string = 'Company App';
  requiredAppCapability = app.READ;

  createUI(ctx: app.OSContext) {
    return (<UIApplication osContext={ctx} appRegistry={this} />);
  };
}
