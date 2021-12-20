import React, { Component } from 'react';
import { widget, app } from 'components';

import { WEntity } from 'core/widget';
import { VGridEntityListEditor, VGridConfigTool, VGridEntityList } from 'core/widget/vgrid';

import { T, LoginPermissionOptions as LoginOptions } from 'module/company/hr/Dependency';
import { UIEmployeeList, UIEmployeeListPlugin } from 'module/company/hr/UIEmployeeList';
import VGridConfig = widget.grid.VGridConfig;
import VGridContext = widget.grid.VGridContext;
const { BBStringField } = widget.input;
const { Form, FormGroup } = widget.input;

export interface BBWidgetInputSelectProps {
  bean: any, field: string, fieldCheck?: string, fieldLabel?: string, disable?: boolean,
  onInputChange?: (bean: any, field: string, oldVal: any, newVal: any) => void
}
class BBPermissionCapabilityType extends Component<BBWidgetInputSelectProps> {
  render() {
    let { bean, field, onInputChange, disable } = this.props;
    const types = ['None', 'Read', 'Write', 'Moderator', 'Admin'];
    const typeLabels = [T('None'), T('Read'), T('Write'), T('Moderator'), T('Admin')];
    return (
      <widget.input.BBSelectField
        bean={bean} field={field} options={types} optionLabels={typeLabels} disable={disable}
        onInputChange={onInputChange} />
    );
  }
}
export class UILoginPermissionForm extends WEntity {
  render() {
    let { observer, readOnly } = this.props;
    let permission = observer.getMutableBean();
    let options = [LoginOptions.EMPLOYEE, LoginOptions.PARTNER];
    let labels = [T('Employee'), T('Partner')];

    let html = (
      <Form>
        <FormGroup label={T('Type')}>
          <widget.input.BBSelectField
            bean={permission} field={'type'} options={options} optionLabels={labels} disable={readOnly} />
        </FormGroup>
        <FormGroup label={T('Login Id')}>
          <BBStringField bean={permission} field={'loginId'} disable={readOnly || !observer.isNewBean()} />
        </FormGroup>
        <FormGroup label={T('Label')}>
          <BBStringField bean={permission} field={'label'} disable={readOnly} />
        </FormGroup>
        <FormGroup label={T('Capability')}>
          <BBPermissionCapabilityType bean={permission} field={'capability'} disable={readOnly} />
        </FormGroup>
      </Form>
    );
    return html;
  }
}

export class UILoginPermissionListEditor extends VGridEntityListEditor {
  renderBeanEditor() {
    let { appContext, pageContext, readOnly } = this.props;
    let observer = this.createBeanObserver();
    return (
      <UILoginPermissionForm
        appContext={appContext} pageContext={pageContext} observer={observer} readOnly={readOnly} />
    );
  }

  createVGridConfig() {
    let { readOnly } = this.props;
    if (readOnly === undefined) {
      readOnly = false;
    }
    let config: VGridConfig = {
      record: {
        fields: [
          ...VGridConfigTool.FIELD_SELECTOR(this.needSelector()),
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('label', T('Label'), 200),

          { name: 'loginId', label: T('Login Id') },
          { name: 'type', label: T('Type'), width: 120 },
          { name: 'capability', label: T('Capability'), width: 200 }
        ]
      },
      toolbar: {
        actions: [
          ...VGridConfigTool.TOOLBAR_ON_DELETE(readOnly, "Del"),
          {
            name: "addEmployee", label: T('Employee'), icon: widget.fa.fas.faPlus,
            onClick: (ctx: VGridContext) => {
              let uiParent = ctx.uiRoot as UILoginPermissionListEditor;
              uiParent.onAdd(LoginOptions.EMPLOYEE);
            }
          }
        ]
      },
      view: {
        currentViewName: 'table',
        availables: {
          table: {
            viewMode: 'table'
          }
        }
      }
    }
    return config;
  }

  onAdd(type: LoginOptions.EMPLOYEE | LoginOptions.PARTNER) {
    let { plugin, appContext } = this.props;
    let onMultiSelect = (pageCtx: app.PageContext, employees: Array<any>) => {
      let permissions: Array<any> = [];
      for (let employee of employees) {
        let perm = { type: type, loginId: employee.loginId, label: employee.label, capability: 'Write' };
        permissions.push(perm);
      }
      plugin.getModel().addRecords(permissions);
      pageCtx.onBack();
      this.forceUpdate();
    }
    let popupPageCtx = this.newPopupPageContext();
    if (type == LoginOptions.EMPLOYEE) {
      let html = (
        <UIEmployeeList
          type={'selector'}
          plugin={new UIEmployeeListPlugin().withExcludeRecords(plugin.getModel().getRecords())}
          appContext={appContext} pageContext={popupPageCtx} readOnly={true}
          onSelect={(_appCtx, pageCtx, employee) => onMultiSelect(pageCtx, [employee])}
          onMultiSelect={(_appCtx, pageCtx, employees) => onMultiSelect(pageCtx, employees)} />
      );
      widget.layout.showDialog(T('Add Employees'), 'lg', html, popupPageCtx.getDialogContext());
    }
  }
}

export class UILoginPermissionListSelector extends VGridEntityList {
  createVGridConfig() {
    let { readOnly, type } = this.props;
    if (readOnly === undefined) {
      readOnly = false;
    }
    let config: VGridConfig = {
      record: {
        fields: [
          ...VGridConfigTool.FIELD_SELECTOR(this.needSelector()),
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('label', T('Label'), 200),

          { name: 'loginId', label: T('Login Id') },
          { name: 'type', label: T('Type'), width: 120 },
          { name: 'capability', label: T('Capability'), width: 200 }
        ]
      },
      toolbar: {
        actions: []
      },
      footer: {
        selector: VGridConfigTool.FOOTER_MULTI_SELECT(T("Select Employee"), type)
      },
      view: {
        currentViewName: 'table',
        availables: {
          table: {
            viewMode: 'table'
          }
        }
      }
    }
    return config;
  }
}