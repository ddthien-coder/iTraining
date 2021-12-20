import { WComponent, WComponentProps } from 'core/widget';
export interface RecordFilter {
  filter: (records: Array<any>) => Array<any>
}

export class ExcludeRecordFilter implements RecordFilter {
  field: string;
  fieldToCompare: string;
  excludeValues: Set<any> = new Set<any>();

  constructor(records: Array<any>, field: string, fieldToCompare: string | null = null) {
    this.field = field;
    if (fieldToCompare) this.fieldToCompare = fieldToCompare;
    else this.fieldToCompare = field;

    for (let rec of records) {
      this.excludeValues.add(rec[field]);
    }
  }

  filter(records: Array<any>): Array<any> {
    let holder = new Array<any>();
    for (let sel of records) {
      let value = sel[this.fieldToCompare];
      if (this.excludeValues.has(value)) continue;
      holder.push(sel);
    }
    return holder;
  }
}
export class ExcludeRecordIdFilter implements RecordFilter {
  idSet: Set<any> = new Set<any>();

  constructor(records?: Array<any>) {
    if (records) this.addRecords(records);
  }

  addExcludeId(id: any) {
    this.idSet.add(id)
    return this;
  }

  addRecord(record: any) {
    this.idSet.add(record['id']);
    return this;
  }

  addRecords(records: Array<any>) {
    for (let record of records) {
      this.idSet.add(record['id']);
    }
    return this;
  }

  filter(records: Array<any>): Array<any> {
    let holder = new Array<any>();
    for (let sel of records) {
      if (this.idSet.has(sel.id)) continue;
      holder.push(sel);
    }
    return holder;
  }
}
export interface WCommittableEntityListProps extends WComponentProps {
  onModify?: (entities: Array<any>, entity: any, field: string) => void;
  onPostCommit?: (entities: Array<any>) => void;
  onPostRollback?: (entities: Array<any>) => void;
}
export class WCommittableEntityList<T extends WCommittableEntityListProps = WCommittableEntityListProps>
  extends WComponent<T> {

  onPostCommit(entities: Array<any>) {
    let { onPostCommit } = this.props;
    if (onPostCommit) {
      onPostCommit(entities);
    } else {
      this.forceUpdate();
    }
  }

  onPostRollback(entities: Array<any>) {
    let { onPostRollback } = this.props;
    if (onPostRollback) {
      onPostRollback(entities);
    } else {
      this.forceUpdate();
    }
  }
}