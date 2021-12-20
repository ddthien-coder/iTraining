import React from 'react';
import { widget, util } from 'components';

import {
  WComplexEntity, WComplexEntityProps
} from 'core/widget';

import { T } from './Dependency'

const { FormContainer, Row, FormGroupCol, BBStringField, BBTextField } = widget.input;
const { EMPTY_VALIDATOR } = util.validator;

export class AttachmentPlugin {
  renderCustomFields(_attachment: any): any { return null; }
}

interface UIAttachmentFormProps extends WComplexEntityProps {
  plugin: AttachmentPlugin;
}
export class UIAttachmentForm extends WComplexEntity<UIAttachmentFormProps> {
  render() {
    let { observer, plugin, readOnly } = this.props;

    let attachment = observer.getMutableBean();
    let html = (
      <FormContainer fluid >
        <Row>
          <FormGroupCol span={12} label={T('Name')}>
            <BBStringField bean={attachment} field={'name'} disable />
          </FormGroupCol>
        </Row>
        <Row>
          <FormGroupCol span={12} label={T('Label')}>
            <BBStringField bean={attachment} field={'label'} validators={[EMPTY_VALIDATOR]} />
          </FormGroupCol>
        </Row>
        {plugin.renderCustomFields(attachment)}
        <Row>
          <FormGroupCol span={12} label={T('Resource Uri')}>
            <BBStringField bean={attachment} field={'resourceUri'} disable />
          </FormGroupCol>
        </Row>
        <Row>
          <FormGroupCol span={12} label={T('Download Uri')}>
            <BBStringField bean={attachment} field={'downloadUri'} disable />
          </FormGroupCol>
        </Row>
        <Row>
          <FormGroupCol span={12} label={T('Public Download Uri')}>
            <BBStringField bean={attachment} field={'publicDownloadUri'} disable />
          </FormGroupCol>
        </Row>
        <Row>
          <FormGroupCol span={12} label={T('Size')}>
            <BBStringField bean={attachment} field={'size'} disable />
          </FormGroupCol>
        </Row>
        <Row>
          <FormGroupCol span={12} label={T('Description')}>
            <BBTextField bean={attachment} field={'description'} disable={readOnly} />
          </FormGroupCol>
        </Row>
      </FormContainer>
    )
    return html;
  }
}