import { Component } from 'react';

import {AppContextProps, ApplicationPlugin} from '../api/api';

export class UIWorkspace extends Component<AppContextProps> {
  render() {
    let {appContext, event} = this.props;
    let uiBody = (<div>Workspace</div>);
    if(event && event.name === 'app:select:plugin') {
      let plugin : ApplicationPlugin = event.data.plugin; 
      uiBody = plugin.createUI(appContext);
    }
    return (
      <div className='ui-workspace'>{uiBody}</div>
    );
  }
}
