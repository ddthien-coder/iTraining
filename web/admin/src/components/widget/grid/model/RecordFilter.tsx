import { ObjUtil } from "components/util/common";

export const ALL = '_all_';
interface IRecordFilter {
  name: string;
  filter: (records: Array<any>) => Array<any>;
}

class RecordFieldValueFilter implements IRecordFilter {
  name: string;
  field: string;
  value?: string;

  constructor(name: string, field: string, value?: string) {
    this.name = name;
    this.field = field;
    this.value = value;
  }

  filter(records: Array<any>) {
    let holder = new Array<any>();
    for (let record of records) {
      let recValue = record[this.field];
      if (!this.value && !recValue) {
        holder.push(record);
        continue;
      }
      if (!recValue) continue;
      let stringVal = `${recValue}`;
      if (stringVal == this.value) {
        holder.push(record);
      }
    }
    return holder;
  }
}

class RecordPatternFilter implements IRecordFilter {
  name: string;
  pattern: string = '';
  caseSensitive: boolean;

  constructor(name: string, caseSensitive: boolean = false) {
    this.name = name;
    this.caseSensitive = caseSensitive;
  }

  withPattern(pattern?: string) {
    if (!pattern) pattern = '';
    else pattern = pattern.trim();
    this.pattern = pattern;
  }

  filter(records: Array<any>) {
    if (!this.pattern || this.pattern.length == 0) return records;
    let holder = new Array<any>();
    for (let i = 0; i < records.length; i++) {
      let record = records[i];
      if (ObjUtil.recordHasExpression(record, this.pattern, this.caseSensitive)) {
        holder.push(record);
      }
    }
    return holder;
  }
}

export class RecordFilter {
  filters: Record<string, IRecordFilter> = {};
  patternFilter = new RecordPatternFilter('expression', false);

  getPattern() { return this.patternFilter.pattern; }

  withPattern(pattern: string) {
    this.patternFilter.withPattern(pattern);
  }

  addFieldValueFilter(name: string, field: string, value?: string) {
    if (value === ALL) {
      this.removeFilter(name);
      return;
    }
    this.addFilter(new RecordFieldValueFilter(name, field, value));
  }

  addFilter(filter: IRecordFilter) {
    this.filters[filter.name] = filter;
  }

  removeFilter(name: string) {
    if (!this.filters[name]) {
      throw new Error(`No filter with name ${name} is found!`);
    }
    delete this.filters[name];
  }

  filter(records: Array<any>) {
    let filteredRecords = records;
    for (let name in this.filters) {
      let filter = this.filters[name];
      filteredRecords = filter.filter(filteredRecords);
    }
    filteredRecords = this.patternFilter.filter(filteredRecords);
    return filteredRecords;
  }

  clear() {
    this.filters = { };
    this.patternFilter = new RecordPatternFilter('expression', false);
  }
}