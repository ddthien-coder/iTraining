import React from "react";
import { widget } from 'components';

import {
  WToolbar
} from 'core/widget/WLayout';
import { StorageState } from "core/entity";

import { VGridEntityList, VGridEntityListEditor, VGridButtonMutilSelect, VGridEntityListType } from "./VGridEntityList";

import fas = widget.fa.fas;

import ENTITY_COLUMNS = widget.grid.ENTITY_COLUMNS;
import DelayEvent = widget.context.DelayEvent;
import EventHandler = widget.context.EventHandler;
import EventButton = widget.context.EventButton;

import createIndex = widget.grid.createIndex;
import createSelector = widget.grid.createSelector;
import DisplayRecord = widget.grid.model.DisplayRecord;
import FieldConfig = widget.grid.FieldConfig;
import VGridFilterConfig = widget.grid.VGridFilterConfig
import VGridActionConfig = widget.grid.VGridActionConfig
import VGridContext = widget.grid.VGridContext;
import FieldContainer = widget.grid.FieldContainer;
import VGridFooterConfig = widget.grid.VGridFooterConfig;

export class VGridConfigTool extends widget.grid.VGridConfigUtil {
  static FIELD_ENTITY = ENTITY_COLUMNS;

  static FIELD_SELECTOR(allow: boolean = true) {
    if (!allow) return [];
    let columns = [
      createSelector("Sel", 35, false)
    ];
    return columns;
  }

  static FIELD_INDEX() { return createIndex("#", 40) }

  static FIELD(remove: boolean, config: FieldConfig) {
    if (remove) return [];
    return [config];
  }

  static FIELD_ON_SELECT(name: string, label: string, width: number, container: FieldContainer = 'fixed-left') {
    let col: FieldConfig = {
      name: name, label: label, width: width, container: container,
      onClick: function (ctx: VGridContext, dRecord: DisplayRecord) {
        let uiRoot = ctx.uiRoot;
        let row = dRecord.row;
        let record = dRecord.record;
        if (uiRoot instanceof VGridEntityListEditor) {
          let editor = uiRoot as VGridEntityListEditor;
          editor.onSelect(row, record);
        } else {
          let wlist = uiRoot as VGridEntityList;
          wlist.onSelect(dRecord);
        }
      }
    }
    return col;
  }

  static FIELD_ON_CLICK(eventDesc: EventHandler, fconfig: FieldConfig, custom?: { label: string }) {
    fconfig.customRender = (ctx: VGridContext, field: FieldConfig, dRecord: DisplayRecord) => {
      let record = dRecord.record;
      let label: string | undefined = custom?.label;
      if (!label) label = record[field.name];

      let requireParam = eventDesc.requireParam;
      let paramName = requireParam ? requireParam[0] : 'record';
      return (
        <EventButton className='w-100 text-left' color='link' label={label} context={ctx}
          event={new DelayEvent(eventDesc).withParam(paramName, record)} />
      );
    };
    return fconfig;
  }

  static TOOLBAR_FILTERS(searchFilter: boolean = false) {
    let filters: Array<VGridFilterConfig> = [
      {
        name: 'filter', hint: 'Filter', icon: fas.faFilter,
        createComponent: function (ctx: VGridContext) { return (<widget.grid.WGridFilter context={ctx} />); }
      }
    ]
    if (searchFilter) {
      let filter = {
        name: 'search', hint: 'Search',
        createComponent: function (ctx: VGridContext) {
          let uiList = ctx.uiRoot as VGridEntityList<any>;
          let plugin = uiList.props.plugin;
          let searchParams = plugin.searchParams;
          return (
            <widget.sql.UISearchParams searchParams={searchParams} onSubmit={(_params) => uiList.reloadData()} />);
        }
      }
      filters.push(filter);
    }
    return filters;
  }

  static TOOLBAR_AUTO_REFRESH(id: string, label: string, refreshPeriod: -1 | 5 | 10 | 30 | 60 | 300 = -1) {
    let filters = [
      {
        name: 'autorefresh', hint: 'Auto Refresh',
        createComponent: function (ctx: VGridContext) {
          let uiList = ctx.uiRoot as VGridEntityList;
          return (
            <div className='flex-hbox'>
              <widget.element.AutoRefreshButton
                color='link' id={id} label={label}
                defaultPeriod={refreshPeriod} onRefresh={() => uiList.reloadData(true)} />
            </div>
          );
        }
      }
    ]
    return filters;
  }

  static TOOLBAR_CHANGE_STORAGE_STATES(
    saveStateURL: string,
    states: Array<StorageState>, readOnly: boolean = false) {

    if (readOnly) return [];
    let actions: Array<VGridActionConfig> = [
      {
        name: 'storage-actions', label: 'Storage Actions', icon: fas.faDatabase,
        supportViewMode: ['table', 'aggregation', 'grid'],
        createComponent: function (ctx: VGridContext) {
          let uiList = ctx.uiRoot as VGridEntityList;
          let actions: Array<widget.element.ButtonActionModel> = [];
          for (let state of states) {
            let action = {
              name: state, label: state, onSelect: function () {
                uiList.changeStorageState(saveStateURL, ctx, state);
              }
            };
            actions.push(action);
          }
          let html = (
            <widget.element.DropdownActionButton
              outline faIcon={fas.faDatabase} hint="Storage Actions" items={actions} />
          )
          return html;
        }
      }
    ];
    return actions;
  };

  static TOOLBAR_ACTION(remove: boolean, action: VGridActionConfig) {
    if (remove) return [];
    return [action];
  }

  static TOOLBAR_ON_ADD(remove: boolean, label?: string) {
    if (remove) return [];
    let hint = 'New';
    if (label) hint = label;
    let actions: Array<VGridActionConfig> = [
      {
        name: "new", label: label, hint: hint, icon: fas.faPlus,
        onClick: (ctx: VGridContext) => {
          let uiRoot = ctx.uiRoot;
          if (uiRoot instanceof VGridEntityListEditor) {
            let uiEditor = uiRoot as VGridEntityListEditor;
            uiEditor.onNewAction();
          } else {
            let uiList = uiRoot as VGridEntityList;
            uiList.onNewAction();
          }
        }
      }
    ];
    return actions;
  }

  static TOOLBAR_ON_DELETE(remove: boolean, label?: string) {
    if (remove) return [];
    let hint = 'Delete';
    if (label) hint = label;
    let actions: Array<VGridActionConfig> = [
      {
        name: "del", label: label, hint: hint, icon: fas.faTrash,
        onClick: (ctx: VGridContext) => {
          let uiRoot = ctx.uiRoot;
          if (uiRoot instanceof VGridEntityListEditor) {
            let uiEditor = uiRoot as VGridEntityListEditor;
            uiEditor.onDeleteAction();
          } else {
            let uiList = uiRoot as VGridEntityList;
            uiList.onDeleteAction();
          }
        }
      }
    ];
    return actions;
  }

  static FOOTER_MULTI_SELECT(label: string, type?: VGridEntityListType) {
    let config: VGridFooterConfig = {
      hide: type !== 'selector',
      render: (ctx: VGridContext) => {
        let wlist = ctx.uiRoot as VGridEntityList;
        let { appContext, pageContext, plugin, onMultiSelect } = wlist.props;
        return (
          <WToolbar>
            <VGridButtonMutilSelect appContext={appContext} pageContext={pageContext} label={label}
              onMultiSelect={onMultiSelect} model={plugin.getListModel()} />
          </WToolbar>
        );
      }
    }
    return config;
  }
}