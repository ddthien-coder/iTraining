import { Component } from 'react';

import { TimeUtil } from 'components/util/common';
import { FAIconDefinition } from 'components/widget/fa';
import { WidgetContext } from '../context';

function getDate(rec: any, field?: string): Date | undefined {
  if (!field) return undefined;
  let date = rec[field];
  if (!date) return undefined;
  if (!(date instanceof Date)) {
    date = TimeUtil.parseCompactDateTimeFormat(date);
  }
  return date;
}

function createDayKey(date: Date) {
  let dayKey = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  return dayKey;
}
export class DayRecordMap {
  dayKey: string;
  allRecords: Array<any> = [];
  addedRecords: Record<string, string> = {};
  recordByHourMap: Record<string, Array<any>> = {}

  constructor(dayKey: string) {
    this.dayKey = dayKey;
  }

  getAllRecords() { return this.allRecords; }

  add(rec: any) {
    this.allRecords.push(rec);
  }

  getRecordAtHour(config: CalendarConfig, date: Date) {
    let dayKey = createDayKey(date);
    if (dayKey != this.dayKey) throw new Error('logic error, the date key is not the same');
    let recordConfig = config.record;
    let holder: Array<any> = [];
    for (let rec of this.allRecords) {
      let fromHour = getDate(rec, recordConfig.dateField);
      let toHour = null;
      if (recordConfig.toDateField) {
        toHour = getDate(rec, recordConfig.toDateField);
      }
      if (fromHour && toHour) {
        if (date.getTime() > fromHour.getTime() && date.getTime() < toHour.getTime()) {
          holder.push(rec);
        }
      } else if (fromHour && date.getHours() == fromHour.getHours()) {
        holder.push(rec);
      } else if (toHour && date.getHours() == toHour.getHours()) {
        holder.push(rec);
      }
    }
    return holder;
  }
}

export class DateRecordMap {
  records: Array<any>[];
  dateRecordMap: Record<string, DayRecordMap> = {}

  constructor(records: Array<any>) {
    this.records = records;
  }

  getByDay(date: Date): DayRecordMap | undefined {
    let dayKey = createDayKey(date);
    let hourRecordMap = this.dateRecordMap[dayKey];
    return hourRecordMap;
  }

  mapByDateField(dateField: string) {
    this.dateRecordMap = {}
    for (let i = 0; i < this.records.length; i++) {
      let rec = this.records[i];
      let date = getDate(rec, dateField);
      this._addRecord(rec, date);
    }
    return this;
  }

  mapByConfig(config: CalendarConfig) {
    this.dateRecordMap = {}
    let recordConfig = config.record;
    let { dateField, dateFieldSelect, toDateField, toDateFieldSelect } = recordConfig;
    let mapByRange = dateFieldSelect && (toDateField && toDateFieldSelect);

    if (mapByRange) {
      this.mapByDateField(dateField);
    } else {
      if (dateFieldSelect) {
        this.mapByDateField(dateField);
      } else if (toDateField && toDateFieldSelect) {
        this.mapByDateField(toDateField);
      }
    }
    return this;
  }

  _addRecord(rec: any, date: Date | undefined) {
    if (!date) return '';
    let dayKey = createDayKey(date);
    let dayRecordMap = this.dateRecordMap[dayKey];
    if (!dayRecordMap) {
      dayRecordMap = new DayRecordMap(dayKey);
      this.dateRecordMap[dayKey] = dayRecordMap;
    }
    dayRecordMap.add(rec);
    return this;
  }
}

export interface Label {
  name: string, label: string;
}
export interface WeekDayLabel extends Label {
}
export interface MonthLabel extends Label {
  month: number;
}

export enum CalendarViewType { Day, Week, Month, Year }

export class CalendarContext extends WidgetContext {
  calendarManager?: ICalendarManager;
  dateRecordMap: DateRecordMap;

  constructor(uiSrc: Component, map: DateRecordMap) {
    super(uiSrc);
    this.dateRecordMap = map;
  }

  getCalendarManager() {
    if (!this.calendarManager) throw new Error("Calendar Manager is not available");
    return this.calendarManager;
  }

  setCalendarManager(manager: ICalendarManager) {
    this.calendarManager = manager;
  }

  withDateRecordMap(map: DateRecordMap) {
    this.dateRecordMap = map;
    return this;
  }

  getDateRecordMap() { return this.dateRecordMap; }
}

export enum HourCellMode { DataOnly, BusinessHour, All }

export enum CellAction { None = 'None', All = 'All' }

export interface CalendarAction {
  name: string;
  label: string;
  icon?: FAIconDefinition;
  onClick: (ctx: CalendarContext, config: CalendarConfig) => void
}

export interface CalendarPluginConfig {
  label: string;
  width?: number;
  actions?: Array<CalendarAction>;
  render?: (ctx: CalendarContext, config: CalendarConfig) => any
}

export interface CalendarConfig {
  view: CalendarViewType;
  selectedDate: Date;
  cellAction: CellAction;
  cellMode: HourCellMode;

  record: {
    dateField: string;
    dateFieldLabel?: string;
    dateFieldSelect?: boolean;
    toDateField?: string;
    toDateFieldLabel?: string;
    toDateFieldSelect?: boolean;
    createDayRecordMap?: (config: CalendarConfig, records: Array<any>) => DateRecordMap;
    dateFieldSet?: Array<{
      dateField: string, dateFieldLabel?: string,
      toDateField?: string, toDateFieldLabel?: string,
    }>
  }

  year: {
    renderCell?: (ctx: CalendarContext, config: CalendarConfig, date: Date) => any
  };

  month: {
    renderCell?: (ctx: CalendarContext, config: CalendarConfig, date: Date) => any
    onCellClick?: (ctx: CalendarContext, config: CalendarConfig, date: Date) => any
  };

  week: {
    renderCell?: (ctx: CalendarContext, config: CalendarConfig, date: Date) => any
  };

  day: {
    renderCell?: (ctx: CalendarContext, config: CalendarConfig, date: Date) => any
  };

  plugin?: CalendarPluginConfig
}

export interface ICalendarManager {
  forceUpdateView: (newViewId?: boolean) => void;
}
