import React, { Component } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap'

import { i18n } from 'components/i18n';
import { WStringInput } from 'components/widget/input';
import { ButtonActionModel, DropdownActionButton } from 'components/widget/element';
import { BBRadioInputField } from 'components/widget/input';
import { Event } from 'components/widget/context';
import { VGridContextProps } from './IVGrid'
import { RECORD_FILTER_HANDLER } from './event'

const t = i18n.getT(['widget']);

export class WGridFilter extends Component<VGridContextProps> {
  onChange = (_oldVal: any, newVal: any) => {
    let { context } = this.props;
    RECORD_FILTER_HANDLER.handle(context, this, new Event().withParam('pattern', newVal));
  }

  render() {
    let { context } = this.props;
    let model = context.model;
    return (
      <WStringInput
        name='search' value={model.getRecordFilter().getPattern()}
        placeholder={t('Filter Expression')} onChange={this.onChange} />
    );
  }
}

export class WGridStateFilter extends Component<VGridContextProps> {
  constructor(props: VGridContextProps) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(_bean: any, _field: string, _oldVal: any, _newVal: any) {
    let { context } = this.props;
    //let model = context.model;
    //console.log(model);
    //model.filterByState(newVal);
    context.getVGrid().forceUpdateView();
  }

  render() {
    let { context } = this.props;
    let model = context.model;
    let opts = [null, 'ACTIVE', 'ARCHIVED'];
    let optLabels = ['All', 'Active', 'Archive'];
    return (
      <UncontrolledDropdown>
        <DropdownToggle nav caret>State Filter</DropdownToggle>
        <DropdownMenu right>
          <BBRadioInputField style={{ display: 'block', padding: '5px 10px' }}
            bean={model} field={'filterState'} options={opts} optionLabels={optLabels}
            onInputChange={this.onInputChange} />
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}

export interface WTableChangeStateProps extends VGridContextProps {
  actions: Array<string>;
}
export class WGridChangeState extends Component<WTableChangeStateProps> {
  actions: Array<ButtonActionModel>;

  constructor(props: WTableChangeStateProps) {
    super(props);
    let thisUI = this;
    let { actions } = props;
    this.actions = [];
    for (let i = 0; i < actions.length; i++) {
      if ('ACTIVE' == actions[i]) {
        this.actions.push(
          { name: 'activate', label: 'Activate', onSelect: function () { thisUI.onChangeStorageState('ACTIVE'); } },
        );
      } else if ('INACTIVE' == actions[i]) {
        this.actions.push(
          { name: 'inactive', label: 'Inactive', onSelect: function () { thisUI.onChangeStorageState('INACTIVE'); } },
        );
      } else if ('ARCHIVED' == actions[i]) {
        this.actions.push(
          { name: 'archive', label: 'Archive', onSelect: function () { thisUI.onChangeStorageState('ARCHIVED'); } },
        );
      } else if ('DEPRECATED' == actions[i]) {
        this.actions.push(
          { name: 'deprecated', label: 'Deprecated', onSelect: function () { thisUI.onChangeStorageState('DEPRECATED'); } }
        );
      }
    }
  }

  onChangeStorageState(newState: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | 'DEPRECATED') {
    let { context } = this.props;
    let model = context.model;
    let selDisplayRecords = model.getDisplayRecordList().getSelectedDisplayRecords();
    for (let i = 0; i < selDisplayRecords.length; i++) {
      let displayRecord = selDisplayRecords[i];
      displayRecord.record.entityState = newState;
    }
    context.getVGrid().forceUpdateView();
  }

  render() {
    let html = (<DropdownActionButton key={'storage-states'} label="States" items={this.actions} />)
    return html;
  }
}