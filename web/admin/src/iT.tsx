import React from 'react';

import * as core  from './core'
import * as module from './module'
import * as app from './app'

export { core, module, app }

console.log('-----------------------------------');
console.log('load webapp');
if(!React['id']) {
  React['id'] = 'webapp'
}
console.log('React id ' + React['id']);
console.log('-----------------------------------');
