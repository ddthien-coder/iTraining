import React from 'react';
import { app, server, util, widget } from 'components';

import { WButtonEntityCommit, WButtonEntityReset, WEntity, WEntityEditor } from 'core/widget/entity';
import { BeanObserver, UUIDTool, WComponent, WComponentProps, WToolbar } from 'core/widget';

import { T, CompanyRestURL, BBAccountAutoComplete } from "./Dependency";
import { BBCompanyAutoComplete } from './WCompany';
import { UILoadableCompanyConfig } from './UICompanyConfig';

const {
  FormContainer, Row, FormGroupCol,
  BBStringField, BBDateTimeField,
  BBTextField
} = widget.input;

const { session } = app.host;

export class UICompanyForm extends WEntity {

  onGenerateCode(label: any) {
    const { toFileName } = util.text;
    let { observer } = this.props;
    if (!observer.isNewBean()) return;
    let code = UUIDTool.generateWithAnyTokens(
      T("You need to enter the label"),
      [toFileName(label)],
      false
    );
    observer.getMutableBean().code = code;
    this.forceUpdate();
  }

  render() {
    let { appContext, pageContext, observer } = this.props;
    let bean = observer.getMutableBean();
    const adminCap = this.hasAdminCapability();
    let errorCollector = observer.getErrorCollector();
    return (
      <FormContainer fluid>
        <Row>
          <FormGroupCol span={6} label={T('Label')}>
            <BBStringField bean={bean} field={'label'} disable={!adminCap} required
              onInputChange={(_bean, _field, _oldVal, newVal) => this.onGenerateCode(newVal)}
              errorCollector={errorCollector} />
          </FormGroupCol>
          <FormGroupCol span={6} label={T('Code')}>
            <BBStringField bean={bean} field={'code'} disable={!adminCap || !observer.isNewBean()} required
              onRefresh={() => this.onGenerateCode(bean.label)} errorCollector={errorCollector} />
          </FormGroupCol>
        </Row>
        <Row>
          <FormGroupCol span={6} label={T('FullName')}>
            <BBStringField bean={bean} field={'fullName'} disable={!adminCap} />
          </FormGroupCol>
          <FormGroupCol span={6} label={T('Registration Code')}>
            <BBStringField bean={bean} field={'registrationCode'} disable={!adminCap} />
          </FormGroupCol>
        </Row>
        <Row>
          <FormGroupCol span={12} label={T('Parent Company')}>
            <BBCompanyAutoComplete
              appContext={appContext} pageContext={pageContext}
              bean={bean} field={'parentId'} labelField={'parentLabel'} useSelectBean={false}
              disable={!adminCap || !observer.isNewBean()} />
          </FormGroupCol>
        </Row>
        <Row>
          <FormGroupCol span={12} label={T('Admin Account Login Id')}>
            <BBAccountAutoComplete
              appContext={appContext} pageContext={pageContext}
              bean={bean} field={'adminAccountLoginId'} useSelectBean={false} disable={!adminCap} />
          </FormGroupCol>
        </Row>
        <Row>
          <FormGroupCol span={6} label={T('Founding Date')}>
            <BBDateTimeField bean={bean} field={"foundingDate"} dateFormat={"DD/MM/YYYY"} timeFormat={false} disable={!adminCap} />
          </FormGroupCol>
          <FormGroupCol span={6} label={T('Closing Date')}>
            <BBDateTimeField bean={bean} field={"closingDate"} dateFormat={"DD/MM/YYYY"} timeFormat={false} disable={!adminCap} />
          </FormGroupCol>
        </Row>
        <Row>
          <FormGroupCol span={12} label={T('Description')}>
            <BBTextField bean={bean} field={'description'} disable={!adminCap} style={{ height: '10em' }} />
          </FormGroupCol>
        </Row>
      </FormContainer>
    );
  }
}

export class UINewCompanyEditor extends WEntityEditor {
  render() {
    let { appContext, pageContext, observer, readOnly, onPostCommit } = this.props;
    let bean = observer.getMutableBean();
    return (
      <div className='flex-vbox'>
        <UICompanyForm observer={observer} appContext={appContext} pageContext={pageContext} />
        <WToolbar>
          <WButtonEntityCommit
            appContext={appContext} pageContext={pageContext} readOnly={readOnly} observer={observer}
            label={T(`Company {{label}}`, { label: bean.label })}
            createURL={CompanyRestURL.company.create}
            commitURL={CompanyRestURL.company.save}
            onPostCommit={onPostCommit} />
          <WButtonEntityReset
            appContext={appContext} pageContext={pageContext} readOnly={readOnly} observer={observer} />
        </WToolbar>
      </div>
    )
  }
}

export class UICompanyEditor extends WEntityEditor {
  render() {
    let { appContext, pageContext, observer, readOnly, onPostCommit } = this.props;
    let bean = observer.getMutableBean();
    return (
      <widget.component.VSplit >
        <widget.component.VSplitPane className='p-1' width={'45%'}>
          <widget.component.HSplit>
            <widget.component.HSplitPane className='pr-2' title={T('Company Info')} titleShow>
              <UICompanyForm observer={observer} appContext={appContext} pageContext={pageContext} />
            </widget.component.HSplitPane>
          </widget.component.HSplit>
          <WToolbar>
            <WButtonEntityCommit
              appContext={appContext} pageContext={pageContext} readOnly={readOnly} observer={observer}
              label={T(`Company {{label}}`, { label: bean.label })}
              createURL={CompanyRestURL.company.create}
              commitURL={CompanyRestURL.company.save}
              onPostCommit={onPostCommit} />
            <WButtonEntityReset
              appContext={appContext} pageContext={pageContext} readOnly={readOnly} observer={observer} />
          </WToolbar>
        </widget.component.VSplitPane>
        <widget.component.VSplitPane className='pr-2'>
          <widget.component.HSplit>
            <widget.component.HSplitPane className='pr-2' title={T('Company Config')} titleShow>
              <UILoadableCompanyConfig appContext={appContext} pageContext={pageContext} companyId={bean.id} onPostCommit={onPostCommit} />
            </widget.component.HSplitPane>
          </widget.component.HSplit>
        </widget.component.VSplitPane>
      </widget.component.VSplit >
    );
  }
}

export class UILoadableCompany extends WComponent {
  observer: BeanObserver = new BeanObserver({});

  constructor(props: WComponentProps) {
    super(props);
    this.markLoading(true);
    let companyACL = session.getCurrentCompanyContext();
    const companyId = companyACL.companyId;
    this.observer.replaceWith({ id: companyId });
    const { appContext } = this.props;
    let callBack = (response: server.rest.RestResponse) => {
      const company = response.data;
      this.observer.replaceWith(company);
      this.markLoading(false)
      this.forceUpdate();
    }
    appContext.serverGET(CompanyRestURL.company.load(companyId), {}, callBack);
  }

  render() {
    const { appContext, pageContext } = this.props;
    const writeCap = this.hasWriteCapability();
    const html = (
      <UICompanyEditor
        appContext={appContext} pageContext={pageContext} readOnly={!writeCap}
        observer={this.observer} />
    )
    return html;
  }
}
