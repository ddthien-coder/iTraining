import { Component } from 'react';

import { AppContext } from '../../../api/api';

interface UIAccountListProps {
  appContext: AppContext;
  accounts: Array<any>
}
interface UIAccountListState {
  accounts: Object
  loginId: String,
}
export class UIAccountList extends Component<UIAccountListProps, UIAccountListState> {

  constructor(props: UIAccountListProps) {
    super(props);
    this.state = {
      accounts: {},
      loginId: ''
    }
  }

  handleViewAccounts = (loginId: string) => {
    const { appContext } = this.props;
    let successCallback = (result: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      alert("Get Account Successfully!")
        this.setState({
          accounts: result.data
        })
    }
    let failCallback = () => {
      alert("Fail to get account")
    }
    let restApiViewAccount = appContext.getRest();
    restApiViewAccount.get(`account/account/${loginId}`, {}, successCallback, failCallback)
  }

  handleDeleteAccountByLoginId = (loginId: string) => {
    const { appContext } = this.props;
    let successCallback = (result: any) => {
      alert("Delete Account ById Successfully!")
      console.log(result.data)
    }
    let failCallback = () => {
      alert("Fail to Delete Account")
    }
    let restApiDeleteAccount = appContext.getRest();
    restApiDeleteAccount.delete(`account/account/${loginId}`, {}, successCallback, failCallback)
  }
  handleChangeLoginId = (e: any) => {
    this.setState({
      loginId: e.target.value,
    })
  }

  render() {
    let { accounts } = this.props;
    let rows = accounts.map((account: any) => {
      return <tr key={account.id}>
        <td>{account.loginId}</td>
        <td>{account.email}</td>
        <td>{account.fullName}</td>
        <td>{account.accountType}</td>
        <td>
          <button className="btn btn-secondary" onClick={() => this.handleDeleteAccountByLoginId(account.loginId)}>Delete</button>
          <button className="btn" onClick={() => this.handleViewAccounts(account.loginId)}>View</button>
        </td>
      </tr>
    })
    return (
      <div className="container container-fluid">
        <div className="text-center">
          <h3>Account Table</h3>
        </div>
        <div>
          <table className="table table-bordered table-striped table-hover table-responsive-xl">
            <thead>
              <tr>
                <td>LoginId</td>
                <td>Email</td>
                <td>FullName</td>
                <td>Account Type</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody className="p-3">
              {rows}
            </tbody>
          </table>
        </div>
      </div >

    );
  }
}