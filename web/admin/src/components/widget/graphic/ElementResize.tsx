import React from "react";
import ReactDOM from "react-dom";

import { Element, MathUtil } from './common'

export type OnElementResize = (ele: Element) => void;
export interface IResizableElementConfig {
  handleSize?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  debug?: boolean;
}
export class ResizableElement extends Element {
  handleSize: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  debug: boolean;
  onResize?: OnElementResize;

  constructor(ele: string | HTMLElement, config: IResizableElementConfig, onResize?: OnElementResize) {
    super(ele);
    this.onResize = onResize;

    this.handleSize = config.handleSize ? config.handleSize : 5;
    this.minWidth = config.minWidth ? config.minWidth : 0;
    this.maxWidth = config.maxWidth ? config.maxWidth : 1000;
    this.minHeight = config.minHeight ? config.minHeight : 0;
    this.maxHeight = config.maxHeight ? config.maxHeight : 1000;
    this.debug = config.debug ? config.debug : false;

    let handle = `${this.handleSize}px`
    let vHandleStyle = {
      background: "transparent", width: handle, minWidth: handle, maxWidth: handle, minHeight: 0, cursor: "w-resize"
    };
    let hHandleStyle = {
      background: "transparent", height: handle, minHeight: handle, maxHeight: handle, cursor: "n-resize"
    };

    if (this.debug == true) {
      vHandleStyle.background = 'gray';
      hHandleStyle.background = 'gray';
    }
    let template = [
      <div style={hHandleStyle} onMouseDown={this.resizeTop}></div>,
      <div className='d-flex flex-grow-1'>
        <div style={vHandleStyle} onMouseDown={this.resizeLeft}></div>
        <div style={{ overflow: "hidden" }} className='flex-grow-1'
          dangerouslySetInnerHTML={{ __html: this.element.innerHTML }}></div>
        <div style={vHandleStyle} onMouseDown={this.resizeRight}></div>
      </div>,
      <div style={hHandleStyle} onMouseDown={this.resizeBottom}></div>
    ];
    let block = document.createElement('div');
    block.setAttribute('class', 'd-flex flex-column flex-grow-1');
    block.style.height = "100%"
    ReactDOM.render(template, block);
    this.element.innerHTML = '';
    this.element.appendChild(block);
  }

  resizeTop = (me: React.MouseEvent) => {
    let top = MathUtil.toInt(this.element.style.top, 0);
    let height = this.getHeight();
    let mtop = me.clientY;
    const stop = () => {
      window.removeEventListener("mousemove", move);
    }
    const move = (m: MouseEvent) => {
      if (height - (m.clientY - mtop) > 60) {
        this.element.style.top = top + (m.clientY - mtop) + "px";
        this.element.style.height = height - (m.clientY - mtop) + "px";
        if (this.onResize) this.onResize(this);
      }
    }
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", stop);
  }

  resizeBottom = (me: React.MouseEvent) => {
    let height = this.getHeight();
    let mtop = me.clientY;
    const stop = () => {
      window.removeEventListener("mousemove", move);
    }
    const move = (m: MouseEvent) => {
      if (height + (m.clientY - mtop) > 60)
        this.element.style.height = height + (m.clientY - mtop) + "px";
      if (this.onResize) this.onResize(this);
    }
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", stop);
  }

  resizeLeft = (me: React.MouseEvent) => {
    let left = MathUtil.toInt(this.element.style.left, 10);
    let width = this.getWidth();
    let mX = me.clientX;
    const stop = () => {
      window.removeEventListener("mousemove", move);
    }
    const move = (m: MouseEvent) => {
      if (width - (m.clientX - mX) > 60) {
        this.element.style.left = left + (m.clientX - mX) + "px";
        this.element.style.width = width - (m.clientX - mX) + "px";
        if (this.onResize) this.onResize(this);
      }
    }
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", stop);
  }

  resizeRight = (me: React.MouseEvent) => {
    let width = MathUtil.toInt(this.element.style.width, 10);
    let mX = me.clientX;
    const stop = () => {
      window.removeEventListener("mousemove", move);
    }
    const move = (m: MouseEvent) => {
      if (width + (m.clientX - mX) > 60) {
        this.element.style.width = width + (m.clientX - mX) + "px";
        if (this.onResize) this.onResize(this);
      }
    }
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", stop);
  }
}
