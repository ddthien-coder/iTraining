import React from 'react';
import { server, widget } from 'components';

import { ComplexBeanObserver, WEntity } from 'core/widget';
import { VGridConfigTool, VGridEntityList, VGridEntityListPlugin } from 'core/widget/vgrid';

import { SystemRestURL, T } from '../Dependency';

import DisplayRecord = widget.grid.model.DisplayRecord;
import VGridConfig = widget.grid.VGridConfig;

const { FormContainer, FormGroupCol, Row } = widget.input;

class GCInfoForm extends WEntity {
  render() {
    const { observer } = this.props;
    let info = observer.getMutableBean();

    if (info.path === 'gcInfo') return null;
    let renderInfo = [];
    for (let key in info) {
      if (key == "_state") continue;
      renderInfo.push(
        <Row key={key}>
          <FormGroupCol span={6} ><label>{key} </label></FormGroupCol>
          <FormGroupCol span={6}>{info[key]}</FormGroupCol>
        </Row>
      );
    }
    let html = (<FormContainer fluid>{renderInfo}</FormContainer>);
    return html;
  }
}

export class UIGCInfoListPlugin extends VGridEntityListPlugin {

  loadData(uiList: VGridEntityList<any>): void {
    let callback = (response: server.rest.RestResponse) => {
      let records = response.data.garbageCollectorInfo;
      this.update(records);
      uiList.markLoading(false);
      uiList.forceUpdate();
    };
    this.serverGet(uiList, SystemRestURL.rest.getJVMInfo, callback);
  }
}

export class UIGCInfoList extends VGridEntityList {
  createVGridConfig(): VGridConfig {
    let config: VGridConfig = {
      record: {
        fields: [
          ...VGridConfigTool.FIELD_SELECTOR(this.needSelector()),
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('name', T('Name'), 200, 'fixed-left'),
          { name: 'collectionCount', label: T('Collection Count') },
          { name: 'collectionTime', label: T('Collection Time') },
          { name: 'poolNames', label: T('Pool Names') },
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

  onDefaultSelect(dRecord: DisplayRecord) {
    let type = dRecord.record;
    let { appContext, pageContext } = this.props;
    let pageCtx = pageContext.createPopupPageContext();
    let observer = new ComplexBeanObserver(type);

    let html = (<GCInfoForm observer={observer} pageContext={pageContext} appContext={appContext} />);
    widget.layout.showDialog(T("GC Info"), 'lg', html, pageCtx.getDialogContext());
  }
}
