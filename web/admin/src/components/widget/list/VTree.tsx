import React, {Component} from "react";
import { VariableSizeGrid } from "react-window";

import { IDTracker } from "components/util/common";

import { fas, FAButton } from "components/widget/fa";

import './stylesheet.scss'
export class TreeNode {
  parent: any;
  path: string;
  name: string;
  label: string;
  userData: any;
  collapse: boolean;
  children: null | Array<TreeNode>;
  loadedChildren: boolean;

  constructor(parent: any, path: string, name: string, label: string, userData: any, collapse: boolean) {
    this.parent = parent;
    this.path = path;
    this.name = name;
    this.label = label;
    this.userData = userData;
    this.collapse = collapse;
    this.children = null;
    this.loadedChildren = false;
  }

  getChildByName(name: string) {
    if (!this.children) return null;
    for (let i = 0; i < this.children.length; i++) {
      let child = this.children[i];
      if (child.name === name) return child;
    }
    return null;
  }

  getChildren() { return this.children; }

  getParent(): any { return this.parent; }

  setLoadedChildren() { 
    this.loadedChildren = true; 
  }

  addChild(name: string, label: string, userData: any, collapse: boolean): any {
    let path = null;
    if (this.path) path = this.path + '/' + name;
    else path = name;
    let node = new TreeNode(this, path, name, label, userData, collapse);
    if (!this.children) this.children = [];
    this.children.push(node);
    return node;
  }
}

export class TreeModel {
  showRoot: boolean;
  root: TreeNode;
  selectedNode: TreeNode;

  constructor(showRoot: boolean) {
    this.showRoot = showRoot;
    this.root = new TreeNode(null, '', "root", "Root", null, false);
    this.selectedNode = this.root;
  }

  setShowRoot(bool: boolean): void { this.showRoot = bool; }

  getRoot() { return this.root; }

  setRoot(root: any): void {
    this.root = root;
    this.selectedNode = root;
  }

  getSelectedNode() { return this.selectedNode; }

  setSelectedNode(node: any): void { this.selectedNode = node; }

  isLoadedChildren(node: TreeNode) {
    if (node.children) return true;
    return node.loadedChildren;
  }

  isLeafNode(node: TreeNode) {
    let children = node.getChildren();
    if (!children) return true;
    return children.length === 0;
  }

  onCollapse(_node: TreeNode): void { }

  onExpand(node: TreeNode, postLoadCallback: (node: TreeNode) => void): void {
    if (!this.isLoadedChildren(node)) {
      this.loadChildren(node, postLoadCallback);
    } else {
      if (postLoadCallback) postLoadCallback(node);
    }
  }

  removeNode(node: any) {
    let parent = node.getParent();
    if (!parent) return;
    let pChildren = parent.getChildren();
    for (let i = 0; i < pChildren.length; i++) {
      let child = pChildren[i];
      if (node.path === child.path) pChildren.splice(i, 1);
    }
  }

  addChild(node: TreeNode, name: string, label: string, userData: any): any {
    let child = node.addChild(name, label, userData, true);
    return child;
  }

  loadChildren(_node: TreeNode, _postLoadCallback?: (node: TreeNode) => void): any {
    throw new Error('this method need to reimplement');
  }
}

type CellParam = { columnIndex: number, rowIndex: number, style: any };

interface VTreeListProps {
  vtree: VTree;
  rows: Array<any>;
}
interface VTreeListState {
  init: boolean;
}
class VTreeList extends Component<VTreeListProps, VTreeListState> {
  state: VTreeListState = {
    init: false
  };
  divElement: HTMLElement | null = null;

  componentDidMount() {
    if (this.divElement) {
      this.setState({ init: true });
    }
  }

  rowHeight = (_rowIndex: number) => {
    return 20;
  }

  CellData = (param: CellParam) => {
    let { rows, vtree } = this.props;
    let config = vtree.getVTreeConfig();
    let model = vtree.getTreeModel();
    let rowIdx = param.rowIndex;
    let row = rows[rowIdx];
    let cssRow = rowIdx % 2 ? 'odd' : 'even';
    let className = `cell cell-${cssRow}`;
    let node: TreeNode = row.node;

    let userData = node.userData;
    let deep: number = row.deep;
    let toggleEle = null;
    if (!model.isLoadedChildren(node)) {
      toggleEle = (
        <FAButton className='mr-1' color='link' icon={fas.faSync} onClick={() => vtree.onToggleNode(node)} />
      );
    } else if (!model.isLeafNode(node)) {
      let icon = fas.faCaretDown;
      if (node.collapse) icon = fas.faCaretRight;
      toggleEle = (
        <FAButton color='link' icon={icon} onClick={() => vtree.onToggleNode(node)} />
      );
    }
    let selected = node == model.getSelectedNode();
    let opacity = 1;
    if (userData && userData.state === 'InActive') opacity = 0.6;
    let cellStyle = param.style;
    let treeStyle = { ...cellStyle, paddingLeft: 10 * deep, opacity: opacity };

    let uiActions = null;
    if (config.renderNodeAction) {
      uiActions = config.renderNodeAction(vtree, node, selected);
    }
    return (
      <div className={`${className} justify-content-between`} key={row} style={treeStyle}>
        <div>
          {toggleEle}
          <FAButton color='link' disabled={selected} onClick={() => vtree.onSelectNode(node)}>{node.label}</FAButton>
        </div>

        <div>{uiActions}</div>
      </div>
    );
  };

  columnWidth = (_index: number) => {
    let width = this.divElement ? this.divElement.clientWidth : 300;
    return width - 5;
  }

  onScroll = (_param: { scrollTop: number, scrollLeft: number, scrollUpdateWasRequested: any }) => {
  }

  render() {
    if (!this.divElement) {
      return (<div className='flex-vbox' ref={(divElement) => { this.divElement = divElement }}>Loading...</div>)
    }
    let height = this.divElement ? this.divElement.clientHeight : 300;
    let width = this.divElement ? this.divElement.clientWidth : 300;
    let { rows } = this.props; 
    let columnCount = 1;
    return (
      <div className='grid-container' ref={(divElement) => { this.divElement = divElement }}>
        <VariableSizeGrid
          onScroll={this.onScroll}
          className="grid" style={{ overflow: 'scroll'}}
          columnCount={columnCount} columnWidth={(index) => this.columnWidth(index)}
          rowCount={rows.length} rowHeight={this.rowHeight}
          height={height} width={width}>
          {(param) => this.CellData(param)}
        </VariableSizeGrid>
      </div>
    );
  }
}

export interface VTreeConfig {
  renderNode?: (vTree: VTree, node: TreeNode, selected: boolean) => any;
  renderNodeAction?: (vTree: VTree, node: TreeNode, selected: boolean) => any;
}

export interface VTreeProps {
  className?: string;
  model: TreeModel;
  config: VTreeConfig;
  expandRoot?: boolean;
  onSelectNode?: (node: TreeNode) => void
}
export class VTree extends Component<VTreeProps> {
  componentDidMount() {
    const { expandRoot } = this.props;
    if (expandRoot) {
      this.onExpandRoot(false);
    }
  }

  getVTreeConfig() {
    const { config } = this.props;
    return config;
  }

  getTreeModel() { return this.props.model; }

  onExpandRoot(selectFirstNode: boolean = false) {
    const { model } = this.props;
    let thisUI = this;
    let callback = (node: TreeNode) => {
      let children = node.getChildren();
      if (children != null && selectFirstNode) {
        this.onSelectNode(children[0])
      }
      thisUI.forceUpdate();
    };
    model.onExpand(model.getRoot(), callback);
  }

  onToggleNode(node: TreeNode) {
    let { model } = this.props;
    if (!node.collapse) {
      model.onCollapse(node);
      node.collapse = true;
      this.forceUpdate();
    } else {
      let thisUI = this;
      let callback = (node: TreeNode) => {
        node.collapse = false;
        thisUI.forceUpdate();
      };
      model.onExpand(node, callback);
    }
  }

  onSelectNode(node: any) {
    this.getTreeModel().setSelectedNode(node);
    let { onSelectNode } = this.props;
    if (onSelectNode) onSelectNode(node);
  }

  createDataRow(rowDataHolder: Array<any>, model: TreeModel, node: TreeNode, deep: number) {
    rowDataHolder.push({ node: node, deep: deep });

    if (node.collapse) return;
    let children = node.getChildren();
    if (children == null) return;
    for (let i = 0; i < children.length; i++) {
      this.createDataRow(rowDataHolder, model, children[i], deep + 1);
    }
  }

  initDataRowHolder() {
    const { model } = this.props;
    let rows: Array<any> = [];
    if (model.showRoot) {
      this.createDataRow(rows, model, model.root, 0);
    } else {
      let children = model.root.getChildren();
      if (children != null) {
        for (let i = 0; i < children.length; i++) {
          this.createDataRow(rows, model, children[i], 0);
        }
      }
    }
    return rows;
  }

  render() {
    let rows = this.initDataRowHolder();
    let { className } = this.props;
    className = className ? `vtree ${className}` : 'vtree'
    return (
      <div className={className}>
        <VTreeList key={IDTracker.next()}  vtree={this} rows={rows} />
      </div>
    );
  }
}