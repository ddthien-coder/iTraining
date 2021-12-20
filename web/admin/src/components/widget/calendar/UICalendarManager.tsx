import React, { Component } from "react";

import { IDTracker } from "components/util/common";
import { CalendarContext, CalendarConfig, CalendarViewType, ICalendarManager } from "./ICalendar";
import { UIMonthCalendar } from "./UIMonthCalendar";
import { UIYearCalendar } from "./UIYearCalendar";
import { UIWeekCalendar } from "./UIWeekCalendar";
import { UIDayCalendar } from "./UIDayCalendar";
import { CalendarToolbar } from "./CalendarToolbar";
import { UICalendarPlugin } from "./UICalendarPlugin";

import './stylesheet.scss'
interface UICalendarViewProps {
  context: CalendarContext; config: CalendarConfig;
}
interface UICalendarViewState {
  width: number;
  height: number;
}
class UICalendarView extends Component<UICalendarViewProps, UICalendarViewState> {
  state = { width: 500, height: 300 }
  divElement: HTMLElement | null = null;

  componentDidMount() {
    if (this.divElement) {
      const height = this.divElement.clientHeight;
      const width = this.divElement.clientWidth;
      this.setState({ height: height, width: width });
      console.log('  update state ');
    }
  }

  render() {
    if (!this.divElement) {
      return <div className='flex-vbox' ref={(ele) => { this.divElement = ele }}>Loading...</div>
    }
    let { context, config } = this.props;
    let { width, height } = this.state;
    let UICalendarView = null;
    if (config.view == CalendarViewType.Year) {
      UICalendarView = (<UIYearCalendar context={context} config={config} date={config.selectedDate} />);
    } else if (config.view == CalendarViewType.Month) {
      UICalendarView = <UIMonthCalendar context={context} config={config} date={config.selectedDate} />;
    } else if (config.view == CalendarViewType.Week) {
      UICalendarView = <UIWeekCalendar context={context} config={config} date={config.selectedDate} />;
    } else {
      UICalendarView = <UIDayCalendar context={context} config={config} date={config.selectedDate} />;
    }
    return (
      <div className='ui-calendar-workspace flex-vbox' style={{ width: width, height: height, overflow: 'auto' }}
        ref={(ele) => { this.divElement = ele }}>
        {UICalendarView}
      </div>)
  }
}

interface UICalendarManagerProps {
  context: CalendarContext; config: CalendarConfig;
}
interface UICalendarManagerState {
  viewId: string;
}
export class UICalendarManager extends Component<UICalendarManagerProps, UICalendarManagerState>
  implements ICalendarManager {
  state = { viewId: `view-${IDTracker.next()}`, pluginViewId: `plugin-view-${IDTracker.next()}` }

  constructor(props: UICalendarManagerProps) {
    super(props);
    let { context } = props;
    context.setCalendarManager(this);
  }

  forceUpdateView(newViewId: boolean = false) {
    if (newViewId) {
      this.setState({ viewId: `${IDTracker.next}` })
    }
    this.forceUpdate();
  }

  render() {
    let { context, config } = this.props;
    let { viewId } = this.state;
    let plugin = config.plugin;
    let uiPluginView = null;
    let pluginWidth = 400;
    if (plugin) {
      if (plugin.width) pluginWidth = plugin.width;
      if (plugin.render) {
        uiPluginView = plugin.render(context, config);
      }
    }
    if (!uiPluginView) {
      uiPluginView = (<UICalendarPlugin context={context} config={config} />);
    }
    return (
      <div className='ui-calendar-manager flex-vbox'>
        <CalendarToolbar key={`toolbar-${viewId}`}
          config={config} context={context} date={config.selectedDate}
          onChangeCalendarConfig={() => this.forceUpdate()} />
        <div className='flex-hbox'>
          <UICalendarView key={viewId} context={context} config={config} />
          <div key={`plugin-${viewId}`} className='flex-vbox-grow-0 p-1' style={{ width: pluginWidth }}>
            {uiPluginView}
          </div>
        </div>
      </div>
    );
  }
}
