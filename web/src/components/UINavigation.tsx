import React, {Component} from 'react';

import {Button} from 'reactstrap'

import {AppContextProps, AppEvent} from '../api/api';
import {PluginManager} from '../app/plugin/PluginManager';

interface UINavigationProps extends AppContextProps {
  pluginManager: PluginManager;
}

export class UINavigation extends Component<UINavigationProps> {
  onHelloClick(message: string) {
    console.log('call onHelloClick(..)');
    console.log(`Message = ${message}`);
    alert(message);
  }

  onHelloRest(message: string) {
    console.log('call onHelloRest(..)');
    console.log(`Message = ${message}`);
    let { appContext } = this.props;
    let callback = (restResponse: any) => {
      console.log('rest callback:');
      console.log(restResponse);
      let data = restResponse.data;
      let message = data.message;
      alert(`${message}`);
    };
    appContext.getRest().get('core/ping', {message: message}, callback);
  }

  broadcastAppEvent(eventName: string, data: any) {
    console.log('call onAppEventBroadcast(..)');
    console.log(`Event Name = ${eventName}`);
    let {appContext} = this.props;
    let event = new AppEvent(eventName, data, this);
    appContext.broadcast(event);
  }

  renderPlugins() {
    console.log('call renderPlugins()');
    let { pluginManager } = this.props;
    let uiSections = [];
    let categories = pluginManager.getCategories();
    for(let category of Array.from(categories.values())) {
      let pluginLinks = [];
      for(let plugin of Array.from(category.plugins.values())) {
        pluginLinks.push(
          <Button key={plugin.name} color='link' onClick={() => this.broadcastAppEvent("app:select:plugin", {plugin: plugin})}>{plugin.label}</Button>
        );
      }
      let uiSection = (
        <div key={category.name} className='ui-section'>
          <h3>{category.name}</h3>
          { pluginLinks }
        </div>
      );
      uiSections.push(uiSection);
    }
    return uiSections;
  }

  render() {
    return (
      <div className='ui-navigation'>
        <div className='ui-section' style={{height: 200}}>
          <h3>Hello Buttons</h3>
          <div>
            <Button color='link' onClick={() => this.onHelloClick('My First Button Click')}>Hello Link</Button>
            <Button color='link' onClick={() => this.broadcastAppEvent('change:screen', {screen: ''})}>Hello App
              Event</Button>
          </div>
        </div>

        <div className='ui-section'>
          <h3>Hello Rest</h3>
          <div>
            <Button color='link' onClick={() => this.onHelloRest('Hello Rest')}>Hello Rest</Button>
          </div>
        </div>
        {this.renderPlugins()}
      </div>
    );
  }
}
