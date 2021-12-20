import React from 'react'
import {  server, widget } from 'components';

import { WComponent, WComponentProps, ComplexBeanObserver } from 'core/widget';
import { VGridConfigTool, VGridEntityList, VGridEntityListPlugin } from 'core/widget/vgrid';

import { SystemRestURL, T } from '../Dependency';
import { UIEntity } from './UIEntity';

import DisplayRecord = widget.grid.model.DisplayRecord;
import VGridConfig = widget.grid.VGridConfig;
import VGridContext = widget.grid.VGridContext;

export class UIEntityListPlugin extends VGridEntityListPlugin {
  loadData(uiList: VGridEntityList<any>): void {
    let callback = (response: server.rest.RestResponse) => {
      let entities = response.data;
      console.log(entities);

      this.update(entities);
      uiList.markLoading(false);
      uiList.forceUpdate();
    }
    this.serverGet(uiList, SystemRestURL.db.getEntityInfos, callback);
  }
}

export class UIEntityList extends VGridEntityList {

  createVGridConfig(): VGridConfig {
    let config: VGridConfig = {
      record: {
        fields: [
          ...VGridConfigTool.FIELD_SELECTOR(this.needSelector()),
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('name', T('Name'), 300),

          { name: 'category', label: T('Category') },
          { name: 'tableName', label: T('Table Name'), width: 400, sortable: true },
          { name: 'checks', label: T('Checks'), width: 300 },
          { name: 'className', label: T('Class Name'), width: 500 }
        ]
      },

      toolbar: {
        actions: [

        ],
        filters: VGridConfigTool.TOOLBAR_FILTERS(false),
      },

      view: {
        currentViewName: 'aggregation',
        availables: {
          table: {
            viewMode: 'table'
          },
          aggregation: {
            viewMode: 'aggregation',
            createAggregationModel(_ctx: VGridContext) {
              let model = new widget.grid.model.AggregationDisplayModel('All', false);
              model.addAggregation(new widget.grid.model.ValueAggregation(T("Category"), "category", true))
              return model;
            }
          }
        }
      },
    };
    return config;
  }

  onDefaultSelect(dRecord: DisplayRecord) {
    let entity = dRecord.record;
    let { appContext, pageContext } = this.props;
    let pageCtx = pageContext.createPopupPageContext();
    let html = (
      <UIEntity appContext={appContext} pageContext={pageCtx} observer={new ComplexBeanObserver(entity)} />
    );
    widget.layout.showDialog(T('Entity'), 'lg', html, pageCtx.getDialogContext());
  }
}

export class UIEntityListPage extends WComponent<WComponentProps> {
  render() {
    let { appContext, pageContext } = this.props;

    return (
      <div className='flex-vbox'>
        <UIEntityList plugin={new UIEntityListPlugin()} appContext={appContext} pageContext={pageContext} />
      </div >
    )
  }
}