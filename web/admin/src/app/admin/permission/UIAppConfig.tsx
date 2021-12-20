import React from 'react';
import { widget, util } from 'components';

import {
  WButtonEntityCommit, WButtonEntityReset, WComplexEntity, WComplexEntityEditor, WEntity, WToolbar
} from 'core/widget';

import { PermissionRestURL, T } from './Dependency';
import { UIPermissionList, UIPermissionListPlugin } from './UIAppPermissionList';
import { VGridConfigTool, VGridEntityListEditor } from 'core/widget/vgrid';

import VGridConfig = widget.grid.VGridConfig;

const { IDTracker } = util;
const { VSplit, VSplitPane, HSplit, HSplitPane } = widget.component;
const { Form, FormGroup, BBStringField, BBSelectField, BBTextField } = widget.input;
class UIAppRoleForm extends WEntity {
  render() {
    let { observer, readOnly } = this.props;
    let reference = observer.getMutableBean();
    let errorCollector = observer.getErrorCollector();
    return (
      <Form>
        <FormGroup label={T('Label')}>
          <BBStringField bean={reference} field={'label'} disable={readOnly} 
          required errorCollector={errorCollector}/>
        </FormGroup>
        <FormGroup label={T('Role')}>
          <BBStringField bean={reference} field={'role'} disable={readOnly || !observer.isNewBean()} 
          required errorCollector={errorCollector} />
        </FormGroup>
      </Form>
    );
  }
}

export class UIAppRoleListEditor extends VGridEntityListEditor {
  renderBeanEditor() {
    let { appContext, pageContext, readOnly } = this.props;
    let observer = this.createBeanObserver();
    return (
      <UIAppRoleForm appContext={appContext} pageContext={pageContext} observer={observer} readOnly={readOnly} />
    );
  }

  createVGridConfig() {
    let config: VGridConfig = {
      record: {
        fields: [
          ...VGridConfigTool.FIELD_SELECTOR(this.needSelector()),
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('label', T('Label'), 250),
          { name: 'role', label: T('Role'), width: 250 },
        ]
      },

      toolbar: {
        actions: [
          ...VGridConfigTool.TOOLBAR_ON_ADD(!this.hasAdminCapability, T("Add")),
          ...VGridConfigTool.TOOLBAR_ON_DELETE(!this.hasAdminCapability, T("Remove"))
        ],
      },
      view: {
        currentViewName: 'table',
        availables: {
          table: {
            viewMode: 'table'
          },
        }
      },
    };
    return config;
  }
}

class UIAppFrom extends WComplexEntity {
  render() {
    let { observer, appContext, pageContext } = this.props;
    let capability = ['None', 'Read', 'Write', 'Admin'];
    let capabilityLabel = [T('None'), T('Read'), T('Write'), T('Admin')];
    let app = observer.getMutableBean();

    return (
      <HSplit>
        <HSplitPane title={T('App')} titleShow heightGrow={0}>
          <Form className='flex-vbox p-1'>
            <FormGroup label={T("Name")}>
              <BBStringField bean={app} field={"label"} disable />
            </FormGroup>
            <FormGroup label={T("Module")}>
              <BBStringField bean={app} field={"module"} disable />
            </FormGroup>
            <FormGroup label={T("Min Required Capability")}>
              <BBSelectField bean={app} field={"requiredCapability"} optionLabels={capabilityLabel}
                options={capability} />
            </FormGroup>
            <FormGroup label={T("Company App")}>
              <BBStringField bean={app} field={"companyApp"} />
            </FormGroup>
            <FormGroup label={T("Label")}>
              <BBStringField bean={app} field={"label"} />
            </FormGroup>
            <FormGroup label={T("Description")}>
              <BBTextField bean={app} field={"description"} />
            </FormGroup>
          </Form>
        </HSplitPane>
        <HSplitPane title={T('Role')} titleShow>
          <UIAppRoleListEditor
            plugin={observer.createVGridEntityListEditorPlugin('roles')}
            appContext={appContext} pageContext={pageContext}
            dialogEditor={true} editorTitle={"Role"} />
        </HSplitPane>
      </HSplit>

    );
  }
}

export class UIAppConfig extends WComplexEntityEditor {

  render() {
    let { appContext, pageContext, observer } = this.props;
    let app = observer.getMutableBean();
    let renderId = IDTracker.next();
    let writeCap = this.hasWriteCapability();

    let { TabPane, Tab } = widget.layout;
    let html = (
      <VSplit>
        <VSplitPane width={'40%'} className='px-1'>
          <UIAppFrom observer={observer} appContext={appContext} pageContext={pageContext} readOnly={!writeCap} />
          <WToolbar>
            <WButtonEntityCommit
              appContext={appContext} pageContext={pageContext} hide={!writeCap} observer={observer}
              label={T('Add/Edit Save App Permission')}
              commitURL={PermissionRestURL.app.save} />
            <WButtonEntityReset
              appContext={appContext} pageContext={pageContext} hide={!writeCap} observer={observer}
              onPostRollback={this.onPostRollback} />
          </WToolbar>
        </VSplitPane>
        <VSplitPane className='px-1'>
          <h4>Permission</h4>
          <TabPane>
            <Tab name="employees" label={T('Employees')} active={true} >
              <UIPermissionList appContext={appContext} pageContext={pageContext}
                observer={observer} accessType={'Employee'}
                plugin={new UIPermissionListPlugin(app, 'Employee')} />
            </Tab>
            <Tab name="partners" label={T('Partners')} >
              <UIPermissionList appContext={appContext} pageContext={pageContext}
                observer={observer} accessType={'Partner'}
                key={renderId}
                plugin={new UIPermissionListPlugin(app, 'Partner')} />
            </Tab>
          </TabPane>
        </VSplitPane>
      </VSplit>
    );
    return html;
  }
}
