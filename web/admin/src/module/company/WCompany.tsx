import React from 'react';
import { app, server, widget } from 'components'

import {
  BBEntityAutoComplete,
  BBEntityAutoCompleteProps,
  BeanObserver,
  EntityAutoCompletePlugin,
} from 'core/widget';

import { T, CompanyRestURL } from "./Dependency";
import { UICompanyEditor } from './UICompany';
import { UICompanyListPlugin, UICompanyList } from './UICompanyList';

import BBAutoComplete = widget.input.BBAutoComplete2;

export class CompanyAutoCompletePlugin extends EntityAutoCompletePlugin {
  labelField?: any;
  constructor(appContext: app.AppContext, pageContext: app.PageContext, labelField?: any) {
    super(appContext, pageContext);;
    this.labelField = labelField;
  }

  filter(pattern: string, onChangeCallback: (selOptions: any[]) => void) {
    let searchParams: widget.sql.SqlSearchParams = {
      "filters": widget.sql.createSearchFilter(pattern),
      maxReturn: 100
    }
    this.doSearch(CompanyRestURL.company.search, searchParams, onChangeCallback);
  }

  onShowMoreInfo(ui: BBAutoComplete, bean: any) {
    let readOnly = !this.appContext.hasUserWriteCapability();
    let callback = (response: server.rest.RestResponse) => {
      let observer = new BeanObserver(response.data);
      let html = (
        <UICompanyEditor
          appContext={this.appContext} pageContext={this.pageContext} readOnly={readOnly} observer={observer} />
      );
      ui.dialogShow(T("Company Info"), 'md', html);
    };
    let parentId = this.getRefLinkValue(ui, bean)
    this.doShowMoreInfo(ui, bean, CompanyRestURL.company.load(parentId), callback);
  }

  onCustomSelect(ui: BBAutoComplete) {
    let onSelect = (company: any) => {
      this.replaceWithSelect(ui, company, company.id);
      this.updateLabelAfterSelect(ui, ui.props.bean, company);
      ui.onPostSelect(company.id);
      ui.dialogClose();
    }

    let uiContent = (
      <div className='flex-vbox' style={{ height: 500 }}>
        <UICompanyList plugin={new UICompanyListPlugin().withExcludeRecords()}
          appContext={this.appContext} pageContext={this.pageContext} readOnly={true}
          onSelect={(_appContext, _pageContext, company) => onSelect(company)} />
      </div>
    );
    ui.dialogShow(T('Select Company'), 'lg', uiContent);
  }

  onCreateNew(ui: BBAutoComplete) {
    let onPostCreate = (Company: any) => {
      this.closePopupPageContext();
      this.replaceWithSelect(ui, Company, Company.id);
    }
    let popupPageCtx = this.newPopupPageContext();
    let uiContent = (
      <UICompanyEditor
        appContext={this.appContext} pageContext={popupPageCtx} observer={new BeanObserver({})}
        onPostCommit={onPostCreate} />
    );
    widget.layout.showDialog(T('Create New Company'), 'md', uiContent, popupPageCtx.getDialogContext());
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

interface BBCompanyAutoCompleteProps extends BBEntityAutoCompleteProps {
  labelField?: string;
}
export class BBCompanyAutoComplete extends BBEntityAutoComplete<BBCompanyAutoCompleteProps> {

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
          bean={bean} field={labelField} disable={true} placeholder={T('Company Label')} />
        {this.renderAutocomplete()}
      </div>
    );
    return html;

  }
  renderAutocomplete() {
    let { appContext, pageContext, style, bean, field, useSelectBean, disable, labelField } = this.props;
    let allowCreateNew = !disable && appContext.hasUserAdminCapability();
    let html = (
      <BBAutoComplete
        style={style}
        plugin={new CompanyAutoCompletePlugin(appContext, pageContext, labelField).withAllowCreateNew(allowCreateNew)}
        bean={bean} field={field} useSelectBean={useSelectBean}
        searchField="code" searchDescField={'label'} disable={disable}
        onPostSelect={this.onPostSelect} />
    );
    return html;
  }
}