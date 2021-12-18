import React, {Component} from 'react';

import { AppContext, ApplicationPlugin } from 'api/api';

interface UIHelloApplicationPluginProps {
  appContext: AppContext;
}
class UIHelloApplicationPlugin extends Component<UIHelloApplicationPluginProps> {
  render() {
    let html = (
      <div>Hello Application Plugin</div>
    );
    return html;
  }
}

export class HelloApplicationPlugin extends ApplicationPlugin {
  constructor() {
    super('hello', 'hello');
    this.label    = 'Hello Application Plugin';
  }

  createUI(appContext: AppContext) {
    return (<UIHelloApplicationPlugin appContext={appContext} /> );
  }
}