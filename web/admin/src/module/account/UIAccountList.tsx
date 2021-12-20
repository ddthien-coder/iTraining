import React from 'react';
import { server, util, widget, app } from 'components';

import { StorageState } from 'core/entity'
import { VGridEntityList, VGridEntityListPlugin, VGridConfigTool } from 'core/widget/vgrid';

import { T, AccountRestURL } from './Dependency';
import { UIAccountExplorer, UIAccountListPageControl } from './UIAccountListControl';
import { WAvatar } from './WAvatar';
import { UIAccountUtil } from './UIAccountUtil';
import { AccountType } from '../account';

import DisplayRecord = widget.grid.model.DisplayRecord;
import VGridConfig = widget.grid.VGridConfig;
import VGridContext = widget.grid.VGridContext;
import PrintConfig = widget.print.PrintConfig;
import PrintCallback = widget.print.PrintCallback;

export class UIAccountListPlugin extends VGridEntityListPlugin {
  constructor() {
    super([]);

    this.searchParams = {
      "filters": widget.sql.createSearchFilter(),
      "optionFilters": [
        {
          "name": "accountType", "label": "Account Type", "type": "STRING", "required": true,
          "options": ["", "USER", "ORGANIZATION"],
          "optionLabels": ["All", "User", "Organization"],
          "selectOption": ""
        },
        widget.sql.createStorageStateFilter([StorageState.ACTIVE, StorageState.ARCHIVED])
      ],
      "rangeFilters": [
        ...widget.sql.createModifiedTimeFilter()
      ],
      "orderBy": {
        fields: ["loginId", "fullName", "modifiedTime"],
        fieldLabels: ["Login Id", "Full Name", "Modified Time"],
        selectFields: ["loginId"],
        sort: "ASC"
      },
      "maxReturn": 1000
    }
  }

  withGroup(groupId: number | null) {
    return this.addSearchParam('groupId', groupId);
  }

  withAccountType(accountType: AccountType | undefined) {
    if (accountType) {
      if (this.searchParams) {
        this.searchParams.optionFilters =
          [
            {
              "name": "accountType", "label": "Account Type", "type": "STRING", "required": true,
              "options": ["", "USER", "ORGANIZATION"],
              "optionLabels": ["All", "User", "Organization"],
              "selectOption": accountType
            }
          ]
      }
    }
    return this;
  }

  loadData(uiList: VGridEntityList<any>) {
    this.serverSearch(uiList, AccountRestURL.account.search);
  }
}

export class UIAccountList extends VGridEntityList {
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
          VGridConfigTool.FIELD_ON_SELECT('loginId', T('Login Id'), 250),

          { name: 'fullName', label: T('Full Name'), width: 150 },
          { name: 'mobile', label: T('Mobile'), width: 120 },
          { name: 'email', label: T('Email'), width: 250 },
          {
            name: 'lastLoginTime', label: T('Last Login Time'), width: 180, state: ({ visible: false }),
            format: util.text.formater.compactDateTime
          },
          ...VGridConfigTool.FIELD_ENTITY
        ]
      },
      toolbar: {
        actions: [
          ...VGridConfigTool.TOOLBAR_CHANGE_STORAGE_STATES(
            AccountRestURL.account.saveState,
            [StorageState.ACTIVE, StorageState.INACTIVE, StorageState.ARCHIVED, StorageState.DEPRECATED], readOnly
          )
        ],

        filters: VGridConfigTool.TOOLBAR_FILTERS(addDbSearchFilter),

      },
      control: {
        label: 'Account Groups',
        width: 200,
        render: (ctx: VGridContext) => {
          let uiAccountList = ctx.uiRoot as UIAccountList;
          let { appContext, pageContext, plugin } = uiAccountList.props;
          let pluginImpl = plugin as UIAccountListPlugin;
          return (
            <UIAccountExplorer appContext={appContext} pageContext={pageContext} plugin={pluginImpl} context={ctx} />
          );
        }
      },
      footer: {
        page: {
          hide: type !== 'page',
          render: (ctx: VGridContext) => {
            let uiAccountList = ctx.uiRoot as UIAccountList;
            let { appContext, pageContext } = uiAccountList.props;
            return (<UIAccountListPageControl appContext={appContext} pageContext={pageContext} context={ctx} />);
          }
        },
        selector: VGridConfigTool.FOOTER_MULTI_SELECT("Select Accounts", type)
      },
      view: {
        currentViewName: 'table',
        availables: {
          table: {
            viewMode: 'table'
          },
          grid: {
            viewMode: 'grid',
            rowHeight: 85,
            renderRecord: (_ctx: VGridContext, dRecord: DisplayRecord) => {
              let account = dRecord.record;
              return (
                <div className='flex-hbox m-1'>
                  <WAvatar loginId={account.loginId} width={65} />
                  <div className='p-1'>
                    <div>{account.fullName}</div>
                    <div>[{account.loginId}]</div>
                  </div>
                </div>
              );
            }
          },
          print: {
            viewMode: 'print',
            label: 'Print',
            currentPrintName: 'activities',
            prints: [
              { name: 'activities', label: 'Activities' },
              { name: 'statistics', label: 'Statistics' }
            ],
            loadPrint: (
              ctx: VGridContext, config: PrintConfig, reportType: string, reportCallback: PrintCallback) => {
              let uiAccountList = ctx.uiRoot as UIAccountList;
              let plugin = uiAccountList.props.plugin as UIAccountListPlugin;
              let { appContext } = uiAccountList.props;
              let callback = (response: server.rest.RestResponse) => {
                let storeInfo = response.data;
                let viewReportUrl = app.host.CONFIG.createServerLink(`/get/store/${storeInfo.storeId}`);
                reportCallback('success', viewReportUrl, "Load Report Success");
              }
              let loadReportUrl = AccountRestURL.account.printURL(config.name, reportType);
              appContext.serverPOST(loadReportUrl, plugin.searchParams, callback);
            }
          }
        },
      }
    }
    return config;
  }

  onDefaultSelect(dRecord: DisplayRecord) {
    let account = dRecord.record;
    UIAccountUtil.showAccountInfo(this, account.loginId, false);
  }

  filterByGroup(group: any) {
    let { plugin } = this.props;
    let context = this.getVGridContext();
    context.withAttr('currentGroup', group);
    let groupId = group ? group.id : null;
    (plugin as UIAccountListPlugin).withGroup(groupId);
    this.reloadData();
  }
}