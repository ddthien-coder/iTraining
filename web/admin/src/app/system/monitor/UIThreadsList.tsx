import React from 'react';
import { server, widget } from 'components';

import {
  ComplexBeanObserver, WComponent, WComponentProps, WEntity
} from 'core/widget';
import { VGridConfigTool, VGridEntityList, VGridEntityListPlugin } from 'core/widget/vgrid';

import { SystemRestURL, T } from '../Dependency';

import DisplayRecord = widget.grid.model.DisplayRecord;
import VGridConfig = widget.grid.VGridConfig;
const { Row, TabPane, Tab } = widget.layout;
const { FormContainer, FormGroupCol } = widget.input;

class ThreadForm extends WEntity {
  render() {
    const { observer } = this.props;
    let userData = observer.getMutableBean();
    let renderInfo = [];
    for (let key in userData) {
      if (key === 'threadStackTrace') {
        continue;
      }
      if (key == "_state") continue;
      renderInfo.push(
        <Row key={key}>
          <FormGroupCol span={6}><label>{key} </label></FormGroupCol>
          <FormGroupCol span={6}> {userData[key]}</FormGroupCol>
        </Row>
      );
    }
    let html = (
      <TabPane>
        <Tab name='threadInfo' label='Thread Info' active={true}>
          <FormContainer fluid>{renderInfo}</FormContainer>
        </Tab>
        <Tab name='stacktrace' label='Stacktrace'>
          <FormContainer fluid>{userData.threadStackTrace}</FormContainer>
        </Tab>
      </TabPane>
    );
    return html;
  }
}

export class UIThreadListPlugin extends VGridEntityListPlugin {
  loadData(uiList: VGridEntityList<any>): void {
    let callback = (response: server.rest.RestResponse) => {
      let records = response.data.threads.threads;
      this.update(records);
      uiList.markLoading(false);
      uiList.forceUpdate();
    }
    this.serverGet(uiList, SystemRestURL.rest.getJVMInfo, callback);
  }
}

export class UIThreadList extends VGridEntityList {
  createVGridConfig(): VGridConfig {
    let config: VGridConfig = {
      record: {
        fields: [
          ...VGridConfigTool.FIELD_SELECTOR(this.needSelector()),
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('threadName', T('Thread Name'), 200, 'fixed-left'),

          { name: 'threadBlockCount', label: T('Thread Block Count'), state: { visible: true } },
          { name: 'threadBlockTime', label: T('Thread Block Time'), state: { visible: true } },
          { name: 'threadCPUTime', label: T('Thread CPU Time'), state: { visible: true } },
          { name: 'threadId', label: T('Thread Id'), state: { visible: true } },
          { name: 'threadState', label: T('Thread State'), state: { visible: true } },
          { name: 'threadUserTime', label: T('Thread User Time'), state: { visible: true } },
          { name: 'threadWaitedCount', label: T('Thread Waited Count') },
          { name: 'threadWaitedTime', label: T('Thread Waited Count') },
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
    let { appContext, pageContext, } = this.props;
    let pageCtx = this.newPopupPageContext();
    let observer = new ComplexBeanObserver(type);
    let html = (
      < ThreadForm observer={observer} pageContext={pageContext} appContext={appContext} />
    );
    widget.layout.showDialog("Method", 'md', html, pageCtx.getDialogContext());
  }

  render() {
    let { appContext, pageContext } = this.props;

    return (
      <widget.component.HSplit>
        <ThreadSummaryForm appContext={appContext} pageContext={pageContext} />
        {super.render()}
      </widget.component.HSplit>
    )
  }
}

class ThreadSummaryForm extends WComponent {
  threadCount: any;
  threadDeamonCount: any
  threadPeakCount: any
  threadStartedCount: any
  constructor(props: WComponentProps) {
    super(props);
    this.load();
  }

  load() {
    this.markLoading(true)
    let { appContext } = this.props;
    let successCB = (response: server.rest.RestResponse) => {
      this.markLoading(false)
      this.threadCount = response.data.threads.threadCount;
      this.threadDeamonCount = response.data.threads.threadDeamonCount;
      this.threadPeakCount = response.data.threads.threadPeakCount;
      this.threadStartedCount = response.data.threads.threadStartedCount;
      this.forceUpdate();
    }
    appContext.serverGET(SystemRestURL.rest.getJVMInfo, {}, successCB);
  }
  render() {
    return (
      <FormContainer fluid className='full-height-box'>
        <Row>
          <FormGroupCol span={6} label={T("Thread Count")}>
          </FormGroupCol>
          <FormGroupCol span={6}>
            <label> {this.threadCount}</label>
          </FormGroupCol>
          <FormGroupCol span={6} label={T("hread Deamon Count")}>
          </FormGroupCol>
          <FormGroupCol span={6}>
            <label> {this.threadDeamonCount}</label>
          </FormGroupCol>
          <FormGroupCol span={6} label={T("Thread Peak Count")}>
          </FormGroupCol>
          <FormGroupCol span={6}>
            <label> {this.threadPeakCount}</label>
          </FormGroupCol>
          <FormGroupCol span={6} label={T("Thread Started Count")}>
          </FormGroupCol>
          <FormGroupCol span={6}>
            <label> {this.threadStartedCount}</label>
          </FormGroupCol>
        </Row>
      </FormContainer>
    )
  }
}
