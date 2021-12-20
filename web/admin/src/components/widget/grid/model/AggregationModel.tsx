import moment from 'moment';
import { TimeUtil } from 'components/util/common';
import { DisplayRecord, DisplayRecordList } from './model';
export class Bucket {
  name: string;
  label: string;
  buckets: Array<Bucket> | null = null;
  records: Array<any>;
  aggregatedRecords: null | Array<any> = null;
  collapse: boolean;
  aggregation: Aggregation | null = null;

  constructor(name: string, label: any, records: Array<any>, collapse: boolean = false) {
    this.name = name;
    if (!label) label = 'N/A';
    this.label = `${label}`;
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
  name: string;
  enable: boolean;
  invoke(records: Array<any>): any;
}

export class SumAggregationFunction implements IAggregationFunction {
  name: string;
  enable: boolean;
  calculateFields: Array<any>

  constructor(name: string, sumFields: Array<any>, enable: boolean = true) {
    this.name = name;
    this.enable = enable;
    this.calculateFields = sumFields;
  }

  invoke(records: Array<any>) {
    let aggRec: any = { aggLabel: this.name };
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
    let aggRec: any = { aggLabel: this.name };
    for (let i = 0; i < this.calculateFields.length; i++) {
      let field = this.calculateFields[i];
      let avg = super.calculateAggregationValue(field, records) / records.length;
      aggRec[field] = avg;
    }
    return aggRec;
  }
}

export class Aggregation {
  name: string;
  field: string;
  active: boolean;
  sort: null | 'asc' | 'desc' = null;

  aggFunctions: Array<IAggregationFunction> = []
  onClick?: (bucket: Bucket) => void;

  getFieldData: null | ((record: any) => any) = null;

  constructor(name: string, field: string, active: boolean = false) {
    this.name = name;
    this.field = field;
    this.active = active;
  }

  withSortBucket(sort: null | 'asc' | 'desc') {
    this.sort = sort;
    return this;
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

  sortBuckets(buckets: Array<Bucket>) {
    if (!this.sort) return buckets;
    let sortOrder = 1;
    if (this.sort === 'desc') sortOrder = -1;
    const SORT_FUNC = function (b1: Bucket, b2: Bucket) {
      let l1 = b1.label;
      let l2 = b2.label;
      let compare = l1.localeCompare(l2);
      return compare * sortOrder;
    };
    buckets = buckets.sort(SORT_FUNC);
    return buckets;
  }

  runAggFunctions(bucket: Bucket) {
    if (this.aggFunctions.length == 0) return;
    let aggRecords = [];
    let records = bucket.records;
    for (let func of this.aggFunctions) {
      if (!func.enable) continue;
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

  constructor(name: string, field: string, format: string, active: boolean = false) {
    super(name, field, active);
    this.format = format ? format : 'YYYY-MM-DD';
  }

  mapToBucket(bucketMap: any, record: any) {
    let field = this.field;
    let fieldValue = record[field];
    let date = TimeUtil.checkAndParseCompactDateTimeFormat(fieldValue);
    let mapValue = moment(date).format(this.format);
    let selBucket = bucketMap[mapValue];
    if (!selBucket) {
      selBucket = new Bucket(this.name, mapValue, []);
      bucketMap[mapValue] = selBucket;
    }
    selBucket.addRecord(record);
  }
}

export class AggregationDisplayModel extends DisplayRecordList {
  rootLabel: string;
  records: Array<any> = [];
  aggregations: Array<Aggregation> = [];
  rootBucket: Bucket;

  constructor(rootLabel: string, collapse: boolean = true) {
    super();
    this.rootLabel = rootLabel;
    this.rootBucket = new Bucket('root', rootLabel, [], collapse);
  }

  getRootBucket() { return this.rootBucket; };

  /**@override */
  updateRecords(records: Array<any>) {
    this.records = records;
    this.runAggregation();
    return this;
  }

  /**@override */
  updateDisplayRecords() {
    this.displayRecords.length = 0;
    this._addDisplayRecord(this.displayRecords, this.rootBucket, 0);
    return this;
  }

  /**@override */
  markSelectAllDisplayRecords(val: boolean = true) {
    for (let row = 0; row < this.displayRecords.length; row++) {
      let dRecord = this.displayRecords[row];
      if (!dRecord.isDataRecord()) continue;
      let recState = dRecord.getRecordState();
      recState.selected = val;
    }
  }

  addAggregation(aggregation: Aggregation, active: boolean = false) {
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

  moveAggregation(agg: Aggregation, up: boolean) {
    for (let i = 0; i < this.aggregations.length; i++) {
      let selAgg = this.aggregations[i];
      if (agg === selAgg) {
        if (up) {
          if (i == 0) return;
          this.aggregations.splice(i, 1);
          this.aggregations.splice(i - 1, 0, agg);
        } else {
          if (i == this.aggregations.length - 1) return;
          this.aggregations.splice(i, 1);
          this.aggregations.splice(i + 1, 0, agg);
        }
        return;
      }
    }
    throw new Error('Error, agg is not managed')
  }

  runAggregation() {
    this.rootBucket = this._runAggregationWith(this.aggregations, false);
    this.updateDisplayRecords();
  }

  _runAggregationWith(aggregations: Array<any>, forceActive: boolean) {
    let rootBucket = new Bucket('root', this.rootLabel, this.records);
    for (let i = 0; i < aggregations.length; i++) {
      let agg = aggregations[i];
      if (!forceActive && !agg.active) continue;
      this._aggregate(rootBucket, agg);
    }
    return rootBucket;
  }

  _addDisplayRecord(displayRecordHolder: Array<DisplayRecord>, bucket: Bucket, deep: number) {
    let row = displayRecordHolder.length;
    displayRecordHolder.push(
      new DisplayRecord(null, row, false).withModel(bucket).withType('bucket').withIndent(deep));
    if (!bucket.collapse) {
      let children = bucket.buckets;
      if (children != null) {
        for (let i = 0; i < children.length; i++) {
          this._addDisplayRecord(displayRecordHolder, children[i], deep + 1);
        }
      }
      let records = bucket.records;
      if (records) {
        for (let i = 0; i < records.length; i++) {
          let rec = records[i];
          let row = displayRecordHolder.length;
          let dRecord = new DisplayRecord(rec, row, true).withIndent(deep);
          dRecord.rowInBucket = i + 1;
          displayRecordHolder.push(dRecord);
        }
      }
    }
    let aggRecords = bucket.aggregatedRecords;
    if (aggRecords) {
      for (let i = 0; i < aggRecords.length; i++) {
        let aggRecord = aggRecords[i];
        let row = displayRecordHolder.length;
        let dRecord = new DisplayRecord(aggRecord, row, false).withType('agg').withIndent(deep);
        displayRecordHolder.push(dRecord);
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
}