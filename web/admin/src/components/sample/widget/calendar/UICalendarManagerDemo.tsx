import React, { Component } from "react";
import {
  CalendarContext, CalendarConfig, CalendarViewType, HourCellMode, CellAction, DateRecordMap
} from 'components/widget/calendar/ICalendar'
import { UICalendarManager } from 'components/widget/calendar/UICalendarManager'

export class UICalendarManagerDemo extends Component {
  config: CalendarConfig

  constructor(props: any) {
    super(props);

    this.config = {
      view: CalendarViewType.Year,
      cellAction: CellAction.All,
      cellMode: HourCellMode.All,
      selectedDate: new Date(),
      year: {},

      record: { dateField: 'date', dateFieldSelect: true },

      month: {
        renderCell(ctx: CalendarContext, _config: CalendarConfig, date: Date) {
          let dayRecord = ctx.getDateRecordMap().getByDay(date);
          if (!dayRecord) return null;
          let allRecords = dayRecord.getAllRecords();
          if (allRecords.length == 0) return null;
          return <div>{allRecords.length} records</div>;
        },

        onCellClick(_ctx: CalendarContext, _config: CalendarConfig, _date: Date) {
          alert('test');
        }
      },

      week: {

        renderCell(ctx: CalendarContext, config: CalendarConfig, date: Date) {
          let dayRecord = ctx.getDateRecordMap().getByDay(date);
          if (!dayRecord) return null;
          let allRecords = dayRecord.getRecordAtHour(config, date);
          if (allRecords.length == 0) return null;
          return <div>{allRecords.length} records</div>;
        },
      },
      day: {
        renderCell(ctx: CalendarContext, config: CalendarConfig, date: Date) {
          let dayRecord = ctx.getDateRecordMap().getByDay(date);
          if (!dayRecord) return null;
          let allRecords = dayRecord.getRecordAtHour(config, date);
          if (allRecords.length == 0) return null;
          return <div>{allRecords.length} records</div>;
        },
      },

      plugin: {
        label: 'PLugin Demo', width: 400
      }

    }
  }

  render() {
    let records = [];
    let DAYS = 10;
    for (let i = 0; i < DAYS; i++) {
      for (let j = 0; j < 3; j++) {
        let date = new Date();
        date.setDate(date.getDate() + i);
        date.setHours(date.getHours() + j);
        records.push(
          { label: 'record ' + (i + 1), date: date }
        );
      }
    }
    let dayRecordMap = new DateRecordMap(records).mapByDateField('date');
    let context = new CalendarContext(this, dayRecordMap);
    return <UICalendarManager context={context} config={this.config} />
  }
}
