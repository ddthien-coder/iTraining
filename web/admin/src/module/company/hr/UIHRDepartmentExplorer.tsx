import React from 'react';
import { app, widget, server } from 'components';

import { BeanObserver, ExplorerActions, WComponent, } from 'core/widget';
import { ExplorerConfig, VGridComponentProps, VGridExplorer } from 'core/widget/vgrid';

import { T, HRRestURL } from "module/company/hr/Dependency";
import { UIEmployeeListPlugin, UIEmployeeList } from 'module/company/hr/UIEmployeeList';
import { UIHRDepartmentEditor } from 'module/company/hr/UIHRDepartment';

import TreeNode = widget.list.TreeNode;
import TreeModel = widget.list.TreeModel;

class HRDepartmentTreeModel extends TreeModel {
  appContext: app.AppContext;

  constructor(showRoot: boolean, appContext: app.AppContext) {
    super(showRoot);
    this.appContext = appContext;
    let root = new TreeNode(null, '', '', T('All Departments'), null, false);
    this.setRoot(root);
  }

  loadChildren(node: TreeNode, postLoadCallback?: (node: TreeNode) => void): any {
    let callbackHandler = (response: server.rest.RestResponse) => {
      let children = response.data;
      if (children.length) {
        for (let i = 0; i < children.length; i++) {
          let childDept = children[i];
          this.addChild(node, childDept.name, childDept.label, childDept);
        }
      }
      node.setLoadedChildren();
      if (postLoadCallback) postLoadCallback(node);
    };
    let restClient = this.appContext.getServerContext().getRestClient();
    let deptId = node.userData ? node.userData.id : 0;
    restClient.get(HRRestURL.department.loadChildren(deptId), {}, callbackHandler);
  }
}

class UIHRDepartmentExplorerNew<T extends VGridComponentProps> extends VGridExplorer<T> {
  createTreeModel() {
    return new HRDepartmentTreeModel(true, this.props.appContext);
  }

  createConfig() {
    const { context } = this.props;
    let uiRoot = context.uiRoot as WComponent;
    let writeCap = uiRoot.hasWriteCapability();
    let explorerConfig: ExplorerConfig = {
      actions: [ExplorerActions.ADD, ExplorerActions.EDIT, ExplorerActions.DEL]
    }
    if (!writeCap) {
      explorerConfig.actions = [];
    }
    return this.createTreeConfig(explorerConfig);
  }

  onSelectNode(_node: TreeNode) {
    throw new Error(T('You need to implement this method'));
  }

  onAdd(node: TreeNode) {
    let { appContext, pageContext, context } = this.props;
    let hrDepartment = { parentId: node.userData?.id }
    let observer = new BeanObserver(hrDepartment);
    let popupPageCtx = pageContext.createPopupPageContext();
    let onPostCommit = (department: any, _uiEditor?: WComponent) => {
      popupPageCtx.onClose();
      if (node.loadedChildren === false) {
        const successCB = (_reloadedNode: TreeNode) => {
          node.collapse = false;
          this.forceUpdate();
        }
        this.model.loadChildren(node, successCB)
      } else {
        node.addChild(department.name, department.label, department, false);
      }
      let uiEmployeeList = context.uiRoot as UIEmployeeList;
      uiEmployeeList.reloadData();
    }
    let html = <UIHRDepartmentEditor appContext={appContext}
      pageContext={popupPageCtx} observer={observer} onPostCommit={onPostCommit} />
    widget.layout.showDialog(T(`Add HR Department ${node.userData?.label}`), "md", html, popupPageCtx.getDialogContext());
  }

  onEdit(node: TreeNode) {
    let { appContext, pageContext, context } = this.props;
    let hrDepartment = node.userData;
    let observer = new BeanObserver(hrDepartment);
    if (hrDepartment == null) {
      appContext.addOSNotification('danger', T('Cannot edit root'));
    } else {
      let popupPageCtx = pageContext.createPopupPageContext();
      let onPostCommit = (department: any, _uiEditor?: WComponent) => {
        popupPageCtx.onClose();
        node.label = department.label;
        node.userData = department;
        let uiEmployeeList = context.uiRoot as UIEmployeeList;
        uiEmployeeList.reloadData();
        uiEmployeeList.forceUpdate();
      }
      let html = <UIHRDepartmentEditor appContext={appContext} pageContext={popupPageCtx}
        observer={observer} onPostCommit={onPostCommit} />
      widget.layout.showDialog(T("Edit HR Department"), "md", html, popupPageCtx.getDialogContext());
    }
  }

  onDel(node: TreeNode) {
    let { appContext, context } = this.props;
    let department = node.userData;
    let successCB = (_response: server.rest.RestResponse) => {
      appContext.addOSNotification('success', T('Delete HR Department Success!'));
      this.model.removeNode(node);
      this.model.setSelectedNode(this.model.root);
      let uiEmployeeList = context.uiRoot as UIEmployeeList;
      uiEmployeeList.filterByDepartment(null);
    }
    let failCB = (_response: server.rest.RestResponse) => {
      appContext.addOSNotification('danger', T(`Cannot delete department ${department.label}, this has the children!`))
    }
    appContext.serverDELETE(HRRestURL.department.delete(department.id), {}, successCB, failCB)
  }
}

interface UIHRDepartmentEmployeeExplorerProps extends VGridComponentProps {
  plugin: UIEmployeeListPlugin;
}

export class UIHRDepartmentEmployeeExplorer extends UIHRDepartmentExplorerNew<UIHRDepartmentEmployeeExplorerProps> {
  onSelectNode(node: TreeNode) {
    let { context } = this.props;
    let uiEmployeeList = context.uiRoot as UIEmployeeList;
    uiEmployeeList.filterByDepartment(node.userData);
    this.forceUpdate();
  }
}