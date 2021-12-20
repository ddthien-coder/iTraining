
import React from 'react'

import { widget, server } from 'components'

import {
  ComplexBeanObserver,
  WButtonEntityWrite, WComponent, WComponentProps, WToolbar
} from 'core/widget'

export class WJobLauncherPlugin {
  jobActionObserver: ComplexBeanObserver;

  constructor(jobName: string) {
    let jobAction = {
      jobName: jobName, action: 'Start',
      params: {}
    }
    this.jobActionObserver = new ComplexBeanObserver(jobAction);
  }

  getJobActionObserver() {
    return this.jobActionObserver;
  }

  createForm() {
    throw Error("This method need to be overrided");
  }
}

interface WJobLauncherProps extends WComponentProps {
  plugin: WJobLauncherPlugin
  onLaunchSucess?: (jobInstance: any, operation: any) => void;
}
export class WJobLauncher extends WComponent<WJobLauncherProps> {
  onSubmit = () => {
    let { appContext, pageContext, plugin, onLaunchSucess } = this.props;
    let observer = plugin.getJobActionObserver();

    let callback = (response: server.rest.RestResponse) => {
      let jobInstance = response.data;
      if (onLaunchSucess) {
        onLaunchSucess(jobInstance, observer.getMutableBean().params.operation);
      } else {
        widget.layout.showJson('sm', 'Job Instance', jobInstance);
      }
    }

    let action = observer.commitAndGet();
    appContext.serverPOST("/company/job/action", action, callback);
    pageContext.onBack();
  }

  render() {
    let { appContext, pageContext, plugin } = this.props;
    let html = (
      <div className='flex-vbox'>
        {plugin.createForm()}
        <WToolbar>
          <WButtonEntityWrite
            appContext={appContext} pageContext={pageContext}
            label={'Submit'} onClick={this.onSubmit} />
        </WToolbar>
      </div>
    );
    return html;
  }
}

export function popupJobLauncher(uiSource: WComponent, plugin: WJobLauncherPlugin,
  onLaunchSucess?: (jobInstance: any, operation: any) => void) {
  let { appContext, pageContext } = uiSource.props;
  let pageCtx = pageContext.createPopupPageContext();
  let html = (
    <WJobLauncher appContext={appContext} pageContext={pageCtx}
      plugin={plugin} onLaunchSucess={onLaunchSucess} />
  );
  widget.layout.showDialog("Job Launcher", 'sm', html, pageCtx.getDialogContext());
}