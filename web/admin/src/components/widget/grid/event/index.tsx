import { Component } from 'react';
import { Event, EventHandler } from 'components/widget/context';
import { fas } from 'components/widget/fa'
import { WidgetContext } from 'components/widget/context'

import {
  VGridActionConfig, VGridContext
} from '../IVGrid'
import { VGridUtil } from '../util'

export const RECORD_TOGGLE_FIELD_HANDLER: EventHandler = {
  name: 'record:field:toggle', label: 'Field Toggle', icon: fas.faCog,
  handle: (ctx: WidgetContext, _uiSrc: Component, event: Event) => {
    let context = ctx as VGridContext;
    let field = event.param('field');
    context.getConfigModel().getRecordConfigModel().toggleVisibleField(field);
    context.getVGrid().forceUpdateView(true);
  }
}

export const RECORD_FIELD_CHANGE_GROUP_HANDLER: EventHandler = {
  name: 'record:field:change:group', label: 'Field Group', icon: fas.faCog,
  handle: (ctx: WidgetContext, _uiSrc: Component, event: Event) => {
    let context = ctx as VGridContext;
    let field = event.param('field');
    let group = event.param('group');
    context.getConfigModel().getRecordConfigModel().changeFieldGroup(field, group);
    context.getVGrid().forceUpdateView(true);
  }

}

export const RECORD_FILTER_HANDLER: EventHandler = {
  name: 'record:filter', label: 'Filter', icon: fas.faFilter,
  handle: (ctx: WidgetContext, _uiSrc: Component, event: Event) => {
    let context = ctx as VGridContext;
    let pattern = event.getParam('pattern');
    context.model.getRecordFilter().withPattern(pattern);
    context.model.filter();
    context.getVGrid().forceUpdateView();
  }
}

export const RECORD_ADD_HANDLER: EventHandler = {
  name: 'record:add', label: 'Add', icon: fas.faPlus,
  handle: (ctx: WidgetContext, _uiSrc: Component, event: Event) => {
    let context = ctx as VGridContext;
    let records: Array<any> = event.param('records');
    context.model.addRecords(records);
    context.getVGrid().forceUpdateView();
  }
}

export const RECORD_DEL_ROWS_HANDLER: EventHandler = {
  name: 'record:del:rows', label: 'Delete Rows', icon: fas.faTrashAlt,
  handle: (ctx: WidgetContext, _uiSrc: Component, event: Event) => {
    let context = ctx as VGridContext;
    let rows = event.param('rows');
    context.model.removeDisplayRecords(rows);
    context.getVGrid().forceUpdateView(true);
  }
}

export const RECORD_DEL_SELECTED_HANDLER: EventHandler = {
  name: 'record:del:selected', label: 'Delete Rows', icon: fas.faTrashAlt,
  handle: (ctx: WidgetContext, _uiSrc: Component, _event: Event) => {
    let context = ctx as VGridContext;
    context.model.removeSelectedDisplayRecords();
    context.getVGrid().forceUpdateView(true);
  }
}

export const GRID_ACTION_HANDLER: EventHandler = {
  name: 'grid:action', label: 'Grid Action', icon: fas.faCog,
  handle: (ctx: WidgetContext, _uiSrc: Component, event: Event) => {
    let context = ctx as VGridContext;
    let action: VGridActionConfig = event.param('action');
    if (action.onClick) {
      action.onClick(context);
      context.getVGrid().forceUpdateView();
    }
  }
}

export const GRID_CHANGE_VIEW_HANDLER: EventHandler = {
  name: 'grid:view:name', label: 'View Name', icon: fas.faCog,
  handle: (ctx: WidgetContext, _uiSrc: Component, event: Event) => {
    let context = ctx as VGridContext;
    let viewName = event.param('viewName');
    VGridUtil.changeView(context, viewName);
    context.getVGrid().forceUpdateView(true);
  }
}