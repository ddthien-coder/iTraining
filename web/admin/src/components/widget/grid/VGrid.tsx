import React, { Component } from "react";

import { ELEProps, mergeCssClass } from "components/widget/element";
import { fas, FAButton } from "components/widget/fa";
import { VGridContextProps, IVGrid, VGridViewConfig, VGridContext, DynamicView } from "./IVGrid";
import { VGridUtil, VGridConfigUtil } from './util'
import { VGridToolbar } from "./VGridToolbar";
import { DefaultViewModePlugin } from "./view/Plugin";
import { GridView } from "./view/GridView";
import { TableView, TableViewModePlugin } from "./view/TableView";
import { TableAggregationView, TableAggregationViewModePlugin } from "./view/TableAggregationView";
import { TableTreeView } from "./view/TableTreeView";
import { KanbanView } from "./view/KanbanView";
import { CalendarView } from "./view/CalendarView";
import { CustomView } from "./view/CustomView";
import { PrintView } from "./view/ReportView";
import { VGridControlManager } from "./control/VGridControl";

import "./stylesheet.scss";
interface VGridProps extends ELEProps, VGridContextProps {
}

export class VGridViewManager extends Component<VGridProps> {

  onSelectMainView = () => {
    let {context} = this.props ;
    let viewState = VGridConfigUtil.getViewState(context.config);
    viewState.currentDynamicView = null;
    this.forceUpdate();
  }

  onSelectDynamicView(view: DynamicView) {
    let {context} = this.props ;
    let viewState = VGridConfigUtil.getViewState(context.config);
    viewState.currentDynamicView = view;
    this.forceUpdate();
  }

  onRemoveDynamicView(view: DynamicView) {
    let {context} = this.props ;
    let dynamicViews = VGridConfigUtil.getViewState(context.config).dynamics;
    for(let i = 0; i < dynamicViews.length; i++) {
      let selView = dynamicViews[i];
      if(view == selView) {
        dynamicViews.splice(i, 1);
      }
    }
    let viewState = VGridConfigUtil.getViewState(context.config);
    viewState.currentDynamicView = null;
    this.forceUpdate();
  }

  renderMainView(context: VGridContext, currentViewName: string, currView: VGridViewConfig) {
    let model = context.model;
    let viewId = model.lastModifiedList;

    let viewMode = currView.viewMode;
    let viewUI = null;
    let viewState = VGridConfigUtil.getViewState(context.config);
    let currentDynamicView = viewState.currentDynamicView;
    if (currentDynamicView) {
      return <div key={currentDynamicView.name} className='flex-vbox'>{currentDynamicView.ui}</div>;
    }

    if (viewMode == 'grid') {
      viewUI = <GridView key={currentViewName} context={context} viewName={currentViewName} />
    } else if (viewMode == 'aggregation') {
      viewUI = <TableAggregationView key={currentViewName} context={context} viewName={currentViewName} />
    } else if (viewMode == 'tree') {
      viewUI = <TableTreeView key={currentViewName} context={context} viewName={currentViewName} />
    } else if (viewMode == 'kanban') {
      viewUI = <KanbanView key={currentViewName} context={context} viewName={currentViewName} />
    } else if (viewMode == 'calendar') {
      viewUI = <CalendarView key={currentViewName} context={context} viewName={currentViewName} />
    } else if (viewMode == 'custom') {
      viewUI = <CustomView key={currentViewName} context={context} viewName={currentViewName} />
    } else if (viewMode == 'print') {
      viewUI = <PrintView key={currentViewName} context={context} viewName={currentViewName} />
    } else {
      viewUI = <TableView key={currentViewName} context={context} viewName={currentViewName} />
    }

    let footerUI = null;
    let footerConfig = context.config.footer
    if (footerConfig) {
      let sections = [];
      for (let name in footerConfig) {
        let footer = footerConfig[name];
        if (footer.hide) continue;
        sections.push(<div key={name} className='flex-vbox-grow-0'>{footer.render(context)}</div>);
      }
      if (sections.length > 0) {
        footerUI = (<div className='flex-vbox-grow-0 p-1 border-top'>{sections}</div>);
      }
    }

    let html = (
      <div key={viewId} className='flex-vbox pt-1'>
        {viewUI}
        {footerUI}
      </div>
    );
    return html;
  }

  render() {
    let { context } = this.props;

    let { currentViewName } = context.config.view
    let currView = VGridConfigUtil.getView(context.config, currentViewName);
    let viewState = VGridConfigUtil.getViewState(context.config);
    let dynamicViews = viewState.dynamics;
    let currentDynamicView = viewState.currentDynamicView;

    if(dynamicViews.length == 0) {
      return this.renderMainView(context, currentViewName, currView);
    }
    let mainViewLabel = currView.label? currView.label:currentViewName;
    let uiTabBtns = new Array<any>() ;
    uiTabBtns.push(
      <div key={'main'} className={currentDynamicView == null ? 'tab tab-selected': 'tab'}>
        <FAButton color='link' onClick={this.onSelectMainView}>{mainViewLabel}</FAButton>
      </div>
    );
    for(let view of dynamicViews) {
      uiTabBtns.push(
        <div key={view.name} className={view == currentDynamicView ? 'tab tab-selected':'tab'}>
          <FAButton color='link' onClick={() => this.onSelectDynamicView(view)}>{view.label}</FAButton>
          <FAButton color='link' icon={fas.faTrashAlt} onClick={() => this.onRemoveDynamicView(view)} />
        </div>
      );
    }

    let html = (
      <div className='flex-vbox'>
        <div className='v-grid-dynamic-views flex-hbox-grow-0'>{uiTabBtns}</div>
        {this.renderMainView(context, currentViewName, currView)}
      </div>
    );
    return html;
  }
}
export class VGrid extends Component<VGridProps> implements IVGrid {
  constructor(props: VGridProps) {
    super(props);
    let { context } = props;
    context.registerViewModePlugin('default', new DefaultViewModePlugin());
    context.registerViewModePlugins(['table', 'tree'], new TableViewModePlugin());
    context.registerViewModePlugins(['aggregation'], new TableAggregationViewModePlugin());

    context.setVGrid(this);
    VGridUtil.changeView(context, context.config.view.currentViewName);
  }

  getContext() { return this.props.context; }

  addDynamicView(view: DynamicView) {
    let { context } = this.props;
    let viewState = VGridConfigUtil.getViewState(context.config);
    let dynamicViews = viewState.dynamics;
    dynamicViews.push(view);
    viewState.currentDynamicView = view ;
  }

  forceUpdateView(newViewId: boolean = false) {
    if (newViewId) {
      let { context } = this.props;
      let model = context.model;
      model.lastModifiedList = new Date().getTime();
    }
    this.forceUpdate();
  }

  render() {
    let { className, style, context } = this.props;
    let controlUI = null;
    let controlConfig = context.config.control;
    if (controlConfig) {
      if (controlConfig.render) {
        controlUI = controlConfig.render(context);
      } else {
        controlUI = <VGridControlManager context={context} />
      }
    }

    className = mergeCssClass('v-grid', className);
    let html = (
      <div className={className} style={style}>
        {controlUI}
        <div className='flex-vbox'>
          <VGridToolbar context={context} />
          <VGridViewManager context={context} />
        </div>
      </div>
    );
    return html;
  }
}