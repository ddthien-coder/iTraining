import { Component } from 'react';
import { UIAccount } from './UIAccount';
import { UIAccountList } from './UIAccountList';

/**
 * TODO:
 * Implement UIAccountPage with layout
 * -----------------------------------------------------------------------
 * | [Account List] [New Account] [Hello]                                |
 * -----------------------------------------------------------------------
 * |  Account List Table or Account Form                                 |
 * |                                                                     |
 * |                                                                     |
 * |                                                                     |
 * |                                                                     |
 * |                                                                     |
 * -----------------------------------------------------------------------
 */

import { AppContext } from '../../../api/api';

interface UIAccountPageProps {
  appContext: AppContext;
}

interface UIAccountPageState {
  accounts: Array<any>
}

export class UIAccountPage extends Component<UIAccountPageProps, UIAccountPageState> {
  view: String;
  constructor(props: UIAccountPageProps) {
    super(props);
    this.state = {
      accounts: []
    }
    this.view = 'list'
  }

  showList() {
    this.view = 'list'
    this.forceUpdate();
  }

  createAccount() {
    this.view = 'form'
    this.forceUpdate();
  }

  componentDidMount() {
    const { appContext } = this.props;
    const successCB = (result: any) => {
      console.log();

      this.setState({ accounts: result.data });
    }
    let restClient = appContext.getRest();
    restClient.get(`account/account/all`, {}, successCB);
  }

  render() {
    const { appContext } = this.props;
    let account = null;
    let view = null;
    let button = null;
    if (this.view === 'list') {
      view = <UIAccountList appContext={appContext} accounts={this.state.accounts} />
    } else if (this.view === 'form') {
      view = <UIAccount appContext={appContext} account={account} />
    }
    if (this.view === 'form') {
      button = <button className="btn btn-primary" onClick={() => this.showList()}>List</button>
    } else if (this.view === 'list') {
      button = <button className="btn  btn-info" onClick={() => this.createAccount()}>Create</button>
    }
    return (
      <div>
        <div>{view}</div>
        <div>{button}</div>
      </div>
    );
  }
}