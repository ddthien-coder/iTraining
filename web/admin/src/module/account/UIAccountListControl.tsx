import React from 'react';
import { app, widget, server } from 'components';

import { ExplorerActions, ComplexBeanObserver } from 'core/entity';
import {
  WToolbar, WButtonDeleteMembership, WButtonNewMembership, WButtonEntityNew, WComponent
} from 'core/widget';
import {
  ExplorerConfig, VGridExplorer, VGridComponentProps, VGridComponent
} from 'core/widget/vgrid';

import { AccountRestURL, T } from './Dependency'
import { AccountType } from '../account';
import { UIAccountList, UIAccountListPlugin } from './UIAccountList';
import { UIAccountGroupEditor } from './UIAccountGroup';
import { UILoadableAccountInfo } from './UIAccountInfo';
import { UINewAccountEditor } from './UINewAccount';

import TreeNode = widget.list.TreeNode;
import TreeModel = widget.list.TreeModel;

class AccountGroupTreeModel extends TreeModel {
  appContext: app.AppContext;

  constructor(appContext: app.AppContext, showRoot: boolean) {
    super(showRoot);
    this.appContext = appContext;
    let root = new TreeNode(null, '', '', T('All Account Groups'), null, false);
    this.setRoot(root);
  }

  loadChildren(node: TreeNode, postLoadCallback?: (node: TreeNode) => void): any {
    let callbackHandler = (result: any) => {
      let children = result.data;
      if (children.length) {
        for (let i = 0; i < children.length; i++) {
          let childGroup = children[i];
          this.addChild(node, childGroup.name, childGroup.label, childGroup);
        }
      }
      node.setLoadedChildren();
      if (postLoadCallback) postLoadCallback(node);
    };
    let groupId = node.userData ? node.userData.id : 0;
    this.appContext.serverGET(AccountRestURL.group.loadChildren(groupId), {}, callbackHandler);
  }
}

export class UIAccountExplorer<T extends VGridComponentProps> extends VGridExplorer<T> {
  createTreeModel() {
    return new AccountGroupTreeModel(this.props.appContext, true);
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

  onSelectNode(node: TreeNode) {
    let { context } = this.props;
    let uiAccountList = context.uiRoot as UIAccountList;
    uiAccountList.filterByGroup(node.userData);
    this.forceUpdate();
  }

  onEdit(node: TreeNode) {
    let { appContext, pageContext } = this.props;
    let accountGroup = node.userData;
    let accountGroupObserver = new ComplexBeanObserver(accountGroup);
    if (accountGroup == null) {
      appContext.addOSNotification('danger', T("Cannot Edit the root"));
    } else {
      let popupPageCtx = pageContext.createPopupPageContext();
      let onPostCommit = (group: any) => {
        popupPageCtx.onClose();
        node.label = group.label;
        node.userData = group;
        this.forceUpdate();
      }
      let html = (
        <UIAccountGroupEditor
          appContext={appContext} pageContext={popupPageCtx} observer={accountGroupObserver}
          onPostCommit={onPostCommit} />
      )
      widget.layout.showDialog(T("Edit Account Group"), "md", html, popupPageCtx.getDialogContext());
    }
  }

  onAdd(node: TreeNode) {
    let { appContext, pageContext, context } = this.props;
    let accountGroup = { parentId: node.userData?.id }
    let observer = new ComplexBeanObserver(accountGroup);
    let popupPagecontext = pageContext.createPopupPageContext();

    let onPostCommit = (group: any, _uiEditor: WComponent) => {
      popupPagecontext.onBack();
      if (node.loadedChildren === false) {
        const successCB = (_reloadedNode: TreeNode) => {
          node.collapse = false;
          this.forceUpdate();
        }
        this.model.loadChildren(node, successCB)
      } else {
        node.addChild(group.name, group.label, group, false);
      }
      let uiAccountList = context.uiRoot as UIAccountList;
      uiAccountList.reloadData();
    }
    let html = (
      <UIAccountGroupEditor
        appContext={appContext} pageContext={popupPagecontext} observer={observer} onPostCommit={onPostCommit} />
    );
    widget.layout.showDialog(T(`Add New Account Group To ${node.userData?.label}`), "md", html,
      popupPagecontext.getDialogContext());
  }

  onDel(node: TreeNode) {
    let { appContext, context } = this.props;
    let group = node.userData;
    let callback = (_response: server.rest.RestResponse) => {
      appContext.addOSNotification('success', T('Delete Account Group Success!'));
      this.model.removeNode(node);
      this.model.setSelectedNode(this.model.root);
      let uiAccountList = context.uiRoot as UIAccountList;
      const accountListPlugin = uiAccountList.props.plugin as UIAccountListPlugin;
      accountListPlugin.withGroup(null)
      uiAccountList.reloadData();
    }
    let failCB = (_response: server.rest.RestResponse) => {
      appContext.addOSNotification('danger', T(`Cannot delete account group ${group.label}, this has the children!`))
    }
    appContext.serverDELETE(AccountRestURL.group.delete(group.id), {}, callback, failCB)
  }
}

export class UIAccountListPageControl extends VGridComponent {
  onNewAccount() {
    let { context, appContext, pageContext } = this.props;
    let popupPagecontext = pageContext.createPopupPageContext();
    let onPostCreate = (newAccountModel: any, _uiEditor?: WComponent) => {
      const account = newAccountModel.account;
      popupPagecontext.onBack();
      let html = (
        <UILoadableAccountInfo appContext={appContext} pageContext={pageContext}
          loginId={account.loginId} />
      );
      pageContext.onAdd('account-detail', T(`Account {{loginId}}`, { loginId: account.loginId }), html);
    }
    let selectedGroup = context.getAttribute('currentGroup');
    let groupIds = selectedGroup ? [selectedGroup.id] : null;
    let groupLabel = selectedGroup ? selectedGroup.label : null;
    let observer = new ComplexBeanObserver({
      account: { accountType: AccountType.USER },
      accountGroupIds: groupIds,

    });
    let html = (
      <UINewAccountEditor appContext={appContext} pageContext={popupPagecontext} observer={observer}
        commitURL={AccountRestURL.account.create} onPostCommit={onPostCreate} />
    );
    widget.layout.showDialog(T(`Add New Account To ${groupLabel}`), 'md', html, popupPagecontext.getDialogContext());
  }

  onImportSuccess = () => {
    let { context } = this.props;
    let uiAccountList = context.uiRoot as UIAccountList;
    uiAccountList.reloadData();
    uiAccountList.forceUpdate();
  }

  onAddMembership() {
    let { context, appContext, pageContext } = this.props;
    let uiAccountList = context.uiRoot as UIAccountList;
    let excludeRecords = uiAccountList.props.plugin.getRecords();
    let popupPageCtx = pageContext.createPopupPageContext();
    let html = (
      <div className='flex-vbox' style={{ height: 600 }}>
        <UIAccountList
          appContext={appContext} pageContext={popupPageCtx} readOnly={true} type='selector'
          plugin={new UIAccountListPlugin().withExcludeRecords(excludeRecords)}
          onSelect={(_appCtx, pageCtx, account) => this.onMultiSelect(pageCtx, [account])}
          onMultiSelect={(_appCtx, pageCtx, accounts) => this.onMultiSelect(pageCtx, accounts)} />
      </div>
    )
    widget.layout.showDialog(T('Add Account Membership'), 'md', html, popupPageCtx.getDialogContext());
  }

  onDeleteMembership() {
    const { context, appContext } = this.props;
    let uiAccountList = context.uiRoot as UIAccountList;
    let plugin = uiAccountList.props.plugin;
    let selectedGroup = context.getAttribute('currentGroup');
    const selectedAccounts = plugin.getListModel().getSelectedRecords()
    let accountLoginIds = new Array<string>();
    for (let i = 0; i < selectedAccounts.length; i++) {
      const account = selectedAccounts[i];
      accountLoginIds.push(account.loginId);
    }
    if (accountLoginIds.length === 0) return;
    const successCB = (_response: server.rest.RestResponse) => {
      plugin.getListModel().removeSelectedDisplayRecords();
      context.getVGrid().forceUpdateView();
      appContext.addOSNotification("success", T(`Delete Memberships Success`));
    }
    appContext.serverDELETE(AccountRestURL.group.membership(selectedGroup.id), accountLoginIds, successCB);
  }

  onMultiSelect = (pageCtx: app.PageContext, accounts: Array<any>) => {
    const { context, appContext } = this.props;
    let currentGroup = context.getAttribute('currentGroup');
    let accountLoginIds = new Array<string>();
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      accountLoginIds.push(account.loginId);
      pageCtx.onBack;
    }
    const successCB = (_response: server.rest.RestResponse) => {
      appContext.addOSNotification("success", T(`Add Memberships Success`));
      let uiAccountList = context.uiRoot as UIAccountList;
      uiAccountList.reloadData();
      context.getVGrid().forceUpdateView();
    }
    appContext.serverPUT(AccountRestURL.group.membership(currentGroup.id), accountLoginIds, successCB);
  }

  render() {
    let { context, appContext, pageContext, readOnly } = this.props;
    let selectedGroup = context.getAttribute('currentGroup');
    const isSelectGroup = !selectedGroup ? true : false;

    return (
      <WToolbar readOnly={readOnly}>
        <WButtonNewMembership
          appContext={appContext} pageContext={pageContext} hide={readOnly || isSelectGroup}
          label={T('Add Membership')}
          onClick={() => this.onAddMembership()} />
        <WButtonDeleteMembership
          appContext={appContext} pageContext={pageContext} hide={readOnly || isSelectGroup}
          label={T('Delete Membership')}
          onClick={() => this.onDeleteMembership()} />
        <WButtonEntityNew
          appContext={appContext} pageContext={pageContext} readOnly={readOnly}
          label={T('New Account')} onClick={() => this.onNewAccount()} />
      </WToolbar>
    )
  }
}
