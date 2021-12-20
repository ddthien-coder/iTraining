import React from 'react';
import { util, widget } from 'components';

import {
  WEntityEditor, WToolbar, WButtonEntityCommit, WButtonEntityReset
} from 'core/widget';

import { AccountRestURL, T } from './Dependency';
const {
  FormContainer, ColFormGroup, Row, BBStringField, BBTextField
} = widget.input;
const { toFileName } = util.text;

export class UIAccountGroupEditor extends WEntityEditor {

  onGenerateName(label: string) {
    const { observer } = this.props;
    if (!observer.isNewBean()) return;
    observer.getMutableBean().name = toFileName(label);
    this.forceUpdate();
  }
  render() {
    let { appContext, pageContext, observer } = this.props;
    let writeCap = this.hasWriteCapability();
    let accountGroup = observer.getMutableBean();
    let errorCollector = observer.getErrorCollector();
    return (
      <div className='flex-vbox'>
        <FormContainer fluid>
          <Row>
            <ColFormGroup span={12} label={T('Label')}>
              <BBStringField bean={accountGroup} field={'label'} disable={!writeCap} required
                onInputChange={(_bean, _field, _oldVal, newVal) => this.onGenerateName(newVal)}
                errorCollector={errorCollector} />
            </ColFormGroup>
          </Row>
          <Row>
            <ColFormGroup span={12} label={T('Name')}>
              <BBStringField bean={accountGroup} field={'name'} disable={!writeCap || !observer.isNewBean()}
                onRefresh={() => this.onGenerateName(accountGroup.label)} required errorCollector={errorCollector} />
            </ColFormGroup>
          </Row>
          <Row>
            <ColFormGroup span={12} label={T('Description')}>
              <BBTextField bean={accountGroup} disable={!writeCap} field={"description"} />
            </ColFormGroup>
          </Row>
        </FormContainer>
        <WToolbar>
          <WButtonEntityCommit
            appContext={appContext} pageContext={pageContext} readOnly={!writeCap} observer={observer}
            label={T(`Account Group {{label}}`, { label: accountGroup.label })}
            commitURL={AccountRestURL.group.save}
            onPostCommit={(entity) => this.onPostCommit(entity)} />
          <WButtonEntityReset
            appContext={appContext} pageContext={pageContext} readOnly={!writeCap} observer={observer}
            onPostRollback={(entity) => this.onPostRollback(entity)} />
        </WToolbar>
      </div >
    )
  }
}