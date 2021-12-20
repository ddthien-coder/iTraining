import React from "react";
import { widget, util, app, server } from 'components'

import {
  BeanObserver, ComplexBeanObserver,
} from 'core/entity';

import {
  EntityAutoCompletePlugin, BBEntityAutoComplete, WDetailAutoComplete,
  WDetailAutoCompleteProps, BBEntityAutoCompleteProps
} from '../../../core/widget/WInput';

import { T, HRRestURL } from 'module/company/hr/Dependency'
import { UIEmployeeList, UIEmployeeListPlugin } from "module/company/hr/UIEmployeeList";
import { UINewEmployeeEditor } from 'module/company/hr/UINewEmployee'
import { UIEmployeeEditor } from 'module/company/hr/UIEmployee'

import BBAutoComplete = widget.input.BBAutoComplete2;
import { WComponent } from "core/widget";

export class EmployeeAutoCompletePlugin extends EntityAutoCompletePlugin {
  labelField?: string;

  constructor(appContext: app.AppContext, pageContext: app.PageContext, labelField?: string) {
    super(appContext, pageContext);
    this.labelField = labelField;
  }

  filter(pattern: string, onChangeCallback: (selOptions: any[]) => void) {
    let searchParams: widget.sql.SqlSearchParams = {
      "filters": [...widget.sql.createSearchFilter(pattern)],
      maxReturn: 100
    };
    this.doSearch(HRRestURL.employee.search, searchParams, onChangeCallback);
  }

  onShowMoreInfo(ui: BBAutoComplete, bean: any) {
    let callback = (response: server.rest.RestResponse) => {
      let employee = response.data;
      let observer: BeanObserver = new BeanObserver(employee);
      let uiContent = (
        <UIEmployeeEditor appContext={this.appContext} readOnly={true} pageContext={this.pageContext}
          observer={observer} />
      );
      ui.dialogShow(T('Employee Info'), 'md', uiContent);
    };
    let loginId = this.getRefLinkValue(ui, bean);
    this.doShowMoreInfo(ui, bean, HRRestURL.employee.load(loginId), callback);
  }

  onCustomSelect(ui: BBAutoComplete) {
    let onSelect = (employee: any) => {
      this.replaceWithSelect(ui, employee, employee.loginId);
      this.updateLabelAfterSelect(ui, ui.props.bean, employee);
      ui.onPostSelect(employee.loginId);
      ui.dialogClose();
    }
    let uiContent = (
      <div className='flex-vbox' style={{ height: 600 }}>
        <UIEmployeeList
          type={'selector'} plugin={new UIEmployeeListPlugin()}
          appContext={this.appContext} pageContext={this.pageContext} readOnly={true}
          onSelect={(_appContext, _pageContext, selEmployee) => onSelect(selEmployee)} />
      </div>
    );
    ui.dialogShow(T('Select Employee'), 'lg', uiContent);
  }

  onCreateNew(ui: BBAutoComplete) {
    let onPostCreate = (account: any, _uiEditor?: WComponent) => {
      this.closePopupPageContext();
      this.replaceWithSelect(ui, account, account.loginId);
    }
    let popupPageCtx = this.newPopupPageContext();
    let observer = new ComplexBeanObserver({ account: { accountType: 'USER' } });
    let uiContent = (
      <UINewEmployeeEditor appContext={this.appContext} pageContext={popupPageCtx}
        observer={observer} onPostCommit={onPostCreate} />);
    widget.layout.showDialog(T('Create New Account'), 'md', uiContent, popupPageCtx.getDialogContext());
  }

  onInputChange(ui: BBAutoComplete, bean: any, field: string, selectOpt: any, oldVal: any, newVal: any) {
    super.onInputChange(ui, bean, field, selectOpt, oldVal, newVal);
    this.updateLabelAfterSelect(ui, bean, selectOpt);
  }

  updateLabelAfterSelect(ui: BBAutoComplete, bean: any, selectBean: any) {
    if (this.labelField) {
      let { searchDescField } = ui.props;
      if (searchDescField) {
        bean[this.labelField] = selectBean[searchDescField];
        ui.forceUpdate();
      }
    }
  }
}

interface BBEmployeeAutoCompleteProps extends BBEntityAutoCompleteProps {
  labelField?: string;
}

export class BBEmployeeAutoComplete extends BBEntityAutoComplete<BBEmployeeAutoCompleteProps> {
  onPostSelect = (option: any, val: any) => {
    let { onPostSelect } = this.props;
    if (onPostSelect) onPostSelect(option, val);
    this.forceUpdate();
  }

  render() {
    let { labelField } = this.props;
    if (labelField) return this.renderWithLabelField(labelField);
    return this.renderAutocomplete();
  }

  renderWithLabelField(labelField: string) {
    let { bean } = this.props;
    let { BBStringField } = widget.input;
    let html = (
      <div className='flex-hbox'>
        <BBStringField className='mr-1 w-50'
          bean={bean} field={labelField} disable={true} placeholder={'Employee Label'} />
        {this.renderAutocomplete()}
      </div>
    );
    return html;

  }

  renderAutocomplete() {
    let { appContext, pageContext, disable, style, bean, field, useSelectBean, labelField } = this.props;
    let allowCreateNew = !disable && appContext.hasUserAdminCapability();
    let html = (
      <BBAutoComplete
        style={style}
        plugin={
          new EmployeeAutoCompletePlugin(appContext, pageContext, labelField).withAllowCreateNew(allowCreateNew)
        }
        bean={bean} field={field} useSelectBean={useSelectBean}
        searchField={'loginId'} searchDescField={'label'} disable={disable}
        onPostSelect={this.onPostSelect} />
    );
    return html;
  }
}

export class WDetailEmployeeAutoComplete extends WDetailAutoComplete {
  plugin: EmployeeAutoCompletePlugin;

  constructor(props: WDetailAutoCompleteProps) {
    super(props);
    let { appContext, pageContext, allowEmpty } = this.props;
    this.plugin = new EmployeeAutoCompletePlugin(appContext, pageContext).withAllowCreateNew(true);
    if (!allowEmpty) {
      this.plugin.withValidators([new util.validator.EmptyValidator(T('This field cannot be empty'))]);
    }
  }

  render() {
    let { bean, readOnly, useSelectBean, field } = this.props;
    if (useSelectBean == undefined) useSelectBean = true;
    return (
      <BBAutoComplete
        plugin={this.plugin} bean={bean} useSelectBean={useSelectBean}
        field={field} searchField='loginId' searchDescField='label' disable={readOnly}
        onPostSelect={(_bean, _newVal) => this.forceUpdate()} />
    );
  }
}
