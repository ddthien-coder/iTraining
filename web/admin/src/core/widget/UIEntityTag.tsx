import React from 'react';
import { widget, app } from 'components'

import { StorageState, ComplexBeanObserver } from 'core/entity'
import {
  WButtonEntityNew, WButtonEntityCommit, WButtonEntityReset, WComplexEntityEditor, WComplexEntityEditorProps,
} from 'core/widget/entity';
import { WToolbar, WComponentProps, WComponent } from 'core/widget'
import { VGridConfigTool, VGridEntityList, VGridEntityListPlugin, WGridEntityListProps } from './vgrid';

import { T } from './Dependency';

import DisplayRecord = widget.grid.model.DisplayRecord;
import VGridContext = widget.grid.VGridContext;
import VGridConfig = widget.grid.VGridConfig;

interface UIEntityTagEditorProps extends WComplexEntityEditorProps {
  label: string;
  commitURL: string;
}
export class UIEntityTagEditor extends WComplexEntityEditor<UIEntityTagEditorProps> {
  render() {
    let { appContext, pageContext, observer, label, commitURL, onPostCommit } = this.props
    let writeCap = this.hasWriteCapability();
    let bean = observer.getMutableBean()
    let { Form, FormGroup } = widget.input;
    let { BBStringField } = widget.input;
    return (
      <div className='flex-vbox'>
        <Form>
          <FormGroup label={T('Name')}>
            <BBStringField bean={bean} field={"name"} disable={!writeCap} />
          </FormGroup>
          <FormGroup label={T('Label')}>
            <BBStringField bean={bean} field={"label"} disable={!writeCap} />
          </FormGroup>
        </Form>
        <WToolbar>
          <WButtonEntityCommit
            appContext={appContext} pageContext={pageContext} readOnly={!writeCap} observer={observer}
            label={T(`{{label}}  {{beanLabel}}`, { label: label, beanLabel: bean.label })}
            commitURL={commitURL} onPostCommit={onPostCommit} />
          <WButtonEntityReset
            appContext={appContext} pageContext={pageContext} readOnly={!writeCap} observer={observer}
            onPostRollback={this.onPostRollback} />
        </WToolbar>
      </div>
    );
  }
}

export class UIEntityTagListPlugin extends VGridEntityListPlugin {
  searchURL: string;

  constructor(searchURL: string) {
    super([]);
    this.searchURL = searchURL;

    this.searchParams = {
      "filters": [
        ...widget.sql.createSearchFilter()
      ],
      "optionFilters": [
        widget.sql.createStorageStateFilter(['ACTIVE', 'ARCHIVED'])
      ],
      "maxReturn": 1000
    }
  }

  loadData(uiList: VGridEntityList<any>): void {
    this.serverSearch(uiList, this.searchURL);
  }
}

interface UIEntityTagListProps extends WGridEntityListProps {
  saveStateURL: string;
  commitURL: string;
}
export class UIEntityTagList extends VGridEntityList<UIEntityTagListProps> {

  createVGridConfig() {
    let { saveStateURL } = this.props;
    let moderatorCap = this.hasModeratorCapability();
    let config: VGridConfig = {
      record: {
        fields: [
          ...VGridConfigTool.FIELD_SELECTOR(this.needSelector()),
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('label', T('Label'), 250, 'fixed-left'),
          { name: 'name', label: T('Name'), width: 300 },
          ...VGridConfigTool.FIELD_ENTITY
        ]
      },
      toolbar: {
        actions: [
          ...VGridConfigTool.TOOLBAR_CHANGE_STORAGE_STATES(saveStateURL, [StorageState.ACTIVE, StorageState.ARCHIVED], !moderatorCap)
        ],
        filters: VGridConfigTool.TOOLBAR_FILTERS(true)
      },
      view: {
        currentViewName: 'table',
        availables: {
          table: {
            viewMode: 'table'
          },
          aggregation: {
            viewMode: 'aggregation',

            createAggregationModel(_ctx: VGridContext) {
              let model = new widget.grid.model.AggregationDisplayModel(T('All'), false);
              return model;
            }
          }
        }
      }
    }
    return config;
  }

  onDefaultSelect(dRecord: DisplayRecord) {
    let { appContext, pageContext, readOnly, commitURL } = this.props;
    let pageCtx = pageContext.createPopupPageContext();
    let type = dRecord.record;
    let onPostCommit = () => {
      this.closePopupPageContext();
      this.loadData();
    };
    let html = (
      <UIEntityTagEditor
        appContext={appContext} pageContext={pageContext} readOnly={readOnly}
        label={'Invoice Tag'} observer={new ComplexBeanObserver(type)}
        commitURL={commitURL} onPostCommit={onPostCommit} />
    );
    widget.layout.showDialog(T('Invoice Tag'), 'sm', html, pageCtx.getDialogContext());
  }
}

interface BBEntityTagSelectorProps extends widget.input.BBMultiLabelSelectorProps {
  appContext: app.AppContext;
  pageContext: app.PageContext;
  searchURL: string;
}
export class BBEntityTagSelector extends widget.input.BBMultiLabelSelector<BBEntityTagSelectorProps> {
  onSelect(tag: any) {
    this.dialogClose();
    if (tag) {
      let { labelBeans } = this.props;
      for (let i = 0; i < labelBeans.length; i++) {
        if (labelBeans[i].name == tag.name) {
          this.forceUpdate();
          return;
        }
      }
      labelBeans.push(tag);
    }
    this.forceUpdate();
  }

  onCustomSelect() {
    let { appContext, pageContext, searchURL } = this.props;
    let ui = (
      <div className="flex-vbox" style={{ height: '500px' }}>
        <UIEntityTagList
          plugin={new UIEntityTagListPlugin(searchURL)}
          appContext={appContext} pageContext={pageContext}
          saveStateURL={''} commitURL={''}
          onSelect={(_appCtx, _pageCtx, tag) => this.onSelect(tag)} />
      </div>
    );
    this.dialogShow(T('Select Invoice Tag'), 'lg', ui);
  }
}

interface UIEntityTagListPageProps extends WComponentProps {
  label: string;
  searchURL: string;
  commitURL: string;
  saveStateURL: string;
}
export class UIEntityTagListPage extends WComponent<UIEntityTagListPageProps> {
  plugin: UIEntityTagListPlugin;

  constructor(props: UIEntityTagListPageProps) {
    super(props);
    this.plugin = new UIEntityTagListPlugin(props.searchURL);
  }

  onNewEntityTag() {
    const { appContext, pageContext, label, commitURL, readOnly } = this.props;
    let pageCtx = this.newPopupPageContext();
    let html = (
      <UIEntityTagEditor
        appContext={appContext} pageContext={pageContext} readOnly={readOnly}
        label={label} observer={new ComplexBeanObserver({})} commitURL={commitURL} />
    );
    widget.layout.showDialog(T('Invoice Tag'), 'sm', html, pageCtx.getDialogContext());
  }

  render() {
    const { appContext, pageContext, label, commitURL, saveStateURL } = this.props;
    let writeCap = this.hasWriteCapability();
    let html = (
      <div className='flex-vbox'>
        <UIEntityTagList
          plugin={this.plugin}
          appContext={appContext} pageContext={pageContext} readOnly={!writeCap}
          commitURL={commitURL} saveStateURL={saveStateURL} />
        <WToolbar>
          <WButtonEntityNew
            appContext={appContext} pageContext={pageContext} hide={!writeCap}
            label={T(`New ${label}`)} onClick={() => this.onNewEntityTag()} />
        </WToolbar>
      </div>
    );
    return html;
  }
}