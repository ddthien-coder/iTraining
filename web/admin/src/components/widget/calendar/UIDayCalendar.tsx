import React, { Component } from "react";

import { CalendarContext, CalendarConfig, HourCellMode } from "./ICalendar";
interface CellProps {
  context: CalendarContext;
  config: CalendarConfig;
  date: Date;
  style?: React.CSSProperties;
}
class Cell extends Component<CellProps> {
  render() {
    let { context, config, date, style } = this.props;
    let className = 'cell cell-content';
    let content = null;
    if (config.day && config.day.renderCell) {
      content = config.day.renderCell(context, config, date);
    }
    return (<div className={className} style={style}>{content}</div>);
  }
}

function HourRow(uiDayCalendar: UIDayCalendar, hour: Date, hightlight: string) {
  let { context, config } = uiDayCalendar.props;
  let html = (
    <div className={`d-flex flex-grow-1 ${hightlight}`} >
      <div className='cell cell-time'>{hour.getHours() + ":00"}</div>
      <Cell context={context} config={config} date={hour} />
    </div>
  );
  return html;
}

function HourRows(
  uiDayCalendar: UIDayCalendar, date: Date, currTime: Date, matchToday: boolean, cellMode: HourCellMode) {
  let rows = [];
  let from = 0, to = 24;
  if (cellMode == HourCellMode.BusinessHour) {
    from = 8; to = 19;
  }
  for (let i = from; i < to; i++) {
    let hourDate = new Date(date);
    hourDate.setHours(i);
    let hightlight = (matchToday && i == currTime.getHours()) ? 'highlight' : '';
    rows.push(HourRow(uiDayCalendar, hourDate, hightlight));
  }
  return rows
}

interface UIDayCalendarProps {
  context: CalendarContext; config: CalendarConfig; date: Date;
}
export class UIDayCalendar extends React.Component<UIDayCalendarProps> {
  renderRowCells() {
    let { config, date } = this.props;
    let currTime = new Date();
    let matchToday = false;
    if (currTime.getFullYear() == date.getFullYear() &&
      currTime.getMonth() == date.getMonth() && currTime.getDate() == date.getDate()) {
      matchToday = true;
    }
    return HourRows(this, date, currTime, matchToday, config.cellMode);
  }

  onChangeHourCellMode = (cellMode: HourCellMode) => {
    let { config } = this.props;
    config.cellMode = cellMode;
    this.forceUpdate();
  }

  render() {
    return (
      <div className='ui-day-calendar flex-vbox'>
        {this.renderRowCells()}
      </div>
    );
  }
}

