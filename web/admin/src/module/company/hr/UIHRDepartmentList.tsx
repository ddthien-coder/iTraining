import { widget } from 'components'

import { VGridConfigTool, VGridEntityList } from 'core/widget/vgrid';
import { StorageState } from 'core/widget';

import { T, HRDepartmentExplorerPlugin, HRRestURL } from 'module/company/hr/Dependency';

import VGridConfig = widget.grid.VGridConfig;

export class UIHRDepartmentListPlugin extends HRDepartmentExplorerPlugin {
  constructor() {
    super([]);

    this.searchParams = {
      "params": this.createDepartmentOptionalParams(),
      "filters": [
        ...widget.sql.createSearchFilter()
      ],
      "optionFilters": [
        widget.sql.createStorageStateFilter([StorageState.ACTIVE, StorageState.ARCHIVED])
      ],
      "rangeFilters": [
        ...widget.sql.createModifiedTimeFilter()
      ],
      "orderBy": {
        "fields": ["name", "modifiedTime"],
        "fieldLabels": [T("Name"), T("Modified Time")],
        "selectFields": [],
        "sort": "DESC"
      },
      "maxReturn": 1000
    }
  }

  loadData(uiList: VGridEntityList<any>) {
    this.serverSearch(uiList, HRRestURL.department.search);
  }
}

export class UIHRDepartmentList extends VGridEntityList {
  createVGridConfig(): VGridConfig {
    let config: VGridConfig = {
      record: {
        fields: [
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('label', T('Label'), 200, 'fixed-left'),
          { name: 'name', label: T('Name'), width: 200, state: { visible: false } },
          { name: 'description', label: T('Description'), width: 250 },
        ],
      },
      toolbar: {

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
