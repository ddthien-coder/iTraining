import React from "react";
import type { FieldContainer } from "../IVGrid";
import { DisplayRecord } from "../model/model";
import { DataCell } from "./DataCell";
import { HeaderCell } from "./HeaderCell";
import { DEFAULT, VGridContext } from "../IVGrid";

export class TableViewModel {
  context: VGridContext;
  footerRecords: Array<any> | null = null;
  records: Array<DisplayRecord> = [];
  headerCellHeight: number = DEFAULT.row.headerHeight;
  dataCellHeight: number = DEFAULT.row.height;

  constructor(context: VGridContext, _viewName: string) {
    this.context = context;
  }

  initRender() { this._initRender(this.context.model.getDisplayRecordList().getDisplayRecords()); }

  _initRender(records: Array<DisplayRecord>) {
    this.records = records;
  }

  getRecordCount() { return this.records.length; }

  getRecord(row: number): DisplayRecord { return this.records[row]; }

  getRecords() { return this.records; }

  getHeaderCellHeight() { return this.headerCellHeight; }

  getDataCellHeight() { return this.dataCellHeight; }

  getGridWidth(group: FieldContainer = 'default') {
    return this.context.getConfigModel().getRecordConfigModel().getVisibleGridWidth(group);
  }

  getColumnWidth(group: FieldContainer, index: number) {
    return this.context.getConfigModel().getRecordConfigModel().getVisibleColumnWidth(group, index);
  }

  getColumnCount(group: FieldContainer = 'default') {
    return this.context.getConfigModel().getRecordConfigModel().getVisibleColumnCount(group);
  }

  createHeaderCell(group: FieldContainer, col: number, style: any) {
    let field = this.context.getConfigModel().getRecordConfigModel().getVisibleColumn(group, col);
    if (field.customHeaderRender) {
      return field.customHeaderRender(this.context, field, style);
    }
    return <HeaderCell context={this.context} field={field} style={style} />;
  }

  createDataCell(group: FieldContainer, style: any, row: number, col: number) {
    let dRecord = this.getRecord(row);
    let field = this.context.getConfigModel().getRecordConfigModel().getVisibleColumn(group, col);
    return (<DataCell style={style} context={this.context} field={field} record={dRecord} col={col} />);
  }

  getFooterRowCount() {
    if (!this.footerRecords) return -1;
    return this.footerRecords.length;
  }

  setFooterRecords(records: Array<any>) {
    this.footerRecords = records;
  }

  createFooterDataCell(group: FieldContainer, style: any, row: number, col: number) {
    if (!this.footerRecords) {
      throw new Error('Footer records cannot be null');
    }
    let record = this.footerRecords[row];
    let field = this.context.getConfigModel().getRecordConfigModel().getVisibleColumn(group, col);
    if (field.name.startsWith('_')) return <></>;
    let dRecord = new DisplayRecord(record, row, false);
    return (<DataCell style={style} context={this.context} field={field} record={dRecord} col={col} />);
  }
}