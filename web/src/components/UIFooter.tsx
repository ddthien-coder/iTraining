import React, {Component} from 'react';
import {AppContextProps} from '../api/api';

export class UIFooter extends Component<AppContextProps> {
  render() {
    return (
      <div className='ui-footer'>
        <h3>Footer</h3>
      </div>
    );
  }
}
