import React, { Component } from 'react';
import { widget } from 'components'

import {
  WToolbar, WButtonEntityNew, WComponent
} from 'core/widget';
import { ComplexBeanObserver } from 'core/entity'
import { VGridConfigTool, VGridEntityList, VGridEntityListPlugin, WGridEntityListProps } from 'core/widget/vgrid';

import { T, CompanyRestURL } from './Dependency';
import { UICompanyEditor, UINewCompanyEditor } from './UICompany';

import DisplayRecord = widget.grid.model.DisplayRecord;
import VGridConfig = widget.grid.VGridConfig;
import VGridContext = widget.grid.VGridContext;
import VGridContextProps = widget.grid.VGridContextProps;
import TreeDisplayModelPlugin = widget.grid.model.TreeDisplayModelPlugin;
export class UICompanyListPlugin extends VGridEntityListPlugin {
  constructor() {
    super([]);

    this.searchParams = {
      "filters": [
        ...widget.sql.createSearchFilter(),
      ],
      "orderBy": {
        fields: ["label", "code", "modifiedTime"],
        fieldLabels: [T("Label"), T('Code'), T("Modified Time")],
        selectFields: ["label"],
        sort: "ASC"
      },
      "maxReturn": 1000
    }
  }
  loadData(uiList: VGridEntityList<any>) {
    this.serverSearch(uiList, CompanyRestURL.company.search);
  }
}

export class UICompanyList extends VGridEntityList<WGridEntityListProps>{
  createVGridConfig() {

    let { type } = this.props;
    let config: VGridConfig = {
      record: {
        fields: [
          // ...VGridConfigTool.FIELD_SELECTOR(this.needSelector()),
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('label', T('Label'), 200),

          { name: 'code', label: T('Code'), width: 150 },
          { name: 'fullName', label: T('FullName'), width: 150 },
          { name: 'description', label: T('Description'), width: 300 },
          { name: 'id', label: T('Company Id'), state: { visible: false } },
          ...VGridConfigTool.FIELD_ENTITY
        ]
      },
      toolbar: {
        actions: [
        ],
        filters: VGridConfigTool.TOOLBAR_FILTERS(true)
      },

      footer: {
        page: {
          hide: type !== 'page',
          render: (ctx: VGridContext) => {
            return (<UICompanyListPageControl context={ctx} />);
          }
        },
      },

      view: {
        currentViewName: 'tree',
        availables: {
          tree: {
            viewMode: 'tree',
            treeField: 'label',
            plugin: new TreeDisplayModelPlugin()
          },
          aggregation: {
            viewMode: 'aggregation',
            createAggregationModel(_ctx: VGridContext) {
              let model = new widget.grid.model.AggregationDisplayModel(T('All'), false);
              return model;
            }
          }
        },
      },
    }
    return config;
  }

  onDefaultSelect(dbRecord: DisplayRecord) {
    let bean = dbRecord.record;
    let { appContext, pageContext, readOnly } = this.props;
    let popupPageCtx = pageContext.createPopupPageContext();
    let onPostCommit = (_entity: any, _uiEditor?: WComponent) => {
      popupPageCtx.onBack();
      this.reloadData();
    };
    let html = (
      <UICompanyEditor
        appContext={appContext} pageContext={popupPageCtx} readOnly={readOnly}
        observer={new ComplexBeanObserver(bean)}
        onPostCommit={onPostCommit} />
    );
    widget.layout.showDialog(T('Company'), 'lg', html, popupPageCtx.getDialogContext());
  }
}

class UICompanyListPageControl extends Component<VGridContextProps> {

  onNew() {
    let { context } = this.props;
    let uiRoot = context.uiRoot as VGridEntityList;
    let { appContext, pageContext } = uiRoot.props;
    let popupPagecontext = pageContext.createPopupPageContext();
    let onPostCommit = (_entity: any, _uiEditor?: WComponent) => {
      popupPagecontext.onBack();
      uiRoot.reloadData();
    }
    let html = (
      <UINewCompanyEditor
        appContext={appContext} pageContext={popupPagecontext}
        observer={new ComplexBeanObserver({})} onPostCommit={onPostCommit} />
    );
    widget.layout.showDialog(T('New Company'), 'md', html, popupPagecontext.getDialogContext());
  }

  render() {
    let { context } = this.props;
    let uiRoot = context.uiRoot as WComponent;
    let writeCap = uiRoot.hasWriteCapability();
    let { appContext, pageContext } = uiRoot.props;
    let html = (
      <WToolbar>
        <WButtonEntityNew
          appContext={appContext} pageContext={pageContext} hide={!writeCap}
          label={T('New Company')} onClick={() => this.onNew()} />
      </WToolbar>
    );
    return html;
  }
}