import React, { Component } from 'react';
import { widget } from 'components';

import { ShareableScope } from '../../../core/entity';
import { T } from '../Dependency';

export interface BBShareableScopeProps {
  bean: any, field: string, fieldCheck?: string, fieldLabel?: string, disable?: boolean,
  onInputChange?: (bean: any, field: string, oldVal: any, newVal: any) => void
};

export class BBShareableScope extends Component<BBShareableScopeProps> {
  render() {
    let { bean, field, onInputChange, disable } = this.props;
    let options = [ShareableScope.COMPANY, ShareableScope.PRIVATE, ShareableScope.DESCENDANTS, ShareableScope.ORGANIZATION]
    let labels = [T('Company'), T('Private'), T('Descendants'), T('Organization')];
    let html = (
      <widget.input.BBSelectField bean={bean} field={field} options={options} optionLabels={labels}
        disable={disable} onInputChange={onInputChange} />
    );
    return html;
  }
}