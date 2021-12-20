import moment from 'moment';
import { ObjUtil } from "components/util/common";

export class Bucket {
  name: string;
  label: string;
  aggregation: Aggregation | null = null;
  buckets: Array<Bucket> | null = null;
  records: Array<any>;
  aggregatedRecords: null | Array<any> = null;
  collapse: boolean;

  constructor(name: string, label: string, records: Array<any>, collapse: boolean = false) {
    this.name = name;
    this.label = label;
    this.records = records;
    this.collapse = collapse;
  }

  setRecords(records: Array<any>) {
    this.records = records;
    this.buckets = [];
  }

  getNumOfRecords() {
    if (this.buckets != null && this.buckets.length > 0) {
      let numOfRecords = 0;
      for (let i = 0; i < this.buckets.length; i++) {
        numOfRecords += this.buckets[i].getNumOfRecords();
      }
      return numOfRecords;
    } else {
      if (!this.records) return 0;
      return this.records.length;
    }
  }

  getChildrenBuckets() { return this.buckets; }

  addRecord(record: any) {
    if (this.records == null) this.records = [];
    this.records.push(record);
  }

  traverse(visit: any) {
    visit(this);
    let buckets = this.getChildrenBuckets();
    if (buckets == null) return;
    for (let i = 0; i < buckets.length; i++) {
      buckets[i].traverse(visit);
    }
  }

  findBucketsByName(name: string) {
    let holder: Array<any> = [];
    let visitor = (bucket: Bucket) => {
      if (bucket.name === name) holder.push(bucket);
    };
    this.traverse(visitor);
    return holder;
  }

  findLeafBucket() {
    let holder: Array<Bucket> = [];
    let visitor = (bucket: Bucket) => {
      if (!bucket.buckets) holder.push(bucket);
    };
    this.traverse(visitor);
    return holder;
  }
}

export interface IAggregationFunction {
  invoke(records: Array<any>): any;
}

export class SumAggregationFunction implements IAggregationFunction {
  name: string;
  calculateFields: Array<any>

  constructor(name: string, sumFields: Array<any>) {
    this.name = name;
    this.calculateFields = sumFields;
  }

  invoke(records: Array<any>) {
    let aggRec: any = { treeNodeLabel: this.name };
    for (let i = 0; i < this.calculateFields.length; i++) {
      let field = this.calculateFields[i];
      let sum = this.calculateAggregationValue(field, records);
      aggRec[field] = sum;
    }
    return aggRec;
  }

  calculateAggregationValue(field: string, records: Array<any>) {
    let sum = 0;
    for (let i = 0; i < records.length; i++) {
      let rec = records[i];
      sum += rec[field];
    }
    return sum;
  }
}

export class AvgAggregationFunction extends SumAggregationFunction {
  invoke(records: Array<any>) {
    let aggRec: any = { treeNodeLabel: this.name };
    for (let i = 0; i < this.calculateFields.length; i++) {
      let field = this.calculateFields[i];
      let avg = super.calculateAggregationValue(field, records) / records.length;
      aggRec[field] = avg;
    }
    return aggRec;
  }

}

class Aggregation {
  name: string;
  field: string;
  active: boolean;
  aggFunctions: Array<IAggregationFunction> = []
  onClick?: (bucket: Bucket) => void;

  getFieldData: null | ((record: any) => any) = null;

  constructor(name: string, field: string, active: boolean = false) {
    this.name = name;
    this.field = field;
    this.active = active;
  }

  withFieldGetter(getter: (record: any) => any) {
    this.getFieldData = getter;
    return this;
  }

  withAggFunction(func: IAggregationFunction) {
    this.aggFunctions.push(func);
    return this;
  }

  withOnClick(onClick: (bucket: Bucket) => void) {
    this.onClick = onClick;
    return this;
  }

  mapToBucket(_bucketMap: any, _record: any) {
    throw new Error("This method need to be implemented");
  }

  sortBuckets(buckets: Array<Bucket>) { return buckets; }

  runAggFunctions(bucket: Bucket) {
    if (this.aggFunctions.length == 0) return;
    let aggRecords = [];
    let records = bucket.records;
    for (let func of this.aggFunctions) {
      let aggRecord = func.invoke(records);
      aggRecords.push(aggRecord);
    }
    bucket.aggregatedRecords = aggRecords;
  }
}

export class ValueAggregation extends Aggregation {
  mapToBucket(bucketMap: any, record: any) {
    let field = this.field;
    let fieldValue = null;
    if (this.getFieldData) {
      fieldValue = this.getFieldData(record);
    } else {
      fieldValue = record[field];
    }
    let selBucket = bucketMap[fieldValue];
    if (!selBucket) {
      selBucket = new Bucket(this.name, fieldValue, []);
      bucketMap[fieldValue] = selBucket;
    }
    selBucket.addRecord(record);
  }
}

export class DateValueAggregation extends Aggregation {
  format: string;

  constructor(name: string, field: string, format: string) {
    super(name, field);
    this.format = format ? format : 'YYYY-MM-DD';
  }

  mapToBucket(bucketMap: any, record: any) {
    let field = this.field;
    let fieldValue = record[field];
    let mapValue = moment(fieldValue).format(this.format);
    let selBucket = bucketMap[mapValue];
    if (!selBucket) {
      selBucket = new Bucket(this.name, mapValue, []);
      bucketMap[mapValue] = selBucket;
    }
    selBucket.addRecord(record);
  }

  sortBuckets(buckets: Array<Bucket>) {
    const SORT_FUNC = function (b1: Bucket, b2: Bucket) {
      let l1 = b1.label;
      let l2 = b2.label;
      if (l1 === l2) return 0;
      return (l1 > l2) ? 1 : -1;
    };
    return buckets.sort(SORT_FUNC);
  }
}

export class TreeTableModel {
  rootLabel: string;

  records: Array<any>;
  filterExp: null | string;
  filterRecords: Array<any>;

  tableRows: Array<any> = [];

  aggregations: Array<any> = [];
  rootBucket: Bucket;

  constructor(rootLabel: string, records: Array<any>, collapse: boolean = true) {
    this.rootLabel = rootLabel;

    this.filterExp = '';
    this.records = records;
    this.filterRecords = records;
    this.setRowIndex();

    this.rootBucket = new Bucket('root', rootLabel, this.filterRecords, collapse);
  }

  getFilterExp() { return this.filterExp; }

  getRootBucket() { return this.rootBucket; };

  update(records: Array<any>) {
    this.records = records;
    this.filter(this.filterExp);
    this.setRowIndex();
    this.runAggregation();
  }

  setRowIndex() {
    for (let row = 0; row < this.filterRecords.length; row++) {
      let rec = this.filterRecords[row];
      rec['_row'] = row;
    }
  }

  toggleSelectRow(row: number) {
    let rec = this.filterRecords[row];
    if (!rec['_selected']) rec['_selected'] = true;
    else delete rec['_selected'];
  }

  toggleSelectAllRow() {
    for (let row = 0; row < this.filterRecords.length; row++) {
      let rec = this.filterRecords[row];
      if (!rec['_selected']) rec['_selected'] = true;
      else delete rec['_selected'];
    }
  }

  removeSelectedRows() {
    let holder = [];
    for (let i = 0; i < this.records.length; i++) {
      let rec = this.records[i];
      if (rec['_selected']) continue;
      holder.push(rec);
    }
    this.update(holder);
  }

  addAggregation(aggregation: any, active: boolean = false) {
    this.aggregations.push(aggregation);
    if (active) aggregation.active = true;
  }

  setActivateAggregation(name: string, active: boolean) {
    for (let i = 0; i < this.aggregations.length; i++) {
      if (this.aggregations[i].name === name) {
        this.aggregations[i].active = active;
        return;
      }
    }
  }

  runAggregation() {
    this.rootBucket = this.runAggregationWith(this.aggregations, false);
    this.buildTableRows();
  }

  runAggregationWith(aggregations: Array<any>, forceActive: boolean) {
    let rootBucket = new Bucket('root', this.rootLabel, this.filterRecords);

    for (let i = 0; i < aggregations.length; i++) {
      let agg = aggregations[i];
      if (!forceActive && !agg.active) continue;
      this._aggregate(rootBucket, agg);
    }
    return rootBucket;
  }

  getTableRows() { return this.tableRows; }

  buildTableRows() {
    this.tableRows = [];
    this.addTableRow(this.tableRows, this.rootBucket, 0);
  }

  addTableRow(tableRowHolder: Array<any>, bucket: Bucket, deep: number) {
    tableRowHolder.push({ deep: deep, bucket: bucket })
    if (!bucket.collapse) {
      let children = bucket.buckets;
      if (children != null) {
        for (let i = 0; i < children.length; i++) {
          this.addTableRow(tableRowHolder, children[i], deep + 1);
        }
      }
      let records = bucket.records;
      if (records) {
        for (let i = 0; i < records.length; i++) {
          let rec = records[i];
          tableRowHolder.push({ deep: deep, record: rec })
        }
      }
    }
    let aggRecords = bucket.aggregatedRecords;
    if (aggRecords) {
      for (let i = 0; i < aggRecords.length; i++) {
        let rec = aggRecords[i];
        tableRowHolder.push({ deep: deep, aggRecord: rec })
      }
    }
  }

  _aggregate(parentBucket: any, aggregation: Aggregation) {
    let childrenBuckets = parentBucket.buckets;
    if (childrenBuckets != null) {
      for (let j = 0; j < childrenBuckets.length; j++) {
        this._aggregate(childrenBuckets[j], aggregation);
      }
      return;
    }

    let records = parentBucket.records;
    let bucketMap: any = {};
    for (let i = 0; i < records.length; i++) {
      aggregation.mapToBucket(bucketMap, records[i]);
    }
    let buckets = [];
    for (let key in bucketMap) {
      if (bucketMap.hasOwnProperty(key)) {
        let bucket: Bucket = bucketMap[key];
        aggregation.runAggFunctions(bucket);
        bucket.aggregation = aggregation;
        buckets.push(bucket);
      }
    }

    parentBucket.buckets = aggregation.sortBuckets(buckets);
    parentBucket.records = null;
    parentBucket.collapse = false;
  }

  filter(exp: null | string) {
    this.filterExp = exp;
    if (!exp || exp.length === 0) {
      this.filterRecords = this.records;
    } else {
      this.filterRecords = [];
      for (let i = 0; i < this.records.length; i++) {
        let record = this.records[i];
        if (ObjUtil.recordHasExpression(record, exp)) {
          this.filterRecords.push(record);
        }
      }
    }
  }
}
