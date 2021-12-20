import React from 'react';
import { widget, util } from 'components';

import {
  WEntityEditor,
  WToolbar, WButtonEntityCommit, WButtonEntityReset, WEntity
} from 'core/widget'

import { AccountRestURL, T } from './Dependency'
import { AccountType } from '../account';

const { BBStringField, BBDateTimeField, BBSelectField, BBPasswordField, Form, FormGroup } = widget.input;

export class UIBasicAccountForm extends WEntity {
  render() {
    let { observer, readOnly } = this.props;
    let account = observer.getMutableBean();
    return (
      <Form>
        <FormGroup label={T('Login Id')}>
          <BBStringField
            bean={account} field={'loginId'} disable={!observer.isNewBean() || readOnly} required />
        </FormGroup >
        <FormGroup label={T('Full Name')}>
          <BBStringField bean={account} field={'fullName'} disable={readOnly} />
        </FormGroup >
        <FormGroup label={T('Email')}>
          <BBStringField bean={account} field={'email'} required disable={readOnly}
            validators={[util.validator.EMAIL_VALIDATOR]} />
        </FormGroup >
        <FormGroup label={T('Mobile')}>
          <BBStringField bean={account} field={'mobile'} disable={readOnly} />
        </FormGroup >
        <FormGroup label={T('Last Login Time:')}>
          <BBDateTimeField bean={account} field={'lastLoginTime'} disable={true} timeFormat={true} />
        </FormGroup >
      </Form >
    );
  }
}

export class UIAccountEditor extends WEntityEditor {
  render() {
    let { appContext, pageContext, observer, readOnly } = this.props;
    let account = observer.getMutableBean();
    let accountTypeOpts = [AccountType.USER, AccountType.ORGANIZATION];
    let accountTypeOptLabels = [T('USER'), T('ORGANIZATION')];

    return (
      <div className='flex-vbox'>
        <widget.layout.TabPane laf='outline'>
          <widget.layout.Tab name='info' label={T('Basic Account Info')} active>
            <UIBasicAccountForm appContext={appContext} pageContext={pageContext}
              observer={observer} readOnly={readOnly} />
          </widget.layout.Tab>
          <widget.layout.Tab name='other' label={T('Others')}>
            <Form>
              <FormGroup label={T('Account Type')}>
                <BBSelectField bean={account} field={'accountType'} options={accountTypeOpts} optionLabels={accountTypeOptLabels} disable={true} />
              </FormGroup>
              <FormGroup label={T('Password')}>
                <BBPasswordField
                  bean={account} field={'password'} disable={readOnly}
                  validators={[new util.validator.EmptyValidator(T('The password cannot be empty'))]} />
              </FormGroup>
              <FormGroup label={T('State')}>
                <BBStringField bean={account} field={'entityState'} disable={true} />
              </FormGroup>
            </Form>
          </widget.layout.Tab>
        </widget.layout.TabPane>
        <WToolbar>
          <WButtonEntityCommit
            appContext={appContext} pageContext={pageContext} readOnly={readOnly} observer={observer}
            label={`${T('Account')} ${account.loginId}`} commitURL={AccountRestURL.account.save}
            onPostCommit={(_entity) => this.forceUpdate()} />
          <WButtonEntityReset
            appContext={appContext} pageContext={pageContext} readOnly={readOnly} observer={observer} />
        </WToolbar>
      </div>
    );
  }
}