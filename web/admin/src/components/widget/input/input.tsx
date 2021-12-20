import React, { Component, ReactFragment } from 'react';
import moment from 'moment';
import DateTime from 'react-datetime';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { formater } from 'components/util/text';
import { fas, FAButton } from 'components/widget/fa';
import { Validator } from 'components/util/validator';

import { ELEProps, mergeCssClass } from '../element';
import { showNotification } from '../layout';
import 'react-datetime/css/react-datetime.css'
import "./stylesheet.scss";

function isNormalInteger(value: any): boolean {
  var x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}

function isDecimal(str: string): boolean {
  return str.match(/^[-+]?[0-9]+(\.[0-9]+)?$/) != null;
}

export class ErrorCollector {
  errors: Record<string, string> = {};
  count: number = 0;

  getCount() { return this.count; }

  getErrors() { return this.errors; }

  collect(name: string, error: string) {
    if (!this.errors[name]) {
      this.errors[name] = error;
      this.count++;
    }
  }

  remove(name: string) {
    if (this.errors[name]) {
      delete this.errors[name];
      this.count--;
    }
  }

  assertNoError(title: string) {
    if (this.count > 0) {
      let fieldMessages = [];
      for (let name in this.errors) {
        fieldMessages.push(
          <div className='text-warning'>
            {`field ${name} has error ${this.errors[name]}`}
          </div>
        );
      }
      let detail = <div>{fieldMessages}</div>;
      showNotification('warning', title, detail);
      return false
    }
    return true;
  }

  dump() {
    console.log('ErrorCollector:');
    console.log('  count = ' + this.count);
    for (let name in this.errors) {
      console.log(`  ${name} = ${this.errors[name]}`);
    }
  }
}

function runInputValidation(value: any, validators?: Array<Validator>) {
  if (!validators) return;
  for (let i = 0; i < validators.length; i++) {
    validators[i].validate(value);
  }
}
export interface WInputProps extends ELEProps {
  inputId?: string;
  name: string;
  value: any;
  defaultValue?: string;
  placeholder: any;
  disable?: boolean;
  focus?: boolean;
  required?: boolean;
  validators?: Array<Validator>;
  errorCollector?: ErrorCollector;
  onChange?: (oldVal: any, newVal: any) => void;
  onInputChange?: (oldVal: any, newVal: any) => void;
  onKeyDown?: (winput: WInput, event: any, keyCode: number, currInput: any) => void;
  onRefreshAction?: (winput: WInput) => void;
  mapDisplayValue?: (inputValue: any) => any;
  mapInputValue?: (displayValue: any) => any;
};
export interface WInputState {
  message: null | string;
  value: any;
  inputValue: any
};
export class WInput<T extends WInputProps = WInputProps> extends Component<T, WInputState> {
  state = { value: null, inputValue: null, message: null };
  customClass: null | string = null;
  message: null | string = null;

  static getDerivedStateFromProps(props: WInputProps, state: WInputState) {
    let { name, value, defaultValue, required, errorCollector } = props;
    if (state.value !== value) {
      if (errorCollector) errorCollector.remove(name);
      if(!defaultValue) defaultValue = '';
      let inputValue = value ? value : defaultValue;
      let newState: WInputState = {
        message: null, value: value, inputValue: inputValue
      };
      if (required && inputValue == '') {
        newState.message = 'This field cannot be empty';
        if (errorCollector) errorCollector.collect(name, newState.message);
      }
      return newState;
    }
    return null;
  }

  constructor(props: T) {
    super(props);

    this.state = { message: null, value: null, inputValue: null };
    this.onPostInit(props);
  }

  onPostInit(_props: WInputProps) { }

  getMessage() { return this.message; }

  onFocus = (evt: any) => {
    if (this.props.disable) return;
    evt.target.select();
    if (this.state.message) this.setState({ message: null });
  }

  onFocusLost = (evt: any) => {
    if (this.props.disable) return;
    this.updateValue(evt.target.value);
  }

  onChange = (e: any) => {
    let oldVal = this.state.inputValue;
    let { onChange } = this.props;
    this.setState({ inputValue: e.target.value });
    if (onChange) onChange(oldVal, e.target.value);
  }

  updateValue(newVal: any) {
    const { name, required, validators, errorCollector, onInputChange, mapInputValue } = this.props;
    if (errorCollector) errorCollector.remove(name);
    if (mapInputValue) newVal = mapInputValue(newVal);
    let oldVal = this.state.value;
    try {
      if (newVal && newVal.trim) newVal = newVal.trim();
      if (required && !newVal) {
        let errMsg = 'This field cannot be empty';
        if (errorCollector) errorCollector.collect(name, errMsg);
        this.setState({ message: errMsg, inputValue: oldVal });
        return;
      }
      let val = this.convert(newVal);
      this.message = null;
      runInputValidation(val, validators);
      this.setState({ message: null, value: val, inputValue: val });
      if (onInputChange) onInputChange(oldVal, val);
    } catch (err) {
      let errMsg = err.message;
      if (errorCollector) errorCollector.collect(name, errMsg);
      this.setState({ message: errMsg, inputValue: oldVal });
      this.message = errMsg;
    }
  }

  convert(_newVal: string) { throw new Error('this method need to be implemented'); }

  onKeyDown(e: any) {
    let { onKeyDown } = this.props;
    if (onKeyDown) {
      let currInput = this.state.inputValue;
      onKeyDown(this, e, e.keyCode, currInput);
    }
  }

  toDisplayValue(value: any) {
    if (!value) return '';
    const { mapDisplayValue } = this.props;
    if (mapDisplayValue) value = mapDisplayValue(value);
    return value;
  }

  _getInputType() { return 'text'; }

  _getCustomClass() { return null; }

  render() {
    let { style, className, name, placeholder, disable, focus, onRefreshAction, inputId } = this.props;
    let inputValue = this.state.inputValue;
    let displayValue = this.toDisplayValue(inputValue);
    let classes = className ? `form-control ${className}` : 'form-control';
    let type = this._getInputType();
    if (this.state.message) {
      displayValue = this.state.message;
      classes = classes + ' form-control-error';
      type = 'text';
    }
    if (this.customClass) classes = classes + ' ' + this.customClass;
    let inputUI = (
      <input id={inputId} style={style} className={classes} autoFocus={focus ? true : false} type={type}
        name={name} value={displayValue} placeholder={placeholder} readOnly={disable} autoComplete="off"
        onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onFocusLost} onKeyDown={(e) => this.onKeyDown(e)} />
    );
    if(onRefreshAction && !disable) {
      return (
        <div className='flex-hbox'>
          {inputUI}
          <FAButton color='link' icon={fas.faSyncAlt} onClick={() => onRefreshAction? onRefreshAction(this): undefined } />
        </div>
      );
    }
    return inputUI;
  }
}

export class WStringInput extends WInput {
  convert(newVal: string) { return newVal; }
}

export class WPasswordInput extends WStringInput {
  type: 'text'|'password' = 'password';

  _getInputType() { return this.type; }

  onToggleVisibility = () => {
    if(this.type === 'password') this.type = 'text';
    else this.type = 'password';
    this.forceUpdate();
  }

  render() {
    let inputHtml = super.render() ;
    let html = (
      <div className='flex-hbox'>
        {inputHtml}
        <FAButton color='link' icon={fas.faEye} onClick={this.onToggleVisibility} />
      </div>
    );
    return html ;
  }
}

export class WTextInput extends WStringInput {
  render() {
    let { style, className, name, placeholder, disable } = this.props;
    let inputValue = this.state.inputValue;
    let displayValue = this.toDisplayValue(inputValue);
    if (this.state.message) displayValue = this.state.message;
    className = className ? `${className} form-control` : 'form-control';
    let html = (
      <textarea style={style} className={className} name={name} placeholder={placeholder} readOnly={disable}
        onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onFocusLost} value={displayValue}></textarea>
    );
    return html;
  }
}

export class WIntInput extends WInput {
  onPostInit(_props: WInputProps) { this.customClass = 'input-number'; }

  convert(newVal: string) {
    if (isNormalInteger(newVal)) return parseInt(newVal, 10);
    throw new Error(newVal + ' is not a number');
  }
}

export class WLongInput extends WInput {
  onPostInit(_props: WInputProps) { this.customClass = 'input-number'; }

  convert(value: string) {
    if (isNormalInteger(value)) return parseInt(value, 10);
    throw new Error(value + ' is not a long number');
  }
}

export class WFloatInput extends WInput {
  onPostInit(_props: WInputProps) { this.customClass = 'input-number'; }

  convert(value: string) {
    if (!value) return '';
    if (isDecimal(value)) return parseFloat(value);
    throw new Error(value + ' is not a float number');
  }
}

export class WDoubleInput<T extends WInputProps = WInputProps> extends WInput<T> {
  onPostInit(_props: WInputProps) { this.customClass = 'input-number'; }

  convert(value: string) {
    value = value.replace(/,/g, '');
    if(value === '') return 0;
    if (isDecimal(value)) return parseFloat(value);
    throw new Error(`${value} is not a double number`);
  }
}

interface WNumberInputProps extends WInputProps {
  precision?: number;
  maxPrecision?: number;
}
export class WNumberInput<T extends WNumberInputProps = WNumberInputProps> extends WDoubleInput<T> {
  toDisplayValue(value: any) {
    let { mapDisplayValue, precision, maxPrecision } = this.props;
    if (mapDisplayValue) value = mapDisplayValue(value);
    if (!value || typeof value === 'string' || value instanceof String) return value;

    if (precision) return formater.number(value, precision);
    if (!maxPrecision) maxPrecision = 3;
    let precisionCount = 0;
    if (Math.floor(value) != value) {
      precisionCount = value.toString().split(".")[1].length || 0;
    }
    if (precisionCount > maxPrecision) {
      return formater.number(value, maxPrecision);
    }
    return formater.number(value, precisionCount);
  }
}

export class WPercentInput extends WInput {
  onPostInit(_props: WInputProps) { this.customClass = 'input-number'; }

  convert(value: string) {
    value = value.replace(/%/g, '');
    value = value.replace(/,/g, '');
    if (isDecimal(value)) return parseFloat(value) / 100;
    throw new Error(value + ' is not a double number');
  }

  toDisplayValue(value: any) {
    if (!value) return '0';
    if (!value || typeof value === 'string' || value instanceof String) return value;
    return formater.percent(value);
  }
}

export interface WArrayInputProps {
  name: string;
  value: any;
  placeholder: any;
  disable?: boolean;
  disableAdd?: boolean;
  validators?: Array<Validator>;
  errorCollector?: ErrorCollector;
  onChange?: any;
  onInputChange: any;
  onKeyDown?: any
};
export interface WArrayInputState {
  inputValues: Array<any>;
  propsValues: Array<any> | null;
};
class WArrayInput extends Component<WArrayInputProps, WArrayInputState> {
  state: WArrayInputState = { propsValues: null, inputValues: [] };
  addNew: boolean = false;

  static getDerivedStateFromProps(nextProps: WArrayInputProps, prevState: WArrayInputState) {
    let values = nextProps.value;
    if (values != prevState.propsValues) {
      let inputValues = [];
      if (values != null && values.length > 0) {
        for (let i = 0; i < values.length; i++) {
          inputValues.push({ message: null, value: values[i], inputValue: values[i] });
        }
      }
      let newState: WArrayInputState = { inputValues: inputValues, propsValues: values };
      return newState;
    }
    return prevState;
  }

  onFocus(idx: number, _evt: any) {
    if (this.addNew) {
      this.addNew = false;
      return;
    }
    let inputValues = this.state.inputValues;
    inputValues[idx].message = null;
    this.setState({ inputValues: inputValues });
    this.forceUpdate();
  }

  onFocusLost(idx: number, evt: any) {
    const { name, validators, errorCollector, onInputChange } = this.props;
    let { inputValues } = this.state;
    let newVal = this.convert(evt.target.value.trim());

    try {
      if (validators != null) {
        for (let i = 0; i < validators.length; i++) {
          validators[i].validate(newVal);
        }
      }
      if (errorCollector) errorCollector.remove(name);

      inputValues[idx].value = newVal;

      if (onInputChange) {
        var values = [];
        for (let i = 0; i < inputValues.length; i++) {
          values.push(inputValues[i].value);
        }
        onInputChange(this.state.propsValues, values);
        this.setState({ propsValues: values });
      }
    } catch (err) {
      let inputValues = this.state.inputValues;
      inputValues[idx].message = err.toString();
      this.setState({ inputValues: inputValues });
    }
  }

  convert(newVal: string): any { return newVal; }

  onChange(idx: number, e: any) {
    let inputValues = this.state.inputValues;
    inputValues[idx].inputValue = e.target.value;
    this.setState({ inputValues: inputValues });
  }

  onRemove(idx: number) {
    let { inputValues } = this.state;
    inputValues.splice(idx, 1);

    const { onInputChange } = this.props;
    if (onInputChange) {
      var values = [];
      for (let i = 0; i < inputValues.length; i++) {
        values.push(inputValues[i].value);
      }
      onInputChange(this.state.propsValues, values);
    }
    this.setState({ inputValues: inputValues });
  }

  onAddNew() {
    let { inputValues } = this.state;
    inputValues.push({ message: null, value: '', inputValue: '' });
    this.setState({ inputValues: inputValues });
    this.addNew = true;
  }

  isFieldEditable() { return true; }

  render() {
    const { placeholder, disable, onKeyDown } = this.props;
    let readOnly = !this.isFieldEditable() || disable ? true : false;
    let inputValues = this.state.inputValues;
    let inputs = [];
    let renderDelete = null;
    for (let i = 0; i < inputValues.length; i++) {
      let ivalue = inputValues[i];
      let inputValue = ivalue.inputValue;
      if (ivalue.message) inputValue = ivalue.message;
      if (!readOnly) {
        renderDelete = (
          <div className="input-group-prepend">
            <FAButton color='link' icon={fas.faMinus} onClick={(_evt) => this.onRemove(i)} />
          </div>
        );
      }
      let autoFocus = false;
      if (this.addNew && i == inputValues.length - 1) {
        autoFocus = true;
      }
      inputs.push((
        <div key={i} className='input-group mb-1'>
          <input className='form-control' type={'text'} name={`name${i}`} value={inputValue} placeholder={placeholder}
            readOnly={readOnly} onChange={(e) => this.onChange(i, e)} onFocus={(e) => this.onFocus(i, e)}
            onBlur={(e) => this.onFocusLost(i, e)} onKeyDown={onKeyDown} autoComplete='off' autoFocus={autoFocus} />
          {renderDelete}
        </div>
      ));
    }
    let html = (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {inputs}
        {this.renderAdd(readOnly)}
      </div>
    );
    return html;
  }

  renderAdd(readOnly: boolean) {
    if (readOnly) return null;
    const { disableAdd } = this.props;
    if (disableAdd) return null;
    let html = (
      <div>
        <FAButton icon={fas.faPlus} color='link' onClick={(_evt) => this.onAddNew()} />
      </div>
    );
    return html;
  }
}

export class WStringArrayInput extends WArrayInput { convert(newVal: string) { return newVal; } }

export class WIntArrayInput extends WArrayInput {
  convert(newVal: string): any {
    if (isNormalInteger(newVal)) return parseInt(newVal, 10);
    throw new Error(newVal + ' is not a number');
  }
}

export class WLongArrayInput extends WArrayInput {
  convert(value: string): any {
    if (isNormalInteger(value)) return parseInt(value, 10);
    throw new Error(value + ' is not a long number');
  }
}

export class WFloatArrayInput extends WArrayInput {
  convert(value: string): any {
    if (isDecimal(value)) return parseFloat(value);
    throw new Error(value + ' is not a float number');
  }
}

export class WDoubleArrayInput extends WArrayInput {
  convert(value: string): any {
    if (isDecimal(value)) return parseFloat(value);
    throw new Error(value + ' is not a double number');
  }
}

export interface WRadioInputProps extends ELEProps {
  name: string,
  select: any,
  options: Array<any>,
  optionLabels?: Array<string|ReactFragment>,
  disable?: boolean,
  onInputChange: (oldVal: string, newVal: string) => void
}
export interface WRadioInputState { select: string }
export class WRadioInput extends Component<WRadioInputProps, WRadioInputState> {
  static getDerivedStateFromProps(nextProps: WRadioInputProps, prevState: WRadioInputState) {
    if (prevState.select !== nextProps.select) {
      return { select: nextProps.select };
    }
    return null;
  }

  constructor(props: WRadioInputProps) {
    super(props);
    const { select } = props;
    this.state = { select: select };
  }

  onSelect(idx: number) {
    const { onInputChange, options } = this.props;
    let oldVal = this.state.select;
    let newVal = options[idx];
    if (onInputChange) onInputChange(oldVal, newVal);
    this.setState({ select: newVal });
  }

  render() {
    let { name, options, optionLabels, disable, style } = this.props;
    let { select } = this.state;
    if (!optionLabels) optionLabels = options;
    let inputBlocks = [];
    for (let i = 0; i < options.length; i++) {
      let option = options[i];
      if (!option) option = '';
      inputBlocks.push(
        <div key={i} className='flex-hbox align-items-center' style={{ flexFlow: 'row nowrap' }}>
          <input type={'radio'} name={name} value={option} disabled={disable}
            checked={option === select} onChange={() => this.onSelect(i)} />
          <span className='ml-1 mr-2' style={{ display: 'inline-block' }}>{optionLabels[i]}</span>
        </div>
      );
    }
    if (!style) style = { display: 'flex', flexFlow: 'row wrap', width: '100%' }
    let html = (
      <div style={style}> {inputBlocks} </div>
    );
    return html;
  }
}

export interface WCheckboxInputProps extends ELEProps {
  name: string, label?: string, checked: boolean, disable?: boolean,
  onInputChange: (checked: boolean) => void
}
export interface WCheckboxInputState { checked: boolean }
export class WCheckboxInput extends Component<WCheckboxInputProps, WCheckboxInputState> {
  static getDerivedStateFromProps(nextProps: WCheckboxInputProps, prevState: WCheckboxInputState) {
    if (prevState.checked !== nextProps.checked) {
      return { checked: nextProps.checked };
    }
    return null;
  }

  constructor(props: WCheckboxInputProps) {
    super(props);
    this.state = { checked: props.checked };
  }

  onSelect() {
    const { onInputChange } = this.props;
    let checked = !this.state.checked;
    if (onInputChange) onInputChange(checked);
    this.setState({ checked: checked });
  }

  render() {
    let { className, style, name, label, disable } = this.props;
    const { checked } = this.state;
    if (!label) {
      return (
        <input
          className={className} style={style}
          type='checkbox' name={name} value={name} disabled={disable} checked={checked}
          onChange={() => this.onSelect()} />
      );
    }
    let html = (
      <div className={mergeCssClass('flex-hbox-grow-0 align-items-center text-nowrap', className)} style={style}>
        <input
          type='checkbox' name={name} value={name} disabled={disable} checked={checked}
          onChange={() => this.onSelect()} />
        <span className='mx-1' style={{ display: 'inline-block' }}>{label}</span>
      </div>
    );
    return html;
  }
}

export interface WMultiCheckboxInputProps {
  name: string,
  select: Array<string>,
  options: Array<any>,
  optionLabels?: Array<string>,
  disable?: boolean,
  onInputChange: (oldVal: Array<string>, newVal: Array<string>) => void
}
export interface WMultiCheckboxInputState {
  select: Array<string>
  checked: Array<boolean>
}
export class WMultiCheckboxInput extends Component<WMultiCheckboxInputProps, WMultiCheckboxInputState> {
  componentWillMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps: WMultiCheckboxInputProps) {
    const { select, options } = nextProps;
    let checked = [];
    for (let i = 0; i < options.length; i++) {
      checked[i] = false;
      if (select) {
        for (let j = 0; j < select.length; j++) {
          if (options[i] == select[j]) {
            checked[i] = true;
            break;
          }
        }
      }
    }
    this.setState({ select: select, checked: checked });
  }

  onSelect(idx: number) {
    const { onInputChange, options } = this.props;
    let oldVal = this.state.select;
    this.state.checked[idx] = !this.state.checked[idx];
    let newVal = [];
    for (let i = 0; i < options.length; i++) {
      if (this.state.checked[i]) {
        newVal.push(options[i]);
      }
    }
    if (onInputChange) onInputChange(oldVal, newVal);
    this.setState({ select: newVal });
  }

  render() {
    let { name, options, optionLabels, disable } = this.props;
    let { checked } = this.state;
    if (!optionLabels) optionLabels = options;
    let inputBlocks = [];
    for (let i = 0; i < options.length; i++) {
      let option = options[i];
      inputBlocks.push(
        <div key={i} style={{ display: 'flex', flexFlow: 'row nowrap' }}>
          <input type={'checkbox'} name={name} value={option} disabled={disable}
            checked={checked[i]} onChange={() => this.onSelect(i)} />
          <span className='ml-1 mr-2' style={{ display: 'inline-block' }}>{optionLabels[i]}</span>
        </div>
      );
    }
    let html = (
      <div style={{ display: 'flex', flexFlow: 'row wrap', width: '100%' }}>
        {inputBlocks}
      </div>
    );
    return html;
  }
}

export interface WSelectProps extends ELEProps {
  options: Array<any>, optionLabels?: Array<any>, select: any, disable?: boolean,
  onSelect?: (option: any) => void
};
export interface WSelectState { select: null | any };
export class WSelect extends Component<WSelectProps, WSelectState> {

  static getDerivedStateFromProps(nextProps: WSelectProps, prevState: WSelectState) {
    if (prevState.select !== nextProps.select) {
      return { select: nextProps.select };
    }
    return null;
  }

  constructor(props: WSelectProps) {
    super(props);
    this.state = { select: props.select };
  }

  onChange(event: any) {
    const { options } = this.props;
    let value = event.target.value;
    for (let i = 0; i < options.length; i++) {
      if (options[i] == value) {
        if (this.props.onSelect) this.props.onSelect(options[i]);
        break;
      }
    }
    this.setState({ select: value });
  }

  render() {
    const { options, className, style, disable, optionLabels } = this.props;
    const { select } = this.state;
    let optionHtml = [];

    for (let i = 0; i < options.length; i++) {
      let label = options[i];
      if (optionLabels) { label = optionLabels[i]; }
      optionHtml.push((<option key={i} value={options[i]}>{label}</option>));
    }
    let cssClass = mergeCssClass('form-control', className);
    let html = (
      <select className={cssClass} style={style} disabled={disable}
        onChange={evt => this.onChange(evt)} value={select}>
        {optionHtml}
      </select>
    );
    return html;
  }
}

export interface WBeanSelectProps {
  fieldLabel: string, fieldCheck: string, select: any, options: Array<any>,
  disable?: boolean, style?: string,
  onSelect: (value: number) => void
};
export interface WBeanSelectState { select: any };
export class WBeanSelect extends Component<WBeanSelectProps, WBeanSelectState> {
  open: boolean;

  static getDerivedStateFromProps(nextProps: WSelectProps, prevState: WSelectState) {
    if (prevState.select !== nextProps.select) {
      return { select: nextProps.select };
    }
    return null;
  }

  constructor(props: WBeanSelectProps) {
    super(props);
    this.open = false;
    this.state = { select: this.props.select };
  }

  onSelect(idx: number) {
    let { options, fieldCheck, onSelect } = this.props;
    let newOpt = options[idx];
    if (onSelect) onSelect(newOpt);
    this.setState({ select: newOpt[fieldCheck] });
  }

  toggle() {
    this.open = !this.open;
    this.forceUpdate();
  }

  render() {
    const { options, fieldLabel, fieldCheck } = this.props;
    let { select } = this.state;
    let optHtml = [];
    let selectLabel = select;
    for (let i = 0; i < options.length; i++) {
      let opt = options[i];
      let checked = opt[fieldCheck] === select;
      if (checked) selectLabel = opt[fieldLabel];
      optHtml.push((
        <DropdownItem key={i} onClick={() => this.onSelect(i)}>
          <input type="checkbox" defaultChecked={checked} />
          <label className='pl-2'>{opt[fieldLabel]}</label>
        </DropdownItem>
      ));
    }
    var htmlTemplate = (
      <Dropdown isOpen={this.open} toggle={() => this.toggle()}>
        <DropdownToggle caret>{selectLabel}</DropdownToggle>
        <DropdownMenu>{optHtml}</DropdownMenu>
      </Dropdown>
    );
    return htmlTemplate;
  }
}

export interface WDateTimeProps {
  name: string;
  value: any;
  dateFormat?: string;
  timeFormat: any;
  disable?: boolean;
  required?: boolean;
  validators?: Array<Validator>;
  errorCollector?: ErrorCollector;
  onCommitChange?: (moment: any) => void;
};
export interface WDateTimeState {
  propsValue: any;
  value: Date | string;
  inputValue: Date | string;
  errorMessage: string;
};
export class WDateTime extends Component<WDateTimeProps, WDateTimeState> {
  inputValue: Date | string = '';
  focus = false;
  state = { propsValue: '___', value: '', inputValue: '', errorMessage: '' }

  static getDerivedStateFromProps(props: WDateTimeProps, state: WDateTimeState) {
    let { name, required, value, errorCollector } = props;
    if (state.propsValue != value) {
      let errorMessage = '';
      if (required && (!value || value === '')) {
        errorMessage = 'This field is empty or invalid format';
        if (errorCollector) errorCollector.collect(name, errorMessage);
      }
      let newState: WDateTimeState = { propsValue: value, value: value, inputValue: value, errorMessage: errorMessage };
      return newState;
    }
    return null;
  }

  onChange = (value: any) => {
    this.updateValue(value);
  }

  onFocus = (evt: any) => {
    evt.target.select();
    this.focus = true;
    if (this.state.errorMessage) this.setState({ inputValue: '', errorMessage: '' });
  }

  onFocusLost = (_evt: any) => {
    this.focus = false;
  }

  updateValue(inputValue: any) {
    let { name, validators, errorCollector, dateFormat, required } = this.props;

    if (errorCollector) errorCollector.remove(name);
    if (!inputValue || inputValue === '') {
      if (required) {
        let errorMessage = 'This field is empty or invalid format';
        if (errorCollector) errorCollector.collect(name, errorMessage);
        this.setState({ inputValue: inputValue, errorMessage: errorMessage });
      } else {
        if (this.commitChange(null)) {
          this.setState({ value: '', inputValue: '', errorMessage: '' });
        }
      }
      return;
    }
    let parseValue: any = null;
    if (typeof inputValue === 'string' || inputValue instanceof String) {
      inputValue = inputValue as string;
      parseValue = moment(inputValue).format(dateFormat);
    } else {
      parseValue = moment(inputValue, dateFormat);
    }
    if (isNaN(parseValue)) {
      let errorMessage = 'This field is empty or invalid format';
      if (errorCollector) errorCollector.collect(name, errorMessage);
      this.setState({ errorMessage: errorMessage });
      return;
    }

    try {
      runInputValidation(parseValue, validators);
    } catch (err) {
      let errorMessage = err.message;
      this.setState({ inputValue: inputValue, errorMessage: errorMessage });
      if (errorCollector) errorCollector.collect(name, errorMessage);
      return;
    }
    if (this.commitChange(parseValue)) {
      this.setState({ value: parseValue, inputValue: inputValue, errorMessage: '' });
    }
  }

  commitChange(value: any) {
    let { onCommitChange, errorCollector, name } = this.props;
    try {
      if (onCommitChange) onCommitChange(value);
      return true;
    } catch (error: any) {
      let errorMessage = error.message;
      alert(errorMessage);
      if (errorCollector) errorCollector.collect(name, errorMessage);
      this.setState({ value: '', inputValue: '', errorMessage: errorMessage });
    }
    return false;
  }

  render() {
    let { dateFormat, timeFormat, disable } = this.props;
    let { inputValue, errorMessage } = this.state;
    if (!dateFormat) dateFormat = 'DD/MM/YYYY';
    if (!timeFormat) timeFormat = false;
    let errorClassName = errorMessage === '' ? '' : 'form-control-date-error';
    return (
      <div key={`${inputValue}`} className={`flex-hbox justify-content-end bg-light ${errorClassName}`}>
        <DateTime
          value={inputValue} dateFormat={dateFormat} timeFormat={timeFormat}
          inputProps={{ disabled: disable, onFocus: this.onFocus, onBlur: this.onFocusLost }}
          closeOnSelect={true} onChange={this.onChange} />
      </div>
    );
  }
}

export interface WSliderProps extends ELEProps {
  min: number;
  max: number;
  step: number;
  name: string;
  value: number;
  onChange?: (value: number) => void;
}
interface WSliderState {
  initialValue: number;
  value: number;
}
export class WSlider extends Component<WSliderProps, WSliderState> {
  static getDerivedStateFromProps(props: WSliderProps, state: WSliderState) {
    let { value } = props;
    if (!state || state.initialValue != value) {
      let newState: WSliderState = {
        initialValue: value, value: value
      };
      return newState;
    }
    return null;
  }

  handleChange = (event: any) => {
    let { onChange } = this.props;
    let value = event.target.value;
    this.setState({ value: value });
    if (onChange) onChange(value);
  }

  render() {
    let { name, min, max, step, className } = this.props;
    let classes = className ? `form-control ${className}` : 'form-control';
    let html = (
      <input className={classes}
        name={name} type="range" value={this.state.value} min={min} max={max} step={step}
        onChange={this.handleChange} />
    );
    return html;
  }
}