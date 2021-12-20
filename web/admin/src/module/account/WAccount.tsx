import React from 'react';
import { widget, util, app } from 'components'

import { ComplexBeanObserver } from 'core/entity';

import {
  EntityAutoCompletePlugin, BBEntityAutoComplete, BBEntityAutoCompleteProps, WDetailAutoComplete, WDetailAutoCompleteProps
} from '../../core/widget/WInput';

import { AccountRestURL, T } from './Dependency'
import { UIAccountList, UIAccountListPlugin } from './UIAccountList'
import { UILoadableAccountInfo } from './UIAccountInfo'
import { UINewAccountEditor } from './UINewAccount';
import { AccountType } from '../account';

import BBAutoComplete = widget.input.BBAutoComplete2;
const { Form, FormGroup, BBStringField } = widget.input;

export class AccountAutoCompletePlugin extends EntityAutoCompletePlugin {
  labelField?: string;
  accountType?: AccountType;

  constructor(appContext: app.AppContext, pageContext: app.PageContext, labelField?: string, accountType?: AccountType) {
    super(appContext, pageContext);
    this.labelField = labelField;
    this.accountType = accountType;
  }

  filter(pattern: string, onChangeCallback: (selOptions: any[]) => void) {
    let searchParams: widget.sql.SqlSearchParams = {
      "filters": [...widget.sql.createSearchFilter(pattern)],
      maxReturn: 1000
    }
    this.doSearch(AccountRestURL.account.search, searchParams, onChangeCallback);
  }

  onShowMoreInfo(ui: BBAutoComplete, bean: any) {
    let { field } = ui.props;
    let loginId = bean[field];
    let uiContent = (
      <UILoadableAccountInfo appContext={this.appContext} pageContext={this.pageContext} loginId={loginId} readOnly />
    );
    ui.dialogShow(T("Account Info"), 'lg', uiContent);
  }

  onCustomSelect(ui: BBAutoComplete) {
    let onSelect = (_appCtx: app.AppContext, pageCtx: app.PageContext, account: any) => {
      pageCtx.onBack();
      this.replaceWithSelect(ui, account, account.loginId);
      this.updateLabelField(ui, ui.props.bean, account);
      ui.onPostSelect(account.loginId);
      ui.dialogClose();
    }
    let popupPageCtx = new app.PageContext(new widget.layout.DialogContext());

    let uiContent = (
      <div className='flex-vbox'>
        <UIAccountList
          appContext={this.appContext} pageContext={popupPageCtx} type={'selector'} readOnly={true}
          plugin={new UIAccountListPlugin().withAccountType(this.accountType)} onSelect={onSelect} />
      </div>
    );
    widget.layout.showDialog(T('Select Account'), 'lg', uiContent, popupPageCtx.getDialogContext());
  }

  onCreateNew(ui: BBAutoComplete) {
    let onPostCreate = ({ account }: any) => {
      this.closePopupPageContext();
      this.replaceWithSelect(ui, account, account.loginId);
      ui.onPostSelect(account.loginId);
    }
    let popupPageCtx = this.newPopupPageContext();
    let observer = new ComplexBeanObserver({ account: { accountType: 'USER' } });
    let uiContent = (
      <UINewAccountEditor appContext={this.appContext} pageContext={popupPageCtx} observer={observer}
        commitURL={AccountRestURL.account.create} onPostCommit={onPostCreate} />);
    widget.layout.showDialog(T('Create New Account'), 'md', uiContent, popupPageCtx.getDialogContext());
  }

  onInputChange(ui: BBAutoComplete, bean: any, field: string, selectOpt: any, oldVal: any, newVal: any) {
    super.onInputChange(ui, bean, field, selectOpt, oldVal, newVal);
    this.updateLabelField(ui, bean, selectOpt);
  }

  updateLabelField(ui: BBAutoComplete, bean: any, selectBean: any) {
    if (this.labelField) {
      let { searchDescField } = ui.props;
      if (searchDescField) {
        bean[this.labelField] = selectBean[searchDescField];
        ui.forceUpdate();
      }
    }
  }
}

interface BBAccountAutoCompleteProps extends BBEntityAutoCompleteProps {
  labelField?: string;
}
export class BBAccountAutoComplete extends BBEntityAutoComplete<BBAccountAutoCompleteProps>{

  onPostSelect = (option: any, val: any) => {
    let { onPostSelect } = this.props;
    if (onPostSelect) onPostSelect(option, val);
    this.forceUpdate();
  }

  renderAutocomplete() {
    let { appContext, pageContext, disable, style, bean, field, useSelectBean, labelField } = this.props;
    let html = (
      <BBAutoComplete
        style={style}
        plugin={new AccountAutoCompletePlugin(appContext, pageContext, labelField).withAllowCreateNew(true)}
        bean={bean} field={field} useSelectBean={useSelectBean}
        searchField={'loginId'} searchDescField={'fullName'} disable={disable}
        onPostSelect={this.onPostSelect} />
    );
    return html;
  }

  renderWithLabelField(labelField: string) {
    let { bean } = this.props;
    let { BBStringField } = widget.input;
    let html = (
      <div className='flex-hbox'>
        <BBStringField className='mr-1 w-50'
          bean={bean} field={labelField} disable={true} placeholder='Account Full Name' />
        {this.renderAutocomplete()}
      </div>
    );
    return html;
  }

  render() {
    let { labelField } = this.props;
    if (labelField) return this.renderWithLabelField(labelField);
    return this.renderAutocomplete();
  }
}
export class WDetailAccountAutoComplete extends WDetailAutoComplete {
  plugin: AccountAutoCompletePlugin;

  constructor(props: WDetailAutoCompleteProps) {
    super(props);
    let { appContext, readOnly, pageContext, allowEmpty } = props;
    this.plugin =
      new AccountAutoCompletePlugin(appContext, pageContext, undefined, AccountType.USER)
        .withAllowCreateNew(readOnly ? true : false);

    if (!allowEmpty) {
      this.plugin.withValidators([new util.validator.EmptyValidator(T('This field cannot be empty'))]);
    }
  }

  render() {
    let { bean, readOnly, useSelectBean, field, onPostSelect } = this.props;
    let detailBean = bean[field] ? bean[field] : {};

    if (useSelectBean == undefined) useSelectBean = true;

    return (
      <Form>
        <FormGroup label={T('Login Id')}>
          <BBAutoComplete
            plugin={this.plugin} bean={bean} field={field} useSelectBean={useSelectBean}
            searchField="loginId" searchDescField={'loginId'} disable={readOnly}
            onPostSelect={onPostSelect} />
        </FormGroup>
        <FormGroup label={T('Full Name')}>
          <BBStringField bean={detailBean} field={'fullName'} disable={true} />
        </FormGroup>
        <FormGroup label={T('Email')}>
          <BBStringField bean={detailBean} field={'email'} disable={true} />
        </FormGroup>
        <FormGroup label={T('Mobile')}>
          <BBStringField bean={detailBean} field={'mobile'} disable={true} />
        </FormGroup>
      </Form>
    );
  }
}
