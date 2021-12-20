import React from 'react';
import ReactJson from 'react-json-view'

import { RestResponse } from 'components/server/rest/type';
import { showDialog, showNotification } from 'components/widget/layout'
import { SuccessCallback, FailCallback } from "./type";

function createFetchConfig(method: string, params: any) {
  let body = null;
  if (params) {
    body = JSON.stringify(params);
  }

  let config = {
    method: method,
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    cache: 'no-cache',
    mode: 'cors',
    credentials: 'include', //include, same-origin, omit
    body: body
  };
  return config;
}

export function handleResponseError(response: RestResponse) {
  if (response.error.errorType === 'NotAuthorized') {
    let html = (
      <div>You are not authorized. Maybe your session is expired.</div>
    );
    showNotification("info", 'md', html);
    window.location.reload();
    return;
  }
  let html = (
    <ReactJson src={response} indentWidth={4} collapsed={1} />
  );
  showDialog("Error", 'md', html);
}

function createUrl(baseUrl: string, path: string, params?: any) {
    if (params) {
      path = path + '?' + Object.keys(params).map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
      }).join('&')
    }
    if (path.startsWith('/')) return baseUrl + path;
    return baseUrl + '/' + path;
  }

export class Rest {
  serverURL: string;
  restBaseURL: string;

  constructor(serverUrl: string, restBaseURL: string) {
    this.serverURL = serverUrl;
    this.restBaseURL = restBaseURL;
  }

  getServerUrl() { return this.serverURL; }

  getBaseUrl() { return this.restBaseURL; }

  createRestUrl(path: string, params?: any) {
    return createUrl(this.restBaseURL, path, params);
  }

  createUrl(path: string, params?: any) {
    return createUrl(this.serverURL, path, params);
  }

  get(path: string, params: any, cb: SuccessCallback, failCb?: FailCallback): any {
    let config = createFetchConfig('GET', null);
    let url = this.createRestUrl(path);
    if (params) {
      url = url + '?' + Object.keys(params).map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
      }).join('&')
    }
    this.doFetch(url, config, cb, failCb);
  }

  post(path: string, params: any, cb: SuccessCallback, failCb?: FailCallback): any {
    let config = createFetchConfig('POST', params);
    let url = this.createRestUrl(path);
    this.doFetch(url, config, cb, failCb);
  }

  put(path: string, params: any, cb: SuccessCallback, failCb?: FailCallback): any {
    let config = createFetchConfig('PUT', params);
    let url = this.createRestUrl(path);
    this.doFetch(url, config, cb, failCb);
  }

  delete(path: string, params: any, cb: SuccessCallback, failCb?: FailCallback): any {
    let config = createFetchConfig('DELETE', params);
    let url = this.createRestUrl(path);
    this.doFetch(url, config, cb, failCb);
  }

  formSubmit(path: string, formData: any, cb: SuccessCallback): any {
    let config = {
      method: "POST",
      mode: 'cors',
      credentials: 'include',
      body: formData
    };
    let url = this.createRestUrl(path);
    this.doFetch(url, config, cb);
  }

  doFetch(url: string, config: any, successCallback: SuccessCallback, failCb?: FailCallback): any {
    fetch(url, config).then(function (response: any) {
      return response.json();
    }).then(function (response: RestResponse) {
      if (!response || response.error) {
        if (failCb) {
          failCb(response)
          return;
        }
        handleResponseError(response)
      } else {
        response.data = JSON.parse(response.data);
        successCallback(response);
      }
    });
  }
}
