import React from "react";
import { Component } from "react";
import { formater } from "components/util/text";
import { FAButton } from "components/widget/fa";
import {
  BBStringField, BBIntField, BBLongField, BBDoubleField, BBNumberField, BBCurrencyField
} from "components/widget/input";

import { DisplayRecord } from '../model/model'
import { VGridContext, VGridContextProps, FieldConfig } from '../IVGrid'
import { VGridConfigUtil } from '../util'

export function formatCellValue(field: FieldConfig, val: any): any {
  if (val == null) return null;
  if (field.format) return field.format(val);

  if (typeof val.getMonth === 'function') return formater.dateTime(val);
  else if (typeof val === 'number') return formater.number(val);
  else if (typeof val === 'boolean') return val ? 'True' : 'False';
  return val;
}

function getCellType(_field: FieldConfig, val: any): any {
  if (val == null) return '';
  if (typeof val.getMonth === 'function') return 'date';
  else if (typeof val === 'number') return 'number';
  else if (typeof val === 'boolean') return 'boolean';
  return 'text';
}

export interface DataCellProps extends VGridContextProps {
  className?: string;
  style?: any;
  field: FieldConfig;
  record: DisplayRecord;
  col: number;
  editMode?: boolean;
}
export interface DataCellState { editMode: boolean }
export class DataCell extends Component<DataCellProps, DataCellState> {

  constructor(props: DataCellProps) {
    super(props);
    let { field } = props;
    let editMode = false;
    if (field.editor) editMode = field.editor.enable ? true : false;
    this.state = { editMode: editMode };
  }

  onEdit(field: any, record: any): void {
    if (field.editor.isEditable) {
      if (!field.editor.isEditable(field, record)) return;
    }
    this.setState({ editMode: true });
  }

  onClick = () => {
    const { context, field, record } = this.props;
    if (field.onClick) {
      field.onClick(context, record);
    }
  }

  onInputChange = (_bean: any, _fieldName: string, oldVal: any, newVal: any) => {
    const { context, field, record } = this.props;
    if (!field.editor) throw new Error('Invalid state');
    if (oldVal != newVal) {
      let state = record.getRecordState();
      state.markModified();
    }
    if (field.editor.onInputChange) {
      field.editor.onInputChange(context, record, field, oldVal, newVal);
    }
  }

  renderCustomCell(ctx: VGridContext, field: FieldConfig, dDecord: DisplayRecord) {
    if (!field.customRender) throw new Error('Invalid State');
    return field.customRender(ctx, field, dDecord);
  }

  renderOnClickCell(ctx: VGridContext, field: FieldConfig, dRecord: DisplayRecord) {
    let cellValue = null;
    if (field.customRender) {
      cellValue = field.customRender(ctx, field, dRecord);
    } else if (field.fieldDataGetter) {
      cellValue = field.fieldDataGetter(dRecord.record);
    } else {
      cellValue = formatCellValue(field, dRecord.record[field.name]);
    }
    let cellType = getCellType(field, dRecord.record[field.name]);
    let className = `cell-${cellType}`
    return (
      <div className={`${className} w-100`}>
        <FAButton color='link' onClick={this.onClick}>{cellValue}</FAButton>
      </div>
    );
  }

  renderCellEditor(field: FieldConfig, dRecord: DisplayRecord) {
    let BBTypeField: any = null;
    let editor = field.editor;
    if (!editor) throw new Error('No editor config');
    let { validators, required, type } = editor;
    if (type === 'int') BBTypeField = BBIntField;
    else if (type === 'long') BBTypeField = BBLongField;
    else if (type === 'double') BBTypeField = BBDoubleField;
    else if (type === 'number') BBTypeField = BBNumberField;
    else if (type === 'currency') BBTypeField = BBCurrencyField;
    else if (type === 'string') BBTypeField = BBStringField;
    else throw new Error(`Unknown field type ${type}`);
    let record = dRecord.record;
    return (
      <div className='form p-0 flex-hbox'>
        <BBTypeField
          bean={record} field={field.name} validators={validators} required={required}
          onInputChange={this.onInputChange} />
      </div>
    );
  }

  renderCell(field: FieldConfig, dRecord: DisplayRecord) {
    let cellData = null;
    if (field.fieldDataGetter) cellData = field.fieldDataGetter(dRecord.record);
    else cellData = formatCellValue(field, dRecord.record[field.name]);
    let className = field.cssClass;
    if(!className) {
      className = 'cell-' + getCellType(field, dRecord.record[field.name]);
    }
    return (<div className={`${className} w-100`}>{cellData}</div>);
  }

  render() {
    const { context, field, record, col, style } = this.props;
    const { editMode } = this.state;
    let row = record.row;
    let cssRow = row % 2 ? 'odd' : 'even';
    let cssCol = col % 2 ? 'odd' : 'even';
    let className = `cell cell-${cssRow}-${cssCol}`;
    let cellUI = null;
    if (editMode && field.editor) cellUI = this.renderCellEditor(field, record);
    else if (field.customRender) cellUI = this.renderCustomCell(context, field, record);
    else if (field.onClick) cellUI = this.renderOnClickCell(context, field, record);
    else cellUI = this.renderCell(field, record);
    let mergeStyle = field.style ? { ...field.style, ...style } : style;
    let mergeClass = field.cssClass ? `${className} ${field.cssClass}` : className;
    let fieldState = VGridConfigUtil.getFieldConfigState(field);
    if (fieldState.showRecordState) {
      let recState = record.getRecordState(false);
      //Footer data cell does not have the RecordState
      if (recState) {
        if (recState.isMarkNew()) {
          mergeClass = `${mergeClass} cell-state-new`;
        }
        if (recState.isMarkModified()) {
          mergeClass = `${mergeClass} cell-state-modified`;
        }
        if (recState.isMarkDeleted()) {
          mergeClass = `${mergeClass} cell-state-deleted`;
        }
      }
    }
    return (<div className={mergeClass} style={mergeStyle}>{cellUI}</div>);
  }
}