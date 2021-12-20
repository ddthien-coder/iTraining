export class RecordMap<T> {
  records: Record<string, T> = {};

  has(name: string) {
    if (this.records[name]) return true;
    return false;
  }

  get(name: string, defaultVal: T | null = null) {
    if (this.records[name]) return this.records[name];
    return defaultVal;
  }

  getBy(key: any, defaultVal: T | null = null) {
    let name = `${key}`;
    if (this.records[name]) return this.records[name];
    return defaultVal;
  }

  put(name: string, val: T) {
    this.records[name] = val;
  }

  putBy(key: any, val: T) {
    let name = `${key}`;
    this.records[name] = val;
  }

  getAll() {
    let holder: Array<T> = [];
    for (let name in this.records) {
      holder.push(this.records[name]);
    }
    return holder;
  }

  addAll(keyField: string, records?: Array<T>) {
    if (!records) return this;
    for (let record of records) {
      let rec: any = record;
      let name = rec[keyField];
      if (!name) {
        throw new Error(`Record key, key field ${keyField} is not available`);
      }
      let key = `${name}`
      if (this.records[key]) {
        throw new Error(`More than one record with key ${name}`);
      }
      this.records[key] = record;
    }
    return this;
  }
}

export class ListRecordHolder<T> {
  value: any;
  key: string;
  label: string;
  records: Array<T> = [];

  constructor(value: any) {
    if (value) {
      this.key = `${value}`;
      this.label = this.key;
      this.value = value;
    } else {
      this.key = 'unknown';
      this.label = 'Unknown';
    }
  }

  add(rec: T) { this.records.push(rec); }
}
export class ListRecordMap<T> {
  records: Array<T> = [];
  listMap: Record<string, ListRecordHolder<T>> = {};

  addAllRecords(groupByField: string, records?: Array<T>) {
    if (!records) return this;
    for (let i = 0; i < records.length; i++) {
      let rec: any = records[i];
      let value = rec[groupByField];
      let key = 'unknown';
      if (value) key = `${value}`;

      let holder = this.listMap[key];
      if (!holder) {
        holder = new ListRecordHolder(value);
        this.listMap[key] = holder;
      }
      holder.add(rec);
    }
    return this;
  }

  getAllRecords() { return this.records; }

  getList(name: string) {
    let list = this.listMap[name];
    if (!list) throw new Error(`The list $${name} is not avaible`);;
    return list.records;
  }

  getNullableList(name: string) {
    let list = this.listMap[name];
    if (!list) return null;
    return list.records;
  }

  createOrGetList(name: string) {
    let list = this.listMap[name];
    if (!list) {
      list = this.createList(name);
    }
    return list.records;
  }

  getListRecordHolder(name: string, create: boolean = false) {
    let list = this.listMap[name];
    if (!list && create) {
      list = this.createList(name);
    }
    return list;
  }

  getListNames() {
    let names = [];
    for (let name in this.listMap) {
      names.push(name);
    }
    return names;
  }

  put(name: string, rec: T) {
    let holder = this.listMap[name];
    if (!holder) {
      holder = new ListRecordHolder(name);
      this.listMap[name] = holder;
    }
    holder.add(rec);
  }

  private createList(name: string) {
    let holder = this.listMap[name];
    if (!holder) {
      holder = new ListRecordHolder(name);
      this.listMap[name] = holder;
    }
    return holder;
  }
}

export class Set<T = string | number> {
  items: Record<string, T> = {};

  has(name: string) {
    if (this.items[name]) return true;
    return false;
  }

  get(name: string) {
    if (this.items[name]) return this.items[name];
    return null;
  }

  add(item: T) {
    let key = `${item}`
    this.items[key] = item;
  }

  getAll() {
    let holder: Array<T> = [];
    for (let name in this.items) {
      holder.push(this.items[name]);
    }
    return holder;
  }

  addAll(items?: Array<T>) {
    if (!items) return this;
    for (let record of items) {
      let key = `${record}`
      if (this.items[key]) {
        throw new Error(`More than one record with key ${name}`);
      }
      this.items[key] = record;
    }
    return this;
  }
}