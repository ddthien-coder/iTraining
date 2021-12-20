import { RecordFilter } from "./RecordFilter";

import {
  initRecordStates, initRecordState, getRecordState,
  IDisplayRecordList, DisplayRecordList
} from "./model";

export class ListModel {
  lastModifiedList: number = -1;
  records: Array<any> = [];
  recordFilter = new RecordFilter();
  filteredRecords: Array<any> = [];
  displayRecordList: IDisplayRecordList = new DisplayRecordList();

  constructor(records: Array<any>) {
    this.update(records);
  }

  update(records: Array<any>) {
    initRecordStates(records);
    this.records = records;
    this.filter();
  }

  replaceWith(records: Array<any>) {
    initRecordStates(records);
    this.records.length = 0
    this.records.push(...records);
    this.filter();
  }

  reset() {
    initRecordStates(this.records);
    this.filter();
  }

  getRecordFilter() { return this.recordFilter; }

  getRecords(): Array<any> { return this.records; }

  getFilterRecords(): Array<any> { return this.filteredRecords; }

  getDisplayRecordList() { 
    return this.displayRecordList; 
  }

  setDisplayRecordList(list: IDisplayRecordList) {
    this.displayRecordList = list;
    this.displayRecordList.updateRecords(this.filteredRecords);
  }

  addRecord(record: any): void {
    initRecordStates([record]);
    this.records.push(record);
    this.filter();
  }

  addRecords(records?: Array<any>): void {
    if (!records) return;
    if (records.length == 0) return;
    initRecordStates(records);
    this.records.push(...records);
    this.filter();
  }

  removeRecord(record: any): void {
    for(let i = 0; i < this.records.length; i++) {
      if(this.records[i] == record) {
        this.records.splice(i, 1);
        this.filter();
        return;
      }
    }
  }

  getMarkModifiedRecords() {
    let holder = [];
    for (let row = 0; row < this.records.length; row++) {
      let record = this.records[row];
      let state = getRecordState(record);
      if (state.isMarkModified()) holder.push(record);
    }
    return holder;
  }

  getMarkDeletedRecords() {
    let holder = [];
    for (let row = 0; row < this.records.length; row++) {
      let record = this.records[row];
      let state = getRecordState(record);
      if (state.isMarkDeleted()) holder.push(record);
    }
    return holder;
  }

  getModifiedRecords() {
    let holder = [];
    for (let row = 0; row < this.records.length; row++) {
      let record = this.records[row];
      let state = getRecordState(record);
      if (state.isMarkModified() || state.isMarkDeleted()) holder.push(record);
    }
    return holder;
  }

  getSelectedRecords() {
    let holder = [];
    for (let row = 0; row < this.records.length; row++) {
      let record = this.records[row];
      let state = getRecordState(record);
      if (state.selected) holder.push(record);
    }
    return holder;
  }

  getSelectedRecordIds() {
    let ids: Array<any> = [];
    for (let row = 0; row < this.filteredRecords.length; row++) {
      let record = this.filteredRecords[row];
      let state = getRecordState(record);
      if (state.selected) ids.push(record.id);
    }
    return ids;
  }

  insertDisplayRecordAt(row: number, newRecord: any) {
    let dRecord = this.getDisplayRecordList().getDisplayRecordAt(row);
    let record = dRecord.record;
    let newRecordState = initRecordState(newRecord, -1);
    newRecordState.markNew();
    for (let i = 0; i < this.records.length; i++) {
      let sel = this.records[i];
      if (sel === record) {
        this.records.splice(i + 1, 0, newRecord);
        break;
      }
    }
    if (this.filteredRecords != this.records) {
      for (let i = 0; i < this.filteredRecords.length; i++) {
        let sel = this.filteredRecords[i];
        if (sel === record) {
          this.filteredRecords.splice(i + 1, 0, newRecord);
          break;
        }
      }
    }
    for (let i = 0; i < this.filteredRecords.length; i++) {
      let sel = this.filteredRecords[i];
      let recState = getRecordState(sel);
      recState.row = i;
    }
    this.getDisplayRecordList().updateRecords(this.filteredRecords);
  }

  removeDisplayRecords(rows: Array<number>) {
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      let dRecord = this.displayRecordList.getDisplayRecordAt(row);
      dRecord.getRecordState().setMarked(true);
    }
    let holder = [];
    for (let i = 0; i < this.records.length; i++) {
      let rec = this.records[i];
      let state = getRecordState(rec);
      if (state.isMarked()) continue;
      holder.push(rec);
    }
    this.replaceWith(holder);
  }

  removeSelectedDisplayRecords() {
    let holder = [];
    for (let row = 0; row < this.records.length; row++) {
      let record = this.records[row];
      let state = getRecordState(record);
      if (state.selected) continue;
      holder.push(record);
    }
    this.replaceWith(holder);
  }

  filter() {
    this.filteredRecords = this.recordFilter.filter(this.records);
    this.displayRecordList.updateRecords(this.filteredRecords);
    this.lastModifiedList = new Date().getTime();
  }

  sort(field: string, desc: boolean = false) {
    let sortFunc = function (rec1: any, rec2: any) {
      let val1 = 0;
      let val2 = 0;
      if (rec1) val1 = rec1[field];
      if (rec2) val2 = rec2[field];
      if (val1 === val2) return 0;
      let result = (val1 > val2) ? 1 : -1;
      if (desc) return result * -1;
      return result;
    };
    this.filteredRecords.sort(sortFunc);
    this.displayRecordList.updateRecords(this.filteredRecords);
  }
}
