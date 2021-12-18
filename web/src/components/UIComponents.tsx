import React, { Component } from 'react';

import { AppContext } from '../api/api';
import { PluginManager } from '../app/plugin/PluginManager';

import { UIBanner } from './UIBanner'
import { UIFooter } from './UIFooter'
import { UINavigation } from './UINavigation'
import { UIWorkspace } from './UIWorkspace'

import 'bootstrap/dist/css/bootstrap.min.css';
import "./stylesheet.scss";

export class UIComponents extends Component {
  appContext: AppContext;
  pluginManager: PluginManager;

  constructor(props: any) {
    super(props);
    this.appContext = new AppContext(this);
    this.pluginManager = new PluginManager();
  }

  render() {
    let event = this.appContext.consumeEvent();

    return (
      <div className='ui-application'>
        <UIBanner appContext={this.appContext} event={event} />
        <div className='d-flex flex-grow-1'>
          <UINavigation appContext={this.appContext} pluginManager={this.pluginManager} event={event} />
          <UIWorkspace appContext={this.appContext} event={event} />
        </div>
        <UIFooter appContext={this.appContext} event={event} />
      </div>
    );
  }
}