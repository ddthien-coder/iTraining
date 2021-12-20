import React from 'react';
import { widget } from 'components';

import { WComponent } from 'core/widget';

import { SystemRestURL, T } from '../Dependency';

import { UIMonitorSummaryList, UIMonitorSummaryPlugin } from './UIMonitorSummary';
import { UIGCInfoList, UIGCInfoListPlugin } from './UIGCInfoList';
import { UIThreadList, UIThreadListPlugin } from './UIThreadsList';

const { TabPane, Tab } = widget.layout;

export class UIJVMPage extends WComponent {
  render() {
    let { appContext, pageContext } = this.props;

    return (
      <TabPane style={{ height: '100%' }}>
        <Tab name={'jvm'} label={T('JVM')} active={true}>
          <UIMonitorSummaryList plugin={new UIMonitorSummaryPlugin(SystemRestURL.rest.getJVMSummary)} appContext={appContext} pageContext={pageContext} />
        </Tab>
        <Tab name={'gcinfo'} label={T('GC Info')} active={false}>
          {<UIGCInfoList plugin={new UIGCInfoListPlugin()} appContext={appContext} pageContext={pageContext} />}
        </Tab>
        <Tab name={'thread'} label={T('Thread')} active={false}>
          {<UIThreadList plugin={new UIThreadListPlugin()} appContext={appContext} pageContext={pageContext} />}
        </Tab>
      </TabPane>
    )
  }
}