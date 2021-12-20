import { util, widget } from 'components';

const ObjUtil = util.ObjUtil;

function markDelete(bean: any) {
  bean['_delete'] = true;
}

function removeMarkDelete(bean: any) {
  bean['_delete'] = false;
}

export interface IRollbackable {
  rollback(): void;
  commitAndGet(): any;
}
export interface IBeanObserver extends IRollbackable {
  isNewBean(): boolean;
  getErrorCollector(): widget.input.ErrorCollector;
  getMutableBean(): any;
  getBeanProperty(name: string, defaultObj: any): any;
  getComplexBeanProperty(name: string, defaultObj: any): any;
  replaceBeanProperty(name: string, val: any): void;
  replaceWith(bean: any): void;
}

export class BeanObserver implements IBeanObserver {
  rollbackBean: any;
  mutableBean: any;
  errorCollector: widget.input.ErrorCollector;

  constructor(bean: any, errorCollector?: widget.input.ErrorCollector) {
    this.setMutableBean(bean);
    if (errorCollector) {
      this.errorCollector = errorCollector;
    } else {
      this.errorCollector = new widget.input.ErrorCollector();
    }
  }

  isNewBean() {
    if (this.mutableBean.id) return false
    return true
  }

  getErrorCollector() { return this.errorCollector; }

  getMutableBean() { return this.mutableBean; }

  hasBeanProperty(name: string) {
    let mutableBean = this.getMutableBean();
    return mutableBean[name] ? true : false;
  }

  isEmptyProperties(names: Array<string>) {
    let mutableBean = this.getMutableBean();
    for (let name of names) {
      let val = mutableBean[name];
      if (!val) return true;
      if (typeof val === 'string') {
        let string = val as string;
        if (string.length == 0) return true;
      }
      if (Array.isArray(val)) {
        let array = val as Array<any>;
        console.log(`  array type: ${array.length == 0}`);
        if (array.length == 0) return true;
      }
    }
    return false;
  }

  getBeanProperty(name: string, defaultObj: any) {
    let mutableBean = this.getMutableBean();
    if (!mutableBean[name]) {
      mutableBean[name] = defaultObj;
    }
    return mutableBean[name];
  }

  /**@deprecated */
  getComplexBeanProperty(_name: string, _defaultObj: any) {
    alert('Do not use this method')
  }

  replaceWith(bean: any) {
    ObjUtil.copyFields(this.mutableBean, bean, true);
    if (bean == null) {
      markDelete(this.mutableBean);
    } else {
      removeMarkDelete(this.mutableBean);
    }
  }

  replaceBeanProperty(name: string, val: any) {
    let mutableBean = this.getMutableBean();
    mutableBean[name] = val;
  }

  setMutableBean(bean: any) {
    this.rollbackBean = bean;
    this.mutableBean = JSON.parse(JSON.stringify(this.rollbackBean));
  }

  rollback(): void {
    this.mutableBean = this.rollbackBean;
    this.mutableBean = JSON.parse(JSON.stringify(this.rollbackBean));
  }

  commitAndGet(): any {
    for (let property in this.mutableBean) {
      let val = this.mutableBean[property];
      if (!val) continue;
      if (val['_delete']) delete this.mutableBean[property];
    }
    ObjUtil.copyFields(this.rollbackBean, this.mutableBean, true);
    this.mutableBean = JSON.parse(JSON.stringify(this.rollbackBean));
    return this.rollbackBean;
  }
}

export interface IArrayObserver extends IRollbackable {
  getMutableArray: () => Array<any>;
  setMutableArray: (array: Array<any>) => void;

  addRecord: (record: any) => void;
  addRecords: (records: Array<any>) => void;
  removeRecord: (record: any) => void;
  replaceWith: (array: Array<any>) => void;
  commitAndGetMutableArray: () => Array<any>
}

export class ArrayObserver implements IArrayObserver {
  rollbackArray: Array<any> = [];
  mutableArray: Array<any> = [];

  constructor(array: Array<any>) {
    this.setMutableArray(array);
  }

  getMutableArray() { return this.mutableArray; }

  getWatchObject() { return this.getMutableArray(); }

  addRecord(record: any) {
    this.mutableArray.push(record);
  }

  addRecords(records: Array<any>) {
    this.mutableArray.push(...records);
  }

  removeRecord(record: any) {
    for (let i = 0; i < this.mutableArray.length; i++) {
      if (this.mutableArray[i] == record) {
        this.mutableArray.splice(i, 1);
        return;
      }
    }
  }

  setMutableArray(array: Array<any>) {
    this.rollbackArray = array;
    this.mutableArray = [];
    for (let i = 0; i < array.length; i++) {
      let bean = JSON.parse(JSON.stringify(array[i]));
      this.mutableArray.push(bean);
    }
  }

  replaceWith(array: Array<any>) {
    this.mutableArray.length = 0
    this.mutableArray.push(...array);
  }

  rollback(): void {
    this.setMutableArray(this.rollbackArray);
  }

  commitAndGetMutableArray(): any {
    this.setMutableArray(this.mutableArray);
    return this.getMutableArray();
  }

  commitAndGet(): any {
    return this.commitAndGetMutableArray();
  }
}
export class VGridEntityListEditorPlugin implements IArrayObserver, widget.grid.VGridEditorPlugin {
  rollbackArray: Array<any> = [];
  model: widget.grid.model.ListModel = new widget.grid.model.ListModel([]);

  constructor(array: Array<any>) {
    this.setMutableArray(array);
  }

  getModel() { return this.model; };

  getMutableArray() { return this.model.getRecords(); }

  getWatchObject() { return this.getMutableArray(); }

  setMutableArray(array: Array<any>) {
    this.rollbackArray = array;
    let cloneArray = new Array<any>();
    for (let i = 0; i < array.length; i++) {
      let bean = JSON.parse(JSON.stringify(array[i]));
      cloneArray.push(bean);
    }
    this.model.update(cloneArray);
  }

  addRecord(record: any) {
    this.model.addRecord(record);
  }

  addRecords(records: Array<any>) {
    this.model.addRecords(records);
  }

  removeRecord(record: any) {
    this.model.removeRecord(record);
  }

  replaceWith(array: Array<any>) {
    this.model.update(array);
  }

  rollback(): void {
    this.setMutableArray(this.rollbackArray);
  }

  getRecordByFieldValue(field: string, value: string) {
    let records = this.model.getRecords();
    for (let i = 0; i < records.length; i++) {
      let record = records[i];
      let selValue = record[field];
      if (value == selValue) {
        return record
      }
    }
    let record: any = {};
    record[field] = value;
    this.model.addRecord(record);
    return record;
  }

  commitAndGetMutableArray(): any {
    this.setMutableArray(this.model.getRecords());
    return this.getMutableArray();
  }

  commitAndGet(): any {
    return this.commitAndGetMutableArray();
  }

  replaceBeans(beans: Array<any>) {
    this.replaceWith(beans);
  }

  onModify(_editor: widget.grid.VGridEditor<widget.grid.VGridEditorProps>, _bean: any) {
  }
}

export class ComplexBeanObserver extends BeanObserver {
  observers: any = {};

  constructor(bean: any, errorCollector?: widget.input.ErrorCollector) {
    super(bean, errorCollector);
  }

  setMutableBean(bean: any) {
    super.setMutableBean(bean);
    this.observers = {};
  }

  replaceWith(bean: any) {
    super.replaceWith(bean);
    this.observers = {};
  }

  replaceBeanProperty(name: string, val: any) {
    let mutableBean = this.getMutableBean();
    mutableBean[name] = val;
    if (this.observers[name]) {
      delete this.observers[name];
    }
  }

  getComplexArrayProperty(name: string, defaultArray: Array<any>) {
    let mutableBean = this.getMutableBean();
    if (!mutableBean[name]) {
      mutableBean[name] = defaultArray;
      markDelete(defaultArray);
    }
    return mutableBean[name];
  }

  getComplexBeanProperty(name: string, defaultObj: any) {
    let mutableBean = this.getMutableBean();
    if (!mutableBean[name]) {
      if (defaultObj == null) {
        defaultObj = {};
        markDelete(defaultObj);
      }
      mutableBean[name] = defaultObj;
    }
    return mutableBean[name];
  }

  getObserver(propertyName: string): IBeanObserver {
    return this.observers[propertyName];
  }

  createObserver(propertyName: string, defaultObj: any): BeanObserver {
    if (this.observers[propertyName]) return this.observers[propertyName];
    let bean = this.getComplexBeanProperty(propertyName, defaultObj);
    let observer = new BeanObserver(bean, this.getErrorCollector());
    this.observers[propertyName] = observer;
    return observer;
  }

  createComplexBeanObserver(propertyName: string, defaultObj: any): ComplexBeanObserver {
    if (this.observers[propertyName]) return this.observers[propertyName];
    let bean = this.getComplexBeanProperty(propertyName, defaultObj);
    let observer = new ComplexBeanObserver(bean, this.getErrorCollector());
    this.observers[propertyName] = observer;
    return observer;
  }

  createVGridEntityListEditorPlugin(propertyName: string, defaultValues: Array<any> = []): VGridEntityListEditorPlugin {
    if (this.observers[propertyName]) return this.observers[propertyName];
    let array = this.getComplexArrayProperty(propertyName, defaultValues);
    let plugin = new VGridEntityListEditorPlugin(array);
    this.observers[propertyName] = plugin;
    return plugin;
  }

  commitAndGet(): any {
    for (let property in this.observers) {
      let observer: IRollbackable = this.observers[property];
      let bean = observer.commitAndGet();
      this.mutableBean[property] = bean;
    }
    return super.commitAndGet();
  }
}