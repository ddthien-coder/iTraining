import React from 'react';
import {Component ,Props} from 'react';

export class WebsocketClient {
  wsUri:     string;
  websocket: WebSocket | null = null;

  constructor(wsUri: string, open: boolean) {
    this.wsUri = wsUri;
    if(open) this.open();
  }

  open() {
    this.close();
    let thisClient = this;
    let websocket = new WebSocket(this.wsUri);
    websocket.onopen = function(evt) { thisClient.onOpen(evt) };
    websocket.onclose = function(evt) { thisClient.onClose(evt) };
    websocket.onmessage = function(evt) { thisClient.onMessage(evt) };
    websocket.onerror = function(evt) { thisClient.onError(evt) };
    this.websocket = websocket;
  }

  onOpen(_evt: any) { }
  onClose(_evt: any) { }
  onError(_evt: any) { }
  onMessage(_evt: any) { }

  send(message: string) {
    if(this.websocket) {
      this.websocket.send(message);
    } else {
      throw 'Websocket is disconneced';
    }
  }

  sendObject(object: any) {
    if(this.websocket) {
      let json = JSON.stringify(object);
      this.websocket.send(json);
    } else {
      throw 'Websocket is disconneced';
    }
  }


  close() {
    if(this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }
}

export interface UIWebsocketEchoProps extends Props<any> {
  serverUrl: string;
  wsPath: string
}
export class UIWebsocketEcho extends Component<UIWebsocketEchoProps, {}> {
  screen:   string = '';
  wsClient: WebsocketClient|null = null;

  componentWillReceiveProps(_nextProps: any) {
    console.log('[Websocket] componentWillReceiveProps(nexpProps)');
  }

  initWebsocket() {
    this.closeWebsocket();
    let { serverUrl, wsPath } = this.props;
    let wsUri = serverUrl + wsPath ;
    this.screen = '';
    let thisUI = this;
    console.log('wsUri = ' + wsUri)
    let wsClient = new WebsocketClient(wsUri, true/*open*/);
    wsClient.onOpen = (_evt) => {
      thisUI.writeToScreen("CONNECTED");
      thisUI.writeToScreen("SENT: Hello");
      let data = {
        "from": "Tuan", "text": "hello"
      }
      wsClient.send(JSON.stringify(data));
    };
    wsClient.onClose = (_evt) => {
      thisUI.writeToScreen("DISCONNECTED");
    };
    wsClient.onMessage = (evt) => {
      thisUI.writeToScreen('ECHO: ' + evt.data);
    };
    wsClient.onError = (evt) => {
      thisUI.writeToScreen(evt.data);
    };
    this.wsClient = wsClient;
  }

  closeWebsocket() {
    if(this.wsClient) {
      this.wsClient.close();
      this.wsClient = null;
    }
  }

  pingWebsocket() {
    if(this.wsClient) {
      let message = 'hello';
      this.writeToScreen("SENT: " + message);
      this.wsClient.send(message);
    }
  }

  writeToScreen(message: string) {
    this.screen += message + '\n';
    this.forceUpdate();
  }

  render() {
    let { serverUrl, wsPath } = this.props;
    return (
      <div>
        <h3>Websocket</h3>
        <div> Server URL: {serverUrl} </div>
        <div> Websocket Path: {wsPath} </div>
        <pre style={{border: '1px dashed gray', minHeight: '50px'}}>
          {this.screen}
        </pre>
        <button onClick={() => this.initWebsocket() }>Init Websocket</button>
        <button onClick={() => this.pingWebsocket() }>Ping Websocket</button>
        <button onClick={() => this.closeWebsocket() }>Close Websocket</button>
      </div>
    );
  }
}
