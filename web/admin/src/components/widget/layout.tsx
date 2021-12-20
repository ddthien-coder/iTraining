import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactJson from 'react-json-view'

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { storage } from 'components/storage';
import { IDTracker } from 'components/util/common';
import { NotificationMessage } from 'components/widget/util'
import { fas, FAButton, FAIcon } from 'components/widget/fa';

import { ELEProps, ButtonActionModel, GroupButtonActionModel, mergeCssClass } from './element';
import { StoreableStateComponent, StoreableStateComponentProps } from './element';

import './stylesheet.scss';

export { Container, Row, Col } from 'reactstrap'

export type ContentFactory = {
  name: string;
  label: string;
  createContent: () => any;
};
export interface Breadcumbs {
  push: (name: string, label: string, ui: any) => void;
  pushContent: (content: ContentFactory) => void;
  onBack: () => void;
}
export interface BreadcumbsPageProps extends ELEProps { 
  scroll?: boolean;
  rootContent?: ContentFactory;
}
export interface BreadcumbsPageState { path: Array<ContentFactory> }
export class BreadcumbsPage<T extends BreadcumbsPageProps>
  extends Component<T, BreadcumbsPageState> implements Breadcumbs {

  dropdownActions?: Array<GroupButtonActionModel>;
  actions?: Array<ButtonActionModel>;

  constructor(props: any) {
    super(props);
    this.onSelectPath.bind(this);
    this.state = { path: [] };
    let {rootContent} = props;
    if(rootContent) {
      let ui = rootContent.createContent() ;
      this.add(rootContent.name, rootContent.label, ui);
    }
  }

  clear() { this.state.path.splice(0, this.state.path.length); }

  isScrollable() { return false; }

  push(name: string, label: string, ui: any) {
    let { path } = this.state;
    path.push({ name: name, label: label, createContent: () => { return ui; } });
    this.forceUpdate();
  }

  pushContent(uiContent: ContentFactory) {
    let { path } = this.state;
    path.push(uiContent);
    this.forceUpdate();
  }

  add(name: string, label: string, ui: any) { this.push(name, label, ui); }

  onSelectPath(name: string) {
    const { path } = this.state;
    let newPath = [];
    for (let i = 0; i < path.length; i++) {
      newPath.push(path[i]);
      if (path[i].name === name) break;
    }
    this.setState({ path: newPath });
  }

  onBack() {
    const { path } = this.state;
    if (path.length === 1) return;
    path.pop();
    this.setState({ path: path });
  }

  renderActions() {
    if (!this.actions) return null;
    let actions: Array<ButtonActionModel> = this.actions;
    let actionBtns = [];
    for (let i = 0; i < actions.length; i++) {
      let action: ButtonActionModel = actions[i];
      if (!action) continue;
      actionBtns.push(
        <Button key={i} className='mx-1' outline size="sm" onClick={() => action.onSelect(action)}>
          {action.label}
        </Button>
      );
    }
    return actionBtns;
  }

  renderDropdownActions() {
    if (!this.dropdownActions) return null;
    let dropdowns = this.dropdownActions;
    let dropdownEles = [];
    for (let i = 0; i < dropdowns.length; i++) {
      let dropdown = dropdowns[i];
      let actions: Array<ButtonActionModel> = dropdown.actions;
      let itemEles = [];
      for (let j = 0; j < actions.length; j++) {
        let action: ButtonActionModel = actions[j];
        itemEles.push(<DropdownItem key={j} onClick={() => action.onSelect(action)}>{action.label}</DropdownItem>);
      }
      dropdownEles.push(
        <UncontrolledDropdown key={i}>
          <DropdownToggle nav caret className='px-2'>{dropdown.label}</DropdownToggle>
          <DropdownMenu right>{itemEles}</DropdownMenu>
        </UncontrolledDropdown>
      );
    }
    return dropdownEles;
  }

  createBreadcumbPaths() {
    const { path } = this.state;
    let breadcumbPaths = [];
    for (let i = 0; i < path.length; i++) {
      let selPath = path[i];
      if (i > 0) {
        breadcumbPaths.push(
          <FAIcon key={`arrow-${i}`} className='mx-1 text-white' icon={fas.faCaretRight} />);
      }
      if (i === path.length - 1) {
        breadcumbPaths.push((<FAButton key={i} className='px-2' color='info' disabled>{selPath.label}</FAButton>));
      } else {
        let link = (
          <FAButton key={i} className='px-2' color='info'
            onClick={() => this.onSelectPath(selPath.name)}>{selPath.label}</FAButton>
        );
        breadcumbPaths.push(link);
      }
    }

    return <div className='breadcumbs-path flex-hbox align-items-center'>{breadcumbPaths}</div>;
  }

  createBreadcumbContent() {
    const { path } = this.state;
    let breadcumContents = [];
    for (let i = 0; i < path.length; i++) {
      let selPath = path[i];
      if (i === path.length - 1) {
        let content = selPath.createContent();
        breadcumContents.push(<div key={selPath.name} className='flex-vbox'>{content}</div>)
      }
    }
    return breadcumContents;
  }

  render() {
    let html = (
      <div className='breadcumbs flex-vbox'>
        <div className='flex-hbox-grow-0 p-1 justify-content-between'>
          <div className='flex-hbox'> {this.createBreadcumbPaths()} </div>
          <div className='flex-hbox-grow-0'>
            <div className='px-2'>{this.renderActions()}</div>
            <div className='px-2 d-flex'>{this.renderDropdownActions()}</div>
          </div>
        </div>

        <div className='flex-vbox'> {this.createBreadcumbContent()} </div>
      </div>
    );
    return html;
  }
}

export interface TabModel {
  name: string;
  label: string;
  active?: boolean;
  closeable?: boolean;
  ui: any;
}
interface TabProps extends ELEProps {
  name: string;
  label: string;
  active?: boolean;
}
export class Tab extends Component<TabProps> {
  render() {
    let { style, className } = this.props;
    className = mergeCssClass('tab', className);
    let html = (
      <div className={className} style={style}>
        {this.props.children}
      </div>
    );
    return html;
  }
}

interface TabPaneProps extends StoreableStateComponentProps {
  laf?: 'outline';
  contentStyle?: any;
  onSelectTab?: (name: string) => void;
  onCreateTab?: () => TabModel;
  customActions?: Array<ButtonActionModel>;
  uiControl?: any;
}
type TabPaneState = { 
  selectTab: string 
}
export class TabPane extends StoreableStateComponent<TabPaneProps, TabPaneState> {
  dynamicTabs: Array<TabModel>;

  constructor(props: TabPaneProps) {
    super(props);
    this.initStorableState({ selectTab: '' });
    this.dynamicTabs = [];
  }

  onSelectTab(tabName: string) {
    let { onSelectTab } = this.props;
    if (onSelectTab) onSelectTab(tabName);
    this.setStorableState({ selectTab: tabName });
  }

  onClose(tabName: string) {
    let tabs = this.dynamicTabs;
    for (let i = 0; i < tabs.length; i++) {
      let tab = tabs[i];
      if (tabName === tab.name) {
        tabs.splice(i, 1);
        let { children } = this.props;
        if (children) {
          let selChild = children;
          if (children.length) selChild = children[0];
          this.setStorableState({ selectTab: selChild.props.name });
        } else if (tabs.length > 0) {
          this.setStorableState({ selectTab: tabs[0].name });
        }
        break;
      }
    }
  }

  onAdd() {
    const { onCreateTab } = this.props;
    if (!onCreateTab) return;
    this.addTab(onCreateTab());
  }

  addTab(tab: TabModel) {
    this.dynamicTabs.push(tab);
    this.setStorableState({ selectTab: tab.name });
  }

  add(name: string, label: string, ui: any, closeable: boolean = true) {
    let tab : TabModel = {
      name: name, label: label, ui: ui, closeable: closeable
    };
    this.dynamicTabs.push(tab);
    this.setStorableState({ selectTab: tab.name });
  }

  render() {
    let { children, style, laf, className, contentStyle, onCreateTab, customActions, uiControl } = this.props;
    let selectTabName = this.state.selectTab;
    let SelectedTab = null;
    let tabHeaders: Array<any> = [];
    if (children) {
      React.Children.map(children, (tab, i) => {
        if (!tab) return;
        const { name, label, active } = tab.props;
        let disabled = false;
        let tabClass = 'tab';
        if ((!selectTabName && active) || name == selectTabName) {
          disabled = true;
          SelectedTab = tab;
          tabClass = 'tab tab-active'
        }
        let tabBtn = (
          <div key={`stab-${i}`} className={tabClass} >
            <FAButton color='link' disabled={disabled}
              outline onClick={() => this.onSelectTab(name)}>{label}</FAButton>
          </div>
        );
        tabHeaders.push(tabBtn);
      });
    }

    for (let i = 0; i < this.dynamicTabs.length; i++) {
      let tab = this.dynamicTabs[i];
      let tabClass = 'tab';
      if (tab.name === selectTabName) {
        SelectedTab = tab.ui;
        tabClass = 'tab tab-active';
      }
      let tabHeader = (
        <div key={`dtab-${i}`} className={tabClass}>
          <FAButton color='link' onClick={() => this.onSelectTab(tab.name)}>{tab.label}</FAButton>
          {
            tab.closeable ? 
              <FAButton color='link' icon={fas.faTrashAlt} onClick={() => this.onClose(tab.name)} /> : <></>
          }
        </div>
      );
      tabHeaders.push(tabHeader);
    }

    let addTab = null;
    if (onCreateTab) {
      addTab = (
        <div key={'add'} className='tab'>
          <Button color='link' onClick={() => this.onAdd()}>+</Button>
        </div>
      );
    }

    let buttons = null;
    if (customActions) {
      buttons = [];
      for (let i = 0; i < customActions.length; i++) {
        let action = customActions[i];
        let color = action.color ? action.color : 'primary';
        let iconEle = action.icon ? <span className={action.icon} /> : null
        buttons.push(
          <Button key={i} className='d-block my-1' color={color} outline={action.outline} size={action.size}
            onClick={() => action.onSelect(action, this)}>{iconEle} {action.label}</Button>
        );
      }
    }
    let cssClass = 'ui-tabpane flex-vbox';
    if (laf) cssClass = `${cssClass} ui-tabpane-${laf} `
    if (className) cssClass = `${cssClass} ${className} `

    let html = (
      <div style={style} className={cssClass}>
        <div className='header flex-hbox-grow-0 justify-content-between border-bottom'>
          <div className='tabs flex-hbox-grow-0'> {tabHeaders} {addTab} </div>
          <div className='flex-hbox-grow-0'>
            {uiControl}
            {buttons}
          </div>
        </div>
        <div className='content pt-1' style={contentStyle}> {SelectedTab} </div>
      </div>
    );
    return html;
  }
}
export interface UINotificationMessageProps extends ELEProps {
  msg: NotificationMessage
}
export class UINotificationMessage extends React.Component<UINotificationMessageProps> {
  render() {
    const { msg, className, style } = this.props;

    let html = (
      <div className={className} style={style}>
        <h3 className='border-bottom'>{msg.label}</h3>
        <div>{msg.detail}</div>
      </div>
    );
    return html;
  }
}

export class DialogContext {
  dialog?: Dialog;

  getDialog() {
    if (!this.dialog) {
      throw new Error("No dialog is set");
    }
    return this.dialog;
  }
  setDialog(dialog: Dialog) { this.dialog = dialog; }
}

type DialogProps = {
  parentDomId: string,
  title: string, content: any,
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  context?: DialogContext,
  actions?: Array<ButtonActionModel>,
  onClose?: (uiDialog: Dialog) => void,
};
type DialogState = { show: boolean };
export class Dialog extends React.Component<DialogProps, DialogState> {
  constructor(props: DialogProps) {
    super(props);
    let { context } = props;
    if (context) context.setDialog(this);
    this.state = { show: true };
  }

  hide() {
    let { parentDomId } = this.props;
    let parentDomEle = document.getElementById(parentDomId);
    if (parentDomEle) {
      ReactDOM.unmountComponentAtNode(parentDomEle);
      parentDomEle.remove();
    }
  }

  doClose() {
    const { onClose } = this.props;
    if (onClose) onClose(this);
    this.hide();
  }

  render() {
    let { title, content, size, actions, onClose } = this.props;
    if (!size) size = 'md';
    let actionEles = [];
    if (actions) {
      actionEles = [];
      for (let i = 0; i < actions.length; i++) {
        let action = actions[i];
        let color = 'primary';
        if (action.color) color = action.color;
        actionEles.push(
          <Button key={i} className='mx-1' color={color} outline={action.outline}
            onClick={() => action.onSelect(action, { uiDialog: this })}>{action.label}</Button>
        );
      }
    }
    if (onClose) {
      actionEles.push(<Button key={'close'} className='mx-1' onClick={() => this.doClose()}>{'Close'}</Button>);
    }
    let Footer = null;
    if (actionEles.length > 0) {
      Footer = (
        <ModalFooter>
          <div className='d-flex flex-row-reverse'> {actionEles} </div>
        </ModalFooter>
      );
    }

    let theme = storage.sessionGet('laf:theme', 'light');
    let html = (
      <Modal className={`ui-dialog ${theme}-theme`} backdrop={true}
        backdropTransition={{ timeout: 50, appear: false, exit: false }}
        modalTransition={{ timeout: 50, appear: false, exit: false }}
        isOpen={this.state.show} size={size} toggle={() => this.hide()}>
        <ModalHeader toggle={() => this.hide()}> {title} </ModalHeader>
        <ModalBody className={'body-bg body-color'}>{content}</ModalBody>
        {Footer}
      </Modal>
    );
    return html;
  }
}

export function showDialog(
  title: string, size: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  content: ContentFactory | any, ctx?: DialogContext) {

  let body = content;
  if (content.createContent) {
    body = content.createContent();
  }
  let parentDomId = `uidialog_${IDTracker.next()}`;

  var dialogDiv = document.createElement("div");
  dialogDiv.setAttribute("id", parentDomId);
  let appDialogDiv = document.getElementById('app-dialog');
  if (appDialogDiv) {
    appDialogDiv.appendChild(dialogDiv);
    let uiDialog = (
      <Dialog parentDomId={parentDomId} title={title} size={size} content={body} context={ctx} />
    );
    ReactDOM.render(uiDialog, dialogDiv);
  }
}

export function showNotification(type: 'success' | 'info' | 'warning' | 'danger', label: string, detail?: any, cause?: any) {
  let stacktrace = '';
  if (cause) stacktrace = JSON.stringify(cause, null, 2);
  let msg: NotificationMessage = { type: type, label: label, detail: detail, stacktrace: stacktrace };
  let ui = (<UINotificationMessage msg={msg} />);
  let size: 'sm' | 'md' = 'sm';
  if (cause) size = 'md';
  showDialog(label, size, ui);
}

export function showJson(size: 'sm' | 'md' | 'lg', label: string, object: any) {
  let ui = (
    <ReactJson src={object} indentWidth={4} collapsed={1} />
  )
  showDialog(label, size, ui);
}