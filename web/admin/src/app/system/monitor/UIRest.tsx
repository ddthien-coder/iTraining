import React from 'react';
import { server, widget } from 'components';

import { WComponent } from 'core/widget';
import { VGridConfigTool, VGridEntityList, VGridEntityListPlugin } from 'core/widget/vgrid';

import { SystemRestURL, T } from '../Dependency';
import { UIMonitorSummaryList, UIMonitorSummaryPlugin } from './UIMonitorSummary';

import DisplayRecord = widget.grid.model.DisplayRecord;
import VGridConfig = widget.grid.VGridConfig;
import VGridContext = widget.grid.VGridContext;

const { TabPane, Tab } = widget.layout;

export class UIMethodListPlugin extends VGridEntityListPlugin {
  loadData(uiList: VGridEntityList<any>): void {
    let callback = (response: server.rest.RestResponse) => {
      let records: any[] = [];
      for (var i in response.data.modules) {
        for (var j in response.data.modules[i].services)
          for (var k in response.data.modules[i].services[j].calls) {
            response.data.modules[i].services[j].calls[k].module = i
            response.data.modules[i].services[j].calls[k].service = j
            records.push(response.data.modules[i].services[j].calls[k])
          }
      }
      this.update(records);
      uiList.markLoading(false);
      uiList.forceUpdate();
    }
    this.serverGet(uiList, SystemRestURL.rest.getRestMonitor, callback);
  }
}

class UIMethodList extends VGridEntityList {

  createVGridConfig(): VGridConfig {
    let config: VGridConfig = {
      record: {
        fields: [
          ...VGridConfigTool.FIELD_SELECTOR(this.needSelector()),
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('method', T('Method'), 200, 'fixed-left'),

          { name: 'module', label: T('Module') },
          { name: 'service', label: T('Service Name') },
          { name: 'requestCount', label: T('Count') },
          { name: 'errorCount', label: T('Error Count') },
          { name: 'maxExecTime', label: T('Max Exec Time') },
          { name: 'sumExecTime', label: T('Sum Exec Time') }
        ]
      },

      toolbar: {
        actions: [
        ],
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
              model.addAggregation(new widget.grid.model.ValueAggregation(T("Module"), "module", true))
              model.addAggregation(new widget.grid.model.ValueAggregation(T("Service"), "service", false));
              return model;
            }
          }
        }
      },
    };
    return config;
  }

  onDefaultSelect(dRecord: DisplayRecord) {
    let type = dRecord.record;
    let { appContext, pageContext, } = this.props;
    let pageCtx = pageContext.createPopupPageContext();
    let errors = []
    for (var e in type.errors) {
      errors.push(type.errors[e])
    }
    let html = (
      < UIErrorsList plugin={new VGridEntityListPlugin(errors)} pageContext={pageContext} appContext={appContext} />
    );
    widget.layout.showDialog("Method", 'lg', html, pageCtx.getDialogContext());
  }
}

class UIErrorsList extends VGridEntityList {
  createVGridConfig(): VGridConfig {
    let config: VGridConfig = {
      record: {
        fields: [
          VGridConfigTool.FIELD_INDEX(),
          { name: 'message', label: T('Message'), width: 350 },
          { name: 'count', label: T('Count') },
          { name: 'stacktrace', label: T('Stack Trace') },
        ]
      },

      toolbar: {
        actions: [
        ],
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

export class UIRestPage extends WComponent {

  render() {
    let { appContext, pageContext } = this.props;
    return (
      <TabPane style={{ height: '100%' }}>
        <Tab name={'restsummary'} label={T('REST Summary')} active={true}>
          <UIMonitorSummaryList plugin={new UIMonitorSummaryPlugin(SystemRestURL.rest.getRestSummary)} appContext={appContext} pageContext={pageContext} />
        </Tab>
        <Tab name={'restdetail'} label={T('REST Details')} active={false}>
          <UIMethodList plugin={new UIMethodListPlugin()} pageContext={pageContext} appContext={appContext} />
        </Tab>
      </TabPane>)
  }
}