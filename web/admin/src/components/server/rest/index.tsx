import * as React from 'react';
import {Component} from 'react';

import {SuccessCallback} from './type';
import { Rest } from './rest';

interface UIRestPingProps extends React.Props<any> {
  serverUrl: string,
  restPath: string
}
export class UIRestPing extends Component<UIRestPingProps, {}> {
  screen: string = '';
  restContext: {
    serverUrl: string,
    restPath:  string 
  }

  constructor(props: UIRestPingProps) {
    super(props);
    let { serverUrl, restPath } = this.props;
    this.restContext = {
      serverUrl: serverUrl,
      restPath: restPath
    }
  }

  ping() {
    let rest = new Rest(this.restContext.serverUrl, this.restContext.serverUrl);
    let successCB: SuccessCallback = (result: any) => {
      this.screen += `RESPONSE: ${JSON.stringify(result)}\n` ;
      this.forceUpdate();
    }
    this.screen   += 'SENT:     Hello!!!\n'
    rest.post(this.restContext.restPath, {'param': 'value'}, successCB);
    this.forceUpdate();
  }

  clear() {
    this.screen = ''
    this.forceUpdate();
  }

  render() {
    return (
      <div className='my-2 py-2'>
        <div> Rest Base URL: {this.restContext.serverUrl} </div>
        <div> Rest Path: {this.restContext.restPath} </div>
        <pre className='border' style={{minHeight: '50px'}}>
          { this.screen }
        </pre>

        <button onClick={() => this.ping() }>Ping</button>
        <button onClick={() => this.clear() }>Clear</button>
      </div>
    );
  }
}

export *  from './type'
export *  from './rest'
