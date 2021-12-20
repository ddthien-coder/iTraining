import React from 'react';
import { CSSProperties } from 'react';
import { Component } from 'react';

import {
  Button, ButtonProps, ButtonGroup,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
  UncontrolledPopover, Popover, PopoverHeader, PopoverBody
} from 'reactstrap';

import { storage } from 'components/storage';
import { FAIconDefinition, FAButton, fas, FAIcon } from "components/widget/fa";

//import 'bootstrap/dist/css/bootstrap.css';

export function mergeCssClass(c1?: string, c2?: string) {
  if (!c1) return c2;
  if (!c2) return c1;
  return c1 + ' ' + c2;
}

export type ELEProps = {
  mobile?: boolean;
  children?: any; 
  className?: string; 
  style?: CSSProperties
};

export interface ButtonActionModel {
  name: string, icon?: string,
  label: string, color?: string, outline?: boolean, size?: string,
  onSelect: (item: ButtonActionModel, context?: any) => void;
  divider?: boolean
};

export interface WButtonProps extends ButtonProps {
  remove?: boolean;
}
/**@deprecated */
export class WButton extends Component<WButtonProps> {
  render() {
    let { remove } = this.props;
    if (remove == true) return null;
    return <Button {...this.props} />
  }
}

export interface GroupButtonActionModel {
  label: string,
  actions: Array<ButtonActionModel>
};

export interface PopoverButtonProps {
  id: string;
  className?: string;
  label?: any;
  icon?: string;
  faIcon?: FAIconDefinition;
  outline?: boolean;
  color?: string;
  style?: any;
  popover: {
    title?: string, placement?: string, open?: boolean,
    trigger?: 'legacy' | 'click'
  };
  children: any;
  onToggle?: (open: boolean) => void;
}
export class PopoverButton extends Component<PopoverButtonProps, {}> {
  toggle = () => {
    let { popover, onToggle } = this.props;
    popover.open = !popover.open;
    if (onToggle) onToggle(popover.open)
    this.forceUpdate();
  }

  render() {
    let { id, className, label, faIcon, outline, color, popover, children, style } = this.props;
    let popupTitleEle = null;
    if (popover.title) {
      popupTitleEle = (<PopoverHeader>{popover.title}</PopoverHeader>);
    }
    if (!popover.trigger) popover.trigger = 'legacy';
    let placement: any = 'bottom';
    if (!popover.placement) popover.placement = 'any';
    let html = (
      <ButtonGroup className={className}>
        <FAButton id={id} icon={faIcon} outline={outline} color={color} onClick={() => this.toggle()}>
          {label}
        </FAButton>
        <UncontrolledPopover placement={placement} trigger={popover.trigger} target={id}
          isOpen={popover.open} toggle={this.toggle}>
          {popupTitleEle}
          <PopoverBody style={style}>{children}</PopoverBody>
        </UncontrolledPopover>
      </ButtonGroup>
    );
    return html;
  }
}

export interface ButtonWithDropdownProps {
  icon?: FAIconDefinition,
  label: string;
  id: string,
  color?: string,
  size?: 'sm' | 'md' | 'lg';
  popover: { title?: string, onClose?: () => void },
  onClick: () => void,
  children: any
};
export interface ButtonWithDropdownState { popoverOpen: boolean };
export class ButtonWithDropdown extends Component<ButtonWithDropdownProps, ButtonWithDropdownState> {
  constructor(props: ButtonWithDropdownProps) {
    super(props);
    this.state = { popoverOpen: false };
  }

  componentWillReceiveProps(_nextProps: ButtonWithDropdownProps) {
    this.setState({ popoverOpen: false })
  }

  toggle = () => {
    this.setState({ popoverOpen: !this.state.popoverOpen });
  }

  render() {
    let { id, icon, label, popover, onClick, children, color, size } = this.props;
    let popupTitleEle = null;
    if (popover.title) {
      popupTitleEle = (<PopoverHeader>{popover.title}</PopoverHeader>);
    }
    let uiLabel = label ?
      <FAButton className='mx-0 px-1' size={size} color={color} icon={icon}
        onClick={onClick} style={{ whiteSpace: 'nowrap' }} >
        {label}
      </FAButton> : null;

    let html = (
      <ButtonGroup>
        {uiLabel}
        <FAButton className='mx-0 px-1' color={color} id={id} icon={fas.faCaretDown} onClick={this.toggle} />
        <Popover placement="bottom" isOpen={this.state.popoverOpen} target={id}
          toggle={popover.onClose ? popover.onClose : this.toggle}>
          {popupTitleEle}
          <PopoverBody className='d-flex'>{children}</PopoverBody>
        </Popover>
      </ButtonGroup>
    );
    return html;
  }
}

export interface AutoRefreshButtonProps {
  id: string,
  label?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  onRefresh?: () => void,
  defaultPeriod: -1 | 5 | 10 | 30 | 60 | 300
};
export interface AutoRefreshButtonState { selectPeriod: number };
export class AutoRefreshButton extends Component<AutoRefreshButtonProps, AutoRefreshButtonState> {
  timerId: any;
  options = [
    { label: "None", period: -1 },
    { label: "5s", period: 5 },
    { label: "10s", period: 10 },
    { label: "30s", period: 30 },
    { label: "1min", period: 60 },
    { label: "5min", period: 300 },
  ];

  constructor(props: AutoRefreshButtonProps) {
    super(props)
    this.state = { selectPeriod: props.defaultPeriod };
    this.timerId = null;
  }

  componentDidMount() {
    let { selectPeriod } = this.state;
    this.autoRefresh(selectPeriod);
  }

  onSelectPeriod(period: number) {
    this.setState({ selectPeriod: period });
    this.autoRefresh(period);
  }

  onRefresh() {
    let { onRefresh } = this.props;
    if (onRefresh) onRefresh();
  }

  autoRefresh(period: number) {
    let { onRefresh } = this.props;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (onRefresh && period > 0) {
      this.timerId = setInterval(onRefresh, period * 1000);
    }
  }

  componentWillUnmount() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  render() {
    let { id, label, color } = this.props;
    let { selectPeriod } = this.state;
    let optionEles = [];
    for (let i = 0; i < this.options.length; i++) {
      let opt = this.options[i];
      optionEles.push((
        <div key={i} className='mx-1'>
          <input type={'radio'} name={'opt' + i}
            checked={opt.period === selectPeriod} onChange={() => this.onSelectPeriod(opt.period)} />
          <label className='ml-1'>{opt.label}</label>
        </div>
      ));
    }
    let customLabel = `${label}`;
    if (selectPeriod > 0) customLabel = `${label}[${selectPeriod}s]`
    let html = (
      <ButtonWithDropdown id={id} color={color} icon={fas.faSync} label={customLabel}
        popover={{ title: 'Select Refresh Period' }} onClick={() => this.onRefresh()}>
        {optionEles}
      </ButtonWithDropdown>
    );
    return html;
  }
}

export interface DropdownActionButtonProps {
  label?: string;
  icon?: string;
  faIcon?: FAIconDefinition;
  hint?: string;
  items: Array<ButtonActionModel>;
  align?: string;
  color?: string;
  outline?: boolean;
  size?: string;
  className?: string;
};
export interface DropdownActionButtonState { open: boolean };
export class DropdownActionButton extends Component<DropdownActionButtonProps, DropdownActionButtonState> {

  constructor(props: DropdownActionButtonProps) {
    super(props);
    this.state = { open: false };
  }

  toggle() {
    this.setState(prevState => ({ open: !prevState.open }));
  }

  onSelectItem(item: ButtonActionModel) {
    if (item.onSelect) item.onSelect(item);
  }

  render() {
    let { label, icon, faIcon, hint, items, align, size, color, outline, className } = this.props;
    let right = align === 'right';
    let itemEles = [];
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (item.divider) {
        itemEles.push((<DropdownItem key={i} divider />));
      } else {
        itemEles.push((<DropdownItem key={i} onClick={() => this.onSelectItem(item)}>{item.label}</DropdownItem>));
      }
    }
    let iconUI = null;
    if (faIcon) {
      iconUI = (<FAIcon size='1x' className='mr-1' icon={faIcon} title={hint} />)
    } else if (icon) {
      iconUI = (<span className={icon} title={hint} />)
    }
    let html = (
      <ButtonDropdown isOpen={this.state.open} toggle={() => this.toggle()}>
        <DropdownToggle className={`${className}`} caret size={size} color={color} outline={outline}>
          {iconUI}{label}
        </DropdownToggle>
        <DropdownMenu right={right}>{itemEles}</DropdownMenu>
      </ButtonDropdown>
    );
    return html;
  }
}

export interface DropdownSelectItemButtonProps {
  items: Array<any>,
  selectItem?: any,
  onSelect?: (item: any) => void;
};
export interface DropdownSelectItemButtonState { open: boolean, selectItem: any };
export class DropdownSelectItemButton extends Component<DropdownSelectItemButtonProps, DropdownSelectItemButtonState> {
  constructor(props: DropdownSelectItemButtonProps) {
    super(props);
    let { items, selectItem } = props;
    if (!selectItem) selectItem = items[0];
    this.state = { open: false, selectItem: selectItem };
  }

  toggle() { this.setState(prevState => ({ open: !prevState.open })); }

  onSelectItem(item: any) {
    this.setState({ selectItem: item });
    let { onSelect } = this.props;
    if (onSelect) onSelect(item);
  }

  render() {
    let { items } = this.props;
    let { selectItem } = this.state;
    let itemEles = [];
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      itemEles.push((
        <DropdownItem key={i} onClick={() => this.onSelectItem(item)}>
          <input type="checkbox" checked={item === selectItem} readOnly={true} /> {item}
        </DropdownItem>
      ));
    }
    let html = (
      <ButtonDropdown isOpen={this.state.open} toggle={() => this.toggle()}>
        <DropdownToggle caret>{selectItem}</DropdownToggle>
        <DropdownMenu>{itemEles}</DropdownMenu>
      </ButtonDropdown>
    );
    return html;
  }
}

export interface DropdownSelectComplexItemButtonProps {
  label: string,
  items: Array<any>,
  fieldLabel: string,
  fieldCheck: string,
  onSelect?: (item: any) => void;
};
export interface DropdownSelectComplexItemButtonState { open: boolean };
export class DropdownSelectComplexItemButton
  extends Component<DropdownSelectComplexItemButtonProps, DropdownSelectComplexItemButtonState> {

  keepOpen: boolean;

  constructor(props: DropdownSelectComplexItemButtonProps) {
    super(props);
    this.keepOpen = false;
    this.state = { open: false };
  }

  toggle() {
    if (this.keepOpen) {
      this.keepOpen = false;
      this.forceUpdate();
    } else {
      this.setState(prevState => ({ open: !prevState.open }));
    }
  }

  onSelect(item: any) {
    let { onSelect, fieldCheck } = this.props;
    item[fieldCheck] = !item[fieldCheck];
    if (onSelect) onSelect(item);
    this.keepOpen = true;
  }

  render() {
    let { label, items, fieldLabel, fieldCheck } = this.props;
    let itemEles = [];
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let checkedVal = item[fieldCheck] ? item[fieldCheck] : false;
      itemEles.push((
        <DropdownItem key={`item-${i}`} onClick={() => this.onSelect(item)}>
          <div className='flex-hbox-grow-0 align-items-center'>
            <input type="checkbox" name={fieldCheck} value={checkedVal} checked={checkedVal} readOnly={true} />
            <div className='px-2'>{item[fieldLabel]}</div>
          </div>
        </DropdownItem>
      ));
    }
    let html = (
      <ButtonDropdown isOpen={this.state.open} toggle={() => this.toggle()}>
        <DropdownToggle caret>{label}</DropdownToggle>
        <DropdownMenu>{itemEles}</DropdownMenu>
      </ButtonDropdown>
    );
    return html;
  }
}

export interface StoreableStateComponentProps extends ELEProps {
  storeId?: string;
  storeScope?: 'cache' | 'session' | 'disk';
};
export class StoreableStateComponent<T extends StoreableStateComponentProps = StoreableStateComponentProps, S = any>
  extends Component<T, S> {

  initStorableState(state: any) {
    let storeId = this.props.storeId as string;
    this.state = state;
    if (storeId) {
      let storeScope = this.props.storeScope;
      if (storeScope === 'cache') {
        this.state = storage.cacheGet(storeId, this.state);
      } else if (storeScope === 'session') {
        this.state = storage.sessionGet(storeId, this.state);
      } else {
        this.state = storage.pageGet(storeId, this.state);
      }
    }
  }

  setStorableState(state: any) {
    let storeId = this.props.storeId as string;
    if (storeId) {
      let prevState = this.state;
      let newState = { ...prevState, ...state };
      let storeScope = this.props.storeScope;
      if (storeScope === 'cache') {
        storage.cachePut(storeId, newState);
      } else if (storeScope === 'session') {
        storage.sessionPut(storeId, newState);
      } else {
        storage.pagePut(storeId, newState);
      }
      this.setState(state);
    } else {
      this.setState(state);
    }
  }
}

export interface ProgressBarProps { progress: number, duration: number };
export interface ProgressBarState { progress: number };
/**@deprecated */
export class ProgressBar extends Component<ProgressBarProps, ProgressBarState> {
  constructor(props: ProgressBarProps) {
    super(props);
    this.state = { progress: 1 };
    this.state = this.initState(props);
  }

  componentWillReceiveProps(nextProps: ProgressBarProps) {
    let state = this.initState(nextProps);
    this.setState(state);
  }

  componentWillMount() { }

  initState(props: ProgressBarProps) {
    let { progress, duration } = props;
    let state = { progress: progress ? progress : 1 };
    if (!duration) duration = 1000;
    let period = duration / 100;
    let ProgressBar = this;

    let frame = function () {
      if (progress >= 100) {
        clearInterval(id);
      } else {
        progress += period;
        let state: ProgressBarState = { progress: progress };
        ProgressBar.setState(state);
      }
    }
    let id = setInterval(frame, period);
    return state;
  }

  render() {
    const { progress } = this.state;
    var html = (
      <div className="progress" style={{ height: 20 }}>
        <div className="progress-bar bg-info" role="progressbar" style={{ width: progress + '%' }}
          aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}></div>
      </div>
    );
    return html;
  }
}
