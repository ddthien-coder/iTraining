import React from 'react';
import { Component } from 'react';
import { app } from 'components';

export class CompanyRequiredPage extends Component {
  render() {
    if (app.host.session.isAuthenticated()) {
      return this.props.children;
    }

    let html = (
      <div className='d-flex h-100 w-100'>
        <h1 className='m-auto border p-5' style={{ width: 700 }}>
          You Need To Be In A Company To Access This Page!!!
        </h1>
      </div>
    );
    return html;
  }
}