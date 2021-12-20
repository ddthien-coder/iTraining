import React, { CSSProperties } from "react"

import { FAButton } from 'components/widget/fa';

import { CalendarContext, CalendarConfig, HourCellMode } from "./ICalendar";
interface CellProps {
  context: CalendarContext;
  config: CalendarConfig;
  date: Date;
  selected?: boolean
  style?: CSSProperties;
  highlight?: boolean;
}
class Cell extends React.Component<CellProps>{
  render() {
    let { context, config, style, date, selected, highlight } = this.props
    let className = "cell";
    if (selected) className += ' cell-selected';
    if (highlight) className += ' cell-highlight';
    let content = null;
    if (config.week && config.week.renderCell) {
      content = config.week.renderCell(context, config, date);
    }
    return (<div className={className} style={style}>{content}</div>)
  }
}

function DayHeaders(uiCal: UIWeekCalendar) {
  let { date } = uiCal.props
  let cells = [];
  cells.push(<div className='cell cell-header cell-time'></div>);
  for (let i = 0; i < 7; i++) {
    let dayInWeek = new Date(date);
    dayInWeek.setDate(date.getDate() + (i - date.getDay()));
    cells.push(
      <div className='cell cell-header'>
        <FAButton color='link' onClick={() => uiCal.onSelectDay(dayInWeek)}>{dayInWeek.toDateString()}</FAButton>
      </div>
    );
  }
  return (
    <div className="flex-hbox-grow-0 justify-content-between">{cells}</div>
  );
}

function HourRows(uiCal: UIWeekCalendar) {
  let { context, config, date } = uiCal.props
  let currTime = new Date();
  let from = 0, to = 24;
  if (config.cellMode == HourCellMode.BusinessHour) {
    from = 8; to = 19;
  }

  let rows = []
  for (let i = from; i < to; i++) {
    let cells = [];
    cells.push(<div className='cell cell-time'>{i + ":00"}</div>);
    let hour = new Date(date);
    hour.setHours(i);
    for (let j = 0; j < 7; j++) {
      let dayInWeek = new Date(hour);
      dayInWeek.setDate(hour.getDate() + (j - date.getDay()));
      let highlight = false;
      let selected = j == date.getDay();
      if (selected) highlight = i == currTime.getHours();
      cells.push(
        <Cell context={context} config={config} selected={selected} date={dayInWeek} highlight={highlight} />
      );
    }
    rows.push(
      <div className=" d-flex flex-grow-1 justify-content-between">{cells}</div>
    );
  }
  return (
    <div className="flex-vbox">
      {rows}
    </div>
  );
}

interface UIWeekCalendarProps {
  context: CalendarContext;
  config: CalendarConfig, date: Date
}
export class UIWeekCalendar extends React.Component<UIWeekCalendarProps>{
  onSelectDay(date: Date) {
    let { context, config } = this.props;
    config.selectedDate = date
    context.getCalendarManager().forceUpdateView(true);
  }

  onChangeHourCellMode = (cellMode: HourCellMode) => {
    let { config } = this.props;
    config.cellMode = cellMode;
    this.forceUpdate();
  }

  render() {
    return (
      <div className="ui-week-calendar flex-vbox">
        {DayHeaders(this)}
        {HourRows(this)}
      </div>
    );
  }
}