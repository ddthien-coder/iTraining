import React, { Component } from "react";

import { UIMiniMonthCalendar } from "./UIMonthCalendar";
import { CalendarContext, CalendarConfig } from "./ICalendar";
interface UIYearCalendarProps {
  context: CalendarContext;
  config: CalendarConfig;
  date: Date;
}
export class UIYearCalendar extends Component<UIYearCalendarProps> {
  render() {
    let { context, config, date } = this.props;
    let table = []
    let month = 0;
    for (let row = 0; row < 4; row++) {
      let rows = []
      for (let column = 0; column < 3; column++) {
        let monthInYear = new Date(date);
        monthInYear.setMonth(month);
        rows.push(
          <UIMiniMonthCalendar key={`col-${column}`}
            context={context} config={config} date={monthInYear} useLabelHeader disableSelectDay />);
        month++;
      }
      table.push(<div key={`row-${row}`} className="d-flex flex-row justify-content-around">{rows}</div>);
    }
    return (
      <div className='ui-year-calendar' >
        {table}
      </div>
    );
  }
}