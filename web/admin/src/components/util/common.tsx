import moment from 'moment';

export const COMPACT_DATETIME_FORMAT = "DD/MM/YYYY@HH:mm:ssZ";
export const TIME_ID_FORMAT = "DDMMYYYYHHmmss";
export const DATE_ID_FORMAT = "DDMMYYYY";

export class IDTracker {
  static idTracker: number = 0;
  static next() { return ++this.idTracker; }
}

export class IDGenerator {
  idTracker: number = 0;
  next() { return ++this.idTracker; }
}

export class TimeUtil {
  //TODO: rename getCompactDateTimeFormat()
  static getCompactDateTimeFormat() { return COMPACT_DATETIME_FORMAT; }

  static javaCompactDateTimeFormat(d: Date) {
    let currDateTime = moment(d).format(COMPACT_DATETIME_FORMAT);
    //remove timezone colon
    currDateTime = currDateTime.slice(0, currDateTime.length - 3) + currDateTime.slice(currDateTime.length - 2);
    return currDateTime;
  }

  static checkAndParseCompactDateTimeFormat(date: any) {
    if(!date) return null;
    if(typeof date === 'string') {
      return this.parseCompactDateTimeFormat(date as string);
    }
    if(typeof date.getMonth === 'function') {
      return date as Date;
    }
    if(date instanceof moment) {
      let moment = date as moment.Moment;
      return moment.toDate();
    }
    return date;
  }

  static parseCompactDateTimeFormat(d: string) {
    let currDateTime = moment(d, COMPACT_DATETIME_FORMAT);
    return currDateTime.toDate();
  }

  static parseDateTimeFormat(d: string, format: string) {
    let currDateTime = moment(d, format);
    return currDateTime.toDate();
  }

  static toDateIdFormat(date: Date) {
    let dateTime = moment(date).format(DATE_ID_FORMAT);
    return dateTime;
  }

  static toDateTimeIdFormat(date: Date) {
    let dateTime = moment(date).format(TIME_ID_FORMAT);
    return dateTime;
  }

  static toCompactDateTimeFormat(date: Date) {
    let dateTime = moment(date).format(COMPACT_DATETIME_FORMAT);
    //remove timezone colon
    dateTime = dateTime.slice(0, dateTime.length - 3) + dateTime.slice(dateTime.length - 2);
    return dateTime;
  }

  static compareDate(datetime1: string, datetime2: string, _format: 'compact') {
    if (!datetime1 || !datetime1) return false;
    let m1 = moment(datetime1, COMPACT_DATETIME_FORMAT);
    let m2 = moment(datetime2, COMPACT_DATETIME_FORMAT);
    return m1.diff(m2, 'days') > 0;
  }
}

export class ObjUtil {
  static isPrimitive(obj: any) {
    if (typeof obj === 'string' || obj instanceof String) return true;
    else if (typeof obj === 'number') return true;
    //todo: boolean ,date object type
    return false;
  }

  static isArray(obj: any) {
    if (obj.constructor === Array) return true;
    return false;
  }

  static recordHasExpression(record: any, pattern: string, caseSensitive: boolean = true) {
    if (!caseSensitive) pattern = pattern.toLocaleLowerCase();
    return this._recordHasExpression(record, pattern, caseSensitive);
  }

  static _recordHasExpression(record: any, pattern: string, caseSensitive: boolean) {
    if (!record) return false;
    if (this.isPrimitive(record)) {
      let string = `${record}`;
      if (!caseSensitive) string = string.toLocaleLowerCase();
      return string.indexOf(pattern) >= 0;
    } else if (this.isArray(record)) {
      let array: Array<any> = record;
      for (let i = 0; i < array.length; i++) {
        let value = array[i];
        if (this._recordHasExpression(value, pattern, caseSensitive)) return true;
      }
    } else {
      for (let prop in record) {
        let val = record[prop];
        if (this._recordHasExpression(val, pattern, caseSensitive)) return true;
      }
    }
    return false;
  }

  static copyFields(dest: any, src: any, exactCopy: boolean = true) {
    if (exactCopy) {
      for (let prop in dest) delete dest[prop];
    }
    for (let prop in src) dest[prop] = src[prop];
  }

  static replaceProperties(dest: any, src: any) {
    if (!dest) {
      dest = src;
      return;
    }
    for (let prop in dest) delete dest[prop];
    for (let prop in src) dest[prop] = src[prop];
  }

  static hasRecordWith(records: Array<any>, field: string, value: any) {
    for (let i = 0; i < records.length; i++) {
      let record = records[i];
      if (!record[field]) continue;
      if (value == record[field]) return true;
    }
    return false;
  }

  static toJson(obj: any) {
    let json = JSON.stringify(obj, null, 2);
    return json;
  }

  static copyToClipboard(text: string) {
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }
}

export const KeyCode = {
  ADD: 187, SUB_ADD: 107,
  SUBTRACT: 189, SUB_SUBTRACT: 109,
  DELETE: 46, SUB_DELETE: 110,
  F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117, F7: 118,
  C: 67, V: 86,
  ARROW_UP: 38, ARROW_DOWN: 40, ESC: 27, ENTER: 13
}