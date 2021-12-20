import React, { Component } from "react";
import { VariableSizeGrid } from "react-window";
import { VGridViewProps, VGridGridViewConfig } from "../IVGrid";
import { VGridConfigUtil } from "../util";

import { TableViewModel } from "./TableViewModel";

type CellParam = { columnIndex: number, rowIndex: number, style: any };
export interface VGridGridViewState {
  init: boolean;
  width: number;
  height: number;
  cellHeight: number;
}
export class GridView extends Component<VGridViewProps, VGridGridViewState> {
  state: VGridGridViewState = { init: false, width: 0, height: 0, cellHeight: 0 };
  divElement: HTMLElement | null = null;
  viewModel: TableViewModel;
  viewConfig: VGridGridViewConfig;

  constructor(props: VGridViewProps) {
    super(props);
    let { context, viewName } = props;
    this.viewModel = new TableViewModel(context, viewName);
    this.viewConfig = VGridConfigUtil.getView(context.config, viewName) as VGridGridViewConfig;
  }

  componentDidMount() {
    if (this.divElement) {
      let height = this.divElement.clientHeight - 5;
      let width = this.divElement.clientWidth;
      let cellHeight = this.viewConfig.rowHeight ? this.viewConfig.rowHeight : 100;
      this.setState({ init: true, height: height, width: width, cellHeight: cellHeight });
    }
  }

  dataCellHeight = (_index: number) => { return this.state.cellHeight; }

  onScroll = (_param: { scrollTop: number, scrollLeft: number, scrollUpdateWasRequested: any }) => {
  }

  RowData = (param: CellParam) => {
    let { context } = this.props;
    let displayRecords = this.viewModel.getRecords();
    let rowIndex = param.rowIndex;
    let maxCell = this.viewConfig.column ? this.viewConfig.column : 4;
    let cellWidt = 100 / maxCell;
    let start = rowIndex * maxCell;
    let limit = start + maxCell;
    if (displayRecords.length < limit) limit = displayRecords.length;
    let cells = [];
    let colWidth = `${cellWidt}%`;
    for (let i = start; i < limit; i++) {
      let dRecord = displayRecords[i];
      cells.push(
        <div key={i} className='flex-vbox'
          style={{ minWidth: colWidth, maxWidth: colWidth, padding: 2, overflow: 'auto' }}>
          {this.viewConfig.renderRecord(context, dRecord)}
        </div>
      );
    }
    let html = (<div className={`flex-hbox`} style={param.style}> {cells} </div>);
    return html;
  };

  render() {
    if (!this.state.init) {
      return (<div className='flex-vbox' ref={(ele) => { this.divElement = ele }}>Loading...</div>)
    }
    this.viewModel.initRender();
    let { width, height } = this.state;

    let maxColumn = this.viewConfig.column ? this.viewConfig.column : 4;
    let rowCount = Math.ceil(this.viewModel.getRecordCount() / maxColumn);
    return (
      <div className='v-grid-grid-view'  ref={(ele) => { this.divElement = ele }}>
        <div className='grid-container'>
          <VariableSizeGrid
            onScroll={this.onScroll}
            className="grid"
            columnCount={1} columnWidth={() => width - 5}
            rowCount={rowCount} rowHeight={this.dataCellHeight}
            height={height} width={width}>
            {this.RowData}
          </VariableSizeGrid>
        </div>
      </div>
    );
  }
}