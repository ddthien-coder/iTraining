import React from 'react'
import { widget } from 'components';

import { WComplexEntity } from 'core/widget/entity';

import { T } from '../Dependency';

import { VGridConfigTool, VGridEntityList, VGridEntityListPlugin } from 'core/widget/vgrid';

const { FormContainer, Row, ColFormGroup, BBStringField } = widget.input;
import VGridConfig = widget.grid.VGridConfig;

export class UIEntityFieldList extends VGridEntityList {

  createVGridConfig(): VGridConfig {
    let config: VGridConfig = {
      record: {
        fields: [
          ...VGridConfigTool.FIELD_SELECTOR(this.needSelector()),
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('name', T('Name'), 200, 'fixed-left'),

          { name: 'tableFieldName', label: T('Table Field Name'), width: 300 },
          { name: 'dataType', label: T('Data Type') },
          { name: 'persistentType', label: T('Persistent Type') },
          { name: 'checks', label: T('Checks'), width: 300 },
          ...VGridConfigTool.FIELD_ENTITY
        ]
      },

      toolbar: {
        actions: [
        ],
        filters: VGridConfigTool.TOOLBAR_FILTERS(false)
      },

      view: {
        currentViewName: 'table',
        availables: {
          table: {
            viewMode: 'table'
          },
        }
      },
    };
    return config;
  }
}

export class UIEntity extends WComplexEntity {
  render() {
    let { appContext, pageContext, observer } = this.props;
    let entity = observer.getMutableBean();
    return (
      <div className='flex-vbox'>
        <FormContainer fluid>
          <Row>
            <ColFormGroup span={6} label={T('Entity')}>
              <BBStringField bean={entity} field='name' disable />
            </ColFormGroup>
            <ColFormGroup span={6} label={T('Table')}>
              <BBStringField bean={entity} field='tableName' disable />
            </ColFormGroup>
          </Row>
          <Row>
            <ColFormGroup span={6} label={T('Class Name')}>
              <BBStringField bean={entity} field='className' disable />
            </ColFormGroup>
            <ColFormGroup span={6} label={T('Checks')}>
              <div> {entity.checks} </div>
            </ColFormGroup>
          </Row>
        </FormContainer>
        <UIEntityFieldList
          plugin={new VGridEntityListPlugin(observer.getComplexArrayProperty("fields", []))}
          appContext={appContext} pageContext={pageContext} />
      </div>
    );
  }
}