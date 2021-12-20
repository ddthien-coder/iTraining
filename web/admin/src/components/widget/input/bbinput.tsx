import React, { Component, ReactElement, ReactFragment } from 'react';
import moment from 'moment';

import { Validator } from 'components/util/validator';
import { IDTracker } from 'components/util/common';
import { fas, FAButton } from "components/widget/fa";
import { ELEProps, mergeCssClass } from "../element";
import { DialogContext, showDialog } from "../layout";
import {
  ErrorCollector,
  WInput, WStringInput, WStringArrayInput, WTextInput, WPasswordInput,
  WIntInput, WIntArrayInput, WLongInput, WLongArrayInput,
  WDoubleInput, WDoubleArrayInput, WFloatInput, WFloatArrayInput,
  WNumberInput, WPercentInput, WRadioInput, WDateTime,
  WCheckboxInput, WMultiCheckboxInput, WSelect, WBeanSelect,
  WSlider
} from './input';

const COMPACT_DATETIME_FORMAT = "DD/MM/YYYY@HH:mm:ssZ";

export interface BBFieldProps extends ELEProps {
  inputId?: string;
  bean: any;
  field: string;
  placeholder?: string;
  disable?: boolean;
  focus?: boolean
  required?: boolean
  validators?: Array<Validator>;
  errorCollector?: ErrorCollector;
  mapDisplayValue?: (inputValue: any) => any
  mapInputValue?: (displayValue: any) => any
  onKeyDown?: (winput: WInput, event: any, keyCode: number, currInput: any) => void;
  onInputChange?: (bean: any, field: string, oldVal: any, newVal: any) => void;
  onRefresh?: (bbField: BBField, bean: any, field: string) => void;
};
interface BBFieldState {
  renderId: any;
  value: any;
}
export class BBField<T extends BBFieldProps = BBFieldProps> extends Component<T, BBFieldState> {
  state = { renderId: null, value: null }

  static getDerivedStateFromProps(props: BBFieldProps, state: BBFieldState) {
    let { bean, field } = props;
    let value = bean[field];
    if (!state.renderId || value != state.value) {
      return { renderId: IDTracker.next(), value: value };
    }
    return null;
  }

  getWInput(): null | WInput { return null; }

  getDefaultValue() { return ''; }

  onWInputChange(oldVal: any, newVal: any) {
    const { bean, field, onInputChange } = this.props;
    bean[field] = newVal;
    this.forceUpdate();
    if (onInputChange) onInputChange(bean, field, oldVal, newVal);
  }

  onRefreshAction = (_input: WInput) => {
    let {onRefresh, bean, field} = this.props ;
    if(onRefresh) onRefresh(this, bean, field);
  }

  createWInput() {
    const {
      inputId, bean, field, validators, errorCollector, focus, required,
      placeholder, style, className, disable, onKeyDown, mapInputValue, mapDisplayValue,
      onRefresh
    } = this.props;
    let WInput: any = this.getWInput();
    let onRefreshAction = undefined ;
    if(onRefresh) onRefreshAction = this.onRefreshAction;
    let html = (
      <WInput key={this.state.renderId} inputId={inputId}
        style={style} className={className} 
        name={field} value={bean[field]} defaultValue={this.getDefaultValue()} placeholder={placeholder}
        disable={disable} focus={focus} required={required} errorCollector={errorCollector}
        onKeyDown={onKeyDown} validators={validators}
        onInputChange={(oldVal: any, newVal: any) => this.onWInputChange(oldVal, newVal)}
        mapInputValue={mapInputValue} mapDisplayValue={mapDisplayValue} {...this.getCustomProps()}
        onRefreshAction={onRefreshAction}/>
    );
    return html;
  }

  getCustomProps() : any { return undefined; }

  render() { return this.createWInput(); }
}

export class BBStringField extends BBField { getWInput(): any { return WStringInput; } }

export class BBStringArrayField extends BBField { getWInput(): any { return WStringArrayInput; } }

export class BBTextField extends BBField {
  createWInput() {
    const { style, className, bean, field, placeholder, disable, onKeyDown } = this.props;
    let html = (
      <WTextInput style={style} className={className} name={field} value={bean[field]} placeholder={placeholder} disable={disable}
        onKeyDown={onKeyDown} onInputChange={(oldVal, newVal) => this.onWInputChange(oldVal, newVal)} />
    );
    return html;
  }
}

export class BBPasswordField extends BBField { getWInput(): any { return WPasswordInput; } }

export class BBIntField extends BBField { getWInput(): any { return WIntInput; } }
export class BBIntArrayField extends BBField { getWInput(): any { return WIntArrayInput; } }

export class BBLongField extends BBField { getWInput(): any { return WLongInput; } }
export class BBLongArrayField extends BBField { getWInput(): any { return WLongArrayInput; } }

export class BBFloatField extends BBField { 
  getWInput(): any { return WFloatInput; } 

  getDefaultValue() { return '0'; }
}

export class BBFloatArrayField extends BBField { getWInput(): any { return WFloatArrayInput; } }

export class BBDoubleField extends BBField { 
  getWInput(): any { return WDoubleInput; } 

  getDefaultValue() { return '0'; }
}

interface BBNumberFieldProps extends BBFieldProps {
  precision?: number;
  maxPrecision?: number;
}
export class BBNumberField<T extends BBNumberFieldProps = BBNumberFieldProps> extends BBField<T> { 
  getWInput(): any { return WNumberInput; } 

  getCustomProps() {
    const { precision, maxPrecision } = this.props;
    return {precision: precision, maxPrecision: maxPrecision}
  }

  getDefaultValue() { return '0'; }
}

export class BBCurrencyField extends BBNumberField { 
}

export class BBPercentField extends BBField { getWInput(): any { return WPercentInput; } }

export class BBDoubleArrayField extends BBField { getWInput(): any { return WDoubleArrayInput; } }

export interface BBRadioInputFieldProps extends ELEProps {
  bean: any,
  field: string,
  options: Array<any>,
  optionLabels?: Array<string|ReactFragment>,
  disable?: boolean,
  onInputChange?: (bean: any, field: string, oldVal: any, newVal: any) => void
};
export class BBRadioInputField extends Component<BBRadioInputFieldProps, {}> {
  onWInputChange(oldVal: any, newVal: any) {
    const { bean, field, onInputChange } = this.props;
    bean[field] = newVal;
    if (onInputChange) {
      onInputChange(bean, field, oldVal, newVal);
    }
    this.forceUpdate();
  }

  render() {
    const { bean, field, options, optionLabels, disable, style, className } = this.props;
    let id = IDTracker.next();
    let html = (
      <WRadioInput style={style} className={className} disable={disable}
        name={`field_${id}`} options={options} optionLabels={optionLabels} select={bean[field]}
        onInputChange={(oldVal, newVal) => this.onWInputChange(oldVal, newVal)} />
    );
    return html;
  }
}

export interface BBCheckboxFieldProps extends ELEProps {
  bean: any, field: string, value: any, label?: string, disable?: boolean,
  onInputChange?: (bean: any, field: string, oldVal: any, newVal: any) => void
};
export class BBCheckboxField extends Component<BBCheckboxFieldProps, {}> {
  onWInputChange(checked: boolean) {
    const { bean, field, value, onInputChange } = this.props;
    if (typeof value === "boolean") bean[field] = checked;
    else bean[field] = checked ? value : null;
    if (onInputChange) onInputChange(bean, field, !checked, checked);
    else this.forceUpdate();
  }

  render() {
    const { className, style, bean, field, label, disable } = this.props;
    let checked = bean[field] ? true : false;
    let html = (
      <WCheckboxInput className={className} style={style} label={label} name={field} checked={checked} disable={disable}
        onInputChange={(checked: boolean) => this.onWInputChange(checked)} />
    );
    return html;
  }
}

export interface BBMultiCheckboxInputFieldProps {
  bean: any,
  field: string,
  options: Array<any>,
  optionLabels?: Array<string>,
  disable?: boolean,
  onInputChange?: (bean: any, field: string, oldVal: any, newVal: any) => void
};
export class BBMultiCheckboxInputField extends Component<BBMultiCheckboxInputFieldProps, {}> {
  onWInputChange(oldVal: any, newVal: any) {
    const { bean, field, onInputChange } = this.props;
    bean[field] = newVal;
    if (onInputChange) onInputChange(bean, field, oldVal, newVal);
  }

  render() {
    const { bean, field, options, optionLabels, disable } = this.props;
    let html = (
      <WMultiCheckboxInput name={field} options={options} optionLabels={optionLabels} select={bean[field]} disable={disable}
        onInputChange={(oldVal, newVal) => this.onWInputChange(oldVal, newVal)} />
    );
    return html;
  }
}

export interface BBSelectFieldProps extends ELEProps {
  bean: any;
  field: string;
  options: Array<any>;
  optionLabels?: Array<any>;
  disable?: boolean;
  onInputChange?: (bean: any, field: string, oldVal: any, newVal: any) => void
};
export class BBSelectField extends Component<BBSelectFieldProps, {}> {

  constructor(props: BBSelectFieldProps) {
    super(props);
    const { bean, field, options } = this.props;
    if (options.length > 0 && bean[field] == null) { bean[field] = options[0]; }
  }

  onSelect(newVal: any) {
    const { bean, field, onInputChange } = this.props;
    let oldVal = bean[field];
    bean[field] = newVal;
    if (onInputChange) {
      onInputChange(bean, field, oldVal, newVal);
    }
    this.forceUpdate();
  }

  render() {
    const { bean, field, options, className, style, disable, optionLabels } = this.props;
    let html = (
      <WSelect
        className={className} style={style}
        options={options} optionLabels={optionLabels} select={bean[field]}
        disable={disable} onSelect={(value) => this.onSelect(value)} />
    );
    return html;
  }
}

export interface BBBeanSelectFieldProps {
  bean: any, field: string, fieldCheck: string, fieldLabel: string, disable?: boolean, options: Array<any>,
  onInputChange: (bean: any, field: string, oldVal: any, newVal: any) => void
};
export class BBBeanSelectField extends Component<BBBeanSelectFieldProps, {}> {
  onSelect(opt: any) {
    const { bean, field, fieldCheck, onInputChange } = this.props;
    let oldVal = bean[field];
    bean[field] = opt[fieldCheck];
    if (onInputChange) {
      onInputChange(bean, field, oldVal, opt);
    }
  }

  render() {
    const { bean, field, options, fieldLabel, fieldCheck, disable } = this.props;
    let html = (
      <WBeanSelect options={options} fieldLabel={fieldLabel} fieldCheck={fieldCheck} select={bean[field]}
        disable={disable} onSelect={(opt) => this.onSelect(opt)} />
    );
    return html;
  }
}

export interface BBDateTimeFieldProps extends BBFieldProps {
  //bean: any;
  //field: string;
  //disable?: boolean;
  //onInputChange?: (bean: any, field: string, oldVal: any, newVal: any) => void;
  commitFormat?: 'date' | string,
  dateFormat?: any, timeFormat: any,
};
export class BBDateTimeField extends Component<BBDateTimeFieldProps, {}> {
  onInputChange(moment: any) {
    let { bean, field, commitFormat, onInputChange } = this.props;
    if (!commitFormat) commitFormat = COMPACT_DATETIME_FORMAT;
    let oldVal = bean[field];
    let value = null;

    if (moment) {
      value = moment.format(commitFormat);
      //moment format time zone as DD/MM/YYYY@HH:mm:ss+HH:mm while java format DD/MM/YYYY@HH:mm:ss+HHmm
      //Need to remove ':' character in timezone
      value = value.slice(0, value.length - 3) + value.slice(value.length - 2);
    }
    bean[field] = value;
    if (onInputChange) {
      onInputChange(bean, field, oldVal, value);
    }
  }

  render() {
    let {
      bean, field, commitFormat, dateFormat, timeFormat,
      validators, errorCollector, disable, required
    } = this.props;
    if (timeFormat === true) timeFormat = 'HH:mm';
    if (!commitFormat) commitFormat = COMPACT_DATETIME_FORMAT;

    let value = bean[field];
    if ('date' === commitFormat) {
    } else {
      if (value) {
        value = moment(value, commitFormat);
      } else {
        value = '';
      }
    }
    let html = (
      <WDateTime name={field} value={value} dateFormat={dateFormat} timeFormat={timeFormat} disable={disable}
        validators={validators} errorCollector={errorCollector} required={required}
        onCommitChange={(moment) => this.onInputChange(moment)} />
    );
    return html;
  }
}

export interface BBMultiLabelSelectorProps extends ELEProps {
  labelBeans: Array<any>;
  labelField: string;
  onLabelClick?: (bean: any) => void;
  context?: any, disable?: boolean;
};
export class BBMultiLabelSelector<T extends BBMultiLabelSelectorProps> extends Component<T, {}> {
  dialogContext: DialogContext | null = null;

  onCustomSelect() {
    let ui = (<div style={{ height: 300 }}>Custom Select</div>)
    this.dialogShow('Custom Select', 'md', ui);
  }

  dialogShow(title: string, size: 'xs' | 'sm' | 'md' | 'lg' | 'xl', ui: any) {
    this.dialogContext = new DialogContext();
    showDialog(title, size, ui, this.dialogContext);
  }

  dialogClose() {
    if (this.dialogContext) {
      this.dialogContext.getDialog().doClose();
      this.dialogContext = null;
    }
  }

  onRemove(idx: number) {
    let { labelBeans } = this.props;
    labelBeans.splice(idx, 1);
    this.forceUpdate();
  }

  onLabelClick(bean: any) {
    let { onLabelClick } = this.props;
    if (onLabelClick) onLabelClick(bean);
  }

  render() {
    let { className, style, labelBeans, labelField, disable } = this.props;
    let labelWidgets = [];

    for (let i = 0; i < labelBeans.length; i++) {
      let bean = labelBeans[i];
      let uiLabel = this.renderBean(bean, labelField);
      if (uiLabel == null) continue;
      let widget = (
        <div key={i} className='flex-hbox-grow-0 border p-1 mr-1'>
          {uiLabel}
          <FAButton hidden={disable} color="link" icon={fas.faTrashAlt} onClick={() => this.onRemove(i)} />
        </div>
      );
      labelWidgets.push(widget);
    }
    let html = (
      <div className={mergeCssClass(className, 'flex-hbox-grow-0 flex-wrap p-1')} style={style}>
        {labelWidgets}
        <FAButton hidden={disable} color='link' icon={fas.faPlus} onClick={() => this.onCustomSelect()} />
      </div>
    );
    return html;
  }

  renderBean(bean: any, labelField: string): ReactElement | null {
    let label = bean[labelField];
    let html = (<FAButton className='p-0' color='outline' onClick={() => this.onLabelClick(bean)}>{label}</FAButton>);
    return html;
  }
}

export interface BBReferenceProps {
  className?: string, style?: any,
  bean: any, field: string,
  disable?: boolean;
  onInfo: () => void;
};
export class BBReference<T extends BBReferenceProps> extends Component<T, {}> {
  render() {
    let { className, style, bean, field, onInfo } = this.props;
    let value = bean[field];
    let html = (
      <div className={`d-flex ${className}`} style={style}>
        <input className={'form-control'} name={field} value={value} disabled />
        {
          value ?
            <FAButton color='link' icon={fas.faInfo} onClick={() => onInfo()} /> : null
        }

      </div>
    );
    return html;
  }
}

export interface BBSliderProps extends ELEProps {
  field: string;
  bean: any;
  min: number;
  max: number;
  step: number;
  onInputChange?: (bean: any, field: string, oldVal: any, newVal: any) => void
}
export class BBSlider extends Component<BBSliderProps> {
  onChange = (newVal: number) => {
    let { bean, field, onInputChange } = this.props;
    let oldVal = bean[field];
    bean[field] = newVal;
    if (onInputChange) {
      onInputChange(bean, field, oldVal, newVal);
    }
  }
  render() {
    let { bean, field, min, max, step } = this.props;
    let value = bean[field];
    if (!value) value = min;
    let html = (
      <WSlider name={field} value={value} min={min} max={max} step={step} onChange={this.onChange} />
    );
    return html;
  }
}

export interface BBCallableFieldProps extends BBFieldProps {
  onCall: () => void
}

/**@deprecated */
export class BBFieldCallable extends Component<BBCallableFieldProps> {
  getBBField(): any {
    throw new Error('You need to override this method');
  }

  render() {
    let { className, style, bean, field, placeholder, disable, focus, validators, errorCollector, required } = this.props;
    let { onKeyDown, onInputChange, onCall, mapDisplayValue, mapInputValue } = this.props;
    let BBField = this.getBBField();
    let html = (
      <div className={`d-flex ${className}`} style={style} >
        <BBField
          bean={bean} field={field} placeholder={placeholder} disable={disable} errorCollector={errorCollector}
          focus={focus} validators={validators} onKeyDown={onKeyDown} required={required}
          onInputChange={onInputChange} mapInputValue={mapInputValue} mapDisplayValue={mapDisplayValue} />
        {
          disable ? null :
            <FAButton color='link' icon={fas.faSyncAlt} onClick={onCall} />
        }
      </div >
    );
    return html;
  }
}
/**@deprecated */
export class BBCallableStringField extends BBFieldCallable {
  getBBField(): any { return BBStringField; }
}

/**@deprecated */
export class BBCallableNumberField extends BBFieldCallable {
  getBBField(): any { return BBNumberField; }
}