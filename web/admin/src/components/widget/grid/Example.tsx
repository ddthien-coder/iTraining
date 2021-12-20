import React, {Component} from "react";
import { FixedSizeGrid as Grid } from "react-window";

import "./stylesheet.scss";

export class GridExample extends Component {
  bodyGrid: any = React.createRef();
  headerGrid: any = React.createRef();
  footerGrid: any = React.createRef();

  onScroll = (param: { scrollTop: number, scrollLeft: number, scrollUpdateWasRequested: any }) => {
    this.bodyGrid.current.scrollTo({ scrollLeft: 0, scrollTop: param.scrollTop });
    this.headerGrid.current.scrollTo({ scrollLeft: param.scrollLeft });
  }

  Cell = (param: { columnIndex: number, rowIndex: number, style: any }) => (
    <div
      className={
        param.columnIndex % 2
          ? param.rowIndex % 2 === 0
            ? "GridItemOdd"
            : "GridItemEven"
          : param.rowIndex % 2
            ? "GridItemOdd"
            : "GridItemEven"
      }
      style={param.style}
    >
      r{param.rowIndex}, c{param.columnIndex}
    </div>
  );

  render() {
    let headerHeight = 40;
    let footerHeight = 40;
    let height = 500;
    let width = 800;
    return (
      <div style={{ display: "flex", flexDirection: "row", flexGrow: 10, border: '1px solid red' }} >
        <div>
          <Grid
            style={{ overflowY: "hidden" }} className="Grid"
            columnCount={2} columnWidth={100}
            rowCount={1} rowHeight={35}
            height={headerHeight} width={210} >
            {this.Cell}
          </Grid>
          <Grid
            ref={this.bodyGrid}
            style={{ overflowY: "hidden" }} className="Grid"
            columnCount={2} columnWidth={100}
            rowCount={1000} rowHeight={35}
            height={height} width={210} >
            {this.Cell}
          </Grid>
          <Grid
            style={{ overflowY: "hidden" }} className="Grid"
            columnCount={2} columnWidth={100}
            rowCount={1} rowHeight={35}
            height={footerHeight} width={210} >
            {this.Cell}
          </Grid>
        </div>
        <div>
          <Grid
            ref={this.headerGrid}
            style={{ overflowX: "hidden" }} className="Grid flex-grow-1"
            columnCount={1000} columnWidth={100}
            rowCount={1} rowHeight={35}
            height={headerHeight} width={width} >
            {this.Cell}
          </Grid>
          <Grid
            onScroll={this.onScroll}
            className="Grid flex-grow-1"
            columnCount={1000} columnWidth={100}
            rowCount={1000} rowHeight={35}
            height={height} width={width}>
            {this.Cell}
          </Grid>
          <Grid
            ref={this.headerGrid}
            style={{ overflowX: "hidden" }} className="Grid flex-grow-1"
            columnCount={1000} columnWidth={100}
            rowCount={1} rowHeight={35}
            height={footerHeight} width={width} >
            {this.Cell}
          </Grid>
        </div>
      </div>
    );
  }
}