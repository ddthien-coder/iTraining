import React, { Component } from "react";
import {
  UncontrolledDropdown, DropdownToggle, DropdownMenu, ButtonGroup
} from 'reactstrap'

import { FAButton, fas } from 'components/widget/fa'
import { BBCheckboxField, BBSelectField } from "components/widget/input";
import {
  CalendarContext, CalendarConfig, HourCellMode,
  CellAction, CalendarViewType
} from "./ICalendar";
import { UICalendarControl } from "./UICalendarControl";

interface CalendarToolbarProps {
  context: CalendarContext;
  config: CalendarConfig;
  date: Date;
  onChangeHourCellMode?: (cellMode: HourCellMode) => void;
  onChangeCalendarConfig: () => void;
}
interface CalendarToolbarState {
  options: Array<number>;
  optionLbs: Array<string>;
  currSelect: number;
}
export class CalendarToolbar extends Component<CalendarToolbarProps, CalendarToolbarState> {
  constructor(props: CalendarToolbarProps) {
    super(props);

    let { config } = this.props;
    let recordConfig = config.record;

    let dateFieldSet = recordConfig.dateFieldSet;
    if (dateFieldSet) {
      let options = [];
      let optionLbs = [];
      for (let i = 0; i < dateFieldSet.length; i++) {
        let sel = dateFieldSet[i];
        options.push(i);
        let label = sel.dateFieldLabel;
        if (!label) label = sel.dateField;
        if (sel.toDateFieldLabel) label += ` - ${sel.toDateFieldLabel}`;
        optionLbs.push(label);
      }
      this.state = { options: options, optionLbs: optionLbs, currSelect: 0 };
    } else {
      this.state = { options: [], optionLbs: [], currSelect: 0 };
    }
  }

  toggleCellAction = () => {
    let { config, onChangeCalendarConfig } = this.props;
    if (config.cellAction == CellAction.None) {
      config.cellAction = CellAction.All;
    } else {
      config.cellAction = CellAction.None;
    }
    onChangeCalendarConfig();
  }

  onChangeHourCellMode(cellMode: HourCellMode) {
    let { config, onChangeHourCellMode, onChangeCalendarConfig } = this.props;
    if (config.view == CalendarViewType.Day || config.view == CalendarViewType.Week) {
      config.cellMode = cellMode;
      if (onChangeHourCellMode) onChangeHourCellMode(cellMode);
      else onChangeCalendarConfig();
    }
  }

  createHourCellModeControl() {
    let { config, onChangeHourCellMode } = this.props;
    let currCellMode: HourCellMode | null = null;
    if (config.view == CalendarViewType.Day || config.view == CalendarViewType.Week) {
      currCellMode = config.cellMode;
    }
    if (!currCellMode) return <></>;

    let hourCellModeBtns = [
      <FAButton key='bh' outline icon={fas.faBusinessTime} hint={'Business Hours'}
        disabled={currCellMode == HourCellMode.BusinessHour}
        onClick={() => this.onChangeHourCellMode(HourCellMode.BusinessHour)} />,

      <FAButton key='all' outline icon={fas.faListAlt} hint={'All Hours'} disabled={currCellMode == HourCellMode.All}
        onClick={() => this.onChangeHourCellMode(HourCellMode.All)} />,
    ];
    if (onChangeHourCellMode) {
      hourCellModeBtns.push(
        <FAButton key='hwt' outline icon={fas.faEye} hint={'Hour With Tasks'}
          onClick={() => this.onChangeHourCellMode(HourCellMode.DataOnly)} />
      )
    }
    return <ButtonGroup>{hourCellModeBtns}</ButtonGroup>
  }

  onChangeDateFieldConfig = () => {
    let { config, context, onChangeCalendarConfig } = this.props;
    context.getDateRecordMap().mapByConfig(config);
    onChangeCalendarConfig();
  }

  onSelectDateFieldSet(idx: number) {
    let { config, context, onChangeCalendarConfig } = this.props;
    let recordConfig = config.record;
    let dateFieldSet = recordConfig.dateFieldSet;
    if (!dateFieldSet) return;
    let selSet = dateFieldSet[idx];
    recordConfig.dateField = selSet.dateField;
    recordConfig.dateFieldLabel = selSet.dateFieldLabel;
    recordConfig.dateFieldSelect = true;

    recordConfig.toDateField = selSet.toDateField;
    recordConfig.toDateFieldLabel = selSet.toDateFieldLabel;
    recordConfig.toDateFieldSelect = false;
    this.setState({ currSelect: idx });
    context.getDateRecordMap().mapByConfig(config);
    onChangeCalendarConfig();
  }

  onSelectCalendarView(view: CalendarViewType) {
    let { context, config } = this.props
    config.view = view;
    context.getCalendarManager().forceUpdateView(true);
  }

  onSelectToday = () => {
    let { context, config } = this.props
    config.selectedDate = new Date();
    context.getCalendarManager().forceUpdateView(true);
  }

  createDateControl() {
    let { config } = this.props;
    let recordConfig = config.record;
    let { dateField, dateFieldLabel, toDateField, toDateFieldLabel } = recordConfig;

    let dateFieldSet = recordConfig.dateFieldSet;
    let dateFieldSetSelector = null;
    if (dateFieldSet) {
      dateFieldSetSelector = (
        <BBSelectField className='mx-2 p-0' style={{ height: '1.75rem' }}
          bean={{ select: this.state.currSelect }} field={'select'}
          options={this.state.options} optionLabels={this.state.optionLbs}
          onInputChange={(_bean, _field, _oldVal, newVal) => this.onSelectDateFieldSet(newVal)} />
      );
    }

    if (!dateFieldLabel) dateFieldLabel = dateField;
    if (!toDateFieldLabel) toDateFieldLabel = toDateField;
    let html = (
      <div className='flex-hbox-grow-0 align-items-center mx-2'>
        {dateFieldSetSelector}
        <BBCheckboxField className='mr-2'
          bean={recordConfig} field={'dateFieldSelect'} value={true} label={dateFieldLabel}
          onInputChange={(_bean, _field, _oldVal, _newVal) => this.onChangeDateFieldConfig()} />
        <BBCheckboxField
          bean={recordConfig} field={'toDateFieldSelect'} value={true} label={toDateFieldLabel}
          onInputChange={(_bean, _field, _oldVal, _newVal) => this.onChangeDateFieldConfig()} />
      </div>
    );
    return html;
  }

  render() {
    let { context, config, date } = this.props;
    let viewMode = config.view;
    let label = date.toDateString();
    let cellActionIcon = fas.faEye;
    if (config.cellAction == CellAction.None) {
      cellActionIcon = fas.faEyeSlash;
    }
    return (
      <div className='ui-calendar-toolbar flex-hbox-grow-0 justify-content-between bg-light'>
        <div className='header flex-hbox-grow-0'>
          <UncontrolledDropdown>
            <DropdownToggle nav caret style={{ width: 150 }}>{label}</DropdownToggle>
            <DropdownMenu left style={{ outline: 'none', border: 'none', padding: 1 }}>
              <div className='bg-light' style={{ border: '3px solid whitesmoke', width: 300 }}>
                <UICalendarControl context={context} config={config} />
              </div>
            </DropdownMenu>
          </UncontrolledDropdown>
          <ButtonGroup>
            <FAButton outline disabled={viewMode == CalendarViewType.Year}
              onClick={() => this.onSelectCalendarView(CalendarViewType.Year)}>Year</FAButton>
            <FAButton outline disabled={viewMode == CalendarViewType.Month}
              onClick={() => this.onSelectCalendarView(CalendarViewType.Month)}>Month</FAButton>
            <FAButton outline disabled={viewMode == CalendarViewType.Week}
              onClick={() => this.onSelectCalendarView(CalendarViewType.Week)}>Week</FAButton>
            <FAButton outline disabled={viewMode == CalendarViewType.Day}
              onClick={() => this.onSelectCalendarView(CalendarViewType.Day)}>Day</FAButton>
          </ButtonGroup>
          <FAButton className='mx-1' outline
            onClick={this.onSelectToday}>Today</FAButton>
          <FAButton className='mx-1' outline icon={cellActionIcon}
            onClick={this.toggleCellAction}>Cell Action</FAButton>
        </div>
        <div className='actions flex-hbox-grow-0'>
          {this.createDateControl()}
          {this.createHourCellModeControl()}
        </div>
      </div>
    );
  }
}