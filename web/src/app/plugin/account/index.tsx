import { Component } from 'react';

import { AppContext, ApplicationPlugin } from '../../../api/api';
import { UIAccountPage } from './UIAccountPage';

interface UIAccountApplicationPluginProps {
  appContext: AppContext;
}

interface UIAccountApplicationPluginState {
  accounts: Array<any>;
}

class UIAccountApplicationPlugin extends Component<UIAccountApplicationPluginProps, UIAccountApplicationPluginState> {
  //TODO: move state and componentDidMount to UIAccountPage
  render() {
    const { appContext } = this.props;
    return (<UIAccountPage appContext={appContext} />);
  }
}

export class AccountApplicationPlugin extends ApplicationPlugin {
  constructor() {
    super('account', 'account');
    this.label = 'Account Application Plugin';
  }

  createUI(appContext: AppContext) {
    return (<UIAccountApplicationPlugin appContext={appContext} />);
  }
}