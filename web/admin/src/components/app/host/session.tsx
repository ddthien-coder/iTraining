import { storage } from 'components/storage'
import { RestResponse } from 'components/server/rest'

import * as api from 'components/app/host/api'
import { CONFIG } from "./config";

const ACCOUNT_STATE_KEY = 'webos:account-state';
class StorableState {
  records: Record<string, any> = {};

  getState(name: string, defaultState: any) {
    let currState = storage.diskGet(name, defaultState);
    this.records[name] = currState;
    return currState;
  }

  mergeState(name: string, newState: any) {
    let currState = storage.diskGet(name, {});
    let updateState = { ...currState, ...newState };
    storage.diskPut(name, updateState);
    this.records[name] = updateState;
    return updateState;
  }

  setState(name: string, newState: any) {
    storage.diskPut(name, newState);
    this.records[name] = newState;
    return newState;
  }

  removeState(name: string) {
    let currState = storage.diskGet(name, {});
    storage.diskRemove(name);
    delete this.records[name];
    return currState;
  }
}
class Session {
  storable: StorableState | null = null;
  accountAcl: api.AccountAcl | null = null;
  authenticated: boolean;

  constructor() {
    this.authenticated = false;
  }

  getStorable() {
    if (!this.storable) {
      throw new Error('Session storable is not available');
    }
    return this.storable;
  }

  getAccountAcl() {
    if (!this.accountAcl) throw new Error('You need to authenticate first');
    return this.accountAcl;
  }

  isAuthenticated() { return this.authenticated; }

  getLoginId() {
    if (!this.accountAcl) throw new Error('You need to authenticate first');
    return this.accountAcl.getLoginId();
  }

  getCurrentCompanyContext() {
    if (!this.accountAcl) throw new Error('You need to authenticate first');
    let availableCompanyAcls = this.accountAcl.getCompanyAcl();
    return availableCompanyAcls;
  }

  getCompanyContextByName(name: string) {
    if (!this.accountAcl) throw new Error('You need to authenticate first');
    let availableCompanyAcls = this.accountAcl.getAvailableCompanyAcls();
    if (!availableCompanyAcls) return null;
    for (let i = 0; i < availableCompanyAcls.length; i++) {
      let ctx = availableCompanyAcls[i];
      if (ctx.companyCode == name) return ctx;
    }
    return null;
  }

  authenticate(accountAclModel: api.IAclModel) {
    this.accountAcl = new api.AccountAcl(accountAclModel);
    this.authenticated = this.accountAcl.isAuthorized();
    if (this.authenticated) {
      this.storable = new StorableState();
      let accountState: api.IAccountState = {
        loginId: this.accountAcl.getLoginId(),
        accessToken: this.accountAcl.getAccessToken(),
        companyCode: this.accountAcl.getSelectedCompany()
      };
      this.storable.mergeState(ACCOUNT_STATE_KEY, accountState);
    }
    return this.authenticated;
  }

  signout(_uicomponent: any, _callback: any) {
    if (!this.accountAcl) throw new Error('You need to authenticate first');
    this.authenticated = false;
    this.accountAcl = null;
    this.storable = null;
  }

  signin(loginModel: any, successCB?: (accountACL: api.AccountAcl) => void) {
    let successCb = (result: RestResponse) => {
      let aclModel: api.IAclModel = result.data;
      if (this.authenticate(aclModel) && successCB) {
        successCB(this.getAccountAcl());
      }
    }
    let failCb = (_result: RestResponse) => {
      alert('Fail to login. Contact the admin for further information.');
    }
    let serverCtx = CONFIG.createServerContext();
    serverCtx.getRestClient().post("/company/acl/authenticate", loginModel, successCb, failCb);
  }

  autoSignin(customSuccessCB: (accountACL: api.AccountAcl) => void, customFailCB: () => void) {
    let storable = new StorableState();
    let accountState: api.IAccountState = storable.getState(ACCOUNT_STATE_KEY, {});
    if (!accountState.accessToken) {
      customFailCB();
      return;
    }
    let failCb = (_result: RestResponse) => {
      delete accountState.accessToken
      storable.mergeState(ACCOUNT_STATE_KEY, accountState);
      customFailCB();
    }

    let successCb = (result: RestResponse) => {
      let aclModel: api.IAclModel = result.data;
      if (this.authenticate(aclModel)) {
        customSuccessCB(this.getAccountAcl());
      } else {
        failCb(result);
      }
    }

    let serverCtx = CONFIG.createServerContext();
    let accessToken = { token: accountState.accessToken };
    serverCtx.getRestClient().post("/company/acl/token/validate", accessToken, successCb, failCb);
  }
}

const session = new Session();
export { session };