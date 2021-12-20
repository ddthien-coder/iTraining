import { DisplayRecord, DisplayRecordList } from './model';
import { RecordMap } from 'components/util/Collections';
export class TreeDisplayModelPlugin {
  getId(record: any): any { return record['id']; }
  getParentId(record: any): any { return record['parentId']; }

  isRootRecord(record: any): boolean {
    let parentId = this.getParentId(record);
    if (!parentId) return true;
    return false;
  }

  isParent(record: any, candidateRec: any): boolean {
    if (this.getId(record) === this.getParentId(candidateRec)) return true;
    return false;
  }

  buildTreeRecords(records: Array<any>): Array<TreeRecord> {
    let treeRecordMap = new RecordMap<TreeRecord>();
    let rootTreeRecords = new Array<TreeRecord>();
    let remainingHolder = new Array<TreeRecord>();
    for (let record of records) {
      if (this.isRootRecord(record)) {
        let treeRecord = new TreeRecord(record, 0);
        rootTreeRecords.push(treeRecord);
        treeRecordMap.putBy(this.getId(record), treeRecord);
      } else {
        remainingHolder.push(record);
      }
    }
    this.buildRemaining(treeRecordMap, remainingHolder);
    return rootTreeRecords;
  }

  buildRemaining(treeRecordMap: RecordMap<TreeRecord>, records: Array<any>) {
    let remainingHolder = new Array<TreeRecord>();
    for (let record of records) {
      let parentTreeRecord = treeRecordMap.getBy(this.getParentId(record));
      if (parentTreeRecord) {
        let treeRecord = parentTreeRecord.addChild(this, record);
        treeRecordMap.putBy(this.getId(record), treeRecord);
      } else {
        remainingHolder.push(record);
      }
    }
    if (remainingHolder.length == 0) return;
    this.buildRemaining(treeRecordMap, remainingHolder);
  }
}

export class TreeRecord {
  deep: number;
  record: any;
  children: Array<TreeRecord> = [];
  collapse: boolean;

  constructor(record: any, deep: number) {
    this.record = record;
    this.deep = deep;
    if (deep < 2) this.collapse = false;
    else this.collapse = true;
  }

  addChild(plugin: TreeDisplayModelPlugin, child: any): TreeRecord {
    if (plugin.isParent(this.record, child)) {
      let childTreeRecord = new TreeRecord(child, this.deep + 1);
      this.children.push(childTreeRecord);
      return childTreeRecord;
    }
    throw new Error("wrong parent , child relationship");
  }

  collectDisplayRecord(holder: Array<DisplayRecord>) {
    let dRecord = new DisplayRecord(this.record, holder.length, true).withModel(this).withIndent(this.deep);
    holder.push(dRecord);
    if (this.collapse) return;
    for (let treeRecord of this.children) {
      treeRecord.collectDisplayRecord(holder);
    }
  }
}

export class TreeDisplayModel extends DisplayRecordList {
  records: Array<any> = [];
  treeRecords: Array<TreeRecord> = [];
  plugin: TreeDisplayModelPlugin;

  constructor(plugin: TreeDisplayModelPlugin) {
    super();
    this.plugin = plugin;
  }

  /**@override */
  updateRecords(records: Array<any>) {
    this.treeRecords = this.plugin.buildTreeRecords(records);
    this.updateDisplayRecords();
    return this;
  }

  /**@override */
  updateDisplayRecords() {
    let holder = new Array<DisplayRecord>();
    for (let treeRecord of this.treeRecords) {
      treeRecord.collectDisplayRecord(holder);
    }
    this.displayRecords = holder;
    return this;
  }
}