import React from 'react'
import { app, server, widget } from 'components';

import { IStorage, UserStorage } from './Storage';
import { WUploadResourceList, UploadResource } from './WUploadResource';
import { popupUIPreview } from './utilities';
import { VGridConfigTool, VGridEntityList, VGridEntityListPlugin, WGridEntityListProps } from 'core/widget/vgrid';
import { T } from './Dependency';

import VGridConfig = widget.grid.VGridConfig;
import VGridContext = widget.grid.VGridContext;
import { UIStorageDirectoryExplorer } from './UIStorage';
import { StorageState } from 'core/widget';

export class UIDirectoryListPlugin extends VGridEntityListPlugin {
  storage: IStorage;
  path: string | null;

  constructor(storage: IStorage, path: string | null) {
    super([]);
    this.storage = storage;
    this.path = path;
    this.searchParams = {
      "params": { path: null },
      "filters": [
        ...widget.sql.createSearchFilter()
      ],
      "optionFilters": [
        widget.sql.createStorageStateFilter([StorageState.ACTIVE, StorageState.ARCHIVED]),
      ],
      "rangeFilters": [
        ...widget.sql.createModifiedTimeFilter()
      ],
      "orderBy": {
        "fields": ["modifiedTime"],
        "fieldLabels": ["Modified Time"],
        "selectFields": ["modifiedTime"],
        "sort": "DESC"
      },
      "maxReturn": 1000
    }
  }

  withPath(path: string | null) {
    return this.addSearchParam("path", path);
  }

  loadData(uiList: VGridEntityList<any>) {
    let { appContext } = uiList.props;
    const callback = (result: any) => {
      let directory: any = result.data;
      this.update(directory.children);
      uiList.markLoading(false);
      uiList.forceUpdate();
    }
    let params = { path: this.path ? this.path : '/', loadChildren: true };
    appContext.serverGET(this.storage.getRestPath(), params, callback);
  }
}

export class UIDirectoryList extends VGridEntityList<WGridEntityListProps> {
  createVGridConfig() {
    const config: VGridConfig = {
      record: {
        fields: [
          ...VGridConfigTool.FIELD_SELECTOR(this.needSelector()),
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('name', T('Name'), 250),
          { name: 'type', label: 'Type', width: 200 },
          { name: 'path', label: 'Path', width: 200 },
          { name: 'size', label: 'Size', width: 200 },
          { name: 'createdBy', label: 'Created By', width: 200 },
          { name: 'modifiedBy', label: 'Modified By', width: 200 },
          { name: 'modifiedTime', label: 'Modified Time', width: 200 }
        ]
      },
      toolbar: {
        actions: [
          {
            name: "upload", label: T('Upload'), icon: widget.fa.fas.faPlus,
            onClick: (ctx: VGridContext) => {
              let uiRoot = ctx.uiRoot;
              let uiList = uiRoot as UIDirectoryList;
              uiList.onShowUpload()
            }
          },
          {
            name: "preview", label: T('Preview'), icon: widget.fa.fas.faPlus,
            onClick: (ctx: VGridContext) => {
              let uiRoot = ctx.uiRoot;
              let snode: any;
              let uiList = uiRoot as UIDirectoryList;
              uiList.onPreview(snode)
            }
          },
        ],

      },
      control: {
        label: 'Directory',
        width: 200,
        render: (ctx: VGridContext) => {
          let uiDirectoryList = ctx.uiRoot as UIDirectoryList;
          let { appContext, pageContext, plugin } = uiDirectoryList.props;
          let pluginImpl = plugin as UIDirectoryListPlugin;
          return (
            <UIStorageDirectoryExplorer storage={new UserStorage()}
              appContext={appContext} pageContext={pageContext} plugin={pluginImpl} context={ctx} />
          );
        }
      },
      view: {
        currentViewName: 'table',
        availables: {
          table: {
            viewMode: 'table'
          }
        },
      }
    }
    return config;
  }

  onShowUpload() {
    let { appContext } = this.props;
    let newPageCtx = new app.PageContext(new widget.layout.DialogContext())
    let rest = appContext.getServerContext().getRestClient();
    let content = (
      <div className='flex-vbox' style={{ height: 500 }}>
        <WUploadResourceList
          appContext={appContext} pageContext={newPageCtx} multiple={true} rest={rest} onUpload={this.onUpload} />
      </div>
    );
    widget.layout.showDialog('Upload', 'md', content, newPageCtx.getDialogContext());
  }

  onUpload = (uploadResources: Array<UploadResource>) => {
    let { appContext, plugin } = this.props;
    let pluginImpl = plugin as UIDirectoryListPlugin;
    let successCB = (_response: server.rest.RestResponse) => {
      appContext.addOSNotification("success", "Save file successfully");
      this.loadData();
    }
    let failCB = (response: server.rest.RestResponse) => {
      appContext.addOSNotification("danger", "Save file fail", null, response);
    }
    let uploadReq = { storagePath: pluginImpl.path, uploadResources: uploadResources };
    appContext.serverPOST(pluginImpl.storage.getRestUploadPath(), uploadReq, successCB, failCB);
  }

  onPreview(snode: any) {
    popupUIPreview(this.props, '/storage/content/system', { path: snode.path });
  }

  filterPath(path: any) {
    let { plugin } = this.props;
    let context = this.getVGridContext();
    context.withAttr('path', path);
    let paths = path ? path.path : null;
    (plugin as UIDirectoryListPlugin).withPath(paths);
    this.reloadData();
  }
}
