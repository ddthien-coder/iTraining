import React, { Component } from 'react';

import { fas, FAButton } from 'components/widget/fa';
import { showDialog } from 'components/widget/layout'
import { DelayEvent, EventButton } from 'components/widget/context';

import { GRID_ACTION_HANDLER } from './event';
import { VGridActionConfig, VGridContextProps } from './IVGrid';
import { VGridConfigUtil } from './util';
import { UIVGridDebug } from './UIDebug';
export class VGridToolbar extends Component<VGridContextProps, {}> {
  render() {
    const { context } = this.props;
    let config = context.config
    let html = (
      <div className={`v-grid-toolbar d-flex justify-content-between bg-light border-bottom`}>
        <div className='flex-hbox-grow-0'>
          {this.renderViewControls()}
          <div className='btn-group'>
            {this.renderActions(config.toolbar.actions)}
            <FAButton key='debug' className='btn-action' outline icon={fas.faBug} hint={'Debug'}
              onClick={() => showDialog("VGrid Debug", 'lg', <UIVGridDebug context={context} />)} />
          </div>
        </div>
        <div className="btn-group">
          {this.renderActions(config.toolbar.filterActions)}
          {this.renderFilters()}
        </div>
      </div>
    );
    return html;
  }

  renderActions(actions?: Array<VGridActionConfig>) {
    if (!actions || actions.length == 0) return null;
    const { context } = this.props;
    let config = context.config
    let { currentViewName } = config.view;
    let viewConfig = VGridConfigUtil.getView(config, currentViewName);
    let viewMode = viewConfig.viewMode;
    let actionUIs = [];
    for (let action of actions) {
      if (action.supportViewMode) {
        let support = false;
        for (let selViewMode of action.supportViewMode) {
          if (viewMode == selViewMode) {
            support = true;
            break;
          }
        }
        if (!support) continue;
      }

      if (action.createComponent) {
        let actionUI = (<div key={action.name} className='d-inline-block'>{action.createComponent(context)}</div>)
        actionUIs.push(actionUI);
      } else {
        let hint = action.hint;
        if (!hint) hint = action.label;
        let buttonUI = (
          <EventButton key={action.name} context={context}
            label={action.label} icon={action.icon} outline hint={action.label}
            event={new DelayEvent(GRID_ACTION_HANDLER).withParam('action', action)} />
        );
        actionUIs.push(buttonUI)
      }
    }
    return (<>{actionUIs}</>);
  }

  renderFilters() {
    const { context } = this.props;
    let config = context.config
    let filters = config.toolbar.filters;
    if (!filters || filters.length == 0) return null;
    let definedFilters = filters;
    let filterUIs = [];
    for (let i = 0; i < definedFilters.length; i++) {
      let filter = definedFilters[i];
      let uiLabel = null;
      if (filter.icon || filter.label) {
        uiLabel = (
          <FAButton key={i} color='link' icon={filter.icon} hint={filter.hint} disabled>
            {filter.label}
          </FAButton>
        );
      }
      filterUIs.push(
        <div className='flex-hbox-grow-0' key={filter.name}>
          {uiLabel}
          {filter.createComponent(context)}
        </div>
      );
    }
    return filterUIs;
  }

  renderViewControls() {
    const { context } = this.props;
    let viewBtns = [];
    let viewPluginBtns = null;
    let { availables, currentViewName } = context.config.view;
    for (let viewName in availables) {
      let viewConfig = availables[viewName];
      if (viewConfig.hide) continue;
      let plugin = context.getViewModePlugin(viewConfig.viewMode);
      let viewBtn = (
        <div key={viewName} className='flex-hbox-grow-0'>{plugin.createToolbarViewBtn(context, this, viewConfig, viewName)}</div>
      )
      viewBtns.push(viewBtn);
      if (viewName === currentViewName) {
        viewPluginBtns = plugin.createToolbarViewControl(context, this, viewConfig, viewName);
      }
    }

    return (
      <>
        <div key={'view-btns'} className='btn-group'>{viewBtns}</div>
        <div key={'view-plugin-btns'} className='btn-group'>{viewPluginBtns}</div>
      </>
    );
  }
}