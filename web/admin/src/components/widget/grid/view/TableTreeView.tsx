import React from 'react';

import { fas, FAButton } from "components/widget/fa";
import { TableView } from "./TableView";
import type {
  VGridContext, VGridViewProps, FieldContainer,
  FieldConfig,
  VGridTreeViewConfig
} from "../IVGrid";
import { VGridConfigUtil } from '../util'
import { TableViewModel } from "./TableViewModel";
import { DataCell } from "./DataCell";
import { DisplayRecord } from '../model';

export class TreeDataCell extends DataCell {
  onToggleDisplayRecord(dRecord: DisplayRecord) {
    let { context } = this.props;
    let treeRecord = dRecord.model;
    treeRecord.collapse = !treeRecord.collapse;
    context.model.getDisplayRecordList().updateDisplayRecords();
    context.getVGrid().forceUpdateView();
  }

  wrapWithToggleButton(cellUI: any, dRecord: DisplayRecord) {
    let treeRecord = dRecord.model;
    let indent = dRecord.indentLevel * 15;
    let toggleBtn = null;
    if (treeRecord.children && treeRecord.children.length > 0) {
      let icon = fas.faCaretDown;
      if (treeRecord.collapse) icon = fas.faCaretRight;
      toggleBtn = (
        <FAButton className='mr-1' color='link' icon={icon} onClick={() => this.onToggleDisplayRecord(dRecord)} />
      );
    } else {
      indent -= 5;
    }
    let html = (
      <div className='flex-hbox'>
        <div style={{ paddingLeft: indent }}>{toggleBtn}</div>
        {cellUI}
      </div>
    );
    return html;
  }

  renderCellEditor(field: FieldConfig, dRecord: DisplayRecord) {
    let cellUI = super.renderCellEditor(field, dRecord);
    return this.wrapWithToggleButton(cellUI, dRecord);
  }

  renderOnClickCell(ctx: VGridContext, field: FieldConfig, dRecord: DisplayRecord) {
    let cellUI = super.renderOnClickCell(ctx, field, dRecord);
    return this.wrapWithToggleButton(cellUI, dRecord);
  }

  renderCell(field: FieldConfig, dRecord: DisplayRecord) {
    let cellUI = super.renderCell(field, dRecord);
    return this.wrapWithToggleButton(cellUI, dRecord);
  }

  renderCustomCell(ctx: VGridContext, field: FieldConfig, dRecord: DisplayRecord) {
    let cellUI = super.renderCustomCell(ctx, field, dRecord);
    return this.wrapWithToggleButton(cellUI, dRecord);
  }
}

class TableTreeViewModel extends TableViewModel {
  treeField: string;

  constructor(context: VGridContext, viewName: string) {
    super(context, viewName);
    let treeView = VGridConfigUtil.getView(context.config, viewName) as VGridTreeViewConfig;
    this.treeField = treeView.treeField;
  }

  createDataCell(group: FieldContainer, style: any, row: number, col: number) {
    let dRecord = this.getRecord(row);
    let field = this.context.getConfigModel().getRecordConfigModel().getVisibleColumn(group, col);
    if (field.name === this.treeField) {
      return (<TreeDataCell style={style} context={this.context} field={field} record={dRecord} col={col} />);
    }
    return (<DataCell style={style} context={this.context} field={field} record={dRecord} col={col} />);
  }
}
export class TableTreeView extends TableView {
  createViewModel(props: VGridViewProps) {
    let { context, viewName } = props;
    return new TableTreeViewModel(context, viewName);
  }
}