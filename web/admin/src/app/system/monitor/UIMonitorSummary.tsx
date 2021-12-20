import { server, widget } from 'components';

import { VGridConfigTool, VGridEntityList, VGridEntityListPlugin } from 'core/widget/vgrid';

import { T } from '../Dependency';

import VGridConfig = widget.grid.VGridConfig;

export class UIMonitorSummaryPlugin extends VGridEntityListPlugin {
  url: any;
  constructor(_url: any) {
    super([]);
    this.url = _url
  }

  loadData(uiList: VGridEntityList<any>): void {
    let callback = (response: server.rest.RestResponse) => {
      let records = response.data.properties;
      this.update(records);
      uiList.markLoading(false);
      uiList.forceUpdate();
    }
    this.serverGet(uiList, this.url, callback);
  }
}

export class UIMonitorSummaryList extends VGridEntityList {

  createVGridConfig(): VGridConfig {
    let config: VGridConfig = {
      record: {
        fields: [
          VGridConfigTool.FIELD_INDEX(),
          { name: 'name', label: T('Name'), width: 300 },
          { name: 'value', label: T('Value'), width: 300 }
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

}