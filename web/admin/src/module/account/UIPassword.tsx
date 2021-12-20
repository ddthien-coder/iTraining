import React from 'react';
import { widget, util, server } from 'components';

import {
  WToolbar, WEntity, WButtonEntityWrite
} from 'core/widget';

import { AccountRestURL, T } from './Dependency';

import Validator = util.validator.Validator

const {
  BBStringField, Row, ColFormGroup, FormContainer, BBPasswordField
} = widget.input;

class PasswordValidator implements Validator {
  validate(val: string): void {
    if (!val) {
      throw new Error("Field cannot be empty");
    }
    if (val.length < 8) {
      throw new Error("Password length must be at least 8 characters");
    }
  }
}

export class UIChangePasswordEditor extends WEntity {
  onChangePassword = () => {
    let { appContext, pageContext, observer } = this.props;
    let successCB = (response: server.rest.RestResponse) => {
      let result = response.data;
      if (result.status == 'Success') {
        pageContext.onBack();
      }
      widget.layout.showNotification('info', 'Change password', result.message);
    };
    let req = observer.commitAndGet();
    appContext.serverPUT(AccountRestURL.account.changePassword, req, successCB);
  }

  render() {
    let { appContext, pageContext, observer } = this.props;
    let changePasswordReq = observer.getMutableBean();
    let errorCollector = observer.getErrorCollector();
    let passwordValidator = new PasswordValidator();
    let html = (
      <div>
        <FormContainer fluid>
          <Row>
            <ColFormGroup span={12} label={T("Login ID")}>
              <BBStringField bean={changePasswordReq} field={'loginId'} disable={true} />
            </ColFormGroup>
            <ColFormGroup span={12} label={T("Old Password")}>
              <BBPasswordField bean={changePasswordReq} field={'oldPassword'} />
            </ColFormGroup>
            <ColFormGroup span={12} label={T("New Password")}>
              <BBPasswordField bean={changePasswordReq} field={'newPassword'} required
                validators={[passwordValidator]} errorCollector={errorCollector} />
            </ColFormGroup>
            <ColFormGroup span={12} label={T("Confirm Password")}>
              <BBPasswordField bean={changePasswordReq} field={'confirmPassword'}
                required errorCollector={errorCollector} />
            </ColFormGroup>
          </Row>
        </FormContainer>
        <WToolbar>
          <WButtonEntityWrite
            appContext={appContext} pageContext={pageContext}
            label={T('Reset Password')} onClick={this.onChangePassword} />
        </WToolbar>
      </div>
    );
    return html;
  }
}