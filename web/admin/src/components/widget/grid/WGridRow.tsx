import React, { Component } from 'react';

import { FAButton, fas } from 'components/widget/fa';
import { WCheckboxInput } from 'components/widget/input';
import { VGridContext, FieldConfig } from './IVGrid';
import { DisplayRecord } from './model/model';
import { VGridConfigUtil } from './util';
import { HeaderCell } from './view/HeaderCell';
class SelectorHeaderCell extends HeaderCell {
  toggleSelectAllRow = (checked: boolean) => {
    let { context } = this.props;
    let state = VGridConfigUtil.getRecordConfigState(context.config);
    state.selectAll = !state.selectAll;
    context.model.getDisplayRecordList().markSelectAllDisplayRecords(checked);
    context.getVGrid().forceUpdateView();
    this.forceUpdate();
  }

  render() {
    let { context, style } = this.props;
    let state = VGridConfigUtil.getRecordConfigState(context.config);
    let cellUI = (
      <div className={`cell cell-header justify-content-center`} style={style}>
        <WCheckboxInput className='m-0 p-0' name='selectAll' checked={state.selectAll}
          onInputChange={this.toggleSelectAllRow} />
      </div>
    );
    return cellUI;
  }
}

export function createSelector(label: string, width: number, removable?: boolean) {
  let col: FieldConfig = {
    name: '_selector_', label: label, width: width, cssClass: 'cell-text-center', 
    container: 'fixed-left', removable: removable, resizable: false,
    customRender: (ctx: VGridContext, _field: FieldConfig, dDecord: DisplayRecord) => {
      return <WGridRecordSelector className='d-inline-block m-auto' context={ctx} row={dDecord.row} />
    },

    customHeaderRender: (ctx: VGridContext, field: FieldConfig, style: any) => {
      return <SelectorHeaderCell context={ctx} field={field} style={style} />
    }
  }
  return col;
}

export function createIndex(label: string, width: number, removable?: boolean) {
  let col: FieldConfig = {
    name: '_index_', label: label, width: width, container: 'fixed-left',
    removable: removable, resizable: false,
    customRender: (_ctx: VGridContext, _field: FieldConfig, record: DisplayRecord) => {
      return <>{record.getDisplayRow()}</>
    }
  }
  return col;
}
export interface WGridRowProps {
  className?: string;
  style?: any;
  context: VGridContext;
  row: number;
}
export class WGridRecordSelector extends Component<WGridRowProps> {
  onToggle = (check: boolean) => {
    let { context, row } = this.props;
    context.model.getDisplayRecordList().markSelectDisplayRecord(row, check)
    this.forceUpdate();
  }

  render() {
    let { className, style, context, row } = this.props;
    let model = context.model;
    let selected = model.getDisplayRecordList().isSelectDisplayRecord(row);
    return (
      <WCheckboxInput className={className} style={style} name='row_selector' checked={selected}
        onInputChange={this.onToggle} />
    );
  }
}

interface WRowActionProps extends WGridRowProps {
  color?: string;
  outline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
export class WGridRowDelete extends Component<WRowActionProps> {
  onRemove = () => {
    let { context, row } = this.props;
    context.model.removeDisplayRecords([row]);
    context.getVGrid().forceUpdateView();
  }

  render() {
    let { className, style, color, outline, size } = this.props;
    return (
      <FAButton className={className} style={style}
        color={color} outline={outline} size={size}
        icon={fas.faTrashAlt} onClick={this.onRemove} />
    );
  }
}

export class WGridMarkRowDeleted extends Component<WRowActionProps> {
  onRemove = () => {
    let { context, row } = this.props;
    context.model.getDisplayRecordList().toggleDeletedDisplayRecord(row);
    context.getVGrid().forceUpdateView();
  }

  render() {
    let { className, style, color, outline, size } = this.props;
    return (
      <FAButton className={className} style={style}
        color={color} outline={outline} size={size}
        icon={fas.faTrashAlt} onClick={this.onRemove} />
    );
  }
}

interface WGridInsertRowProps extends WRowActionProps {
  createInsertRecord: (ctx: VGridContext, atRecord: DisplayRecord) => any;
  allowInsert?: (ctx: VGridContext, atRecord: DisplayRecord) => boolean;
}
export class WGridInsertRow extends Component<WGridInsertRowProps> {
  onInsert = () => {
    let { context, row, createInsertRecord } = this.props;
    let dRecord = context.model.getDisplayRecordList().getDisplayRecordAt(row);
    let newRecord = createInsertRecord(context, dRecord)
    context.model.insertDisplayRecordAt(row, newRecord);
    context.model.getDisplayRecordList().updateDisplayRecords();
    context.getVGrid().forceUpdateView();
  }

  render() {
    let { context, row, className, style, color, outline, size, allowInsert } = this.props;
    let disabled = false;
    if (allowInsert) {
      let dRecord = context.model.getDisplayRecordList().getDisplayRecordAt(row);
      disabled = !allowInsert(context, dRecord);
    }
    return (
      <FAButton className={className} style={style} disabled={disabled}
        color={color} outline={outline} size={size}
        icon={fas.faPlusSquare} onClick={this.onInsert} />
    );
  }
}