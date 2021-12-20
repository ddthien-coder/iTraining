import React from "react";
import { server, widget } from 'components'

import {
  BeanObserver, EntityAutoCompletePlugin,
  BBEntityAutoComplete, BBEntityAutoCompleteProps
} from 'core/widget';

import { T, HRRestURL } from 'module/company/hr/Dependency'
import { UIHRDepartmentList, UIHRDepartmentListPlugin } from "module/company/hr/UIHRDepartmentList";
import { UIHRDepartmentEditor } from "module/company/hr/UIHRDepartment";

import BBAutoComplete = widget.input.BBAutoComplete2;

export class BBHRDepartmentAutoCompletePlugin extends EntityAutoCompletePlugin {
  filter(pattern: string, onChangeCallback: (selOptions: any[]) => void) {
    let searchParams: widget.sql.SqlSearchParams = {
      "filters": [...widget.sql.createSearchFilter(pattern)],
      maxReturn: 100
    };
    this.doSearch(HRRestURL.department.search, searchParams, onChangeCallback);
  }

  onShowMoreInfo(ui: BBAutoComplete, bean: any) {
    let callback = (response: server.rest.RestResponse) => {
      let department = response.data;
      let observer: BeanObserver = new BeanObserver(department);
      let uiContent = (
        <UIHRDepartmentEditor appContext={this.appContext} pageContext={this.pageContext} observer={observer}
          readOnly={true} />
      );
      ui.dialogShow(T('Department Info'), 'md', uiContent);
    };
    let id = bean.name.id;
    this.doShowMoreInfo(ui, bean, HRRestURL.department.load(id), callback);
  }

  onCustomSelect(ui: BBAutoComplete) {
    let onSelect = (department: any) => {
      this.replaceWithSelect(ui, department, department.name);
      ui.onPostSelect(department.name);
      ui.dialogClose();
    }
    let uiContent = (
      <div className='flex-vbox' style={{ height: 600 }}>
        <UIHRDepartmentList
          type={'selector'} plugin={new UIHRDepartmentListPlugin()}
          appContext={this.appContext} pageContext={this.pageContext} readOnly={true}
          onSelect={(_appContext, _pageContext, selDepartment) => onSelect(selDepartment)} />
      </div>
    );
    ui.dialogShow(T('Select Department'), 'sm', uiContent);
  }
}

interface BBHRDepartmentAutoCompleteProps extends BBEntityAutoCompleteProps {
  labelField?: string;
}

export class BBHRDepartmentAutoComplete extends BBEntityAutoComplete<BBHRDepartmentAutoCompleteProps> {

  onPostSelect = (option: any, val: any) => {
    let { onPostSelect } = this.props;
    if (onPostSelect) onPostSelect(option, val);
    else this.forceUpdate();
  }

  renderAutocomplete() {
    let {
      appContext, pageContext, disable, style, bean, field, useSelectBean, required
    } = this.props;
    let allowCreateNew = !disable && appContext.hasUserAdminCapability();
    return (
      <BBAutoComplete
        required={required}
        style={style}
        plugin={new BBHRDepartmentAutoCompletePlugin(appContext, pageContext).withAllowCreateNew(allowCreateNew)}
        bean={bean} field={field} useSelectBean={useSelectBean}
        searchField={"name"} searchDescField={'label'} disable={disable}
        onPostSelect={this.onPostSelect} />
    );
  }

  renderWithLabelField(labelField: string) {
    let { bean, field, useSelectBean } = this.props;
    if (!bean[field] && useSelectBean) bean[field] = { [labelField]: null };
    let { BBStringField } = widget.input;

    return (
      <div className='flex-hbox'>
        <BBStringField className='mr-1 w-50'
          bean={useSelectBean ? { [labelField]: bean[field].label } : bean} field={labelField} disable={true}
          placeholder={T('Department Label')} />
        {this.renderAutocomplete()}
      </div>
    );
  }

  render() {
    let { labelField } = this.props;
    if (labelField) return this.renderWithLabelField(labelField);
    return this.renderAutocomplete();
  }
}
