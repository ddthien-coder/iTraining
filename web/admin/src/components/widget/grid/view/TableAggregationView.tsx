import React, { Component, ReactFragment } from 'react';
import { UncontrolledPopover, PopoverBody, PopoverHeader } from 'reactstrap'

import { IDTracker } from 'components/util/common';
import { formater } from "components/util/text";
import { fas, FAButton } from "components/widget/fa";
import { WCheckboxInput } from 'components/widget/input';

import { AggregationDisplayModel, Aggregation, IAggregationFunction } from '../model/AggregationModel';
import { VGridContext, VGridViewConfig } from "../IVGrid";
import type { FieldContainer, VGridViewProps, VGridAggregationViewConfig, FieldConfig } from "../IVGrid";

import { VGridConfigUtil } from "../util";
import { TableViewModel } from "./TableViewModel";
import { HeaderCell } from "./HeaderCell";
import { DataCell } from "./DataCell";
import { DefaultViewModePlugin, FieldControl, RecordEditorControl } from "./Plugin";
import { TableView } from "./TableView";

class TableAggregationViewModel extends TableViewModel {
  treeWidth = 0;

  constructor(context: VGridContext, viewName: string) {
    super(context, viewName);
    let aggViewConfig = VGridConfigUtil.getView(context.config, viewName) as VGridAggregationViewConfig;
    let width = aggViewConfig.treeWidth;
    this.treeWidth = width ? width : 200;
  }

  initRender() {
    let displayRecordList = this.context.model.getDisplayRecordList();
    this._initRender(displayRecordList.getDisplayRecords());
  }

  onToggleBucket(bucket: any) {
    bucket.collapse = !bucket.collapse;
    this.context.model.getDisplayRecordList().updateDisplayRecords();
    this.context.getVGrid().forceUpdateView();
  }

  getGridWidth(group: FieldContainer = 'default') {
    let width = this.context.getConfigModel().getRecordConfigModel().getVisibleGridWidth(group);
    if (group == 'fixed-left') {
      width += this.treeWidth;
    }
    return width;
  }

  getColumnCount(group: FieldContainer = 'default') {
    let count = this.context.getConfigModel().getRecordConfigModel().getVisibleColumnCount(group);
    if (group == 'fixed-left') count += 1;
    return count;
  }

  getColumnWidth(group: FieldContainer, colIndex: number) {
    if (group == 'fixed-left') {
      if (colIndex == 0) return this.treeWidth;
      colIndex -= 1;
    }
    return this.context.getConfigModel().getRecordConfigModel().getVisibleColumnWidth(group, colIndex);
  }

  createHeaderCell(group: FieldContainer, col: number, style: any) {
    if (group == 'fixed-left') {
      if (col == 0) {
        return <div className={`cell cell-header`} style={style}>Buckets</div>
      }
      col -= 1;
    }
    let field = this.context.getConfigModel().getRecordConfigModel().getVisibleColumn(group, col);
     if (field.customHeaderRender) {
      return field.customHeaderRender(this.context, field, style);
    }
    return <HeaderCell context={this.context} field={field} style={style} />;
  }

  createDataCell(group: FieldContainer, style: any, row: number, col: number) {
    let dRecord = this.getRecord(row);
    if (group == 'fixed-left') {
      if (col == 0) {
        if (dRecord.type == 'bucket') {
          let bucket: any = dRecord.model;
          let labelUI = (<span>{formater.truncate(bucket.label, 30)}</span>);
          let icon = fas.faCaretDown;
          if (bucket.collapse) icon = fas.faCaretRight;
          if (bucket.aggregation && bucket.aggregation.onClick) {
            let onClick = bucket.aggregation.onClick;
            labelUI = (
              <FAButton color='link' onClick={() => onClick(bucket)} title={bucket.label}>
                {formater.truncate(bucket.label, 30)}
              </FAButton>
            );
          }
          let customStyle = { ...style, paddingLeft: dRecord.indentLevel * 15 };
          return (
            <div key={row} className={`cell cell-tree`} style={customStyle} >
              <FAButton color='link' icon={icon} onClick={() => this.onToggleBucket(bucket)} />
              <strong>{labelUI}</strong>
              <span>[{bucket.getNumOfRecords()}]</span>
            </div>
          );
        } else if (dRecord.type == 'agg') {
          let aggRecord: any = dRecord.record;
          let customStyle = { ...style, paddingLeft: dRecord.indentLevel * 15 + 15 };
          return <div className={`cell cell-tree`} style={customStyle}>{aggRecord.aggLabel}</div>
        }
        return <div className={`cell cell-tree`} style={style} />
      }
      col -= 1;
    }

    let field = this.context.getConfigModel().getRecordConfigModel().getVisibleColumn(group, col);
    if (field.name == '_index') {
      return this._createEmptyDataCell(field, style, row, col);
    }
    if (dRecord.type == 'data' || dRecord.type == 'agg') {
      return (<DataCell style={style} context={this.context} field={field} record={dRecord} col={col} />);
    }
    return this._createEmptyDataCell(field, style, row, col);
  }

  createFooterDataCell(group: FieldContainer, style: any, row: number, col: number) {
    if (group == 'fixed-left') {
      if (col == 0) {
        return <div className={`cell`} style={style}></div>
      }
      col -= 1;
    }
    return super.createFooterDataCell(group, style, row, col);
  }

  _createEmptyDataCell(_field: FieldConfig, style: any, row: number, col: number) {
    let cssRow = row % 2 ? 'odd' : 'even';
    let cssCol = col % 2 ? 'odd' : 'even';
    let className = `cell cell-${cssRow}-${cssCol}`;
    let html = (<div className={className} style={style} />);
    return html;
  }
}
export class TableAggregationView extends TableView {
  /**@override */
  createViewModel(props: VGridViewProps) {
    let { context, viewName } = props;
    return new TableAggregationViewModel(context, viewName);
  }
}

class AggregationControl extends Component<VGridViewProps> {
  viewId = `cols-${IDTracker.next()}`;

  onToggleAggregation = (agg: Aggregation) => {
    const { context } = this.props;
    agg.active = !agg.active;
    let aggModel = context.model.getDisplayRecordList() as AggregationDisplayModel;
    aggModel.runAggregation();
    context.getVGrid().forceUpdateView();
  }

  onMoveAggregation = (agg: Aggregation, up: boolean) => {
    const { context } = this.props;
    let aggModel = context.model.getDisplayRecordList() as AggregationDisplayModel;
    aggModel.moveAggregation(agg, up);
    aggModel.runAggregation();
    context.getVGrid().forceUpdateView();
  }

  onToggleFunction = (func: IAggregationFunction) => {
    const { context } = this.props;
    func.enable = !func.enable;
    let aggModel = context.model.getDisplayRecordList() as AggregationDisplayModel;
    aggModel.runAggregation();
    context.getVGrid().forceUpdateView();
  }

  renderAggregationOptions() {
    const { context } = this.props;
    let model = context.model.getDisplayRecordList() as AggregationDisplayModel;
    let aggregations = model.aggregations;
    let fieldsUI = [];
    fieldsUI.push(
      <div key={'header'} className='flex-hbox p-1 align-items-center border-bottom'>
        <div style={{ width: 200 }}>Aggregations</div>
        <div>Funtions</div>
      </div>
    )
    for (let i = 0; i < aggregations.length; i++) {
      let agg = aggregations[i];
      let indent = i * 10 + 5;
      fieldsUI.push(
        <div key={agg.name} className='flex-hbox p-1 align-items-center border-bottom'>
          <div className='px-1 flex-hbox-grow-0 align-items-center' style={{ width: 200 }}>
            <FAButton color='link' icon={fas.faArrowDown} onClick={() => this.onMoveAggregation(agg, false)} />
            <FAButton color='link' icon={fas.faArrowUp} onClick={() => this.onMoveAggregation(agg, true)} />
            <WCheckboxInput label="" name={agg.field} checked={agg.active}
              onInputChange={(_checked) => this.onToggleAggregation(agg)} />
            <em style={{ paddingLeft: indent }}>{agg.name}</em>
          </div>

          <div>{this.renderAggFunction(agg)}</div>
        </div>
      );
    }
    return fieldsUI;
  }

  renderAggFunction(agg: Aggregation) {
    let funcsUI = [];
    for (let func of agg.aggFunctions) {
      funcsUI.push(
        <WCheckboxInput key={func.name} className='px-1' style={{ width: 75 }}
          label={func.name} name={agg.field} checked={func.enable}
          onInputChange={(_checked) => this.onToggleFunction(func)} />
      );
    }
    return (<div className='flex-hbox align-items-center'>{funcsUI}</div>)
  }

  render() {
    let html = (
      <>
        <FAButton id={this.viewId} className='btn-action' outline icon={fas.faCaretDown}>Aggregations</FAButton>
        <UncontrolledPopover trigger='legacy' popperClassName='popover-z50' placement="bottom" target={this.viewId}>
          <PopoverHeader>Aggregations Control</PopoverHeader>
          <PopoverBody className='p-1'>
            {this.renderAggregationOptions()}
          </PopoverBody>
        </UncontrolledPopover>
      </>
    );
    return html;
  }
}

export class TableAggregationViewModePlugin extends DefaultViewModePlugin {
  createToolbarViewControl(
    ctx: VGridContext, _uiSrc: Component, _viewConfig: VGridViewConfig, viewName: string): ReactFragment {
    return (
      <>
        <FieldControl key='record-field-control' context={ctx} viewName={viewName} />
        <RecordEditorControl key='record-editor-control' context={ctx} viewName={viewName} />
        <AggregationControl key='aggregation-control' context={ctx} viewName={viewName} />
      </>
    );
  }
}