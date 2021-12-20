import React, { ReactFragment } from 'react';
import { app, widget, util } from 'components';

import { ExplorerActions } from 'core/widget'

import { IStorage } from './Storage';
import { UIDirectoryList, UIDirectoryListPlugin } from './UIDirectoryList';
import { ExplorerConfig, VGridComponent, VGridComponentProps, VGridExplorer } from 'core/widget/vgrid';

import IDTracker = util.IDTracker;

const { fas, FAButton, FAIcon } = widget.fa;
import TreeModel = widget.list.TreeModel;
import TreeNode = widget.list.TreeNode;

class DirectoryTreeModel extends TreeModel {
  appContext: app.AppContext;
  storage: IStorage;

  constructor(showRoot: boolean, appContext: app.AppContext, storage: IStorage) {
    super(showRoot);
    this.appContext = appContext;
    this.storage = storage;
    let root = new widget.list.TreeNode(null, '', '', 'Storage', null, false);
    this.setRoot(root);
  }

  loadChildren(node: widget.list.TreeNode, postLoadCallback?: (node: widget.list.TreeNode) => void): any {
    let callbackHandler = (result: any) => {
      let directory = result.data;
      let children = directory.children;
      if (children.length) {
        for (let i = 0; i < children.length; i++) {
          let child = children[i];
          if (child.type == 'Directory') {
            this.addChild(node, child.name, child.name, child);
          }
        }
      }
      node.setLoadedChildren();
      if (postLoadCallback) postLoadCallback(node);
    };
    let restClient = this.appContext.getServerContext().getRestClient();
    let path = `/${node.path}`;
    let params = { path: path, loadChildren: true };
    restClient.get(this.storage.getRestPath(), params, callbackHandler);
  }
}
interface UIStorageDirectoryExplorerProps extends VGridComponentProps {
  storage: IStorage;
}
export class UIStorageDirectoryExplorer<T extends UIStorageDirectoryExplorerProps = UIStorageDirectoryExplorerProps>
  extends VGridExplorer<T> {

  createConfig() {
    let explorerConfig: ExplorerConfig = { actions: [ExplorerActions.ADD, ExplorerActions.EDIT, ExplorerActions.DEL] }
    return this.createTreeConfig(explorerConfig);
  }

  createTreeModel() {
    let { appContext, storage } = this.props;
    return new DirectoryTreeModel(true, appContext, storage);
  }

  onSelectNode(node: TreeNode) {
    let { context } = this.props;
    let plugin = context.uiRoot as UIDirectoryList;
    plugin.filterPath(node.path);
    this.forceUpdate();
  }

  onAdd(_node: widget.list.TreeNode) {
  }

  onEdit(_node: widget.list.TreeNode) {
  }
}

interface UIStoragePageProps extends VGridComponentProps {
  storage: IStorage
}
export class UIStoragePage extends VGridComponent<UIStoragePageProps> {
  selectPaths: Array<string> = [];
  plugin: UIDirectoryListPlugin;

  constructor(props: UIStoragePageProps) {
    super(props);
    let { storage } = props;
    this.plugin = new UIDirectoryListPlugin(storage, null);
  }

  onSelect(snode: any) {
    if (snode.type == 'Directory') {
      this.selectPaths.push(snode.name);
      this.plugin.withPath(snode.path);
      this.forceUpdate();
    }
  }

  onSelectPath(selectIdx: number) {
    let newSelectPaths = new Array<string>();
    let path = '/';
    for (let i = 0; i < selectIdx; i++) {
      newSelectPaths.push(this.selectPaths[i]);
      if (i > 0) path += '/';
      path += this.selectPaths[i];
    }
    this.selectPaths = newSelectPaths;
    this.plugin.withPath(path);
    this.forceUpdate();
  }

  render() {
    let { appContext, pageContext } = this.props;
    let pathUI = new Array<ReactFragment>();
    pathUI.push(
      <FAButton className='mr-2 p-1' outline size='sm' onClick={() => this.onSelectPath(0)}>
        Storage
      </FAButton>
    );
    if (this.selectPaths.length > 0) {
     
      for (let i = 0; i < this.selectPaths.length; i++) {
        // let path = '';
        // path += '/';
        // path += this.selectPaths[i];
        pathUI.push(<FAIcon icon={fas.faAngleRight} />);
        pathUI.push(
          <FAButton className='mx-2 p-1' outline size='sm' onClick={() => this.onSelectPath(i + 1)}>
            {this.selectPaths[i]}
          </FAButton>
        );
      }
    }
    let renderId = IDTracker.next();
    let readOnly = !appContext.hasUserAdminCapability();
    let html = (
      <div className='flex-vbox'>
        <div className='border-bottom my-1'>{pathUI}</div>
        <UIDirectoryList key={renderId}
          plugin={this.plugin} appContext={appContext} pageContext={pageContext} readOnly={readOnly}
          onSelect={(_appCtx, _pageCtx, snode) => this.onSelect(snode)} />
      </div>
    );
    return html;
  }
}