import React from 'react'
import { app, server, widget } from 'components';

import { ComplexBeanObserver, ModifyBeanActions, StorageState } from "core/entity";
import { VGridConfigTool, VGridEntityList, VGridEntityListPlugin, WGridEntityListProps } from 'core/widget/vgrid';

import { PermissionRestURL, T } from './Dependency';
import { UIEmployeeList, UIEmployeeListPlugin } from 'module/company/hr/UIEmployeeList';

import VGridConfig = widget.grid.VGridConfig;
import VGridContext = widget.grid.VGridContext;

export class UIPermissionListPlugin extends VGridEntityListPlugin {
  constructor(app: any, accessType: 'Employee' | 'Partner') {
    super([]);
    this.searchParams = {
      params: { appId: app.id, accessType: accessType },
      filters: [
        ...widget.sql.createSearchFilter()
      ],
      optionFilters: [
        widget.sql.createStorageStateFilter([StorageState.ACTIVE, StorageState.ARCHIVED])
      ],
      orderBy: {
        fields: ["code", "modifiedTime"],
        fieldLabels: ["Code", "Modified Time"],
        selectFields: [],
        sort: "DESC"
      },
      maxReturn: 1000,
    }
  }

  loadData(uiList: VGridEntityList<any>): void {
    this.serverSearch(uiList, PermissionRestURL.permissions.search);
  }
}

interface UIPermissionListProps extends WGridEntityListProps {
  observer: ComplexBeanObserver;
  accessType: 'Employee' | 'Partner';
}
export class UIPermissionList extends VGridEntityList<UIPermissionListProps> {

  constructor(props: UIPermissionListProps) {
    super(props);
  }
  createVGridConfig(): VGridConfig {

    let config: VGridConfig = {
      record: {
        fields: [
          ...VGridConfigTool.FIELD_SELECTOR(this.needSelector()),
          VGridConfigTool.FIELD_INDEX(),
          { name: 'loginId', label: T('Login Id'), width: 200 },
          { name: 'capability', label: T('Min Capability') },
          { name: 'appRole', label: T('Role'), width: 200, state: { visible: false } },
          { name: 'appRoleLabel', label: T('Role Label'), width: 200 },
          { name: 'companyId', label: T('Company'), state: { visible: false }, width: 100, },
          { name: 'accessType', label: T('Type'), state: { visible: false } },
          { name: 'appModule', label: T('App Module'), width: 200 },
          { name: 'appName', label: T('App Name'), state: { visible: false } },
        ]
      },

      toolbar: {
        actions: [
          {
            name: "add-read", label: T('Read'), icon: widget.fa.fas.faPlus,
            onClick: (ctx: VGridContext) => {
              let uiRoot = ctx.uiRoot as UIPermissionList;
              uiRoot.onAdd("Read");
            }
          },
          {
            name: "add-write", label: T('Write'), icon: widget.fa.fas.faPlus,
            onClick: (ctx: VGridContext) => {
              let uiRoot = ctx.uiRoot as UIPermissionList;
              uiRoot.onAdd("Write");
            }
          },
          {
            name: "add-moderator", label: T('Moderator'), icon: widget.fa.fas.faPlus,
            onClick: (ctx: VGridContext) => {
              let uiRoot = ctx.uiRoot as UIPermissionList;
              uiRoot.onAdd("Moderator");
            }
          },
          {
            name: "add-admin", label: T('Admin'), icon: widget.fa.fas.faPlus,
            onClick: (ctx: VGridContext) => {
              let uiRoot = ctx.uiRoot as UIPermissionList;
              uiRoot.onAdd("Admin");
            }
          },
          {
            name: "change-role", label: T('Change Role'), icon: widget.fa.fas.faEdit,
            onClick: (ctx: VGridContext) => {
              let uiRoot = ctx.uiRoot as UIPermissionList;
              uiRoot.onChangeRole();
            }
          },
          ...VGridConfigTool.TOOLBAR_ON_DELETE(!this.hasModeratorCapability, T("Remove"))
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

  onDeleteAction() {
    let { appContext, plugin, onModifyBean } = this.props;
    const successCB = (_response: server.rest.RestResponse) => {
      plugin.getListModel().removeSelectedDisplayRecords();
      if (onModifyBean) onModifyBean(plugin.getListModel().getRecords(), ModifyBeanActions.DELETE);
      else this.forceUpdate();

      appContext.addOSNotification("success", T(`Delete App Permission Success`));
    }
    let permissionIds = plugin.getListModel().getSelectedRecordIds();
    appContext.serverDELETE(PermissionRestURL.permissions.delete, permissionIds, successCB);
  }

  onChangeRole() {
    const { observer, appContext, pageContext, plugin, accessType } = this.props;

    const selectedAppPermissions = plugin.getListModel().getSelectedRecords();
    if (selectedAppPermissions.length === 0) {
      return null;
    }

    const appRoles = observer.getComplexArrayProperty('roles', []);
    let popupPageCtx = new app.PageContext(new widget.layout.DialogContext());

    const onSelect = (role: any) => {
      let permissions = [];
      for (let i = 0; i < selectedAppPermissions.length; i++) {
        const appPermission = selectedAppPermissions[i];
        permissions.push(
          {
            app: observer.getMutableBean(),
            accessType: accessType,
            loginId: appPermission.loginId,
            capability: appPermission.capability,
            appRole: role.role,
            appRoleLabel: role.label
          }
        )
      }

      const onCallBack = (_response: server.rest.RestResponse) => {
        popupPageCtx.onClose();
        appContext.addOSNotification("success", T(`Change App Permission Role Successfully`));
        this.forceUpdate();
      }
      appContext.serverPUT(PermissionRestURL.permissions.save, permissions, onCallBack);
    }
    const html = (
      <UIAppRoleList
        plugin={new VGridEntityListPlugin(appRoles)} readOnly={true}
        appContext={appContext} pageContext={pageContext}
        onSelect={(_appContext, _pageContext, role) => onSelect(role)} />
    )
    widget.layout.showDialog(T('Add New Employee'), 'xl', html, popupPageCtx.getDialogContext());
  }

  onAdd(capability: any) {
    let html = null;
    let { appContext } = this.props;

    let onMultiSelect = (pageContext: app.PageContext, options: Array<any>) => {
      if (!options || options.length === 0) return null;
      let { appContext, observer, accessType, plugin } = this.props;
      const app = observer.getMutableBean();
      let permissions = [];
      for (let i = 0; i < options.length; i++) {
        let option = options[i];
        permissions.push(
          { app: app, accessType: accessType, loginId: option.loginId, capability: capability }
        )
      }
      const onReceiveData = (result: server.rest.RestResponse) => {
        let permissions = result.data;
        let appAccessPermissions = [];
        for (let i = 0; i < permissions.length; i++) {
          let permission = permissions[i];
          appAccessPermissions.push(
            { appModule: app.module, appName: app.name, companyId: permission.companyId, loginId: permission.loginId, accessType: accessType, capability: capability, id: permission.id }
          )
        }
        plugin.getListModel().addRecords(appAccessPermissions);
        pageContext.onBack();
        appContext.addOSNotification("success", T(`Add App Permission Success`));
        this.forceUpdate();
      }
      appContext.serverPUT(PermissionRestURL.permissions.save, permissions, onReceiveData);
    }
    let popupPageCtx = new app.PageContext(new widget.layout.DialogContext());
      // const excludeRecordsFilter = new ExcludeRecordFilter(plugin.getListModel().getRecords(), 'loginId', 'loginId');
      html = (
        <div className='flex-vbox'>
          <UIEmployeeList
            type={'selector'}
            plugin={new UIEmployeeListPlugin()}
            appContext={appContext} pageContext={popupPageCtx} readOnly={true}
            onSelect={(_appCtx, pageCtx, employee) => onMultiSelect(pageCtx, [employee])}
            onMultiSelect={(_appCtx, pageCtx, employees) => onMultiSelect(pageCtx, employees)} />
        </div>
      )
    widget.layout.showDialog(T('Add New Employee'), 'xl', html, popupPageCtx.getDialogContext());
    return html;
  }
}

class UIAppRoleList extends VGridEntityList {
  createVGridConfig() {
    let config: VGridConfig = {
      record: {
        fields: [
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