import React, { Component, CSSProperties } from "react";

import { FAButton, fas } from 'components/widget/fa';
import { BBBeanSelectField } from 'components/widget/input';
import {
  CalendarConfig, CalendarContext, WeekDayLabel
} from "./ICalendar";
import { createMonthLabels, createWeekDayLabels } from "./utilities";

interface CellProps {
  context: CalendarContext;
  config: CalendarConfig;
  controlMode?: boolean
  type?: 'preview' | 'header';
  date: Date;
  style?: CSSProperties;
  selected?: boolean;
}

interface MonthCalendarProps {
  context: CalendarContext;
  config: CalendarConfig;
  date: Date;
  controlMode?: boolean
  disableSelectDay?: boolean;
}
export class UIAbstractMonthCalendar<T extends MonthCalendarProps, S = any> extends Component<T, S> {
  WEEK_DAY_LABELS: Array<WeekDayLabel> = createWeekDayLabels();

  getSelectDay(date: Date, currMonth: Date) {
    let { disableSelectDay } = this.props;
    if (disableSelectDay) return -1;
    if (currMonth.getFullYear() == date.getFullYear() && currMonth.getMonth() == date.getMonth()) {
      return date.getDate();
    }
    return -1;
  }

  renderTable() {
    let { context, config, date, controlMode } = this.props;
    let currMonth = new Date(date.getFullYear(), date.getMonth(), 1); //first day of current month
    let prevMonth = new Date(date.getFullYear(), date.getMonth(), 0); //last day of previous month
    let numOfDayInCurrMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() - currMonth.getDate();
    let firstWeekStartDay = currMonth.getDay();
    let selectDay = this.getSelectDay(date, currMonth);
    let Cell = this.getCell();
    let rows: Array<any> = [];
    let dateLabelCells: Array<any> = []
    this.WEEK_DAY_LABELS.forEach((sel, idx) => {
      dateLabelCells.push(<div key={`cell-${idx}`} className='cell cell-header'>{sel.label}</div>)
    });
    rows.push(<div key={`row-${rows.length}`} className="d-flex justify-content-between">{dateLabelCells}</div>)
    let cellIdx = 0;
    let currRowIdx = 0;
    let cells: Array<any> = [];
    while (cellIdx < 42) {
      let rowIdx = Math.floor(cellIdx / 7);

      if (rowIdx > currRowIdx) {
        rows.push(
          <div key={`row-${rows.length}`} className="flex-hbox flex-grow-1 justify-content-between">{cells}</div>);
        cells = new Array<any>();
        currRowIdx = rowIdx;
      }

      let currDayOfWeek = cellIdx % 7;
      if (rowIdx == 0 && firstWeekStartDay > currDayOfWeek) {
        let day = prevMonth.getDate() - (firstWeekStartDay - currDayOfWeek - 1);
        let date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);
        cells.push(
          <Cell key={`col-${cells.length}`}
            context={context} config={config} type='preview' date={date} controlMode={controlMode} />
        );
      } else if (cellIdx > numOfDayInCurrMonth + firstWeekStartDay) {
        let day = cellIdx - (numOfDayInCurrMonth + firstWeekStartDay);
        let date = new Date(currMonth.getFullYear(), currMonth.getMonth() + 1, day);
        cells.push(
          <Cell key={`col-${cells.length}`}
            context={context} config={config} type='preview' date={date} controlMode={controlMode} />
        );
      } else {
        let date = new Date(currMonth.getFullYear(), currMonth.getMonth(), cellIdx - firstWeekStartDay + 1);
        let isSelectDay = date.getDate() == selectDay;
        cells.push(
          <Cell key={`col-${cells.length}`}
            context={context} config={config} selected={isSelectDay} date={date} controlMode={controlMode} />)
      }
      cellIdx++;
    }
    rows.push(<div key={`row-${rows.length}`} className="flex-hbox justify-content-between">{cells}</div>)
    return rows;
  }

  getCell(): any { throw new Error('Need to override this method'); }
}

class MiniMonthCell extends Component<CellProps> {
  onSelectCell() {
    let { context, config, date, controlMode } = this.props;
    config.selectedDate = date
    if (controlMode) {
      context.getCalendarManager().forceUpdateView(true);
    } else if (config.month && config.month.onCellClick) {
      config.month.onCellClick(context, config, date);
    }
  }

  render() {
    let { date, style, selected, type } = this.props;
    let className = 'cell';
    if (type) className = `${className} cell-preview`;
    if (selected) className = `${className} cell-selected`;
    return (
      <div className={className} style={style}>
        <FAButton color='link' onClick={() => this.onSelectCell()}>{date.getDate()}</FAButton>
      </div>
    )
  }
}

interface UIMiniMonthCalendarProps extends MonthCalendarProps {
  useLabelHeader?: boolean;
}
export class UIMiniMonthCalendar extends UIAbstractMonthCalendar<UIMiniMonthCalendarProps> {
  MONTH_LABELS = createMonthLabels();
  YEAR_LABELS: Array<any>;

  constructor(props: UIMiniMonthCalendarProps) {
    super(props);
    let { date } = props;
    let year = date.getFullYear();
    let from = year - 5;
    let to = year + 5;
    this.YEAR_LABELS = [];
    for (let i = from; i <= to; i++) {
      this.YEAR_LABELS.push({ label: i })
    }
  }

  getCell(): any { return MiniMonthCell; }

  onIncrMonth(incr: number) {
    let { context, date, config, controlMode } = this.props;
    date.setMonth(date.getMonth() + incr);
    config.selectedDate = date;
    if (controlMode) {
      context.getCalendarManager().forceUpdateView(true);
    }
  }

  onIncrYear(incr: number) {
    let { context, date, config, controlMode } = this.props;
    date.setFullYear(date.getFullYear() + incr);
    config.selectedDate = date;
    if (controlMode) {
      context.getCalendarManager().forceUpdateView(true);
    }
  }

  onSelectMonth(opt: any) {
    let { context, config, date, controlMode } = this.props;
    date.setMonth(opt.month);
    config.selectedDate = date;
    if (controlMode) {
      context.getCalendarManager().forceUpdateView(true);
    }
  }

  onSelectYear(opt: any) {
    let { context, config, date, controlMode } = this.props;
    date.setFullYear(opt.label);
    config.selectedDate = date;
    if (controlMode) {
      context.getCalendarManager().forceUpdateView(true);
    }
  }

  render() {
    let { date, useLabelHeader } = this.props;
    let year = date.getFullYear(), month = date.getMonth();
    if (useLabelHeader) {
      return (
        <div className='ui-mini-month-calendar'>
          <div className="control d-flex border justify-content-center">
            {month + 1}/{year}
          </div>
          <div className="d-flex flex-column my-2">
            {this.renderTable()}
          </div>
        </div>
      );
    }
    let bean = { month: month, year: year }
    return (
      <div className='ui-mini-month-calendar'>
        <div className="control d-flex justify-content-between border">
          <div className='d-flex'>
            <FAButton className='py-0' color='link' icon={fas.faAngleDoubleLeft} iconSize='2x'
              onClick={() => this.onIncrYear(-1)} />
            <FAButton className='py-0' color='link' icon={fas.faAngleLeft} iconSize='2x'
              onClick={() => this.onIncrMonth(-1)} />
          </div>

          <div className='text-center d-flex'>
            <BBBeanSelectField
              bean={bean} field={'month'} options={this.MONTH_LABELS} fieldCheck={'month'} fieldLabel={'label'}
              onInputChange={(_bean, _field, _oldVal, opt) => this.onSelectMonth(opt)} />
            <BBBeanSelectField
              bean={bean} field={'year'} options={this.YEAR_LABELS} fieldCheck={'label'} fieldLabel={'label'}
              onInputChange={(_bean, _field, _oldVal, opt) => this.onSelectYear(opt)} />
          </div>

          <div className='d-flex'>
            <FAButton className='py-0' color='link' icon={fas.faAngleRight} iconSize='2x'
              onClick={() => this.onIncrMonth(1)} />
            <FAButton className='py-0' color='link' icon={fas.faAngleDoubleRight} iconSize='2x'
              onClick={() => this.onIncrYear(1)} />
          </div>
        </div>
        <div className="d-flex flex-column my-2">
          {this.renderTable()}
        </div>
      </div>
    )
  }
}

class Cell extends Component<CellProps> {
  onSelectCell() {
    let { context, config, date } = this.props;
    if (config.month && config.month.onCellClick) {
      config.month.onCellClick(context, config, date);
    } else {
      config.selectedDate = date
      context.getCalendarManager().forceUpdateView(true);
    }
  }

  render() {
    let { context, config, date, style, type, selected } = this.props
    let className = 'cell';
    if (type) className = `${className} cell-${type}`;
    if (selected) className = `${className} cell-selected`;
    let content = null;
    if (config.month && config.month.renderCell) {
      content = config.month.renderCell(context, config, date);
    }
    return (
      <div className={className} style={style}>
        <div className='label' onClick={() => this.onSelectCell()}>
          {date.getDate()}
        </div>
        <div className='content flex-vbox'>{content}</div>
      </div>)
  }
}

interface UIMonthCalendarProps extends MonthCalendarProps {
}
export class UIMonthCalendar extends UIAbstractMonthCalendar<UIMonthCalendarProps> {
  getCell(): any { return Cell; }

  render() {
    return (
      <div className='ui-month-calendar flex-vbox'>
        {this.renderTable()}
      </div>
    );
  }
}