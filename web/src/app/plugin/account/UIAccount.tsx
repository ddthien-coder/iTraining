import React, { Component } from 'react';

import { AppContext } from 'api/api';

// props
interface UIAccountProps {
  appContext: AppContext;
  account: any
}
// state
interface UIAccountState {
  account: any
}
//  component tu luu tru,quan ly props, state cua chinh no (Account)
export class UIAccount extends Component<UIAccountProps, UIAccountState> {
  constructor(props: UIAccountProps) {
    super(props);
    // luu tru/ ghi nho account
    this.state = {
      account: {}
    };
  }
  handleChangeLoginId = (e: any) => {
    // xu ly su kien
    // e = event
    e.preventDefault();
    // goi setState no se tu dong cap nhat component chinh
    // va cac component con cua no
    this.setState({
      account: {
        ...this.state.account,
        loginId: e.target.value,
      }
    });
  }

  handleChangeAccountType = (e: any) => {
    e.preventDefault();
    this.setState
      ({
        account: {
          ...this.state.account,
          accountType: e.target.value
        }
      })
  }
  handleChangeFullName = (e: any) => {
    e.preventDefault();
    this.setState
      ({
        account: {
          ...this.state.account,
          fullName: e.target.value
        }
      })
  }

  handleChangeEmail = (e: any) => {
    e.preventDefault();
    this.setState
      ({
        account: {
          ...this.state.account,
          email: e.target.value
        }
      })
  }

  handleChangePassword = (e: any) => {
    e.preventDefault();
    this.setState
      ({
        account: {
          ...this.state.account,
          password: e.target.value
        }
      })
  }

  handleSaveAccount = (e: any) => {
    e.preventDefault();
    // khai bao bien account cuc bo su dung let
    let account = this.state.account;
    console.log(account);

    const { appContext } = this.props;
    let successCallback = (result: any) => {
      alert("Save Successfully!")
      console.log(result.data)
    }
    let failCallback = () => {
      alert("Save Failed")
    }
    // call api put
    let resrApiSaveAccount = appContext.getRest();
    resrApiSaveAccount.put(`account/account`, account, successCallback, failCallback);
  }

  render() {
    const form = {
      width: "700px",
      margin: 0,
    }
    return (
      <form onSubmit={this.handleSaveAccount} style={form}>
        <div className="p-5">
          <div className="form-group mb-3">
            <label>LoginId:</label>
            <input type="text" className="form-control col-6" required
              value={this.state.account.loginId ? this.state.account.loginId : ''}
              onChange={this.handleChangeLoginId} />
          </div >

          <div className="form-group mb-3">
            <label>Email:</label>
            <input type="email" className="form-control col-6" required
              value={this.state.account.email ? this.state.account.email : ''}
              onChange={this.handleChangeEmail} />
          </div >
          <div className="form-group mb-3">
            <label>FullName:</label>
            <input type="text" className="form-control col-6" required
              value={this.state.account.fullName ? this.state.account.fullName : ''}
              onChange={this.handleChangeFullName} />
          </div>
          <div className="form-group mb-3">
            <label>Password:</label>
            <input type="password" className="form-control col-6" required
              value={this.state.account.password ? this.state.account.password : ''}
              onChange={this.handleChangePassword} />
          </div >
          <div className="form-group mb-3">
            <label>AccountType:</label>
            <select value={this.state.account.accountType}
              onChange={this.handleChangeAccountType}
              className="form-control col-6">
              <option>Select Type</option>
              <option value="User">User</option>
              <option value="Organization">Organization</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form >
    )
  }
}