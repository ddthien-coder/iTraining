import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { app, React, ReactDOM } from "components";
import * as erp from "./iT";

import { PrivateRoute, UILogin } from "app/host/auth/uiauth";
import UIHostApp from "app/host/UIHostApp";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import "./stylesheet.scss";

import AdminAppRegistry = erp.app.admin.AdminAppRegistry;
import SystemAppRegistry = erp.app.system.SystemAppRegistry;
import HomeAppRegistry = erp.app.user.HomeAppRegistry

import CompanyAppRegistry = erp.app.company.CompanyAppRegistry;
import SampleAppRegistry = erp.app.sample.SampleAppRegistry;
import AppRegistryGroup  = app.host.AppRegistryGroup;

const AppRegistryManager = app.host.AppRegistryManager;

let userGroup = new AppRegistryGroup('user', 'User');
let userApps = [
  new HomeAppRegistry(), new SampleAppRegistry()
];
AppRegistryManager.addGroupApps(userGroup, userApps);

let systemGroup = new AppRegistryGroup('system', 'System');
let systemApps = [
  new AdminAppRegistry(), new SystemAppRegistry(), new SampleAppRegistry()
];
AppRegistryManager.addGroupApps(systemGroup, systemApps);

let companyGroup = new AppRegistryGroup('company', 'Company');
let companyApps = [
  new CompanyAppRegistry()
];
AppRegistryManager.addGroupApps(companyGroup, companyApps);

let sampleGroup = new AppRegistryGroup('sample', 'Sample');
let sampleApps = [
  new SampleAppRegistry()
 ];
AppRegistryManager.addGroupApps(sampleGroup, sampleApps);

let otherGroup = new AppRegistryGroup('others', 'Others');
let otherApps = [new SampleAppRegistry()];
AppRegistryManager.addGroupApps(otherGroup, otherApps);

function AuthRoute() {
  let router = (
    <Router>
      <Switch>
        <Route path="/login/app" component={UILogin} />
        <Route exact path="/" render={() => <Redirect to="/app/ws:_restore_" />} />
        <Route exact path="/app" render={() => <Redirect to="/app/ws:_restore_" />} />
        <PrivateRoute loginPath='/login/app' path="/app/ws:name/:app*" component={UIHostApp} />
      </Switch>
    </Router>
  );
  return router;
}

ReactDOM.render(<AuthRoute />, document.getElementById('app'));

console.log('-----------------------------------');
console.log('load index');
if(!React['id']) {
  React['id'] = 'index'
}
console.log('React id ' + React['id']);
console.log('-----------------------------------');