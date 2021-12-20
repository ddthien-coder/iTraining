import React from "react";
import { util, widget } from "components";

import {
  WEntityEditor, WToolbar, WButtonEntityCommit, WButtonEntityReset
} from "core/widget";

import { T, HRRestURL } from "module/company/hr/Dependency";

const { toFileName } = util.text;
const {
  FormContainer, ColFormGroup, Row, BBStringField, BBTextField
} = widget.input;

export class UIHRDepartmentEditor extends WEntityEditor {

  onGenerateName(label: string) {
    const { observer } = this.props;
    if (!observer.isNewBean()) return;
    observer.getMutableBean().name = toFileName(label);
    this.forceUpdate();
  }

  render() {
    let { appContext, pageContext, observer, onPostCommit } = this.props;
    let bean = observer.getMutableBean();
    let writeCap = this.hasWriteCapability();
    let errorCollector = observer.getErrorCollector();

    return (
      <div className='flex-vbox'>
        <FormContainer fluid>
          <Row>
            <ColFormGroup span={12} label={T('Label')}>
              <BBStringField bean={bean} field={'label'} disable={!writeCap} required errorCollector={errorCollector}
                onInputChange={(_bean, _field, _oldVal, newVal) => this.onGenerateName(newVal)} />
            </ColFormGroup>
          </Row>
          <Row>
            <ColFormGroup span={12} label={T('Name')}>
              <BBStringField bean={bean} field={'name'} disable={!writeCap || !observer.isNewBean()}
                onRefresh={() => this.onGenerateName(bean.label)} required errorCollector={errorCollector} />
            </ColFormGroup>
          </Row>
          <Row>
            <ColFormGroup span={12} label={T('Description')}>
              <BBTextField bean={bean} disable={!writeCap} field={"description"} />
            </ColFormGroup>
          </Row>
        </FormContainer>
        <WToolbar>
          <WButtonEntityCommit
            appContext={appContext} pageContext={pageContext} readOnly={!writeCap} observer={observer}
            label={T(`HR Department {{label}}`, { label: bean.label })} hide={!writeCap}
            commitURL={HRRestURL.department.save}
            onPostCommit={onPostCommit} />
          <WButtonEntityReset
            appContext={appContext} pageContext={pageContext} readOnly={!writeCap} observer={observer}
            onPostRollback={this.onPostRollback} hide={!writeCap} />
        </WToolbar>
      </div>
    );
  }
}
