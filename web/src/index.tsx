import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes , Route } from "react-router-dom";

import { UIHello } from "./UIHello";
import { UIApplication } from "./components/UIApplication";
import reportWebVitals from './reportWebVitals';

import './stylesheet.scss';

function AppRouter() {
  let router = (
    <Router>
      <Routes>
        <Route path="/" element={<UIApplication />} />
        <Route path="/hello" element={<UIHello />} />
      </Routes>
    </Router>
  );
  return router;
}

ReactDOM.render(<AppRouter />, document.getElementById('app'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
