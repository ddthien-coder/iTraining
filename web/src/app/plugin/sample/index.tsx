import React, {Component} from 'react';

import {AppContext, ApplicationPlugin} from 'api/api';

interface UISampleApplicationPluginProps {
  appContext: AppContext;
}
class UISampleApplicationPlugin extends Component<UISampleApplicationPluginProps> {
  render() {
    let html = (
      <div>Sample Application Plugin</div>
    );
    return html;
  }
}

export class SampleApplicationPlugin extends ApplicationPlugin {
  constructor() {
    super('sample', 'sample');
    this.label    = 'Sample Application Plugin';
  }

  createUI(appContext: AppContext) {
    return (<UISampleApplicationPlugin appContext={appContext} /> );
  }
}