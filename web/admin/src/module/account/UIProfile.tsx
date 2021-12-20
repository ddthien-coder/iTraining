import React from 'react';
import { widget, util, app, server } from 'components';

import { BeanObserver, ComplexBeanObserver } from 'core/entity'
import { WEntityEditor, WButtonEntityCommit, WButtonEntityReset } from 'core/widget/entity'
import { WComponentProps, WToolbar, WComponent } from 'core/widget';

import { AccountRestURL, T } from './Dependency';
import { BBAccountAutoComplete } from './WAccount';
import { WAvatarEditor } from './WAvatar';
import { UIChangePasswordEditor } from './UIPassword';

const { session } = app.host;
const {
  BBStringField, BBDateTimeField, BBTextField, Form, FormGroup, BBSelectField, BBNumberField,
} = widget.input;
const { TabPane, Tab } = widget.layout;
const { FAButton, fas } = widget.fa;

function CommonProfileForm(editor: UIProfileEditor) {
  const { appContext, pageContext, observer } = editor.props;
  let errorCollector = observer.getErrorCollector();
  let profile = observer.getMutableBean();
  const hasWriteCap = editor.hasWriteCapability();

  const modCap = editor.hasModeratorCapability();
  let changePasswordCap = false;
  if (modCap || session.getLoginId() == profile.loginId) {
    changePasswordCap = true;
  }

  let html = (
    <div className='d-flex'>
      <div className='flex-grow-1 mr-1'>
        <FormGroup label='Full Name'>
          <BBStringField bean={profile} field={'fullName'} errorCollector={errorCollector} disable={!hasWriteCap} />
        </FormGroup>
        <FormGroup label='Email'>
          <BBStringField
            bean={profile} field={'email'} disable={!hasWriteCap}
            errorCollector={errorCollector} required />
        </FormGroup>
        <FormGroup label='Mobile'>
          <BBStringField bean={profile} field={'mobile'} disable={!hasWriteCap} errorCollector={errorCollector} />
        </FormGroup>
        <div className='p-2'>
          <FAButton color='link' className='px-1' hidden={!changePasswordCap} icon={fas.faEdit}
            onClick={editor.onChangePassword}>
            {T('Change Password')}
          </FAButton>
          <FAButton color='link' className='px-1' hidden={!changePasswordCap} icon={fas.faEdit}
            onClick={editor.onResetPassword}>
            {T('Reset Password')}
          </FAButton>
        </div>
      </div>
      <WAvatarEditor appContext={appContext} pageContext={pageContext} observer={observer} />
    </div>
  );
  return html;
}

export class UIProfileEditor extends WEntityEditor {
  onChangePassword = () => {
    let { appContext, pageContext, observer } = this.props;
    let profile = observer.getMutableBean();
    let popupPageCtx = pageContext.createPopupPageContext();
    let writeCap = this.hasWriteCapability();
    let reqObserver = new BeanObserver({ loginId: profile.loginId });
    let html = (
      <UIChangePasswordEditor appContext={appContext} pageContext={popupPageCtx} observer={reqObserver} readOnly={!writeCap} />
    );
    widget.layout.showDialog("Change Password", 'sm', html, popupPageCtx.getDialogContext());
  }

  onResetPassword = () => {
    let { appContext, pageContext, observer } = this.props;
    let successCB = (response: server.rest.RestResponse) => {
      let result = response.data;
      if (result.status == 'Success') {
        pageContext.onBack();
      }
      widget.layout.showNotification('info', 'Success!', result.message);
    };
    let req = observer.commitAndGet();
    appContext.serverPUT(AccountRestURL.account.resetPassword, req, successCB);
  }
}

export class UIUserProfileEditor extends UIProfileEditor {
  render() {
    let { appContext, pageContext, observer } = this.props;
    let profile = observer.getMutableBean();
    let genderOpts = ['male', 'female', 'other'];
    let genderLabelOpts = ['Male', 'Female', 'Other'];
    let marriedOpts = ['Single', 'Married', 'Other'];
    let marriedLabelOpts = ['Single', 'Married', 'Other'];

    const hasWriteCap = this.hasWriteCapability();

    let html = (
      <Form className='flex-vbox'>
        <TabPane laf='outline'>
          <Tab name='info' label='Profile Info' active={true}>
            {CommonProfileForm(this)}
            <FormGroup label='Login ID'>
              <BBStringField bean={profile} field={'loginId'} disable={true} />
            </FormGroup>
            <FormGroup label='Account Type'>
              <BBStringField bean={profile} field={'accountType'} disable={true} />
            </FormGroup>
            <FormGroup label='Personal ID'>
              <BBStringField bean={profile} field={'personalId'} disable={!hasWriteCap} />
            </FormGroup>
            <FormGroup label='Nickname'>
              <BBStringField bean={profile} field={'nickname'} disable={!hasWriteCap} />
            </FormGroup>
            <FormGroup label='First Name'>
              <BBStringField bean={profile} field={'firstName'} disable={!hasWriteCap} />
            </FormGroup>
            <FormGroup label='Last Name'>
              <BBStringField bean={profile} field={'lastName'} disable={!hasWriteCap} />
            </FormGroup>
            <FormGroup label='Birthday'>
              <BBDateTimeField bean={profile} field={'birthday'} timeFormat={false} disable={!hasWriteCap} />
            </FormGroup>
            <FormGroup label='Hobby'>
              <BBTextField bean={profile} field={'hobby'} disable={!hasWriteCap} />
            </FormGroup>
          </Tab>

          <Tab name='others' label='Others'>
            <FormGroup label='Gender'>
              <BBSelectField disable={!hasWriteCap}
                bean={profile} field={'gender'} options={genderOpts} optionLabels={genderLabelOpts} />
            </FormGroup>
            <FormGroup label='Marital Status'>
              <BBSelectField disable={!hasWriteCap}
                bean={profile} field={'maritalStatus'} options={marriedOpts} optionLabels={marriedLabelOpts} />
            </FormGroup>
            <FormGroup label='Height'>
              <BBNumberField
                bean={profile} field={'height'} disable={!hasWriteCap}
                validators={[new util.validator.NumberRangeValidator(0, 300)]} />
            </FormGroup>
            <FormGroup label='Weight'>
              <BBNumberField bean={profile} field={'weight'} disable={!hasWriteCap}
                validators={[new util.validator.NumberRangeValidator(0, 500)]} />
            </FormGroup>
            <FormGroup label='Avatar Url'>
              <BBStringField bean={profile} field={'avatarUrl'} disable={true} />
            </FormGroup>
          </Tab>
        </TabPane>
        <WToolbar readOnly={!hasWriteCap}>
          <WButtonEntityCommit
            appContext={appContext} pageContext={pageContext}
            observer={observer} label={`User Profile ${profile.loginId}`}
            commitURL={AccountRestURL.profile.saveUser} onPostCommit={this.onPostCommit} />
          <WButtonEntityReset
            appContext={appContext} pageContext={pageContext} observer={observer}
            onPostRollback={this.onPostRollback} />
        </WToolbar>
      </Form>
    );

    return html;
  }
}

export class UIOrgProfileEditor extends UIProfileEditor {

  render() {
    const { appContext, pageContext, observer } = this.props;
    let profile = observer.getMutableBean();
    const writeCap = this.hasWriteCapability();
    let html = (
      <Form>
        {CommonProfileForm(this)}
        <FormGroup label={T('Login Id')}>
          <BBStringField bean={profile} field={'loginId'} disable={true} />
        </FormGroup>
        <FormGroup label='Account Type'>
          <BBStringField bean={profile} field={'accountType'} disable={true} />
        </FormGroup>
        <FormGroup label={T('Name (local language)')}>
          <BBStringField bean={profile} field={'name'} disable={!writeCap} />
        </FormGroup>
        <FormGroup label={T('Organization Type')}>
          <BBStringField bean={profile} field={'organizationType'} disable={!writeCap} />
        </FormGroup>
        <FormGroup label={T('Slogan')}>
          <BBStringField bean={profile} field={'slogan'} disable={!writeCap} />
        </FormGroup>
        <FormGroup label={T('Representative')}>
          <BBAccountAutoComplete
            appContext={appContext} pageContext={pageContext} disable={!writeCap}
            bean={profile} field={'representativeLoginId'}
            useSelectBean={false} labelField={'representative'} />
        </FormGroup>
        <FormGroup label={T('Founding Date')}>
          <BBDateTimeField bean={profile} field={'foundingDate'} timeFormat={false} disable={!writeCap} />
        </FormGroup>
        <FormGroup label={T('Closing Date')}>
          <BBDateTimeField bean={profile} field={'closingDate'} timeFormat={false} disable={!writeCap} />
        </FormGroup>
        <FormGroup label={T('Description')}>
          <BBTextField bean={profile} field={'description'} disable={!writeCap} />
        </FormGroup>
        <WToolbar readOnly={!writeCap}>
          <WButtonEntityCommit
            appContext={appContext} pageContext={pageContext}
            observer={observer} label={`Org Profile ${profile.loginId}`}
            commitURL={AccountRestURL.profile.saveOrg}
            onPostCommit={this.onPostCommit} />
          <WButtonEntityReset
            appContext={appContext} pageContext={pageContext} observer={observer}
            onPostRollback={this.onPostRollback} />
        </WToolbar>
      </Form>
    );
    return html;
  }
}

interface UIProfileProps extends WComponentProps {
  profile: any;
}
export class UIProfile extends WComponent<UIProfileProps> {
  render() {
    let { appContext, pageContext, profile, readOnly } = this.props;
    if (profile.accountType == "USER") {
      return (
        <UIUserProfileEditor
          appContext={appContext} pageContext={pageContext} readOnly={readOnly}
          observer={new ComplexBeanObserver(profile)} />
      );
    } else {
      return (
        <UIOrgProfileEditor
          appContext={appContext} pageContext={pageContext} readOnly={readOnly}
          observer={new ComplexBeanObserver(profile)} />
      );
    }
  }
}