
class Entry {
  val: any;
  next: Entry | null;
  prev: Entry | null;

  constructor(val: any) {
    this.val = val;
    this.next = null;
    this.prev = null;
  };
};

class LinkedList {
  head: Entry | null;
  tail: Entry | null;
  length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  };

  addHead(val: any) {
    let newEntry = new Entry(val);

    if (!this.head) {
      this.head = newEntry;
      this.tail = this.head;
    };

    this.head.prev = newEntry;
    newEntry.next = this.head;
    this.head = newEntry;

    this.length++;
    return newEntry;
  }

  addTail(val: any) {
    let newEntry = new Entry(val);

    if (!this.tail) {
      this.head = newEntry;
      this.tail = newEntry;
    };

    this.tail.next = newEntry;
    newEntry.prev = this.tail;
    this.tail = newEntry;

    this.length++;
    return newEntry;
  }

  removeHead() {
    let removed = this.head;
    if (!this.head) return undefined;

    this.head = this.head.next;
    if (this.head) this.head.prev = null;

    this.length--;
    return removed;
  }

  removeTail() {
    if (!this.tail) return undefined;
    let removed = this.tail;

    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    };

    this.tail = removed.prev;
    if (this.tail) this.tail.next = null;

    this.length--;
    return removed;
  }

  getAt(index: number) {
    let current
    if (index < 0 || index >= this.length) return undefined;

    if (index <= this.length / 2) {
      current = this.head;
      for (let i = 0; i < index; i++) {
        if (!current) {
          throw new Error('Should not happen');
        }
        current = current.next;
      }
    } else {
      current = this.tail;
      for (let i = this.length; i > index; i--) {
        if (!current) {
          throw new Error('Should not happen');
        }
        current = current.prev;
      }
    }

    return current;
  }

  insert(val: any, index: number) {
    if (index < 0 || index > this.length) return null;
    if (index === this.length) return this.addTail(val);
    if (index === 0) return this.addHead(val);

    let prev = this.getAt(index - 1);
    if (!prev) throw new Error('Should not happen');
    let newNode = new Entry(val);
    let temp = prev.next;

    prev.next = newNode;
    newNode.next = temp;
    newNode.prev = prev;

    this.length++;
    return true;
  }

  remove(index: number) {
    if (index < 0 || index >= this.length) return null;
    if (index === this.length) return this.removeTail();
    if (index === 0) return this.removeHead();

    let removed = this.getAt(index);
    if (!removed) throw new Error('Should not happen');

    if (removed.prev) {
      removed.prev.next = removed.next;
    }
    if (removed.next) {
      removed.next.prev = removed.prev;
    }

    this.length--;
    return removed;
  }

  removeEntry(entry: Entry) {
    if (this.head === entry) {
      this.head = entry.next;
    }
    if (this.tail === entry) {
      this.tail = entry.prev;
    }

    if (entry.prev) {
      entry.prev.next = entry.next;
    }

    if (entry.next) {
      entry.next.prev = entry.prev;
    }
    this.length--;
    return entry;
  }

  update(val: any, index: number) {
    let entry = this.getAt(index);
    if (entry) entry.val = val;
    return entry;
  }
};

class LRUCacheStorage {
  cacheStorage: Record<string, Entry> = {};
  linkedList: LinkedList = new LinkedList();
  maxCacheStore = 50;

  constructor(size: number = 50) {
    this.maxCacheStore = size;
  }

  setMaxCacheStore(size: number) {
    this.maxCacheStore = size;
  }

  get(name: string, defaultVal?: any) {
    let entry = this.cacheStorage[name];
    if (!entry) {
      if (defaultVal) {
        let entry = this.linkedList.addHead(defaultVal);
        this.cacheStorage[name] = entry;
        return defaultVal;
      }
      return null;
    } else {
      this.linkedList.removeEntry(entry);
      this.linkedList.addHead(entry);
      return entry.val;
    }
  }

  put(name: string, val: any) {
    let entry = this.cacheStorage[name];
    if (entry) {
      entry.val = val;
    } else {
      if (this.linkedList.length >= this.maxCacheStore) {
        this.linkedList.removeTail();
      }
      this.linkedList.addHead(val);
    }
  }
}

class SessionStorage {
  storage: Record<string, any> = {};

  get(name: string, defaultVal?: any) {
    let entry = this.storage[name];
    if (!entry) {
      if (defaultVal) {
        this.storage[name] = defaultVal;
        return defaultVal;
      }
      return null;
    } else {
      return entry;
    }
  }

  put(name: string, val: any) {
    this.storage[name] = val;
  }

  remove(name: string) {
    delete this.storage[name];
  }

  clear() { this.storage = {}; }
}

class DiskStorage {
  StorageType = 'disk';

  get(name: string, defaultVal?: any) {
    let entry = localStorage.getItem(name);
    if (!entry) {
      if (defaultVal) {
        this.put(name, defaultVal);
        return defaultVal;
      }
      return null;
    } else {
      return JSON.parse(entry);
    }
  }

  put(name: string, val: any) {
    let json = JSON.stringify(val);
    localStorage.setItem(name, json);
  }

  remove(name: string) {
    localStorage.removeItem(name);
  }

  clear() {
    localStorage.clear();
  }
}

export interface IStorage {
  setMaxPageStore: (size: number) => void;
  pageGet: (name: string, defaultVal?: any) => any;
  pagePut: (name: string, val: any) => void;

  setMaxCacheStore: (size: number) => void;
  cacheGet: (name: string, defaultVal?: any) => any;
  cachePut: (name: string, val: any) => void;

  sessionGet: (name: string, defaultVal?: any) => any;
  sessionPut: (name: string, val: any) => void;
  sessionClear: () => void;

  diskGet: (name: string, defaultVal?: any) => any;
  diskPut: (name: string, val: any) => void;
  diskRemove: (name: string) => void;
  diskClear: () => void;
}
class Storage implements IStorage {
  pageStorage = new LRUCacheStorage(10);
  cacheStorage = new LRUCacheStorage(50);
  sessionStorage = new SessionStorage();
  diskStorage: SessionStorage | DiskStorage;

  constructor() {
    if (localStorage) {
      this.diskStorage = new DiskStorage();
    } else {
      this.diskStorage = new SessionStorage();
    }
  }

  setMaxPageStore(size: number) {
    this.pageStorage.setMaxCacheStore(size);
  }

  pageGet(name: string, defaultVal?: any) {
    return this.pageStorage.get(name, defaultVal);
  }

  pagePut(name: string, val: any) {
    this.pageStorage.put(name, val);
  }

  pageClear() {
    this.pageStorage = new LRUCacheStorage(this.pageStorage.maxCacheStore);
  }

  setMaxCacheStore(size: number) {
    this.cacheStorage.setMaxCacheStore(size);
  }

  cacheGet(name: string, defaultVal?: any) {
    return this.cacheStorage.get(name, defaultVal);
  }

  cachePut(name: string, val: any) {
    this.cacheStorage.put(name, val);
  }

  sessionGet(name: string, defaultVal?: any) {
    return this.sessionStorage.get(name, defaultVal);
  }

  sessionPut(name: string, val: any) {
    this.sessionStorage.put(name, val);
  }

  sessionClear() { this.sessionStorage.clear(); }

  diskGet(name: string, defaultVal?: any) {
    return this.diskStorage.get(name, defaultVal);
  }

  diskPut(name: string, val: any) {
    this.diskStorage.put(name, val);
  }

  diskRemove(name: string) {
    this.diskStorage.remove(name);
  }

  diskListKeys() {
  }

  diskClear() { this.diskStorage.clear(); }
}

const storage = new Storage();
export { storage }