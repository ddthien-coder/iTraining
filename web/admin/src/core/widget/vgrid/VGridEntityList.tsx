import React, { Component, ReactFragment } from "react";
import { app, widget, server, util } from 'components';

import { BeanObserver, ComplexBeanObserver } from 'core/entity';
import { ExplorerActions, ModifyBeanActions } from "core/entity";

import { WComponent, WComponentProps } from '../WLayout';

import { T } from "../Dependency"
import { RecordFilter, ExcludeRecordIdFilter } from "../WEntityList";

import fas = widget.fa.fas;
import FAButton = widget.fa.FAButton;

import DisplayRecord = widget.grid.model.DisplayRecord;
import VGridConfig = widget.grid.VGridConfig
import VGridContextProps = widget.grid.VGridContextProps
import VGridContext = widget.grid.VGridContext;
import VGridEditor = widget.grid.VGridEditor;
import VGridEditorProps = widget.grid.VGridEditorProps;
import VGridControlConfig = widget.grid.VGridControlConfig;
import VGridControlManager = widget.grid.VGridControlManager;

import TreeNode = widget.list.TreeNode;
import VTree = widget.list.VTree;

export type VGridEntityListType = 'page' | 'selector';

export class VGridEntityListPlugin {
  vgridConfig?: VGridConfig;
  searchParams?: widget.sql.SqlSearchParams;
  listModel: widget.grid.model.ListModel;
  recordFilter?: RecordFilter;

  constructor(records: Array<any> = []) {
    this.listModel = this.createListModel(records);
  }

  protected addSearchParam(name: string, value: any) {
    if (!this.searchParams) throw new Error("search params is not available");
    if (!this.searchParams.params) {
      this.searchParams.params = {};
    }
    if (!value) {
      delete this.searchParams.params[name];
    } else {
      this.searchParams.params[name] = value;
    }
    return this;
  }

  protected removeSearchParam(name: string) {
    if (!this.searchParams) throw new Error("search params is not available");
    if (!this.searchParams.params) {
      this.searchParams.params = {};
    }
    delete this.searchParams.params[name];
    return this;
  }

  withVGridConfig(config: VGridConfig) {
    this.vgridConfig = config;
    return this;
  }

  withRecordFilter(filter?: RecordFilter) {
    this.recordFilter = filter;
    return this;
  }

  withExcludeRecords(records?: Array<any>) {
    if (records) {
      this.recordFilter = new ExcludeRecordIdFilter().addRecords(records);
    }
    return this;
  }

  getVGridConfig(): VGridConfig {
    if (!this.vgridConfig) {
      throw new Error("No Table Config Available");
    }
    return this.vgridConfig;
  }

  getRecords() { return this.listModel.getRecords(); }

  update(records: Array<any>) {
    if (this.recordFilter) {
      records = this.recordFilter.filter(records);
    }
    this.listModel.update(records);
    return this;
  }

  createListModel(records: Array<any>) { return new widget.grid.model.ListModel(records); }

  getListModel() { return this.listModel; }

  loadData(vgrid: VGridEntityList<any>): void {
    // throw new Error('You need to override this method');
    this.update(this.getRecords());
    vgrid.markLoading(false);
  }

  protected serverSearch(
    uiSource: VGridEntityList<any>, postURL: string, callback?: (response: server.rest.RestResponse) => void) {
    let { appContext } = uiSource.props;
    uiSource.markLoading(true);
    appContext.serverPOST(postURL, this.searchParams, this.createCallback(uiSource, callback));
  }

  protected serverGet(
    uiSource: VGridEntityList<any>, url: string, callback?: server.rest.SuccessCallback) {
    let { appContext } = uiSource.props;
    uiSource.markLoading(true);
    appContext.serverGET(url, {}, this.createCallback(uiSource, callback));
  }

  createCallback(vgrid: VGridEntityList<any>, callback?: server.rest.SuccessCallback) {
    let { appContext, pageContext, onLoadData } = vgrid.props;
    if (!callback) {
      callback = (response: server.rest.RestResponse) => {
        let records = response.data;
        vgrid.onPostLoadData(records);
        this.update(records);
        vgrid.markLoading(false);
        if (onLoadData) {
          onLoadData(appContext, pageContext, this.listModel);
        } else {
          vgrid.forceUpdate();
        }
      };
    }
    return callback;
  }
}

export interface VGridComponentProps extends VGridContextProps {
  appContext: app.AppContext;
  pageContext: app.PageContext;
  readOnly?: boolean;
}
export class VGridComponent<T extends VGridComponentProps = VGridComponentProps> extends Component<T> {
}

export interface VGridEntityListProps extends WComponentProps {
  filter?: RecordFilter;
  onSelect?: (appContext: app.AppContext, pageContext: app.PageContext, entity: any) => void;
  onMultiSelect?: (appContext: app.AppContext, pageContext: app.PageContext, entities: Array<any>) => void;
}
export interface WGridEntityListProps extends WComponentProps {
  type?: VGridEntityListType,
  storageState?: 'disk' | 'session' | 'default'
  plugin: VGridEntityListPlugin,
  onSelect?: (appContext: app.AppContext, pageContext: app.PageContext, entity: any) => void;
  onMultiSelect?: (appContext: app.AppContext, pageContext: app.PageContext, entities: Array<any>) => void;
  onModifyBean?: (bean: any | Array<any>, action?: ModifyBeanActions) => void;
  onLoadData?: (appCtx: app.AppContext, pageCtx: app.PageContext, model: widget.grid.model.ListModel) => void;
}

export interface VGridEntityListState {
}
export abstract class VGridEntityList<T extends WGridEntityListProps = WGridEntityListProps, S extends VGridEntityListState = VGridEntityListState> extends WComponent<T, S> {
  protected vgridContext: VGridContext;
  protected viewId = util.common.IDTracker.next();

  constructor(props: T) {
    super(props);
    let { plugin } = props;
    plugin.withVGridConfig(this.createVGridConfig());
    this.vgridContext = this.createVGridContext();
    this.initVGridContext(this.vgridContext);
    this.markLoading(true);
    plugin.loadData(this);
  }

  onPostLoadData(_records: Array<any>) {
  }

  reloadData(_forceReload: boolean = false) {
    let { plugin } = this.props;
    plugin.loadData(this);
  }

  getVGridContext() { return this.vgridContext; }

  protected createVGridContext() {
    let { plugin } = this.props;
    return new VGridContext(this, plugin.getVGridConfig(), plugin.getListModel());
  }

  protected initVGridContext(_context: VGridContext): void {
  }

  protected abstract createVGridConfig(): VGridConfig;

  needSelector() {
    let { pageContext, onMultiSelect } = this.props;
    let writeCap = pageContext.hasUserWriteCapability();
    return writeCap || onMultiSelect ? true : false;
  }

  changeStorageState(restPath: string, ctx: VGridContext, newStorageState: string) {
    let { appContext, plugin } = this.props;
    let listModel = ctx.model;
    let ids = listModel.getSelectedRecordIds();
    let success = (_response: server.rest.RestResponse) => {
      listModel.removeSelectedDisplayRecords();
      this.onPostLoadData(plugin.getListModel().getRecords());
      ctx.getVGrid().forceUpdateView();
    };
    let fail = (_response: server.rest.RestResponse) => { console.log('fail'); };
    let changeStorageStateReq = { entityIds: ids, newStorageState: newStorageState }
    let restClient = appContext.getServerContext().getRestClient();
    restClient.put(restPath, changeStorageStateReq, success, fail);
  }

  onSelect(dRecord: DisplayRecord) {
    let { appContext, pageContext, onSelect } = this.props;
    if (onSelect) {
      onSelect(appContext, pageContext, dRecord.record);
      return;
    }
    this.onDefaultSelect(dRecord);
  }

  onDefaultSelect(_dRecord: DisplayRecord) {
    //You can customize the default select by override this method
  }

  onMultiSelect() {
    let { appContext, pageContext, plugin, onMultiSelect } = this.props;
    if (onMultiSelect) {
      let selectedEntities = plugin.getListModel().getSelectedRecords();
      if (selectedEntities.length == 0) return;
      onMultiSelect(appContext, pageContext, selectedEntities);
    }
  }

  onNewAction() {
    alert("You need to override this method");
  }

  onDeleteAction() {
    alert("You need to override this method");
  }

  render() {
    if (this.isLoading()) return this.renderLoading();
    let context = this.getVGridContext();
    let html = (<widget.grid.VGrid key={`id-${this.viewId}`} context={context} />);
    return html;
  }
}
export interface VGridEntityListEditorProps extends VGridEditorProps, WComponentProps {
  onModifyBean?: (bean: any | Array<any>, action?: ModifyBeanActions) => void;
  onSelect?: (appContext: app.AppContext, pageContext: app.PageContext, entity: any) => void;
}
export class VGridEntityListEditor<T extends VGridEntityListEditorProps = VGridEntityListEditorProps> extends VGridEditor<T> {
  popupPageContext: app.PageContext | null = null;
  currentBeanObserver: BeanObserver | ComplexBeanObserver | null = null;

  newPopupPageContext() {
    const { pageContext } = this.props;
    this.closePopupPageContext();
    this.popupPageContext = pageContext.createPopupPageContext();
    return this.popupPageContext;
  }

  closePopupPageContext() {
    if (this.popupPageContext) {
      this.popupPageContext.onBack();
      this.popupPageContext = null;
    }
  }

  isEditable() {
    const { readOnly } = this.props;
    if (readOnly === undefined) return true;
    return !readOnly;
  }

  needSelector() {
    let { pageContext } = this.props;
    let writeCap = pageContext.hasUserWriteCapability();
    return writeCap;
  }

  hasReadCapability() {
    let { pageContext } = this.props;
    return pageContext.hasUserReadCapability();
  }

  hasWriteCapability() {
    let { readOnly, pageContext } = this.props;
    if (readOnly === true) return false;
    return pageContext.hasUserWriteCapability();
  }

  hasModratorCapability() {
    let { readOnly, pageContext } = this.props;
    if (readOnly === true) return false;
    return pageContext.hasUserModeratorCapability();
  }

  hasAdminCapability() {
    let { readOnly, pageContext } = this.props;
    if (readOnly === true) return false;
    return pageContext.hasUserAdminCapability();
  }

  getCurrentBeanObserver() {
    if (!this.currentBeanObserver) {
      throw new Error('No Current Bean Observer');
    }
    return this.currentBeanObserver;
  }

  createBeanObserver(type: 'normal' | 'complex' = 'normal'): BeanObserver | ComplexBeanObserver {
    let bean = this.getSelectBean().bean;
    if (type == 'complex') {
      this.currentBeanObserver = new ComplexBeanObserver(bean);
    } else {
      this.currentBeanObserver = new BeanObserver(bean);
    }
    return this.currentBeanObserver;
  }

  onSaveAction() {
    if (!this.currentBeanObserver) return;
    let errorCollector = this.currentBeanObserver.getErrorCollector();
    if (errorCollector.getCount() > 0) {
      widget.layout.showNotification("danger", "Errors", `Have ${errorCollector.count} errors`);
      return;
    }
    this.closePopupContext();
    let bean = this.currentBeanObserver.commitAndGet();
    let newBean = false;
    if (!this.getSelectBean().inList) {
      newBean = true;
      this.addBean(bean);
    }
    this.forceUpdate();
    let { onModifyBean } = this.props;
    if (onModifyBean) onModifyBean(bean, newBean ? ModifyBeanActions.CREATE : ModifyBeanActions.MODIFY);
  }

  onDeleteAction() {
    let { onModifyBean, plugin } = this.props;
    let selectedRecords = plugin.getModel().getSelectedRecords();
    super.onDeleteAction();
    if (onModifyBean) onModifyBean(selectedRecords, ModifyBeanActions.DELETE);
  }

  onSelect(row: number, entity: any) {
    let { appContext, pageContext, onSelect } = this.props;
    if (onSelect) {
      onSelect(appContext, pageContext, entity);
      return;
    }
    super.onSelect(row, entity);
  }

}

export interface ExplorerConfig { actions: Array<ExplorerActions> }
export abstract class VGridExplorer<T extends VGridComponentProps = VGridComponentProps>
  extends VGridControlManager<T> {

  config: widget.list.VTreeConfig;
  model: widget.list.TreeModel;

  constructor(props: T) {
    super(props);
    this.config = this.createConfig();
    this.model = this.createTreeModel();
  }

  abstract createTreeModel(): widget.list.TreeModel;

  abstract createConfig(): widget.list.VTreeConfig;

  createTreeConfig(config: ExplorerConfig = { actions: [] }) {
    let readOnly = false;
    let vTreeConfig: widget.list.VTreeConfig = {
      renderNodeAction: (_vTree: VTree, node: TreeNode, selected: boolean) => {
        if (readOnly || !selected) return [];
        let buttons = new Array<ReactFragment>();
        for (let action of config.actions) {
          if (action === ExplorerActions.ADD) {
            buttons.push(
              <FAButton key={'add'} icon={fas.faPlus} color='link' onClick={() => this.onAdd(node)} />
            );
          } else if (action === ExplorerActions.EDIT) {
            if (node.getParent() != null) {
              buttons.push(
                <FAButton key={'edit'} icon={fas.faEdit} color='link' onClick={() => this.onEdit(node)} />
              );
            }
          } else if (action === ExplorerActions.DEL) {
            buttons.push(
              <FAButton key={'delete'} icon={fas.faTrash} color='link' onClick={() => this.onDel(node)} />
            )
          }
        }
        return buttons;
      }
    }
    return vTreeConfig;
  }

  onSelectNode(_node: widget.list.TreeNode) {
  }

  onEdit(_node: TreeNode) {
  }

  onAdd(_node: TreeNode) {
  }

  onDel(_node: TreeNode) {
  }

  renderExpandContent(_context: VGridContext, _control: VGridControlConfig) {
    let uiTree = (
      <VTree className='flex-vbox'
        config={this.config} model={this.model} onSelectNode={(node) => this.onSelectNode(node)} expandRoot />
    );
    return uiTree;
  }
}

interface VGridButtonMultiSelectProps extends WComponentProps {
  label?: string;
  model: widget.grid.model.ListModel;
  onMultiSelect?: (appContext: app.AppContext, pageContext: app.PageContext, entities: Array<any>) => void;
}
export class VGridButtonMutilSelect extends Component<VGridButtonMultiSelectProps> {
  onMultiSelect() {
    let { appContext, pageContext, model, onMultiSelect } = this.props;
    if (onMultiSelect) {
      let selectedEntities = model.getSelectedRecords();
      if (selectedEntities.length == 0) return;
      onMultiSelect(appContext, pageContext, selectedEntities);
    }
  }
  render() {
    let { onMultiSelect, label } = this.props;
    if (!onMultiSelect) return (null);
    const { FAButton } = widget.fa;
    const { faCheck } = widget.fa.fas;
    let html = (
      <FAButton size='sm' icon={faCheck} color="primary" onClick={() => this.onMultiSelect()}>
        {label ? label : T('Select')}
      </FAButton>
    );
    return html;
  }
}