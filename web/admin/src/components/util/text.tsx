import moment from 'moment';

const COMPACT_DATETIME_FORMAT = "DD/MM/YYYY@HH:mm:ssZ";
const LOCAL_COMPACT_DATETIME_FORMAT = "DD/MM/YYYY@HH:mm:ss";
const LOCAL_COMPACT_DATE_FORMAT = "DD/MM/YYYY";

export function ftDate(val: Date): string {
  if (val === undefined || val == null) return "";
  return moment(val).format('dd/mm/yyyy');
}

export function toFileName(text: string): string {
  if (!text) return '';
  //const translate = { "đ": "d", "Đ": "d" };
  text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, function (match) {
    //return translate[match];
    if (match == 'đ' || match == 'Đ') return "d";
    return match;
  })
  text = text.replace(/[^\u0020a-zA-Z0-9_.-]/g, '').trim();
  text = text.split(' ').join('-');
  return text.toLowerCase();
}

function formatNumber(val: number, precision: number) {
  var token = val.toFixed(precision).split('.');
  token[0] = token[0].replace(/\d(?=(\d{3})+$)/g, '$&,');
  return token.join('.');
}

export const util = {
  isIn: function (val: string, array: Array<string>) {
    if (!val) return false;
    if (!array) return false;
    for (let i = 0; i < array.length; i++) {
      if (val == array[i]) return true;
    }
    return false;
  },
}

export const formater = {
  text: {
    arrayToString(array: Array<any>) {
      let s: string = '';
      if (array) {
        for (let i = 0; i < array.length; i++) {
          if (i > 0) s += ", ";
          s += array[i];
        }
      }
      return s;
    }
  },

  truncate: (text: string, maxLength: number, elipsis: boolean = false) => {
    if (!text) return text;
    if (text.length < maxLength) return text;
    let newText = text.substr(0, maxLength);
    if (elipsis) newText += '...'
    return newText;
  },

  truncateOrPad: (length: number, pad: string, text?: string) => {
    if (!text) return pad.repeat(length);
    if (text.length < length) return text + pad.repeat(length - text.length);
    return text.substr(0, length);
  },

  compactDateTime: function (val: string) {
    if (!val) return "";
    return moment(val, COMPACT_DATETIME_FORMAT).format(LOCAL_COMPACT_DATETIME_FORMAT);
  },

  compactDate: function (val: string) {
    if (!val) return "";
    return moment(val, COMPACT_DATETIME_FORMAT).format(LOCAL_COMPACT_DATE_FORMAT);
  },

  date: function (val: Date) {
    if (val === undefined || val == null) return "";
    return moment(val).format('DD/MM/YYYY');
  },

  dateTime: function (val: Date) {
    if (val === undefined || val == null) return "";
    return moment(val).format('DD/MM/YYYY HH:mm:ss');
  },

  shortDateTime: function (val: Date) {
    if (val === undefined || val == null) return "";
    return moment(val).format('DD/MM/YY HH:mm');
  },

  yyyymmddTime: function (val: Date) {
    if (val === undefined || val == null) return "";
    return moment(val).format('DD/MM/YYYY HH:mm:ss');
  },

  yyyymmddHHmmss: function (val: Date) {
    if (val === undefined || val == null) return "";
    return moment(val).format('YYYYMMDDHHmmss');
  },

  number: function (val: number, precision: number = 2) {
    if (Number.isInteger(val)) return formatNumber(val, 0);
    return formatNumber(val, precision);
  },

  idNumber: function (val: number) { return val.toFixed(0); },

  integer: function (val: number) { return formatNumber(val, 0); },

  currency: function (val: number, precision: number = 2) {
    return formatNumber(val, precision);
  },

  percent: function (val: number) {
    if (val * 100 % 100 > 0) {
      return Number(val).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 });
    }
    return Number(val).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 });
  }
}
