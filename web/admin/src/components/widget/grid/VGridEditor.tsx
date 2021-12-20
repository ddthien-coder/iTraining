import React from "react";
import { CSSProperties } from "react";
import { IDTracker } from "components/util/common";
import { FAButton } from 'components/widget/fa';
import { HSplit, HSplitPane } from 'components/widget/component';
import { showDialog, DialogContext } from 'components/widget/layout';
import { ListModel } from "./model/ListModel";
import { VGridConfig, VGridContext } from './IVGrid';
import { VGrid } from './VGrid';

export interface VGridEditorPlugin {
  getModel: () => ListModel;
  replaceBeans: (beans: Array<any>) => void
  onModify: (editor: VGridEditor<VGridEditorProps>, bean: any) => void
}
export class ListEditorPlugin implements VGridEditorPlugin {
  model: ListModel;

  constructor(beans: Array<any>) {
    this.model = new ListModel(beans);
  }

  getModel() { return this.model; }

  replaceBeans(beans: Array<any>) {
    this.model.update(beans);
  }

  onModify(_editor: VGridEditor<VGridEditorProps>, _bean: any) { }
}

class SelectBean {
  bean: any;
  inList: boolean;

  constructor(bean: any, inList: boolean) {
    this.bean = bean;
    this.inList = inList;
  }
}

export interface VGridEditorProps {
  dialogEditor: boolean;
  style?: CSSProperties;
  className?: string;
  editorTitle: string;
  collapseEditor?: boolean;

  plugin: VGridEditorPlugin;
}
interface VGridEditorState { selectBean: any }
export class VGridEditor<T extends VGridEditorProps> extends React.Component<T, VGridEditorState> {
  editorViewId = IDTracker.next();
  selectBean: SelectBean = new SelectBean({}, false);
  popupContext: DialogContext | null = null;
  vgridContext: VGridContext

  constructor(props: T) {
    super(props);
    this.state = { selectBean: { origin: {}, modified: {} } };
    let { plugin } = props;
    this.vgridContext = new VGridContext(this, this.createVGridConfig(), plugin.getModel());
    this.initVGridContext(this.vgridContext);
  }

  initVGridContext(_context: VGridContext) {
  }

  nextEditorViewId() {
    this.editorViewId = IDTracker.next();
  }

  update(beans: Array<any>) {
    let { plugin } = this.props;
    plugin.getModel().update(beans);
    if (beans.length > 0) this.selectBean = new SelectBean(beans[0], true);
    else this.selectBean = new SelectBean({}, false);
  }

  addBean(bean: any) {
    let { plugin } = this.props;
    plugin.getModel().addRecord(bean);
    this.selectBean = new SelectBean(bean, true);
    this.forceUpdate();
  }

  newPopupContext() {
    this.closePopupContext();
    this.popupContext = new DialogContext();
    return this.popupContext;
  }

  closePopupContext() {
    if (this.popupContext) {
      this.popupContext.getDialog().doClose();
      this.popupContext = null;
    }
  }

  createVGridConfig(): VGridConfig { throw new Error('This method method need to be implemented'); }

  renderBeanEditor(): any { throw new Error('This method method need to be implemented'); }

  isEditable() { return true; }

  createNewBean() { return {}; }

  getSelectBean() { return this.selectBean; }

  onSelect(_row: number, bean: any) {
    this.nextEditorViewId();
    this.selectBean = new SelectBean(bean, true);
    let { dialogEditor } = this.props;
    if (dialogEditor) {
      this.renderDialogEditor();
    } else {
      this.forceUpdate();
    }
  }

  onNewAction() {
    this.nextEditorViewId();
    let newBean = this.createNewBean();
    this.selectBean = new SelectBean(newBean, false);
    let { dialogEditor } = this.props;
    if (dialogEditor) {
      this.renderDialogEditor();
    } else {
      this.forceUpdate();
    }
  }

  onDeleteAction() {
    let { plugin, dialogEditor } = this.props;
    plugin.getModel().removeSelectedDisplayRecords();
    if (!dialogEditor) {
      this.onNewAction();
    }
    this.forceUpdate();
  }

  onSaveAction() {
    throw new Error('This method method need to be implemented');
  }

  renderFooterAction() {
    if (!this.isEditable()) return null;
    let btnLabel = this.selectBean.inList ? 'Save' : 'Add'
    let html = (
      <div className='flex-hbox-grow-0 justify-content-end mt-2'>
        <FAButton size='sm' outline onClick={() => this.onSaveAction()}>{btnLabel}</FAButton>
      </div>
    );
    return html;
  }

  renderDialogEditor() {
    let { editorTitle } = this.props;
    editorTitle = this.selectBean.inList ? `Edit ${editorTitle}` : `Add ${editorTitle}`;
    let uiContent = (
      <div className='flex-vbox'>
        <div key={this.editorViewId} className='flex-vbox'>
          {this.renderBeanEditor()}
        </div>
        {this.renderFooterAction()}
      </div>
    );
    showDialog(editorTitle, 'md', uiContent, this.newPopupContext());
  }

  render() {
    let { style, className, dialogEditor } = this.props;
    if (dialogEditor) {
      let html = (<VGrid className={className} style={style} context={this.vgridContext} />);
      return html;
    }
    let { editorTitle, collapseEditor } = this.props;
    collapseEditor = collapseEditor === null ? false : collapseEditor;
    editorTitle = this.selectBean.inList ? `Edit ${editorTitle}` : `Add ${editorTitle}`;
    let html = (
      <HSplit>
        <HSplitPane heightGrow={1}>
          <VGrid className={className} style={style} context={this.vgridContext} />
        </HSplitPane>
        <HSplitPane title={editorTitle} titleShow collapse={collapseEditor} heightGrow={0}>
          <div key={this.editorViewId} className='flex-vbox'>
            {this.renderBeanEditor()}
          </div>
          {this.renderFooterAction()}
        </HSplitPane>
      </HSplit>
    );
    return html;
  }
}