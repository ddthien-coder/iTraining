import {
  DisplayRecordList, TreeDisplayModel
} from './model'
import {
  ViewMode, VGridConfig, VGridAggregationViewConfig, VGridTreeViewConfig,
  VGridContext,
  VGridControlConfigState,
  DynamicView,
} from './IVGrid'
import { RecordConfigState, FieldConfig, FieldConfigState } from './IVGrid';
export class VGridConfigUtil {
  static getFieldConfigState(fconfig: FieldConfig): FieldConfigState {
    let state: FieldConfigState | undefined = fconfig.state;
    if (!state) {
      state = { visible: true };
      fconfig.state = state;
    }
    if (!state.init) {
      if (state.visible === undefined) state.visible = true;
      state.init = true;
    }
    return state;
  }

  static getRecordConfigState(config: VGridConfig): RecordConfigState {
    let state: RecordConfigState | undefined = config.record.state;
    if (!state) {
      state = { selectAll: false };
      config.record.state = state;
    }
    return state;
  }

  static hasView(config: VGridConfig, name: string) {
    let availables = config.view.availables;
    return availables[name] ? true : false;
  }

  static getView(config: VGridConfig, name: string) {
    let availables = config.view.availables;
    let view = availables[name];
    if (view) return view;
    throw new Error(`Cannot find the view ${name}`)
  }

  static getCurrentView(config: VGridConfig) {
    let { availables, currentViewName } = config.view;
    let view = availables[currentViewName];
    if (view) return view;
    throw new Error(`Cannot find the view ${currentViewName}`)
  }

  static getViewState(config: VGridConfig) {
    let state = config.view.state;
    if(!state) {
      state = {dynamics: new Array<DynamicView>(), currentDynamicView: null };
      config.view.state = state;
    }
    return state;
  }

  static isInViewModes(viewModes: Array<ViewMode>, viewMode: ViewMode) {
    for (let sel of viewModes) {
      if (sel === viewMode) return true;
    }
    return false;
  }

  static getControl(config: VGridConfig) {
    if (config.control) return config.control;
    throw new Error(`Cannot find the control`);
  }

  static getControlState(config: VGridConfig) {
    let control = VGridConfigUtil.getControl(config);
    let state: VGridControlConfigState | undefined = control.state;
    if (!state) {
      let width = control.width ? control.width : 200;
      state = { width: width, collapse: false };
      control.state = state;
    }
    return state;
  }
}

export class VGridUtil {
  static changeView(ctx: VGridContext, viewName: string) {
    let viewConfig = VGridConfigUtil.getView(ctx.config, viewName);
    if ('aggregation' == viewConfig.viewMode) {
      let aggView = viewConfig as VGridAggregationViewConfig;
      let aggDisplayModel = aggView.createAggregationModel(ctx);
      ctx.model.setDisplayRecordList(aggDisplayModel);
    } else if ('tree' == viewConfig.viewMode) {
      let treeView = viewConfig as VGridTreeViewConfig;
      let treeDisplayModel = new TreeDisplayModel(treeView.plugin);
      ctx.model.setDisplayRecordList(treeDisplayModel);
    } else {
      ctx.model.setDisplayRecordList(new DisplayRecordList());
    }
    ctx.config.view.currentViewName = viewName;
    let viewState = VGridConfigUtil.getViewState(ctx.config);
    viewState.currentDynamicView = null;
  }

  static resizeField(ctx: VGridContext, field: FieldConfig, deltaSize: number) {
    let width = field.width ? field.width : 150;
    let newWidth = width + deltaSize;
    if (newWidth < 100) newWidth = 100;
    field.width = newWidth;
    ctx.getVGrid().forceUpdateView(true);
  }
}