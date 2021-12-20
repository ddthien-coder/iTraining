import React, { Component, ReactFragment } from "react";
import { VariableSizeGrid } from "react-window";
import type { FieldContainer } from "../IVGrid";
import {
  VGridViewProps, VGridTableViewConfig, VGridContext, VGridViewConfig
} from "../IVGrid";
import { VGridConfigUtil } from '../util'
import { DefaultViewModePlugin, FieldControl, RecordEditorControl } from "./Plugin";

import {
  TableViewModel
} from "./TableViewModel";

export type CellParam = { columnIndex: number, rowIndex: number, style: any };
export interface VGridTableViewState {
  init: boolean;
  width: number;
  height: number;
  scrollAreaW: number;
  scrollAreaH: number;
}
export class TableView extends Component<VGridViewProps, VGridTableViewState> {
  state: VGridTableViewState = {
    init: false, width: 0, height: 0, scrollAreaW: 0, scrollAreaH: 0
  };
  divElement: HTMLElement | null = null;

  viewModel: TableViewModel;
  fixedLeftBodyGrid: any = React.createRef();

  fixedRightBodyGrid: any = React.createRef();

  defaultHeaderGrid: any = React.createRef();
  defaultFooterGrid: any = React.createRef();

  constructor(props: VGridViewProps) {
    super(props);
    this.viewModel = this.createViewModel(props);
  }

  createViewModel(props: VGridViewProps) {
    let { context, viewName } = props;
    return new TableViewModel(context, viewName);
  }

  componentDidMount() {
    if (this.divElement) {
      let { context, viewName } = this.props;
      let height = this.divElement.clientHeight;
      let width = this.divElement.clientWidth;
      let scrollAreaW = width - 2;
      if (this.viewModel.getColumnCount('fixed-left') > 0) {
        scrollAreaW -= scrollAreaW = this.viewModel.getGridWidth('fixed-left')
      }
      if (this.viewModel.getColumnCount('fixed-right') > 0) {
        scrollAreaW -= scrollAreaW = this.viewModel.getGridWidth('fixed-right')
      }
      let tableViewConfig = VGridConfigUtil.getView(context.config, viewName) as VGridTableViewConfig
      let scrollAreaH = height;
      scrollAreaH = scrollAreaH - (this.viewModel.getHeaderCellHeight() + 5);
      if (tableViewConfig.footer) {
        let records = tableViewConfig.footer.createRecords(context);
        this.viewModel.setFooterRecords(records);
        let footerHeight = this.viewModel.getDataCellHeight() * records.length;
        scrollAreaH -= footerHeight;
      }
      this.setState({ init: true, height: height, width: width, scrollAreaW: scrollAreaW, scrollAreaH: scrollAreaH });
    }
  }

  dataCellHeight = (_index: number) => {
    return this.viewModel.getDataCellHeight();
  }

  headerCellHeight = (_index: number) => {
    return this.viewModel.getHeaderCellHeight();
  }

  onScroll = (param: { scrollTop: number, scrollLeft: number, scrollUpdateWasRequested: any }) => {
    if (this.fixedLeftBodyGrid.current) {
      this.fixedLeftBodyGrid.current.scrollTo({ scrollLeft: 0, scrollTop: param.scrollTop });
    }

    if (this.defaultHeaderGrid.current) {
      this.defaultHeaderGrid.current.scrollTo({ scrollLeft: param.scrollLeft });
    }
    if (this.defaultFooterGrid.current) {
      this.defaultFooterGrid.current.scrollTo({ scrollLeft: param.scrollLeft });
    }

    if (this.fixedRightBodyGrid.current) {
      this.fixedRightBodyGrid.current.scrollTo({ scrollLeft: 0, scrollTop: param.scrollTop });
    }
  }

  CellColumnWidth = (group: FieldContainer, index: number) => {
    return this.viewModel.getColumnWidth(group, index);
  }

  CellHeader = (group: FieldContainer, param: CellParam) => {
    return this.viewModel.createHeaderCell(group, param.columnIndex, param.style);
  };

  CellData = (group: FieldContainer, param: CellParam) => {
    return this.viewModel.createDataCell(group, param.style, param.rowIndex, param.columnIndex);
  };

  FooterCellData = (group: FieldContainer, param: CellParam) => {
    return this.viewModel.createFooterDataCell(group, param.style, param.rowIndex, param.columnIndex);
  };

  renderFixedLeftUI() {
    let columnCount = this.viewModel.getColumnCount('fixed-left');
    if (columnCount < 1) return null;
    let { scrollAreaH } = this.state;
    let rowCount = this.viewModel.getRecordCount();
    let headerHeight = this.viewModel.getHeaderCellHeight();
    let footerRowCount = this.viewModel.getFooterRowCount();
    let footerHeight = this.viewModel.getDataCellHeight() + footerRowCount;
    let gridWidth = this.viewModel.getGridWidth('fixed-left') + 1;
    let gridUI = (
      <div className='grid-container'>
        <VariableSizeGrid
          style={{ overflowY: "hidden" }} className='grid border-right'
          columnCount={columnCount} columnWidth={(index) => this.CellColumnWidth('fixed-left', index)}
          rowCount={1} rowHeight={this.headerCellHeight}
          height={headerHeight} width={gridWidth} >
          {(param) => this.CellHeader('fixed-left', param)}
        </VariableSizeGrid>
        <VariableSizeGrid
          ref={this.fixedLeftBodyGrid}
          style={{ overflowY: "hidden" }} className="grid border-right"
          columnCount={columnCount} columnWidth={(index) => this.CellColumnWidth('fixed-left', index)}
          rowCount={rowCount} rowHeight={this.dataCellHeight}
          height={scrollAreaH} width={gridWidth} >
          {(param) => this.CellData('fixed-left', param)}
        </VariableSizeGrid>
        {
          footerRowCount > -1 ?
            <VariableSizeGrid
              style={{ overflowY: "hidden" }} className="grid border-right"
              columnCount={columnCount} columnWidth={(index) => this.CellColumnWidth('fixed-left', index)}
              rowCount={footerRowCount} rowHeight={this.dataCellHeight}
              height={footerHeight} width={gridWidth} >
              {(param) => this.FooterCellData('fixed-left', param)}
            </VariableSizeGrid>
            :
            <></>
        }
      </div>
    );
    return gridUI;
  }

  renderFixedRightUI() {
    let columnCount = this.viewModel.getColumnCount('fixed-right');
    if (columnCount < 1) return null;
    let { scrollAreaH } = this.state;
    let rowCount = this.viewModel.getRecordCount();
    let headerHeight = this.viewModel.getHeaderCellHeight();

    let footerRowCount = this.viewModel.getFooterRowCount();
    let footerHeight = this.viewModel.getDataCellHeight();
    let gridWidth = this.viewModel.getGridWidth('fixed-right') + 1;
    let gridUI = (
      <div className='grid-container'>
        <VariableSizeGrid
          style={{ overflowY: "hidden" }} className='grid border-left'
          columnCount={columnCount} columnWidth={(index) => this.CellColumnWidth('fixed-right', index)}
          rowCount={1} rowHeight={this.headerCellHeight}
          height={headerHeight} width={gridWidth} >
          {(param) => this.CellHeader('fixed-right', param)}
        </VariableSizeGrid>
        <VariableSizeGrid
          ref={this.fixedRightBodyGrid}
          style={{ overflowY: "hidden" }} className="grid border-left"
          columnCount={columnCount} columnWidth={(index) => this.CellColumnWidth('fixed-right', index)}
          rowCount={rowCount} rowHeight={this.dataCellHeight}
          height={scrollAreaH} width={gridWidth} >
          {(param) => this.CellData('fixed-right', param)}
        </VariableSizeGrid>
        {
          footerRowCount > -1 ?
            <VariableSizeGrid
              style={{ overflowY: "hidden" }} className="grid border-left"
              columnCount={columnCount} columnWidth={(index) => this.CellColumnWidth('fixed-right', index)}
              rowCount={footerRowCount} rowHeight={this.dataCellHeight}
              height={footerHeight} width={gridWidth} >
              {(param) => this.FooterCellData('fixed-right', param)}
            </VariableSizeGrid>
            :
            <></>
        }
      </div>
    );
    return gridUI;
  }

  render() {
    if (!this.state.init) {
      return (<div className='flex-hbox' ref={(ele) => { this.divElement = ele }}>Loading...</div>)
    }
    this.viewModel.initRender();
    let { scrollAreaW, scrollAreaH } = this.state;
    let rowCount = this.viewModel.getRecordCount();
    let headerHeight = this.viewModel.getHeaderCellHeight();

    let footerRowCount = this.viewModel.getFooterRowCount();
    let footerHeight = this.viewModel.getDataCellHeight();

    let columnCount = this.viewModel.getColumnCount('default');
    return (
      <div className='flex-hbox'>
        {this.renderFixedLeftUI()}
        <div className='grid-container'>
          <VariableSizeGrid
            ref={this.defaultHeaderGrid}
            style={{ overflowX: "hidden" }} className="grid"
            columnCount={columnCount} columnWidth={(index) => this.CellColumnWidth('default', index)}
            rowCount={1} rowHeight={this.headerCellHeight}
            height={headerHeight} width={scrollAreaW} >
            {(param) => this.CellHeader('default', param)}
          </VariableSizeGrid>

          <VariableSizeGrid
            onScroll={this.onScroll}
            className="grid" style={{ overflow: 'scroll' }}
            columnCount={columnCount} columnWidth={(index) => this.CellColumnWidth('default', index)}
            rowCount={rowCount} rowHeight={this.dataCellHeight}
            height={scrollAreaH} width={scrollAreaW}>
            {(param) => this.CellData('default', param)}
          </VariableSizeGrid>
          {
            footerRowCount > -1 ?
              <VariableSizeGrid
                ref={this.defaultFooterGrid}
                style={{ overflowX: "hidden" }} className="grid"
                columnCount={columnCount} columnWidth={(index) => this.CellColumnWidth('default', index)}
                rowCount={footerRowCount} rowHeight={this.dataCellHeight}
                height={footerHeight} width={scrollAreaW} >
                {(param) => this.FooterCellData('default', param)}
              </VariableSizeGrid>
              :
              <></>
          }
        </div>
        {this.renderFixedRightUI()}
      </div>
    );
  }
}

export class TableViewModePlugin extends DefaultViewModePlugin {
  createToolbarViewControl(
    ctx: VGridContext, _uiSrc: Component, _viewConfig: VGridViewConfig, viewName: string): ReactFragment {
    return (
      <>
        <FieldControl key='record-field-control' context={ctx} viewName={viewName} />
        <RecordEditorControl key='record-editor-control' context={ctx} viewName={viewName} />
      </>
    );
  }

  createView(
    ctx: VGridContext, viewId: string, _viewConfig: VGridViewConfig, viewName: string): ReactFragment {
    return (<TableView key={viewId} context={ctx} viewName={viewName} />);
  }
}