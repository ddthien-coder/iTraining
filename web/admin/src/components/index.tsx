import React from 'react';
import ReactDOM from 'react-dom';

import { i18n } from './i18n'
import * as reactstrap from 'reactstrap';

import * as util from './util/index'
import * as server from './server/index'
import * as widget from './widget/index'
import * as app from './app'
import * as sample from './sample/index'

export { storage } from './storage'
export { i18n, util, widget, server, app, reactstrap, sample, React, ReactDOM }

console.log('-----------------------------------');
console.log('load component');
if(!React['id']) {
  React['id'] = 'component'
}
console.log('React id ' + React['id']);
console.log('-----------------------------------');