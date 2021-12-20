import React, { Component, ReactElement, KeyboardEvent } from 'react';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { KeyCode, ObjUtil, IDTracker } from 'components/util/common';
import { Validator } from 'components/util/validator';
import { ELEProps, mergeCssClass } from "components/widget/element";
import { FALabel, FAButton, fas } from "components/widget/fa";
import { DialogContext, showDialog } from "components/widget/layout";
import { ErrorCollector } from "./input";

import './stylesheet.scss';

class WAutoCompleteModel {
  input: any;
  dropdown: boolean = false;
  options: Array<any> = [];
  currSelect: number = -1;
  focus: boolean = false;
  validated: boolean = false;
  errorMessage: string = '';

  constructor(props: WAutoComplete2Props) {
    let { value } = props;
    this.setValue(value);
  }

  withOptions(options: Array<any>) {
    this.options = options;
    this.dropdown = true;
    this.currSelect = options.length > 0 ? 0 : -1;
  }

  onFocusLost() {
    if (!this.validated) {
      this.focus = false;
    } else {
      this.focus = false;
      this.dropdown = false;
      this.currSelect = -1;
    }
  }

  onFocus() {
    this.focus = true;
    this.errorMessage = '';
  }

  validate() {
    this.validated = true;
    this.errorMessage = '';
  }

  onError(mesg: string) {
    this.dropdown = false;
    this.input = '';
    this.currSelect = -1;
    this.validated = false;
    this.errorMessage = mesg;
  }

  setValue(value: string) {
    this.input = value ? value : '';
    this.errorMessage = '';
    this.validated = !(!value || value === '');
  }
}

function runValidation(props: WAutoComplete2Props, model: WAutoCompleteModel, newVal: string) {
  const { name, validators, errorCollector, required } = props;
  if (errorCollector) errorCollector.remove(name);
  model.validate();
  if (required && (!newVal || newVal === '')) {
    model.onError('This field cannot be empty');
    if (errorCollector) errorCollector.collect(name, model.errorMessage);
    return false;
  }
  if (!validators) return true;
  try {
    for (let i = 0; i < validators.length; i++) {
      validators[i].validate(newVal);
    }
  } catch (err: any) {
    model.onError(err.message);
    if (errorCollector) errorCollector.collect(name, err.message);
    return false;
  }
  return true;
}

interface WAutoComplete2Props extends ELEProps {
  name: string;
  value: any;
  searchField?: string;
  searchDescField?: string;
  autofocus?: boolean;
  disable?: boolean;
  allowUserInput?: boolean;
  validators?: Array<Validator>,
  errorCollector?: ErrorCollector;
  required?: boolean;
  onInputChange: (ui: WAutoComplete2, selectBean: null | any, oldVal: string, newVal: string) => void;
  onCreateNew?: (WAutoComplete: WAutoComplete2) => void;
  filter: (exp: string, onChangeCallback: (options: Array<any>) => void) => void;
  onKeyDown?: (ui: WAutoComplete2, evt: KeyboardEvent) => boolean;
};
interface WAutoComplete2State { model: WAutoCompleteModel };
export class WAutoComplete2 extends Component<WAutoComplete2Props, WAutoComplete2State> {
  autoCompleteInput: any;
  mouseSelect = false;
  maxShowItem = 10;

  static getDerivedStateFromProps(_props: WAutoComplete2Props, _state: WAutoComplete2State) {
    return null;
  }

  constructor(props: WAutoComplete2Props) {
    super(props);
    this.autoCompleteInput = React.createRef();
    let model = new WAutoCompleteModel(this.props);
    this.state = { model: model };
    if (!model.validated) {
      runValidation(props, model, model.input);
    }
  }

  getModel() {
    const { model } = this.state;
    return model;
  }

  onFocus = (evt: any) => {
    if (this.props.disable) return;
    evt.target.select();
    let { model } = this.state;
    model.onFocus();
    this.mouseSelect = false;
    this.forceUpdate();
  }

  onFocusLost = (_evt: any) => {
    let thisUI = this;
    let callback = () => {
      /**
       * If select item by mouse from the drop down menu, mouse select will click outside of input and
       * cause a focus lost
       * */
      if (this.mouseSelect) {
        this.mouseSelect = false;
        return;
      }
      let { model } = thisUI.state;
      if (thisUI.props.allowUserInput) {
        thisUI.updateValue(null, model.input);
        model.onFocusLost();
      } else {
        model.onFocusLost()
        if (!model.validated) {
          thisUI.updateValue(null, '');
        }
      }
    }
    /** make sure this callback time is longer than onSelection() callback */
    setTimeout(callback, 200);
  }

  updateValue(optBean: null | any, newVal: any) {
    const { onInputChange } = this.props;
    const { model } = this.state;
    let oldVal = model.input;
    if (newVal && newVal.trim) newVal = newVal.trim();
    let validate = runValidation(this.props, model, newVal);
    if (validate) {
      model.dropdown = false;
      model.input = newVal;
      model.currSelect = -1;
      if (onInputChange) {
        onInputChange(this, optBean, oldVal, newVal);
        return;
      }
    }
    this.forceUpdate();
  }

  /**
   * 1. onKeyDown is called before onChange
   * 2. onChange won't be called for certain key such ENTER, ESC...
   */
  onKeyDown = (evt: KeyboardEvent) => {
    let keyCode = evt.keyCode;
    const { onCreateNew, onKeyDown } = this.props;
    if (onKeyDown) {
      let handled = onKeyDown(this, evt);
      if (handled) return;
    }
    const { model } = this.state;

    if (keyCode === KeyCode.ARROW_UP) {
      evt.stopPropagation();
      if (model.currSelect - 1 >= 0) {
        model.currSelect -= 1;
        this.forceUpdate();
      }
    } else if (keyCode === KeyCode.ARROW_DOWN) {
      evt.stopPropagation();
      let max = model.options.length;
      if (max > this.maxShowItem) max = this.maxShowItem;
      if (model.currSelect + 1 < max) {
        model.currSelect += 1;
        this.forceUpdate();
      } else if (model.currSelect + 1 == max && onCreateNew) {
        model.currSelect += 1;
        this.forceUpdate();
      }
    } else if (keyCode === KeyCode.ESC) {
      evt.stopPropagation();
      model.dropdown = false;
      model.input = '';
      model.currSelect = -1;
      model.validated = false;
      this.forceUpdate();
    } else if (keyCode === KeyCode.ENTER) {
      evt.stopPropagation();
      this.onSelectOption(model.currSelect);
    }
  }

  onChange = (evt: any) => {
    let value = evt.target.value;
    let { filter } = this.props;
    const { model } = this.state;
    model.input = value;
    model.validated = false;
    if (filter) {
      let onChangeCallback = (options: Array<any>) => {
        model.withOptions(options);
        this.forceUpdate();
      }
      filter(value, onChangeCallback);
    }
    this.forceUpdate();
  }

  onSelectOption(idx: number) {
    const { model } = this.state;
    let { onCreateNew, searchField, allowUserInput } = this.props;
    let onSelectCallback = () => {
      let max = model.options.length;
      if (max > this.maxShowItem) max = this.maxShowItem;
      if (idx < 0) {
        let newVal = '';
        if (allowUserInput) newVal = model.input;
        this.updateValue(null, newVal);
      } else if (idx == max && onCreateNew) {
        onCreateNew(this);
        model.input = '';
        model.options = [];
        model.dropdown = false;
        this.forceUpdate();
        return;
      } else {
        let selectOpt = model.options[idx];
        let newVal = selectOpt;
        if (searchField) newVal = selectOpt[searchField];
        this.updateValue(selectOpt, newVal);
      }
    }
    setTimeout(onSelectCallback, 100);
  }

  onMouseSelectOption(idx: number) {
    /**
     * Mouse selecttion will click outside of input and trigger a focus lost.
     * Make sure update value call once , since onFocusLost will try to validate and update value as well
     */
    this.mouseSelect = true;
    this.onSelectOption(idx);
  }

  renderOptions(options: Array<any>) {
    const { searchField } = this.props;
    if (searchField) return this.renderComplexOptions(searchField, options);
    return this.primitiveOptionRender(options);
  }

  renderComplexOptions(searchField: string, options: Array<any>) {
    const { searchDescField } = this.props;
    const { model } = this.state;
    let optionHtml = [];
    let max = options.length;
    if (max > this.maxShowItem) max = this.maxShowItem;
    for (let i = 0; i < max; i++) {
      let opt = options[i];
      let active = false;
      if (model.currSelect === i) active = true;
      let label = opt[searchField];
      let desc = searchDescField ? opt[searchDescField] : '';
      optionHtml.push(
        <DropdownItem key={`opt-${i}`} active={active}>
          <div key={i} className='option' onClick={() => this.onMouseSelectOption(i)}>
            <div className='label'>{label}</div>
            <div className='desc'>{desc}</div>
          </div>
        </DropdownItem>
      );
    }
    if (options.length > max) {
      optionHtml.push(<div key='more' className='more'>...</div>);
    }
    const { onCreateNew } = this.props;
    if (onCreateNew) {
      optionHtml.push(
        <DropdownItem key={'new'} active={model.currSelect == max}>
          <Button color='link' onClick={(_evt) => this.onMouseSelectOption(options.length)}>
            <FALabel icon={fas.faPlus}>Create New</FALabel>
          </Button>
        </DropdownItem>
      );
    }
    return optionHtml;
  }

  primitiveOptionRender(options: Array<any>) {
    let optionHtml = [];
    let max = options.length;
    if (max > this.maxShowItem) max = this.maxShowItem;
    let { currSelect } = this.state.model;
    for (let i = 0; i < max; i++) {
      let className = i === currSelect ? 'option-selected' : 'option';
      let active = false;
      if (currSelect === i) active = true;
      optionHtml.push((
        <DropdownItem key={i} active={active}>
          <div key={i} className={className} onClick={() => this.onMouseSelectOption(i)}>
            {options[i]}
          </div>
        </DropdownItem>
      ));
    }
    if (options.length > max) {
      optionHtml.push(<div key='more' className='more'>...</div>);
    }
    return optionHtml;
  }

  toggle() { }

  render() {
    const { model } = this.state;
    let { style, className, disable, autofocus } = this.props;

    let dropdownContent = null;
    if (model.dropdown) {
      let optionHtml = this.renderOptions(model.options);
      let inputWidth = 250;
      if (this.autoCompleteInput.current) {
        inputWidth = this.autoCompleteInput.current.offsetWidth
      }
      let width = inputWidth > 250 ? inputWidth : 250;
      dropdownContent = (
        <DropdownMenu right style={{ minHeight: '20px', width: width }}>{optionHtml}</DropdownMenu>
      )
    }

    let displayValue = model.input;
    let classes = mergeCssClass(className, 'form-control');
    if (!model.validated && !model.focus) {
      displayValue = model.errorMessage;
      classes = mergeCssClass(classes, ' form-control-error');
    }
    let html = (
      <div className='w-autocomplete flex-hbox'>
        <Dropdown className='flex-hbox' isOpen={model.dropdown} toggle={this.toggle}>
          <DropdownToggle style={{ background: 'none', border: 'none', padding: '0px', width: '100%' }}>
            <input className={classes} style={style} ref={this.autoCompleteInput} value={displayValue}
              readOnly={disable} autoComplete="off" type={'text'} autoFocus={autofocus}
              onKeyDown={this.onKeyDown} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onFocusLost} />
          </DropdownToggle>
          {dropdownContent}
        </Dropdown>
      </div>
    );
    return html;
  }
}

export class BBAutoCompletePlugin {
  validators?: Array<Validator>;
  options: Array<any> = [];
  allowCreateNew: boolean = false;

  withValidators(validators?: Array<Validator>) {
    if (!validators) return this;
    this.validators = validators;
    return this;
  }

  withOptions(options: Array<any>) {
    this.options = options;
    return this;
  }

  withAllowCreateNew(b: boolean) {
    this.allowCreateNew = b;
    return this;
  }

  getDisplayValue(ui: BBAutoComplete2, bean: any) {
    return this.getRefLinkValue(ui, bean);
  }

  getRefLinkValue(ui: BBAutoComplete2, bean: any) {
    const { field, useSelectBean, searchField } = ui.props;
    if (useSelectBean) {
      let valBean = bean[field];
      if (valBean) return valBean[searchField];
    } else {
      return bean[field];
    }
  }

  getLinkedBean(ui: BBAutoComplete2, bean: any) {
    const { field, useSelectBean } = ui.props;
    if (useSelectBean) {
      return bean[field];
    } else {
      return null;
    }
  }

  onInputChange(ui: BBAutoComplete2, bean: any, field: string, selectOpt: any, _oldVal: any, newVal: any) {
    if (selectOpt == null) {
      bean[field] = null;
    } else {
      this.replaceWithSelect(ui, selectOpt, newVal);
    }
  }

  replaceWithSelect(ui: BBAutoComplete2, opt: any, newValue: any) {
    let { useSelectBean } = ui.props
    let { bean, field, errorCollector } = ui.props;
    if (useSelectBean) {
      let valBean = bean[field];
      if (valBean) {
        ObjUtil.replaceProperties(valBean, opt);
      } else {
        bean[field] = opt;
      }
    } else {
      bean[field] = newValue;
    }
    if (errorCollector) errorCollector.remove(field);
  }

  filter(pattern: string, onChangeCallback: (selOptions: Array<any>) => void) {
    let selRecords = [];
    for (let i = 0; i < this.options.length; i++) {
      let record = this.options[i];
      if (ObjUtil.recordHasExpression(record, pattern)) {
        selRecords.push(record);
      }
    }
    onChangeCallback(selRecords);
  }

  onShowMoreInfo(ui: BBAutoComplete2, bean: any) {
    let uiContent = (<pre style={{ height: 500 }}>Custom More Info {JSON.stringify(bean, null, '  ')}</pre>)
    ui.dialogShow('More Info', 'md', uiContent);
  }

  onCustomSelect(ui: BBAutoComplete2) {
    let uiContent = (<div style={{ height: 300 }}>Custom Select</div>)
    ui.dialogShow('Custom Select', 'md', uiContent);
  }

  onCreateNew(ui: BBAutoComplete2) {
    let uiContent = (<div style={{ height: 300 }}>Create New Entry</div>)
    ui.dialogShow('Custom Select', 'md', uiContent);
  }
}

export interface BBAutoComplete2Props {
  style?: any;
  disable?: boolean;
  autofocus?: boolean;
  required?: boolean;
  bean: any;
  field: string;
  searchField: string;
  searchDescField?: string;
  useSelectBean?: boolean;
  hideMoreInfo?: boolean;
  plugin: BBAutoCompletePlugin;
  errorCollector?: ErrorCollector;
  customRenderInput?: (ui: BBAutoComplete2) => any;
  onPostSelect?: (option: any, val: any) => void
};
export class BBAutoComplete2 extends Component<BBAutoComplete2Props, {}> {
  dialogContext: DialogContext | null = null;

  filter(exp: string, onChangeCallback: (selOptions: Array<any>) => void): void {
    const { plugin } = this.props;
    plugin.filter(exp, onChangeCallback);
  }

  onInputChange = (_ui: WAutoComplete2, selectOpt: null | any, oldVal: any, newVal: any) => {
    const { plugin, bean, field, onPostSelect } = this.props;
    plugin.onInputChange(this, bean, field, selectOpt, oldVal, newVal);
    if (onPostSelect) onPostSelect(bean, newVal);
    this.forceUpdate();
  }

  onPostSelect(newVal: any) {
    const { bean, onPostSelect } = this.props;
    if (onPostSelect) onPostSelect(bean, newVal);
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

  render() {
    const { customRenderInput } = this.props;
    let inputUI: any = null;
    if (customRenderInput) {
      inputUI = customRenderInput(this);
    } else {
      inputUI = this.renderInput();
    }
    let html = (
      <div className='flex-hbox'>
        {inputUI}
        {this.renderControl()}
      </div>
    );
    return html;
  }

  renderInput() {
    const {
      plugin, bean, field, searchField, searchDescField,
      disable, errorCollector, style, autofocus, required } = this.props;
    let onCreateNew = undefined;
    if (plugin.allowCreateNew) onCreateNew = (_ui: WAutoComplete2) => {
      plugin.onCreateNew(this);
    }
    let inputValue: any = plugin.getDisplayValue(this, bean);
    let html = (
      <WAutoComplete2 key={IDTracker.next()} style={style}
        name={field} value={inputValue} autofocus={autofocus}
        searchField={searchField} searchDescField={searchDescField}
        validators={plugin.validators} errorCollector={errorCollector} disable={disable} required={required}
        filter={(val, onChangeCallback) => this.filter(val, onChangeCallback)}
        onInputChange={this.onInputChange}
        onCreateNew={onCreateNew} />
    );
    return html;
  }

  renderControl() {
    const { plugin, bean, disable, hideMoreInfo } = this.props;
    let moreInfoBtn = null;
    if (!hideMoreInfo) {
      moreInfoBtn = (
        <Button color='link' onClick={() => plugin.onShowMoreInfo(this, bean)}>
          <FALabel icon={fas.faInfo} />
        </Button>
      );
    }
    let html = (
      <div className="flex-hbox-grow-0">
        {moreInfoBtn}
        {
          !disable ? (
            <Button color='link' onClick={() => plugin.onCustomSelect(this)}>
              <FALabel icon={fas.faSearch} />
            </Button>
          ) : null
        }
      </div>
    );
    return html;
  }
}

export interface BBMultiLabelAutoCompleteProps extends ELEProps {
  labelBeans: Array<any>;
  searchField: string;
  searchDescField: string;
  onLabelClick?: (bean: any) => void;
  disable?: boolean;
  allowUserInput?: boolean;
  filter: (_exp: string, _onChangeCallback: (options: Array<any>) => void) => void;
  onSelect?: (selectBean: null | any, oldVal: string, value: string) => boolean;
  onRemove?: (selectBean: null | any) => boolean;
  customCenderLabel?: (bean: any) => ReactElement;
  showCustomSelect?: () => void;
};
export class BBMultiLabelAutoComplete<T extends BBMultiLabelAutoCompleteProps> extends Component<T, {}> {
  onKeyDown = (ui: WAutoComplete2, evt: KeyboardEvent) => {
    let model = ui.getModel();
    if (model.input == '' && evt.key === 'Backspace') {
      let { labelBeans } = this.props;
      if (labelBeans.length > 0) {
        this.onRemove(labelBeans.length - 1);
      }
      return true;
    }
    return false;
  }

  onInputChange = (ui: WAutoComplete2, selectBean: null | any, oldVal: string, newVal: string) => {
    let { labelBeans, onSelect } = this.props;
    if (onSelect) {
      let success = onSelect(selectBean, oldVal, newVal);
      if (success) {
        ui.getModel().setValue('');
        this.forceUpdate();
      }
      return;
    }
    if (selectBean != null) {
      labelBeans.push(selectBean);
    }
    ui.getModel().setValue('');
    this.forceUpdate();
  }

  onRemove(idx: number) {
    let { labelBeans, onRemove } = this.props;
    let removedBean = labelBeans[idx];
    labelBeans.splice(idx, 1);
    if (onRemove) {
      onRemove(removedBean);
    }
    this.forceUpdate();
  }

  onLabelClick(bean: any) {
    let { onLabelClick } = this.props;
    if (onLabelClick) onLabelClick(bean);
  }

  render() {
    let {
      className, style, labelBeans, searchField, searchDescField, disable,
      filter, showCustomSelect, allowUserInput
    } = this.props;
    let labelWidgets = [];

    for (let i = 0; i < labelBeans.length; i++) {
      let bean = labelBeans[i];
      let uiLabel = this.renderBean(bean, searchDescField);
      if (uiLabel == null) continue;
      let widget = (
        <div key={i} className='flex-hbox-grow-0 border mr-1'>
          {uiLabel}
          <FAButton hidden={disable} color="link" icon={fas.faTrashAlt} onClick={() => this.onRemove(i)} />
        </div>
      );
      labelWidgets.push(widget);
    }
    let customSelectBtn = null;
    if (showCustomSelect) {
      customSelectBtn = (
        <FAButton hidden={disable} color='link' icon={fas.faPlus} onClick={showCustomSelect} />
      );
    }
    let html = (
      <div className={mergeCssClass(className, 'flex-hbox flex-wrap')} style={style}>
        {labelWidgets}
        <WAutoComplete2
          style={{ border: 'none' }} name='filter' value='' disable={disable} allowUserInput={allowUserInput}
          searchField={searchField} searchDescField={searchDescField}
          filter={filter} onInputChange={this.onInputChange} onKeyDown={this.onKeyDown} />
        {customSelectBtn}
      </div>
    );
    return html;
  }

  renderBean(bean: any, labelField: string): ReactElement | null {
    let { customCenderLabel } = this.props;
    let label: any = null;
    if (customCenderLabel) label = customCenderLabel(bean);
    else label = bean[labelField];
    let html = (
      <FAButton className='p-0' color='outline' onClick={() => this.onLabelClick(bean)}>
        {label}
      </FAButton>
    );
    return html;
  }
}

export interface BBOptionAutoCompleteProps {
  style?: any;
  disable?: boolean;
  autofocus?: boolean;
  bean: any;
  field: string;
  searchField?: string;
  searchDescField?: string;
  options: Array<any>;
  allowUserInput?: boolean;
  onInputChange?: (bean: any, field: string, selOpt: any, oldVal: any, newVal: any) => void;
};
export class BBOptionAutoComplete extends Component<BBOptionAutoCompleteProps, {}> {
  filter = (exp: string, onChangeCallback: (selOptions: Array<any>) => void) => {
    let { options } = this.props;
    let filterRecords = [];
    for (let i = 0; i < options.length; i++) {
      let record = options[i];
      if (ObjUtil.recordHasExpression(record, exp)) {
        filterRecords.push(record);
      }
    }
    onChangeCallback(filterRecords);
  }

  onInputChange = (_ui: WAutoComplete2, selectOpt: null | any, oldVal: any, newVal: any) => {
    const { bean, field, onInputChange } = this.props;
    bean[field] = newVal;
    if (onInputChange) onInputChange(bean, field, selectOpt, oldVal, newVal);
    this.forceUpdate();
  }

  render() {
    const { bean, field, searchField, searchDescField, allowUserInput, disable, style, autofocus } = this.props;
    let inputValue: any = bean[field];
    let html = (
      <WAutoComplete2 style={style}
        name={field} value={inputValue} autofocus={autofocus}
        disable={disable} allowUserInput={allowUserInput}
        searchField={searchField} searchDescField={searchDescField}
        filter={this.filter} onInputChange={this.onInputChange} />
    );
    return html;
  }
}