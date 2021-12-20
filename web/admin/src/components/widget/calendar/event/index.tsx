import { Component } from 'react';

import { fas } from 'components/widget/fa'
import { Event, EventHandler, WidgetContext } from 'components/widget/context';
import { CalendarContext } from '../ICalendar'

export const EVT_CALENDAR_UPDATE_VIEW: EventHandler = {
  name: 'cal:update', label: 'Update View', icon: fas.faCalendar,
  handle: (ctx: WidgetContext, _uiSrc: Component, _event: Event) => {
    let context = ctx as CalendarContext;
    context.getCalendarManager().forceUpdateView(true);
  }
}