import React, { Component, ReactFragment } from "react";
import { FAButton } from "components/widget/fa";

import { CalendarContext, CalendarConfig, DayRecordMap, CalendarPluginConfig } from "./ICalendar";

export interface UICalendarPluginProps {
  context: CalendarContext;
  config: CalendarConfig;
}
export class UICalendarPlugin<T extends UICalendarPluginProps = UICalendarPluginProps> extends Component<T> {
  private getPluginConfig() {
    let { config } = this.props;
    let pluginConfig = config.plugin;
    if (!pluginConfig) throw Error('No plugin config');
    return pluginConfig;
  }

  renderBody() {
    let { context, config } = this.props;
    let date = config.selectedDate;
    let dayRecordMap: DayRecordMap | undefined = context.getDateRecordMap().getByDay(date);
    if (!dayRecordMap) {
      return (<div>There is no event on {config.selectedDate.toDateString()}</div>);
    }
    let uiHourInfos = [];
    let hour = new Date(config.selectedDate);
    for (let i = 0; i < 24; i++) {
      hour.setHours(i);
      let records = dayRecordMap.getRecordAtHour(config, hour);
      if (!records || records.length == 0) continue;
      let uiHour = (
        <div key={`hour-${i}`} className='border my-1 p-1'>There are {records.length} event at hour {i + 1}</div>
      );
      uiHourInfos.push(uiHour);
    }
    let html = (<div className='flex-vbox'>{uiHourInfos}</div>);
    return html;
  }

  renderAction(plugin: CalendarPluginConfig) {
    let actions = plugin.actions;
    if (!actions) return '';
    let uiActions: Array<ReactFragment> = [];
    for (let action of actions) {
      uiActions.push(
        <FAButton className='py-0' color='link' icon={action.icon}>{action.label}</FAButton>
      )
    }
    return <div className={'flex-hbox-grow-0'}>{uiActions}</div>;
  }

  render() {
    let pluginConfig = this.getPluginConfig();
    let label = pluginConfig.label ? pluginConfig.label : 'Plugin';

    let html = (
      <div className='flex-vbox'>
        <div className='plugin-toolbar flex-hbox-grow-0 align-items-center justify-content-between bg-light'>
          <h5 className='m-0'>{label}</h5>
          {this.renderAction(pluginConfig)}
        </div>
        <div className='plugin-body flex-vbox py-1'>
          {this.renderBody()}
        </div>
      </div>
    );
    return html;
  }
}
