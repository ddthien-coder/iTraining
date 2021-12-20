import React from 'react'
import { server, widget } from 'components'

import { ComplexBeanObserver } from 'core/entity';
import {
  VGridConfigTool, VGridEntityList, VGridEntityListPlugin
} from 'core/widget/vgrid';

import { PermissionRestURL, T } from './Dependency';
import { UIAppConfig } from './UIAppConfig';

import DisplayRecord = widget.grid.model.DisplayRecord;
import VGridConfig = widget.grid.VGridConfig;
export class UIAppListPlugin extends VGridEntityListPlugin {

  loadData(uiList: VGridEntityList<any>) {
    let { appContext } = uiList.props;
    const callback = (response: server.rest.RestResponse) => {
      let records = response.data;
      this.getListModel().update(records);
      uiList.markLoading(false);
      uiList.forceUpdate();
    };
    uiList.markLoading(true);
    appContext.serverGET(PermissionRestURL.app.search, {}, callback);
  }

}
export class UIAppList extends VGridEntityList {
  createVGridConfig(): VGridConfig {
    let config: VGridConfig = {
      record: {
        fields: [
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('label', T('Label'), 200),
          { name: 'module', label: T('Module') },
          { name: 'name', label: T('Name') },
          { name: 'requiredCapability', label: T('Capability') },
          { name: 'description', label: T('Description') },
          ...VGridConfigTool.FIELD_ENTITY
        ]
      },

      toolbar: {
        actions: [
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

  onDefaultSelect(dRecord: DisplayRecord) {
    let app = dRecord.record;
    let { appContext, pageContext } = this.props;
    let successCB = (response: server.rest.RestResponse) => {
      let modelObserver = new ComplexBeanObserver(response.data);
      let html = (<UIAppConfig appContext={appContext} pageContext={pageContext} observer={modelObserver} />)
      pageContext.onAdd('detail', `App Permission ${response.data.name}`, html);
    }
    appContext.serverGET(PermissionRestURL.app.load(app.module, app.name), {}, successCB);
  }
}
