import React from "react";

import { FAButton } from "components/widget/fa";
import { CalendarContext, CalendarConfig, CalendarViewType } from "./ICalendar";
import { UIMiniMonthCalendar } from "./UIMonthCalendar";

export interface UICalendarControlProps {
  context: CalendarContext;
  config: CalendarConfig;
}
export class UICalendarControl extends React.Component<UICalendarControlProps> {
  onSelectCalendarView(view: CalendarViewType) {
    let { context, config } = this.props
    config.view = view;
    //context.getDateRecordMap().mapByConfig(config);
    context.getCalendarManager().forceUpdateView(true);
  }

  render() {
    let { context, config } = this.props;
    return (
      <div className='p-1'>
        <UIMiniMonthCalendar context={context} config={config} date={config.selectedDate} controlMode={true} />
        <div className="view-control flex-hbox-grow-0 justify-content-around">
          <FAButton outline
            onClick={() => console.log('TODO')}>Today</FAButton>
          <FAButton outline
            onClick={() => this.onSelectCalendarView(CalendarViewType.Year)}>Year</FAButton>
          <FAButton outline
            onClick={() => this.onSelectCalendarView(CalendarViewType.Month)}>Month</FAButton>
          <FAButton outline
            onClick={() => this.onSelectCalendarView(CalendarViewType.Week)}>Week</FAButton>
          <FAButton outline
            onClick={() => this.onSelectCalendarView(CalendarViewType.Day)}>Day</FAButton>
        </div>
      </div>
    )
  }
}
