import React, { Component, ReactFragment } from 'react';
import { app, server, widget } from 'components';

import { BeanObserver } from 'core/entity'
import {
  WEntityEditor, WButtonEntityCommit, WButtonEntityReset, WButtonEntityRead,
} from 'core/widget/entity'
import { WToolbar, WComponent, WComponentProps } from 'core/widget';

import { IUIAccountInfoPlugin, UILoadableAccountInfo, UILoadableAccountInfoProps } from "module/account/UIAccountInfo";
import {  T, HRRestURL } from './Dependency';

const { BBStringField, BBDateTimeField, BBNumberField, Form, FormGroup } = widget.input;
const { Container, Row, Col } = widget.layout;

export class UIEmployeeEditor extends WEntityEditor {

  render() {
    let { appContext, pageContext, observer } = this.props;
    let writeCap = this.hasWriteCapability();
    let employee = observer.getMutableBean();
    return (
      <div className='flex-vbox'>
        <Form>
          <FormGroup label={T("Login Id")}>
            <BBStringField bean={employee} field={'loginId'} disable={true} />
          </FormGroup>
          <FormGroup label={T("Label")}>
            <BBStringField bean={employee} field={'label'} disable={!writeCap} />
          </FormGroup>
          <FormGroup label={T("Code")}>
            <BBStringField bean={employee} field={'code'} disable={!writeCap} />
          </FormGroup>
          <FormGroup label={T("Employee Tax Code")}>
            <BBStringField bean={employee} field={'employeeTaxCode'} disable={!writeCap} />
          </FormGroup>
          <FormGroup label={T("Priority")}>
            <BBNumberField bean={employee} field={'priority'} disable={!writeCap} />
          </FormGroup>
          <FormGroup label={T("Description")}>
            <BBStringField bean={employee} field={'description'} disable={!writeCap} />
          </FormGroup>
          <FormGroup label={T("Start Date")}>
            <BBDateTimeField bean={employee} field={'startDate'} dateFormat={"DD/MM/YYYY"} timeFormat={false} disable={!writeCap} />
          </FormGroup>
          <FormGroup label={T("End Date")}>
            <BBDateTimeField bean={employee} field={'endDate'} dateFormat={"DD/MM/YYYY"} timeFormat={false} disable={!writeCap} />
          </FormGroup>
        </Form>
        <WToolbar>
          <WButtonEntityCommit
            appContext={appContext} pageContext={pageContext} hide={!writeCap} observer={observer}
            label={`Employee ${employee.loginId}`}
            commitURL={HRRestURL.employee.save}
            onPostCommit={(entity) => this.onPostCommit(entity)} />
          <WButtonEntityReset
            appContext={appContext} pageContext={pageContext} hide={!writeCap} observer={observer}
            onPostRollback={(entity) => this.onPostRollback(entity)} />
        </WToolbar>
      </div>
    );
  }
}

interface UILoadableEmployeeInfoProps extends WComponentProps {
  loginId: string;
}
export class UILoadableEmployeeInfo extends WComponent<UILoadableEmployeeInfoProps> {
  employee: any = null;

  constructor(props: UILoadableAccountInfoProps) {
    super(props);

    let { appContext, loginId } = this.props;
    let successCB = (response: server.rest.RestResponse) => {
      this.employee = response.data;
      this.markLoading(false)
      this.forceUpdate();
    }
    appContext.serverGET(HRRestURL.employee.load(loginId), {}, successCB);
    this.markLoading(true);
  }

  render() {
    if (this.isLoading()) return this.renderLoading();
    let { appContext, pageContext } = this.props;
    let employee = this.employee;
    const hasWriteCap = this.hasWriteCapability();

    let html = (
      <div className='flex-vbox mt-1'>
        <Container fluid className='border mb-1'>
          <Row>
            <Col className='col-1'>LoginId:</Col>
            <Col className='col-2'>{employee.loginId}</Col>
            <Col className='col-1'>Employee:</Col>
            <Col className='col-2 flex-hbox'>
              {employee.label}
              {hasWriteCap && (
                <WButtonEntityRead
                  appContext={appContext} pageContext={pageContext} color='link' label={T('Edit')}
                  onClick={() => UIEmployeeUtil.showEmployeeEditor(this, this.employee, true)} />
              )}
            </Col>
          </Row>
          <Row>
            <Col className='col-1'>Start Date:</Col>
            <Col className='col-2'>{employee.startDate}</Col>
            <Col className='col-1'>End Date:</Col>
            <Col className='col-2'>{employee.endDate}</Col>
          </Row>
        </Container>
        <div className='flex-vbox'>
                Comming soon...
        </div>
      </div>
    );
    return html;
  }
}

export class UIEmployeeAccountInfoPlugin implements IUIAccountInfoPlugin {
  createAdditionalTabs(appContext: app.AppContext, pageContext: app.PageContext, loginId: string) {
    let additionalTabs: Array<ReactFragment> = [];
    additionalTabs.push(
      <widget.layout.Tab key='employee' name="employee-info" label={T('Employee Info')}>
        <UILoadableEmployeeInfo appContext={appContext} pageContext={pageContext} loginId={loginId} />
      </widget.layout.Tab>
    );
    return additionalTabs;
  }
}

export class UILoadableEmployeeAccountInfo extends Component<UILoadableAccountInfoProps> {
  render() {
    return <UILoadableAccountInfo {...this.props} plugin={new UIEmployeeAccountInfoPlugin()} />;
  }
}

export class UIEmployeeUtil {
  static showEmployeeEditor(uiSource: WComponent, employee: any, popup: boolean = false) {
    let { appContext, pageContext } = uiSource.props;
    const writeCap = uiSource.hasWriteCapability();
    if (popup) {
      let popupPageContext = pageContext.createPopupPageContext();
      let onPostCommit = (_entity: any, _uiEditor?: WComponent) => {
        popupPageContext.onBack();
        uiSource.forceUpdate();
      }
      let html = (
        <UIEmployeeEditor appContext={appContext} pageContext={popupPageContext} observer={new BeanObserver(employee)}
          onPostCommit={(entity) => onPostCommit(entity)} readOnly={!writeCap} />);
      widget.layout.showDialog("Employee", 'md', html, popupPageContext.getDialogContext());
    } else {
      let html = (
        <UIEmployeeEditor appContext={appContext} pageContext={pageContext} observer={new BeanObserver(employee)} readOnly={!writeCap} />);
      pageContext.onAdd('employee-info', T(`Employee {{loginId}}`, { loginId: employee.loginId }), html);
    }
  }

  static showEmployeeInfo(uiSource: WComponent, loginId: string, popup: boolean = false) {
    let { appContext, pageContext } = uiSource.props;
    if (popup) {
      let popupPageCtx = pageContext.createPopupPageContext();
      let html = (
        <UILoadableEmployeeAccountInfo appContext={appContext} pageContext={popupPageCtx} loginId={loginId} />);
      widget.layout.showDialog("Employee", 'lg', html, popupPageCtx.getDialogContext());
    } else {
      let html = (
        <UILoadableEmployeeAccountInfo appContext={appContext} pageContext={pageContext} loginId={loginId} />);
      pageContext.onAdd('employee-info', T(`Employee {{loginId}}`, { loginId: loginId }), html);
    }
  }
}