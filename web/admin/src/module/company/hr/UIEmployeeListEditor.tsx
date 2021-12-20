import React from 'react';
import { app, widget } from 'components';

import {
  VGridEntityListEditor, VGridConfigTool
} from 'core/widget/vgrid';

import { T } from 'module/company/hr/Dependency';
import { UIEmployeeList, UIEmployeeListPlugin } from 'module/company/hr/UIEmployeeList';

import VGridConfig = widget.grid.VGridConfig;
import VGridContext = widget.grid.VGridContext;
import DisplayRecord = widget.grid.model.DisplayRecord;
import VGridGridViewConfig = widget.grid.VGridGridViewConfig;
export class UIEmployeeListEditor extends VGridEntityListEditor {

  renderBeanEditor() {
    return null;
  }

  createVGridConfig(): VGridConfig {
    let writeCap = this.hasWriteCapability();
    let gridConfig: VGridGridViewConfig = {
      viewMode: 'grid',
      renderRecord: function (_ctx: VGridContext, dRecord: DisplayRecord) {
        let { record } = dRecord;
        let html = (
          <div className='border m-2 h-100'>
            {record.label} [{record.loginId}]
          </div>
        )
        return html;
      }
    };

    let config: VGridConfig = {
      record: {
        fields: [
          ...VGridConfigTool.FIELD_SELECTOR(this.needSelector()),
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('label', T('Label'), 200),
          { name: 'loginId', label: T('login Id'), width: 200 },
          { name: 'description', label: T('Description'), width: 250 },
          { name: 'priority', label: T('Priority'), width: 150 },
          ...VGridConfigTool.FIELD_ENTITY
        ]
      },
      toolbar: {
        actions: [
          ...VGridConfigTool.TOOLBAR_ON_ADD(!writeCap, "Add"),
          ...VGridConfigTool.TOOLBAR_ON_DELETE(!writeCap, "Del"),
        ]
      },
      view: {
        currentViewName: 'table',
        availables: {
          table: {
            viewMode: 'table'
          },
          grid: gridConfig,
        }
      }
    }
    return config;
  }

  onNewAction() {
    let { appContext, plugin } = this.props;
    let onMultiSelect = (pageCtx: app.PageContext, employees: Array<any>) => {
      plugin.getModel().addRecords(employees);
      pageCtx.onBack();
      this.forceUpdate();
    }
    let popupPageCtx = this.newPopupPageContext();
    let html = (
      <div className='flex-vbox'>
        <UIEmployeeList
          type={'selector'}
          plugin={new UIEmployeeListPlugin().withExcludeRecords(plugin.getModel().getRecords())}
          appContext={appContext} pageContext={popupPageCtx} readOnly={true}
          onSelect={(_appCtx, pageCtx, employee) => onMultiSelect(pageCtx, [employee])}
          onMultiSelect={(_appCtx, pageCtx, employees) => onMultiSelect(pageCtx, employees)} />
      </div>
    );
    widget.layout.showDialog(T('Add New Employee'), 'xl', html, popupPageCtx.getDialogContext());
    return html;
  }
}