import React from 'react'
import { widget, app } from 'components'

import {
  WComplexEntityEditor, ComplexBeanObserver
} from 'core/widget';

import {
  UINewAccountEditor, UIConvertAccountEditor, AccountType
} from "module/account";
import { UINewAccountEditorPlugin } from "module/account/UINewAccount";
import { T, HRRestURL } from 'module/company/hr/Dependency'

export class UINewEmployeeAccountEditorPlugin extends UINewAccountEditorPlugin {
  createAdditionalTabs(_appCtx: app.AppContext, _pageCtx: app.PageContext, _observer: ComplexBeanObserver) {
    const { Tab } = widget.layout;
    let tabs = [
      <Tab className='p-2' name='employee' label='Employee'>
      </Tab>
    ];
    return tabs;
  }
}
export class UINewEmployeeEditor extends WComplexEntityEditor {
  render() {
    let { appContext, pageContext, observer, onPostCommit } = this.props;
    let plugin = new UINewEmployeeAccountEditorPlugin();
    const { TabPane, Tab } = widget.layout;
    let html = (
      <TabPane>
        <Tab className='p-2' name='new' label={T('New')} active>
          <UINewAccountEditor
            plugin={plugin} appContext={appContext} pageContext={pageContext}
            label={T('New Employee')} observer={observer}
            commitURL={HRRestURL.employee.create}
            onPostCommit={onPostCommit}
            accountTypesOptions={[AccountType.USER]} />
        </Tab>
        <Tab className='p-2' name='convert' label={T('Convert')}>
          <UIConvertAccountEditor
            plugin={plugin} appContext={appContext} pageContext={pageContext}
            label={T('Convert An Account To Employee')} observer={new ComplexBeanObserver({})}
            commitURL={HRRestURL.employee.create}
            onPostCommit={onPostCommit} />
        </Tab>
      </TabPane>
    );
    return html;
  }
}