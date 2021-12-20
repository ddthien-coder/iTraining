import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./stylesheet.scss";
import { ServerContext, OSContext, AppContext } from "components/app";
import { UISample } from "components/sample";

export class UIApplication extends React.Component<{}, {}> {
  appContext: AppContext;
  constructor(props: any) {
    super(props);
    let serverCtx = new ServerContext('localhost', 'http://localhost:3000', 'http://localhost:3000');
    let osContext = new OSContext(this, serverCtx);
    this.appContext = new AppContext(this, osContext);
  }
  render() {
    return (<UISample appContext={this.appContext} />);
  }
}

function AutoAuthRoute() {
  let router = (
    <Router>
      <Switch>
        <Route path="/admin" component={UIApplication} />
      </Switch>
    </Router>
  );
  return router;
}

ReactDOM.render(<AutoAuthRoute />, document.getElementById('app'));
