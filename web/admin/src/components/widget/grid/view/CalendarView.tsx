import React, { Component } from "react";
import { IDTracker } from "components/util/common";
import { CalendarContext, DateRecordMap } from "components/widget/calendar/ICalendar";
import { UICalendarManager } from "components/widget/calendar/UICalendarManager";
import { VGridViewProps, VGridCalendarViewConfig } from "../IVGrid";
import { VGridConfigUtil } from "../util";
import { ListModel } from "../model/ListModel";

function createDateRecordMap(calendarView: VGridCalendarViewConfig, listModel: ListModel) {
  let records = listModel.getFilterRecords();
  let dateRecordMap = null;
  let calConfig = calendarView.config;
  if (calConfig.record.createDayRecordMap) {
    dateRecordMap = calConfig.record.createDayRecordMap(calendarView.config, records);
  } else {
    dateRecordMap = new DateRecordMap(records).mapByConfig(calConfig);
  }
  return dateRecordMap;
}

export class CalendarView extends Component<VGridViewProps, {}> {
  render() {
    const { context, viewName } = this.props;
    const calendarView = VGridConfigUtil.getView(context.config, viewName) as VGridCalendarViewConfig;
    let dayRecordMap = createDateRecordMap(calendarView, context.model);
    let calContext = new CalendarContext(context.uiRoot, dayRecordMap);
    let html = (<UICalendarManager key={IDTracker.next()} context={calContext} config={calendarView.config} />);
    return html;
  }
}