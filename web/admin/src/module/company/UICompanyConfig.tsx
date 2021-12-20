import React, { Component } from 'react';
import { server, widget } from 'components';

import { WButtonEntityCommit, WComplexEntityEditor, WComponent, WComponentProps, WEntity, WToolbar } from 'core/widget';
import { VGridConfigTool, VGridEntityListEditor } from 'core/widget/vgrid';

import { CompanyRestURL, T } from './Dependency'
import { ComplexBeanObserver, } from 'core/entity';

import VGridConfig = widget.grid.VGridConfig;
const { Form, FormGroup, BBStringField, BBTextField } = widget.input;

interface BBWidgetInputSelectProps {
  bean: any, field: string, fieldCheck?: string, fieldLabel?: string, disable?: boolean,
  onInputChange?: (bean: any, field: string, oldVal: any, newVal: any) => void
}

class BBEntityAttributeType extends Component<BBWidgetInputSelectProps> {
  render() {
    let { bean, field, onInputChange, disable } = this.props;
    const types = ['String', 'StringArray', 'Integer', 'Long', 'Float', 'Double ', 'Boolean', 'Date '];
    return (
      <widget.input.BBSelectField
        bean={bean} field={field} options={types} disable={disable} onInputChange={onInputChange} />
    );
  }
}
class UICompanyConfigAttributeForm extends WEntity {
  render() {
    let { observer } = this.props;
    let attribute = observer.getMutableBean();
    let writeCap = this.hasWriteCapability();
    let errorCollector = observer.getErrorCollector();

    let html = (
      <Form>
        <FormGroup label={T('Name')}>
          <BBStringField bean={attribute} field={'name'} disable={!writeCap} required
            errorCollector={errorCollector} />
        </FormGroup>
        <FormGroup label={T('Group Name')}>
          <BBStringField bean={attribute} field={'groupName'} disable={!writeCap} required
            errorCollector={errorCollector} />
        </FormGroup>
        <FormGroup label={T('Type')}>
          <BBEntityAttributeType bean={attribute} field={'type'} disable={!writeCap} />
        </FormGroup>
        <FormGroup label={T('Value')}>
          <BBStringField bean={attribute} field={'value'} disable={!writeCap} />
        </FormGroup>
        <FormGroup label={T('Description')}>
          <BBTextField bean={attribute} field={'description'} disable={!writeCap} />
        </FormGroup>
      </Form>
    );
    return html;
  }
}

class UICompanyConfigAttributeListEditor extends VGridEntityListEditor {
  renderBeanEditor() {
    let { appContext, pageContext } = this.props;
    let readOnly = !this.isEditable();
    let observer = this.createBeanObserver();
    return (
      <UICompanyConfigAttributeForm appContext={appContext} pageContext={pageContext} observer={observer} readOnly={readOnly} />
    );
  }

  createVGridConfig() {
    let writeCap = this.hasWriteCapability();
    let config: VGridConfig = {
      record: {
        fields: [
          ...VGridConfigTool.FIELD_SELECTOR(this.needSelector()),
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('name', T('Name'), 150, 'fixed-left'),
          { name: 'groupName', label: T('Group') },
          { name: 'type', label: T('Type'), width: 120 },
          { name: 'value', label: T('Value'), width: 200 },
          { name: 'description', label: T('Description') },
          ...VGridConfigTool.FIELD_ENTITY
        ]
      },
      toolbar: {
        actions: [
          ...VGridConfigTool.TOOLBAR_ON_ADD(!writeCap, T("Add")),
          ...VGridConfigTool.TOOLBAR_ON_DELETE(!writeCap, T("Del"))
        ],
      },
      view: {
        currentViewName: 'table',
        availables: {
          table: {
            viewMode: 'table'
          },
        }
      }
    }
    return config;
  }
}

class UICompanyConfigEditer extends WComplexEntityEditor {

  render() {
    let { appContext, pageContext, observer, readOnly, onPostCommit } = this.props;
    let bean = observer.getMutableBean();
    let writeCap = this.hasWriteCapability();
    return (
      <div className="flex-vbox">
        <FormGroup label={T('Label')}>
          <BBStringField bean={bean} field={'label'} disable={!writeCap || !observer.isNewBean()} />
        </FormGroup>
        <UICompanyConfigAttributeListEditor appContext={appContext} pageContext={pageContext}
          plugin={observer.createVGridEntityListEditorPlugin('listAttributes')}
          editorTitle={T("Attributes")} dialogEditor={true} />
        <WToolbar>
          <WButtonEntityCommit
            appContext={appContext} pageContext={pageContext} readOnly={readOnly} observer={observer}
            label={T("Add")}
            hide={!writeCap}
            commitURL={CompanyRestURL.config.save}
            onPostCommit={onPostCommit} />
        </WToolbar>
      </div>
    )
  }

}

interface UILoadableCompanyConfigProps extends WComponentProps {
  companyId: number;
  onPostCommit: any;
}
export class UILoadableCompanyConfig extends WComponent<UILoadableCompanyConfigProps> {
  observer: ComplexBeanObserver = new ComplexBeanObserver({});

  constructor(props: UILoadableCompanyConfigProps) {
    super(props);
    this.markLoading(true);
    this.loadData();
  }

  loadData() {
    let { appContext, companyId } = this.props;
    let callback = (response: server.rest.RestResponse) => {
      this.observer.replaceWith(response.data);
      this.markLoading(false);
      this.forceUpdate();
    }
    appContext.serverGET(CompanyRestURL.config.load(companyId), null, callback)
  }

  render() {
    let { appContext, pageContext, onPostCommit } = this.props;
    if (this.isLoading()) return this.renderLoading();
    let html = (
      <UICompanyConfigEditer appContext={appContext} pageContext={pageContext}
        observer={this.observer} onPostCommit={onPostCommit} />
    )
    return html;
  }
}
