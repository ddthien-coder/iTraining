import React, { Component, SyntheticEvent } from "react";
import { Button, Spinner } from 'reactstrap';
import ReactJson from 'react-json-view'
import { FAButton } from 'components/widget/fa';
import { ELEProps, mergeCssClass } from './element';
import { IDTracker } from 'components/util/common';
import { MouseMove, MouseMovePlugin } from 'components/widget/graphic'

import "./stylesheet.scss";

class VSplitResizePlugin extends MouseMovePlugin {
  resize: (deltaX: number, deltaY: number) => void
  constructor(resize: (deltaX: number, detalY: number) => void) {
    super();
    this.resize = resize;
  }

  onStop = (initX: number, initY: number, X: number, Y: number) => {
    let deltaX = X - initX;
    let deltaY = Y - initY;
    this.resize(deltaX, deltaY);
  }
}

interface SplitPaneState { collapse: boolean; width: number, height: number }

interface VSplitPaneProps {
  className?: string;
  style?: any;
  width?: number | string;
  title?: string;
  titleHeight?: number | string;
  contentViewId?: string;
  onChange?: (pane: VSplitPane, collapse: boolean) => void;
}
export class VSplitPane extends Component<VSplitPaneProps, SplitPaneState> {
  divElement: HTMLElement | null = null;

  constructor(props: VSplitPaneProps) {
    super(props);
    this.state = { collapse: false, width: -1, height: 300 };
  }

  componentDidMount() {
    if (this.divElement) {
      let height = this.divElement.clientHeight;
      let width = this.divElement.clientWidth;
      this.setState({ width: width, height: height })
    }
  }

  toggle = () => {
    let { onChange } = this.props;
    let collapse = !this.state.collapse;
    this.setState({ collapse: collapse })
    if (onChange) onChange(this, collapse);
  }

  resize = (deltaX: number, _deltaY: number) => {
    let { onChange } = this.props;
    let { width, collapse } = this.state;
    this.setState({ width: width + deltaX });
    if (onChange) onChange(this, collapse);
  }

  renderHandle() {
    let { width } = this.props;
    if (!width) return null;

    if (this.state.collapse) {
      let { title, titleHeight } = this.props;
      if (!title) title = "Expand";
      if (!titleHeight) titleHeight = 'auto';
      return (
        <div className='vsplit-title bg-light'>
          <div style={{ height: titleHeight }} onClick={this.toggle}>{title}</div>
        </div>
      );
    }
    let onMouseDown = (me: SyntheticEvent) => MouseMove(me, new VSplitResizePlugin(this.resize));
    return (
      <div className='vsplit-handle'>
        <div className='flex-vbox' onMouseDown={onMouseDown} />
        <FAButton color='info' onClick={this.toggle} />
        <div className='flex-vbox' onMouseDown={onMouseDown} />
      </div>
    );
  }

  renderDetectSize() {
    let { collapse } = this.state;
    let { style, width } = this.props;
    let computedStyle: any = undefined;
    if (collapse) {
      computedStyle = { ...style, flexGrow: 0 };
    } else {
      if (width) {
        computedStyle = { ...style, width: width };
      } else {
        computedStyle = { ...style, flexGrow: 1 };
      }
    }
    return <div className='d-flex' style={computedStyle} ref={(ele) => this.divElement = ele}>Loading...</div>
  }

  render() {
    if (!this.divElement) return this.renderDetectSize();
    let { collapse } = this.state;
    let computedStyle : any = undefined;
    let { className, style, width, contentViewId, children } = this.props;
    let contentUI = null;
    if (collapse) {
      computedStyle = { ...style, flexGrow: 0 };
    } else {
      if (width) {
        let splitWidth = this.state.width;
        computedStyle = { ...style, minWidth: splitWidth, maxWidth: splitWidth };
      } else {
        computedStyle = { ...style, flexGrow: 1};
      }
      className = mergeCssClass('vsplit-content', className);
      contentUI = (
        <div key={contentViewId} className={className}>
          {children}
        </div>
      )
    }
    return (
      <div className='vsplit-pane' style={computedStyle} ref={(ele) => this.divElement = ele}>
        {contentUI}
        {this.renderHandle()}
      </div>
    );
  }
}

interface VSplitProps {
  className?: string;
  style?: any;
  children: React.ReactElement<VSplitPane>[];
  updateOnResize?: boolean;
}
export class VSplit extends Component<VSplitProps, SplitPaneState> {
  renderId = IDTracker.next();

  onChange = (_pane: VSplitPane, _collapse: boolean) => {
    let { updateOnResize } = this.props;
    if (updateOnResize) {
      this.renderId = IDTracker.next();
    }
    this.forceUpdate();
  };

  render() {
    let { className, children, style } = this.props;
    let vsplitPanes: Array<any> = [];
    children.forEach((child: React.ReactElement<VSplitPane>, idx: number) => {
      vsplitPanes.push(
        <VSplitPane key={`split-pane-${idx}`} 
          contentViewId={`vsplit-render-${this.renderId}`} {...child.props} onChange={this.onChange} />
      )
    });
    className = className ? `vsplit ${className}` : 'vsplit'
    return (<div className={className} style={style}>{vsplitPanes}</div>);
  }
}

interface HSplitPaneProps {
  className?: string;
  style?: any;
  height?: number | string;
  heightGrow?: number;
  title?: string;
  titleShow?: boolean;
  titleHeight?: number | string;
  collapse?: boolean;
}
export class HSplitPane extends Component<HSplitPaneProps, SplitPaneState> {
  constructor(props: HSplitPaneProps) {
    super(props);
    let { collapse } = props
    this.state = { collapse: collapse ? true : false, width: 0, height: -1 };
  }

  toggle = () => {
    let collapse = !this.state.collapse;
    this.setState({ collapse: collapse })
  }

  render() {
    let { collapse } = this.state;
    let { className, style, height, heightGrow, title, titleShow, children } = this.props;
    let computedStyle: any = undefined;
    let contentUI = null;
    if (collapse) {
      computedStyle = { ...style, flexGrow: 0 };
    } else {
      if (height) {
        if(heightGrow == undefined) heightGrow = 0;
        computedStyle = { ...style, height: height,  flexGrow: heightGrow };
      } else {
        if(heightGrow == undefined) heightGrow = 1;
        computedStyle = { ...style, flexGrow: heightGrow };
      }
      contentUI = (
        <div className='hsplit-content'>
          {children}
        </div>
      );
    }

    let titleUI = null;
    if (titleShow || this.state.collapse) {
      if (!title) title = "Expand";
      titleUI = (
        <div className='hsplit-title'>
          <div onClick={this.toggle}>{title}</div>
        </div>
      );
    }

    let handleUI = null;
    if (!this.state.collapse && !titleShow) {
      handleUI = (
        <div className='hsplit-handle'>
          <Button color='info' onClick={() => this.toggle()} />
        </div>
      );
    }

    return (
      <div className={`hsplit-pane ${className}`} style={computedStyle}>
        {titleUI}
        {contentUI}
        {handleUI}
      </div>
    );
  }
}

interface HSplitProps {
  className?: string;
  style?: any;
}
export class HSplit extends Component<HSplitProps> {
  render() {
    let { style, className, children } = this.props;
    className = className ? `hsplit ${className}` : 'hsplit'
    return (<div className={className} style={style}>{children}</div>);
  }
}

export class UILazyLoad<P, S> extends React.Component<P, S> {
  loading: boolean = false;

  isLoading() { return this.loading; }

  markLoading(loading: boolean) {
    this.loading = loading;
  }

  renderLoading() {
    let html = (
      <div className='flex-vbox'>
        <div className='mx-auto my-auto'>
          <Spinner color="primary" style={{ width: '5rem', height: '5rem' }} />
        </div>
      </div>
    );
    return html;
  }
}

interface JsonViewProps extends ELEProps {
  object: any;
}
export class JsonView extends Component<JsonViewProps> {
  render() {
    let { className, style, object } = this.props;
    let html = (
      <div className={className} style={style}>
        <ReactJson src={object} indentWidth={4} collapsed={1} />
      </div>
    );
    return html;
  }
}
