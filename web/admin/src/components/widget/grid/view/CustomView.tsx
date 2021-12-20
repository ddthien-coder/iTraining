import React, { Component } from "react";
import { VGridViewProps, VGridCustomViewConfig } from "../IVGrid";
import { VGridConfigUtil } from "../util";

export interface CustomViewState {
  init?: boolean;
  width: number;
  height: number;
}
export class CustomView extends Component<VGridViewProps, CustomViewState> {
  state: CustomViewState = { init: false, width: 0, height: 0 };
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
    const customView = VGridConfigUtil.getView(context.config, viewName) as VGridCustomViewConfig;
    let html = (
      <div className='view view-custom flex-vbox' style={{ overflow: 'auto', width: width, height: height }}>
        {customView.render(context)}
      </div>
    )
    return html;
  }
}