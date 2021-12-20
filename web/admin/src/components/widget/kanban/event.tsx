import { Component } from 'react';

import { fas } from 'components/widget/fa'
import { Event, EventHandler, WidgetContext } from 'components/widget/context';
import { KanbanContext } from './IKabanBoard';

export const EVT_BOARD_UPDATE: EventHandler = {
  name: 'board:update', label: 'Update', icon: fas.faCog,
  handle: (ctx: WidgetContext, _uiSrc: Component, _event: Event) => {
    let context = ctx as KanbanContext;
    context.getKanbanBoard().forceUpdateView();
  }
}