import React, { Component } from 'react';

import {AppContextProps} from '../api/api';

export class UIBanner extends Component<AppContextProps> {
  render() {
    return (
      <div className='ui-banner'>
        <h3>Banner</h3>
      </div>
    );
  }
}
