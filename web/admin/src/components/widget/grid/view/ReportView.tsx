import React, { Component } from "react";
import { UIPrint } from 'components/widget/print';
import { VGridViewProps, VGridPrintViewConfig } from "../IVGrid";
import { VGridConfigUtil } from "../util";

export interface PrintViewState {
  init?: boolean; width: number; height: number;
}
export class PrintView extends Component<VGridViewProps, PrintViewState> {
  state: PrintViewState = { init: false, width: 0, height: 0 };
  divElement: HTMLElement | null = null;

  componentDidMount() {
    if (this.divElement) {
      let height = this.divElement.clientHeight;
      let width = this.divElement.clientWidth;
      this.setState({ init: true, height: height, width: width });
    }
  }

  render() {
    if (!this.state.init) {
      return (<div className='flex-vbox' ref={(ele) => { this.divElement = ele }}>Loading...</div>)
    }
    const { context, viewName } = this.props;
    const { width, height } = this.state;
    const reportViewConfig = VGridConfigUtil.getView(context.config, viewName) as VGridPrintViewConfig;
    let uiReport = null;
    if (reportViewConfig.render) {
      uiReport = reportViewConfig.render(context, reportViewConfig);
    } else {
      uiReport = (
        <UIPrint
          context={context}
          reports={reportViewConfig.prints} defaultPrint={reportViewConfig.currentPrintName}
          loadPrint={reportViewConfig.loadPrint} />
      );
    }
    let html = (
      <div className='view view-report flex-vbox' style={{ overflow: 'auto', width: width, height: height }}>
        {uiReport}
      </div>
    )
    return html;
  }
}