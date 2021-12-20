import React, { Component } from 'react';
import { widget, app, util } from 'components';

import { WComponent, WComponentProps } from './WLayout'
import { T } from './Dependency'

import BBAutoComplete = widget.input.BBAutoComplete2;
import BBAutoCompletePlugin = widget.input.BBAutoCompletePlugin;

export interface BBEntityEditModeProps {
  bean: any, field: string, disable?: boolean,
  onInputChange?: (bean: any, field: string, oldVal: any, newVal: any) => void
};
export class BBEntityEditMode extends Component<BBEntityEditModeProps> {
  render() {
    let { bean, field, onInputChange, disable } = this.props;
    let options = ['VALIDATED', 'DRAFT', 'LOCKED'];
    let labels = [T('Validated'), T('Draft'), T('Locked')];
    let html = (
      <widget.input.BBSelectField
        bean={bean} field={field} options={options} optionLabels={labels} disable={disable}
        onInputChange={onInputChange} />
    );
    return html;
  }
}
export class EntityAutoCompletePlugin extends BBAutoCompletePlugin {
  appContext: app.AppContext;
  pageContext: app.PageContext;
  popupPageContext: app.PageContext | null = null;

  constructor(appContext: app.AppContext, pageContext: app.PageContext) {
    super();
    this.appContext = appContext;
    this.pageContext = pageContext;
  }

  newPopupPageContext() {
    this.closePopupPageContext();
    this.popupPageContext = new app.PageContext(new widget.layout.DialogContext());
    return this.popupPageContext;
  }

  closePopupPageContext() {
    if (this.popupPageContext) {
      this.popupPageContext.onBack();
      this.popupPageContext = null;
    }
  }

  doFilter(searchURL: string, pattern: string, onChangeCallback: (selOptions: any[]) => void) {
    const callback = (result: any) => {
      let entities: Array<any> = result.data;
      onChangeCallback(entities);
    };
    this.appContext.serverPOST(searchURL, { pattern: pattern }, callback);
  }

  doSearch(searchURL: string, searchParams: widget.sql.SqlSearchParams, onChangeCallback: (selOptions: any[]) => void) {
    const callback = (result: any) => {
      let entities: Array<any> = result.data;
      onChangeCallback(entities);
    };
    this.appContext.serverPOST(searchURL, searchParams, callback);
  }

  findWithGet(findURL: string, params: any, onChangeCallback: (selOptions: any[]) => void) {
    const callback = (result: any) => {
      let entities: Array<any> = result.data;
      onChangeCallback(entities);
    };
    let restClient = this.appContext.getServerContext().getRestClient();
    restClient.get(findURL, params, callback);
  }

  doShowMoreInfo(ui: BBAutoComplete, selOpt: any, loaduRL: string, callback: (result: any) => void) {
    if (!selOpt || Object.getOwnPropertyNames(selOpt).length === 0) {
      ui.dialogShow("Info", 'md', (<p>{'No Info'}</p>));
    } else {
      this.appContext.serverGET(loaduRL, {}, callback);
    }
  }
}

export interface BBEntityAutoCompleteProps {
  style?: any;
  disable?: boolean;
  autofocus?: boolean;
  required?: boolean;
  bean: any;
  field: string;
  useSelectBean?: boolean;
  hideMoreInfo?: boolean;
  errorCollector?: widget.input.ErrorCollector;
  validators?: Array<util.validator.Validator>;
  onPostSelect?: (option: any, val: any) => void;
  options?: Array<any>;
  appContext: app.AppContext;
  pageContext: app.PageContext;
};
export class BBEntityAutoComplete<T extends BBEntityAutoCompleteProps = BBEntityAutoCompleteProps>
  extends Component<T> {
}

export interface WDetailAutoCompleteProps extends WComponentProps {
  bean: any;
  field: string;
  validators?: Array<util.validator.Validator>;
  useSelectBean?: boolean;
  allowEmpty?: boolean;
  onPostSelect?: (selectedBean: any) => void;
}
export class WDetailAutoComplete extends WComponent<WDetailAutoCompleteProps> {
}
