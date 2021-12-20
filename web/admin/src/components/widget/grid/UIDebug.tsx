import React, { Component } from 'react'
import ReactJson from 'react-json-view'

import { ObjUtil } from 'components/util/common'
import { FAButton } from 'components/widget/fa';
import { VSplitPane, VSplit } from 'components/widget/component';
import { VGridContextProps } from './IVGrid'
import { VGridConfigUtil } from './util'

interface UIDebugObjectProps {
  object: any;
}
export class UIDebugObject extends Component<UIDebugObjectProps> {
  copyToClipboard() {
    let { object } = this.props;
    let json = ObjUtil.toJson(object.getWatchObject());
    ObjUtil.copyToClipboard(json);
  }

  render() {
    let { object } = this.props;

    let html = (
      <div className='flex-vbox border' style={{ overflowY: 'auto' }}>
        <ReactJson src={object} indentWidth={4} collapsed={2} />
      </div>
    );
    return html;
  }
}

export class UIVGridDebug extends Component<VGridContextProps> {
  watchObject: any = {};

  constructor(props: any) {
    super(props);
    let { context } = props;
    this.watchObject = context.config;
  }

  onShow(object: any) {
    this.watchObject = object;
    this.forceUpdate();
  }

  renderNavigation() {
    let { context } = this.props;
    let html = (
      <div>
        <div className='d-flex flex-column'>
          <h5>Watch Objects</h5>
          <FAButton className='d-block text-left' color='link' onClick={() => this.onShow(context.config)}>
            VGrid Config
          </FAButton>
          <FAButton className='d-block text-left' color='link'
            onClick={() => this.onShow(VGridConfigUtil.getCurrentView(context.config))}>
            Current View Config
          </FAButton>
          <FAButton className='d-block text-left' color='link'
            onClick={() => this.onShow(context.config.record)}>
            Record Config
          </FAButton>
          <FAButton className='d-block text-left' color='link' onClick={() => this.onShow(context.model)}>
            List Model
          </FAButton>
          <FAButton className='d-block text-left' color='link'
            onClick={() => this.onShow(context.model.getDisplayRecordList().getDisplayRecords())}>
            Display Records
          </FAButton>
          <FAButton className='d-block text-left' color='link'
            onClick={() => this.onShow(context.model.getSelectedRecords())}>
            Selected Records
          </FAButton>
          <FAButton className='d-block text-left' color='link'
            onClick={() => this.onShow(context.model.getMarkModifiedRecords())}>
            Modified Records
          </FAButton>
        </div>
      </div>
    );
    return html;
  }

  render() {
    let html = (
      <VSplit style={{ height: 600 }}>
        <VSplitPane width={250}>
          {this.renderNavigation()}
        </VSplitPane>
        <VSplitPane>
          <UIDebugObject object={this.watchObject} />
        </VSplitPane>
      </VSplit>
    );
    return html;
  }
}