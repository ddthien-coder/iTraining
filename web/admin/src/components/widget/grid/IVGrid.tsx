import { Component, ReactFragment } from 'react';

import { Validator } from 'components/util/validator';
import { Arrays } from 'components/util/Arrays';
import { RecordMap, ListRecordMap } from 'components/util/Collections';
import { FAIconDefinition } from 'components/widget/fa';
import { CalendarConfig } from 'components/widget/calendar/ICalendar';
import { PrintConfig, LoadPrint } from 'components/widget/print';
import { WidgetContext } from '../context';
import { ListModel, AggregationDisplayModel, TreeDisplayModelPlugin } from './model';
import { KanbanBoardConfig } from '../kanban/IKabanBoard';
import { DisplayRecord } from './model/model';
import { VGridConfigUtil } from './util';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export const DEFAULT = {
  column: { width: 150 },
  row: { headerHeight: 30, height: 25 }
}

export type FieldContainer = 'fixed-left' | 'fixed-right' | 'default' | undefined;

export type ViewMode = 'table' | 'aggregation' | 'tree' | 'grid' | 'kanban' | 'calendar' | 'print' | 'custom';
export type ControlViewMode = 'expand' | 'collapse';

export type SortDirection = 'asc' | 'desc' | 'none';

export interface Sorter {
  direction?: SortDirection;
  sort?: (records: Array<any>, direcion?: SortDirection) => Array<any>;
}
export interface VGridActionConfig {
  name: string; label?: string;
  supportViewMode?: Array<ViewMode>;
  icon?: FAIconDefinition;
  hint?: string;
  createComponent?: (ctx: VGridContext) => any;
  onClick?: (ctx: VGridContext) => any;
}

export interface VGridFilterConfig {
  name: string; label?: string;
  icon?: FAIconDefinition;
  hint?: string;
  filterPattern?: string;
  createComponent: (ctx: VGridContext) => any,
}

export interface FieldConfigState {
  init?: boolean;
  visible?: boolean;
  showRecordState?: boolean,
}
export interface FieldConfig {
  container?: FieldContainer;
  name: string; label: string;
  order?: number;
  width?: number;
  removable?: boolean;
  sortable?: boolean;
  resizable?: boolean;
  style?: any,
  cssClass?: string,
  state?: FieldConfigState;
  //visible?: boolean;
  //showRecordState?: boolean,
  editor?: {
    enable?: boolean;
    type: string;
    required?: boolean;
    validators?: Array<Validator>;
    onInputChange?: (
      ctx: VGridContext, record: DisplayRecord, field: FieldConfig, oldVal: any, newVal: any) => void;
  },

  onClick?: (ctx: VGridContext, record: DisplayRecord) => void;
  onKeyDown?: (evt: any, ctx: VGridContext, row: number, record: any) => void;
  format?: (val: any) => any;
  fieldDataGetter?: (record: any) => any;
  customRender?: (ctx: VGridContext, field: FieldConfig, record: DisplayRecord) => any;
  customHeaderRender?: (ctx: VGridContext, field: FieldConfig, style: any) => any;
}

export interface FieldGroup {
  label: string;
  icon?: FAIconDefinition;
  visible?: boolean;
  fields: Array<string>;
}

export interface RecordConfigState {
  selectAll: boolean;
}

export interface RecordConfig {
  sorter?: Sorter;
  fields: Array<FieldConfig>;
  fieldGroups?: Record<string, FieldGroup>;
  editor?: {
    supportViewMode: Array<ViewMode>;
  },
  state?: RecordConfigState;
}

export interface VGridViewConfig {
  viewMode: ViewMode;
  label?: string;
  icon?: FAIconDefinition;
  hide?: boolean;
}

export interface VGridTableViewConfig extends VGridViewConfig {
  headerCellHeight?: number;
  dataCellHeight?: number;
  header?: {
  };
  footer?: {
    createRecords: (ctx: VGridContext) => Array<any>;
    customRender: (ctx: VGridContext, field: FieldConfig, record: DisplayRecord) => any,
  };
}

export interface VGridGridViewConfig extends VGridViewConfig {
  column?: number,
  rowHeight?: number,
  renderRecord: (ctx: VGridContext, dRecord: DisplayRecord) => any,
}

export interface VGridKabanViewConfig extends VGridViewConfig {
  board: KanbanBoardConfig
}

export interface VGridCalendarViewConfig extends VGridViewConfig {
  config: CalendarConfig;
}

export interface VGridAggregationViewConfig extends VGridViewConfig {
  treeWidth?: number;
  createAggregationModel(ctx: VGridContext): AggregationDisplayModel
}

export interface VGridPrintViewConfig extends VGridViewConfig {
  currentPrintName: string;
  prints: Array<PrintConfig>;
  loadPrint?: LoadPrint;
  render?: (ctx: VGridContext, viewConfig: VGridPrintViewConfig) => ReactFragment,
}

export interface VGridCustomViewConfig extends VGridViewConfig {
  render: (ctx: VGridContext) => any,
}

export interface VGridTreeViewConfig extends VGridViewConfig {
  treeField: string,
  plugin: TreeDisplayModelPlugin;
}

export type VGridViewConfigOption =
  VGridTableViewConfig | VGridGridViewConfig | VGridAggregationViewConfig |
  VGridKabanViewConfig | VGridCalendarViewConfig | VGridCustomViewConfig |
  VGridTreeViewConfig | VGridPrintViewConfig;

export interface DynamicView {
  name: string;
  label: string;
  icon?: IconDefinition;
  ui: any;
}
export interface VGridToolbar {
  actions?: Array<VGridActionConfig>;
  filters?: Array<VGridFilterConfig>;
  filterActions?: Array<VGridActionConfig>;
}

export interface VGridControlSectionConfig {
  name: string;
  label?: string;
  icon?: FAIconDefinition;

  render: (ctx: VGridContext, mode: 'expand' | 'collapse') => ReactFragment;
}

export interface VGridControlConfigState {
  width: number;
  collapse: boolean;
}
export interface VGridControlConfig {
  width?: number;
  label?: string;
  collapse?: boolean;
  state?: VGridControlConfigState;

  sections?: Array<VGridControlSectionConfig>;

  render?: (ctx: VGridContext) => ReactFragment;
}

export interface VGridFooterConfig {
  hide?: boolean;
  render: (ctx: VGridContext) => ReactFragment;
}

export interface VGridConfig {
  title?: string;
  toolbar: VGridToolbar;
  control?: VGridControlConfig;
  footer?: Record<string, VGridFooterConfig>;
  record: RecordConfig;

  view: {
    currentViewName: string;
    availables: Record<string, VGridViewConfigOption>;
    state?: {
      currentDynamicView: DynamicView|null;
      dynamics: Array<DynamicView>
    }
  },

}

export class RecordConfigModel {
  config: RecordConfig;
  allFields: Array<FieldConfig>;
  fieldMap = new RecordMap<FieldConfig>();
  visibleFieldContainerpMap = new ListRecordMap<FieldConfig>();

  constructor(config: RecordConfig) {
    this.config = config;
    this.allFields = this.config.fields;
    for (let i = 0; i < this.allFields.length; i++) {
      let field = this.allFields[i];
      field.order = i;
      let fieldState = VGridConfigUtil.getFieldConfigState(field);
      if (!field.container) field.container = 'default';
      this.fieldMap.put(field.name, field);
      if (fieldState.visible) {
        this.visibleFieldContainerpMap.put(field.container, field);
      }
    }
  }

  getField(name: string) {
    let field = this.fieldMap.get(name);
    if (!field) throw new Error(`Field ${name} is not found!`);
    return field;
  }

  getVisibleContainerFields(container: FieldContainer): Array<FieldConfig> {
    return this.visibleFieldContainerpMap.createOrGetList(`${container}`);
  }

  toggleVisibleField(fieldName: string) {
    let field = this.getField(fieldName);
    let fieldState = VGridConfigUtil.getFieldConfigState(field);
    this.setVisibleField(fieldName, !fieldState.visible);
  }

  setVisibleField(fieldName: string, visible: boolean) {
    let field = this.getField(fieldName);
    let fieldState = VGridConfigUtil.getFieldConfigState(field);
    let fieldVisible = fieldState.visible;
    if (fieldVisible === visible) return;
    let visibleFields = this.getVisibleContainerFields(field.container);
    if (fieldState.visible) {
      for (let i = 0; i < visibleFields.length; i++) {
        let field = visibleFields[i];
        if (field.name == fieldName) {
          visibleFields.splice(i, 1);
          fieldState.visible = false;
          break;
        }
      }
    } else {
      fieldState.visible = true;
      this._addFieldTo(visibleFields, field);
    }
  }

  _addFieldTo(fields: Array<FieldConfig>, field: FieldConfig) {
    let added = false;
    for (let i = 0; i < fields.length; i++) {
      let selField = fields[i];
      let order = field.order ? field.order : 0;
      let selOrder = selField.order ? selField.order : 0;
      if (order < selOrder) {
        added = true;
        fields.splice(i, 0, field);
        break;
      }
    }
    if (!added) fields.push(field);
  }

  changeFieldGroup(fieldName: string, group: FieldContainer) {
    let field = this.getField(fieldName);
    let oldGroup = field.container ? field.container : 'default';
    let groupList = this.visibleFieldContainerpMap.createOrGetList(oldGroup);
    Arrays.removeFrom(groupList, field);
    field.container = group;
    let newGroupList = this.visibleFieldContainerpMap.createOrGetList(`${group}`);
    this._addFieldTo(newGroupList, field);
  }

  getVisibleColumn(group: FieldContainer, index: number) {
    let fields = this.getVisibleContainerFields(group);
    let field = fields[index];
    return field;
  }

  getVisibleColumnWidth(group: FieldContainer, index: number) {
    let fields = this.visibleFieldContainerpMap.createOrGetList(`${group}`);
    let field = fields[index];
    return field.width ? field.width : DEFAULT.column.width;
  }

  getVisibleColumnCount(group: FieldContainer = 'default') {
    let columns = this.visibleFieldContainerpMap.createOrGetList(group);
    if (!columns) return -1;
    return columns.length;
  }

  getVisibleGridWidth(group: FieldContainer = 'default') {
    let fields = this.visibleFieldContainerpMap.createOrGetList(group);
    let totalWidth = 0;
    for (let field of fields) {
      totalWidth += field.width ? field.width : DEFAULT.column.width;
    }
    return totalWidth;
  }
}

export interface IViewModePlugin {
  createToolbarViewBtn: (
    ctx: VGridContext, uiSrc: Component, viewConfig: VGridViewConfig, viewName: string) => ReactFragment;

  createToolbarViewControl: (
    ctx: VGridContext, uiSrc: Component, viewConfig: VGridViewConfig, viewName: string) => ReactFragment | null;
}

export class VGridConfigModel {
  recordConfigModel: RecordConfigModel;

  constructor(config: VGridConfig) {
    this.recordConfigModel = new RecordConfigModel(config.record);
  }

  getRecordConfigModel() { return this.recordConfigModel; }
}

export class VGridContext extends WidgetContext {
  vgrid?: IVGrid;
  config: VGridConfig;
  model: ListModel;
  viewModePlugins: Record<string, IViewModePlugin> = {};

  configModel: VGridConfigModel;

  constructor(owner: Component, config: VGridConfig, model: ListModel) {
    super(owner);
    this.setConfig(config);
    this.model = model;
  }

  getConfigModel() { return this.configModel; }

  getVGrid() {
    if (!this.vgrid) throw new Error('vgrid is not set');
    return this.vgrid;
  }

  setConfig(config: VGridConfig) {
    this.config = config;
    this.configModel = new VGridConfigModel(config);
  }

  setVGrid(vgrid: IVGrid) { this.vgrid = vgrid; }

  getViewModePlugin(viewMode: ViewMode, useDefault: boolean = true) {
    let key = `${viewMode}`;
    if (this.viewModePlugins[key]) return this.viewModePlugins[key];
    if (useDefault) {
      let plugin = this.viewModePlugins['default'];
      if (plugin) return plugin;
    }
    throw new Error(`No View Mode Plugin for ${viewMode}`);
  }

  registerViewModePlugin(name: string, plugin: IViewModePlugin, override: boolean = false) {
    if (this.viewModePlugins[name] && !override) return;
    this.viewModePlugins[name] = plugin;
  }

  registerViewModePlugins(viewModes: Array<ViewMode>, plugin: IViewModePlugin, override: boolean = false) {
    for (let viewMode of viewModes) {
      let key = `${viewMode}`;
      if (this.viewModePlugins[key] && !override) return;
      this.viewModePlugins[key] = plugin;
    }
  }
}

export interface VGridContextProps {
  context: VGridContext
}

export interface VGridViewProps extends VGridContextProps {
  viewName: string;
}
export interface IVGrid {
  getContext: () => VGridContext;
  addDynamicView: (view: DynamicView) => void;
  forceUpdateView: (newId?: boolean) => void;
}