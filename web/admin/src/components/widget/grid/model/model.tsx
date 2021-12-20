export const ASC_SORT_RECORD = function (field: string, rec1: any, rec2: any) {
  let val1 = 0;
  let val2 = 0;
  if (rec1) val1 = rec1[field];
  if (rec2) val2 = rec2[field];
  if (val1 === val2) return 0;
  return (val1 > val2) ? 1 : -1;
};

export const DESC_SORT_RECORD = function (field: string, rec1: any, rec2: any) {
  return ASC_SORT_RECORD(field, rec1, rec2) * -1;
};

export class RecordState {
  row: number;
  selected: boolean = false;

  marked: boolean = false;

  newCreated: boolean = false;
  modified: boolean = false;
  deleted: boolean = false;

  constructor(row: number) {
    this.row = row;
  }

  isMarked() { return this.marked; }
  setMarked(val: boolean) { this.marked = val; }

  isMarkDeleted() { return this.deleted }

  isMarkModified() { return this.modified }

  isMarkNew() { return this.newCreated }

  markModified(val: boolean = true) { this.modified = val; }

  markDeleted(val: boolean = true) { this.deleted = val; }
  toggleDeleted() { this.deleted = !this.deleted; }

  markNew(val: boolean = true) { this.newCreated = val; }
}

export function initRecordStates(records: Array<any>) {
  for (let row = 0; row < records.length; row++) {
    let record = records[row];
    record['_state'] = new RecordState(row);
  }
}

export function initRecordState(record: any, row: number) {
  let state = new RecordState(row);
  record['_state'] = state;
  return state;
}

export function getRecordState(record: any) {
  if (!record['_state']) {
    throw new Error('Record state is not initialized');
  }
  let state: RecordState = record['_state'];
  return state;
}

export class DisplayRecord {
  record: any;
  row: number;
  rowInBucket?: number;
  model: any;
  type: 'data' | 'agg' | 'bucket' | 'unknown' = 'data';
  indentLevel: number = 0;

  constructor(record: any, row: number, dataRecord: boolean) {
    if (dataRecord) {
      if (!record['_state']) {
        throw new Error('Record state is not initialized');
      }
    } else {
      this.type = 'unknown';
    }
    this.record = record;
    this.row = row;
  }

  isDataRecord() { return this.type == 'data' }

  getRecordState(madatory: boolean = true) {
    if (madatory) return getRecordState(this.record);
    let recState: RecordState = this.record['_state'];
    return recState;
  }

  getDisplayRow() {
    if(this.rowInBucket) return this.rowInBucket;
    return this.row + 1;
  }

  getIndentLevel() { return this.indentLevel; }

  withModel(model: any) {
    this.model = model;
    return this;
  }

  withIndent(level: number) {
    this.indentLevel = level;
    return this;
  }

  withType(type: 'agg' | 'bucket') {
    this.type = type;
    return this;
  }

  cloneRecord() {
    let newRecord = Object.assign({}, this.record);
    delete newRecord['_state'];
    return newRecord;
  }
}

export interface IDisplayRecordList {
  updateRecords: (records: Array<any>) => IDisplayRecordList;
  updateDisplayRecords: () => IDisplayRecordList;
  getDisplayRecords: () => Array<DisplayRecord>;
  getDisplayRecordAt: (idx: number) => DisplayRecord;

  isSelectDisplayRecord: (row: number) => boolean;
  getSelectedDisplayRecords(): Array<DisplayRecord>;
  markSelectDisplayRecord: (row: number, val?: boolean) => void;
  markSelectAllDisplayRecords: (val?: boolean) => void;

  markModifiedDisplayRecord: (row: number, val?: boolean) => void;
  markDeletedDisplayRecord: (row: number, val?: boolean) => void;
  toggleDeletedDisplayRecord: (row: number, val?: boolean) => void;
}

export class DisplayRecordList implements IDisplayRecordList {
  displayRecords = new Array<DisplayRecord>();

  updateRecords(records: Array<any>) {
    this.displayRecords.length = 0;
    for (let i = 0; i < records.length; i++) {
      let record = records[i];
      this.displayRecords.push(new DisplayRecord(record, i, true));
    }
    return this;
  }

  updateDisplayRecords() { return this; }

  getDisplayRecords() { return this.displayRecords; }

  getDisplayRecordAt(row: number) { return this.displayRecords[row]; }

  isSelectDisplayRecord(row: number) {
    let displayRec = this.displayRecords[row];
    if (displayRec.type != 'data') return false;
    return displayRec.getRecordState().selected;
  }

  getSelectedDisplayRecords() {
    let holder = [];
    for (let row = 0; row < this.displayRecords.length; row++) {
      let displayRecord = this.displayRecords[row];
      if (displayRecord.getRecordState().selected) {
        holder.push(displayRecord.record);
      }
    }
    return holder;
  }

  markSelectDisplayRecord(row: number, val: boolean = true) {
    let recState = this.displayRecords[row].getRecordState();
    recState.selected = val;
  }

  markSelectAllDisplayRecords(val: boolean = true) {
    for (let row = 0; row < this.displayRecords.length; row++) {
      let recState = this.displayRecords[row].getRecordState();
      recState.selected = val;
    }
  }

  markModifiedDisplayRecord(row: number) {
    let recState = this.displayRecords[row].getRecordState();
    recState.markModified();
  }

  markDeletedDisplayRecord(row: number) {
    let recState = this.displayRecords[row].getRecordState();
    recState.markDeleted();
  }

  toggleDeletedDisplayRecord(row: number) {
    let recState = this.displayRecords[row].getRecordState();
    recState.toggleDeleted();
  }
}