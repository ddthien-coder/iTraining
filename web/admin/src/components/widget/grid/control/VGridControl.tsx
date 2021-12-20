import React, { Component, ReactFragment } from "react";

import { fas, FAButton } from "components/widget/fa";
import { MouseMove, MouseMovePlugin } from 'components/widget/graphic'
import {
  VGridContextProps, VGridContext, VGridControlConfig, ControlViewMode, VGridControlConfigState
} from "../IVGrid";
import { VGridConfigUtil } from "../util";

export interface VGridControlSectionProps extends VGridContextProps {
  mode: 'expand' | 'collapse'
}
export class VGridControlSection<T extends VGridControlSectionProps = VGridControlSectionProps>
  extends Component<T> {

  renderExpand() {
    return <div>Expand Mode</div>
  }

  renderCollapse() {
    let html = (
      <div className='flex-vbox py-2 align-items-center justify-content-center'>
        <div style={{ writingMode: 'vertical-lr' }}>{this.renderCollapseVerticalUI()}</div>
      </div>
    );
    return html;
  }

  renderCollapseVerticalUI() {
    return <div>Collapse Mode</div>
  }

  render() {
    let { mode } = this.props;
    if (mode == 'expand') return this.renderExpand();
    return this.renderCollapse();
  }
}

class ControlResizePlugin extends MouseMovePlugin {
  context: VGridContext;

  constructor(context: VGridContext) {
    super();
    this.context = context;
  }

  onStop(initX: number, _initY: number, X: number, _Y: number) {
    let deltaX = X - initX;
    let state = VGridConfigUtil.getControlState(this.context.config);
    state.width += deltaX;
    this.context.getVGrid().forceUpdateView(true);
  }
}
export class VGridControlManager<T extends VGridContextProps = VGridContextProps> extends Component<T> {
  toggle = () => {
    let { context } = this.props;
    let state = VGridConfigUtil.getControlState(context.config);
    state.collapse = !state.collapse;
    context.getVGrid().forceUpdateView();
  }

  createSections(context: VGridContext, control: VGridControlConfig, mode: ControlViewMode) {
    let uiSections = null;
    if (control.sections) {
      uiSections = new Array<ReactFragment>();
      for (let section of control.sections) {
        let uiSection = null;
        if (mode === 'expand') {
          let titleUI = null;
          if (section.label) {
            titleUI = <h5 className='border-bottom'>{section.label}</h5>;
          }
          uiSection = (
            <div key={section.name} className='mt-2 p-1'>
              {titleUI}
              {section.render(context, mode)}
            </div>
          );
        } else {
          uiSection = section.render(context, mode);
        }
        uiSections.push(uiSection);
      }
    }
    return uiSections;
  }

  createVerticalText(text?: string) {
    return <div style={{ writingMode: 'vertical-lr' }}>{text}</div>;
  }

  renderCollapse(context: VGridContext, control: VGridControlConfig, _state: VGridControlConfigState) {
    let html = (
      <div key={'collapse'} className='v-grid-control bg-light'>
        <div className='flex-hbox-grow-0 align-items-center justify-content-center bg-dark' style={{ height: 24 }}>
          <FAButton className='p-0 text-white' color='link' size='md' icon={fas.faEye} onClick={this.toggle} />
        </div>
        <div className='flex-vbox py-2 align-items-center justify-content-center'>
          {this.renderCollapseContent(context, control)}
        </div>
      </div>
    );
    return html;
  }

  renderCollapseContent(context: VGridContext, control: VGridControlConfig) {
    let uiContent = null;
    if (control.sections) {
      uiContent = this.createSections(context, control, 'collapse');
    } else {
      uiContent = this.createVerticalText(control.label);
    }
    return uiContent;
  }

  renderExpand(context: VGridContext, control: VGridControlConfig, state: VGridControlConfigState) {
    const { width } = state;
    let label = 'Control';
    if (control.label) label = control.label;
    let html = (
      <div key={'expand'} className='v-grid-control flex-vbox bg-light' style={{ minWidth: width, maxWidth: width }}>
        <div className='title flex-hbox-grow-0 p-1 align-items-center justify-content-between'
          style={{ height: 24 }}>
          <h5 className='m-0 text-white'>{label}</h5>
          <FAButton className='p-0 text-white' color='link' size='md' icon={fas.faEyeSlash} onClick={this.toggle} />
        </div>
        <div className='flex-hbox'>
          <div className='expand-content flex-vbox'>{this.renderExpandContent(context, control)}</div>
          <div className='handle' onMouseDown={(me) => MouseMove(me, new ControlResizePlugin(context))} />
        </div>
      </div>
    );
    return html;
  }

  renderExpandContent(context: VGridContext, control: VGridControlConfig): ReactFragment | null {
    let uiContent = null;
    if (control.sections) {
      uiContent = this.createSections(context, control, 'expand');
    }
    return uiContent;
  }

  render() {
    let { context } = this.props;
    let control = VGridConfigUtil.getControl(context.config);
    let state = VGridConfigUtil.getControlState(context.config);
    if (state.collapse) return this.renderCollapse(context, control, state);
    return this.renderExpand(context, control, state);
  }
}