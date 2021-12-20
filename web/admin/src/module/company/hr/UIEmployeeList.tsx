import React from 'react';
import { widget } from 'components'

import { VGridConfigTool, VGridEntityList } from 'core/widget/vgrid';
import { StorageState } from 'core/widget';

import { T, WAvatar, HRDepartmentExplorerPlugin, HRRestURL } from './Dependency';
import { UIHRDepartmentEmployeeExplorer } from './UIHRDepartmentExplorer';
import { UIEmployeeListPageControl } from './UIEmployeeListControl';
import { UIEmployeeUtil } from './UIEmployee';

import DisplayRecord = widget.grid.model.DisplayRecord;
import VGridConfig = widget.grid.VGridConfig;
import VGridContext = widget.grid.VGridContext;
import FieldConfig = widget.grid.FieldConfig;

export class UIEmployeeListPlugin extends HRDepartmentExplorerPlugin {
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
        "fields": ["loginId", "modifiedTime"],
        "fieldLabels": [T("Login Id"), T("Modified Time")],
        "selectFields": ['loginId'],
        "sort": "ASC"
      },
      "maxReturn": 1000
    }
  }

  loadData(uiList: VGridEntityList<any>) {
    this.serverSearch(uiList, HRRestURL.employee.search);
  }
}

export class UIEmployeeList extends VGridEntityList {
  createVGridConfig() {
    let { plugin, readOnly, onMultiSelect, type } = this.props;
    readOnly = readOnly ? true : false;
    let allowSelector = !readOnly || onMultiSelect ? true : false;
    let addDbSearchFilter = plugin.searchParams ? true : false;

    let config: VGridConfig = {
      record: {
        fields: [
          ...VGridConfigTool.FIELD_SELECTOR(allowSelector),
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('label', T('Label'), 250),

          { name: 'loginId', label: T('Login Id'), width: 150 },
          { name: 'priority', label: T('Priority'), width: 150 },
          {
            name: "departments", label: T("Departments"), width: 150,
            customRender: function (_ctx: VGridContext, _field: FieldConfig, dRecord: DisplayRecord) {
              return renderDepartmentsColumn(dRecord.record.departments);
            }
          },
          { name: 'description', label: T('Description'), width: 150 },
          { name: 'companyId', label: T('Company Id'), width: 150 },
          ...VGridConfigTool.FIELD_ENTITY
        ]
      },
      toolbar: {
        actions: [
          ...VGridConfigTool.TOOLBAR_CHANGE_STORAGE_STATES(
            HRRestURL.employee.saveState,
            [StorageState.ACTIVE, StorageState.INACTIVE, StorageState.ARCHIVED, StorageState.DEPRECATED], readOnly
          )
        ],

        filterActions: [
          ...VGridConfigTool.TOOLBAR_AUTO_REFRESH('auto-refresh-employee-list', T('Refresh')),
        ],

        filters: VGridConfigTool.TOOLBAR_FILTERS(addDbSearchFilter),

      },
      control: {
        label: T('Departments'),
        width: 250,
        render: (ctx: VGridContext) => {
          let uiEmployeeList = ctx.uiRoot as UIEmployeeList;
          let { appContext, pageContext, plugin } = uiEmployeeList.props;
          let pluginImpl = plugin as UIEmployeeListPlugin;
          return (
            <UIHRDepartmentEmployeeExplorer
              appContext={appContext} pageContext={pageContext} plugin={pluginImpl} context={ctx} />
          );
        }
      },
      footer: {
        page: {
          hide: type !== 'page',
          render: (ctx: VGridContext) => {
            let uiEmployeeList = ctx.uiRoot as UIEmployeeList;
            let { appContext, pageContext } = uiEmployeeList.props;
            const hasWriteCap = this.hasWriteCapability();
            return (
              <UIEmployeeListPageControl appContext={appContext} pageContext={pageContext}
                context={ctx} readOnly={!hasWriteCap} />
            );
          }
        },
        selector: VGridConfigTool.FOOTER_MULTI_SELECT(T("Select Employee"), type)
      },
      view: {
        currentViewName: 'table',
        availables: {
          table: {
            viewMode: 'table'
          },
          grid: {
            viewMode: 'grid',
            rowHeight: 75,
            renderRecord: (_ctx: VGridContext, dRecord: DisplayRecord) => {
              let employee = dRecord.record;
              return (
                <div className='flex-hbox m-1'>
                  <WAvatar loginId={employee.loginId} width={65} />
                  <div className='p-1'>
                    <div>{employee.fullName}</div>
                    <div>[{employee.loginId}]</div>
                  </div>
                </div>
              );
            }
          },
        },
      }
    }
    return config;
  }

  onDefaultSelect(dRecord: DisplayRecord) {
    let employee = dRecord.record;
    UIEmployeeUtil.showEmployeeInfo(this, employee.loginId, false);
  }

  filterByDepartment(department: any) {
    let { plugin } = this.props;
    let context = this.getVGridContext();
    context.withAttr('currentDepartment', department);
    let departmentId = department ? department.id : null;
    (plugin as HRDepartmentExplorerPlugin).onSelectDepartment(departmentId);
    this.reloadData();
  }
}

export function renderDepartmentsColumn(departments: Array<any>) {
  if (!departments?.length) return '';
  let ui: String = '';
  departments.forEach(department => {
    ui += department.label + ", ";
  }
  );
  if (ui.endsWith(', ')) {
    ui = ui.slice(0, -2);
  }
  return ui;
}
