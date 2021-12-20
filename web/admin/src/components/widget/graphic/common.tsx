import React from 'react';
import ReactDOM from 'react-dom';
export class MathUtil {
  static toInt(string: string | null, defaultVal: number) {
    if (!string) return defaultVal;
    return parseInt(string, 10);
  }
}

export class Coordinate {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
export class Graphic {
  Panel: Element;

  constructor(canvasId: string) {
    this.Panel = new Element(canvasId);
  }

  drawLine(style: any, p1: Coordinate, p2: Coordinate) {
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute("x1", p1.x + "px")
    line.setAttribute("y1", p1.y + "px")
    line.setAttribute("x2", p2.x + "px")
    line.setAttribute("y2", p2.y + "px")
    for (const prop in style) {
      line.style.setProperty(prop, style[prop]);
    }
    this.Panel.element.appendChild(line);
    return line;
  }

  drawConnectedLines(style: any, points: Array<Coordinate>) {
    for (var i = 0; i < points.length - 1; i++) {
      this.drawLine(style, points[i], points[i + 1]);
      this.drawCircle({ "stroke": "rgb(255,0,0)", "stroke-width": 2 }, points[i], 4);
    }
    this.drawCircle({ "stroke": "rgb(255,0,0)", "stroke-width": 2 }, points[points.length - 1], 4);
  }

  drawLineWithArrow(_p1: Coordinate, _arrow1Style: any, _p2: Coordinate, _arrow2Style: any) {
  }

  drawCircle(style: any, center: Coordinate, diameter: number) {
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute("cx", center.x + "px");
    circle.setAttribute("cy", center.y + "px");
    circle.setAttribute("r", diameter + "px");
    for (const prop in style) {
      circle.style.setProperty(prop, style[prop]);
    }
    this.Panel.element.appendChild(circle);
  }
}

export class Element {
  element: HTMLElement;

  constructor(element: string | HTMLElement) {
    if (element instanceof HTMLElement) {
      this.element = element;
    } else {
      let foundEle = document.getElementById(element)
      if (!foundEle) {
        throw new Error("Cannot find the element with id" + element);
      }
      this.element = foundEle;
    }
    this.element.style.position = "relative"
    if (this.element.style.top == "") this.element.style.top = "0"
    if (this.element.style.left == "") this.element.style.left = "0"
    if (this.element.style.width == "") this.element.style.width = this.element.offsetWidth + "px"

  }

  getWidth() { return this.element.offsetWidth }

  getHeight() { return this.element.offsetHeight }

  findTopLeftPos() {
    return new Coordinate(MathUtil.toInt(this.element.style.left, 0), MathUtil.toInt(this.element.style.top, 0));
  }

  findTopRightPos() { return new Coordinate(this.findTopLeftPos().x + this.getWidth(), this.findTopLeftPos().y); }

  findBottomLeftPos() { return new Coordinate(this.findTopLeftPos().x, this.findTopLeftPos().y + this.getHeight()); }

  findBottomRightPos() {
    return new Coordinate(this.findTopLeftPos().x + this.getWidth(), this.findTopLeftPos().y + this.getHeight());
  }

  findCenterTopPos() { return new Coordinate((this.findTopLeftPos().x + this.getWidth()) / 2, this.findTopLeftPos().y); }

  findCenterBottomPos() {
    return new Coordinate((this.findTopLeftPos().x + this.getWidth()) / 2, this.findTopLeftPos().y + this.getHeight());
  }

  findCenterLeftPos() {
    return new Coordinate(this.findTopLeftPos().x, (this.findTopLeftPos().y + this.getHeight()) / 2);
  }

  findCenterRightPos() {
    return new Coordinate(this.findTopLeftPos().x + this.getWidth(), (this.findTopLeftPos().y + this.getHeight()) / 2);
  }

  findCenterPos() {
    let x = (this.findTopLeftPos().x + this.getWidth()) / 2;
    return new Coordinate(x, (this.findTopLeftPos().y + this.getHeight()) / 2);
  }
}


class MouseMoveRuller {
  layer: HTMLElement;
  yAxis: SVGLineElement | null = null;
  xAxis: SVGLineElement | null = null;
  graphic: Graphic;
  lineStyle = { stroke: "lightgray", "stroke-width": 1, "stroke-dasharray": '2 2' };


  constructor() {
    this.layer = document.createElement('div');
    this.layer.setAttribute("id", "ruller-layer");
    document.body.appendChild(this.layer);
    let canvas = (
      <svg width="100%" height="100%" style={{ top: 0, left: 0, position: "relative" }} id="ruller-layer-svg" />
    );
    ReactDOM.render(canvas, this.layer);
    this.graphic = new Graphic('ruller-layer-svg');
  }

  drawXAxis = (me: MouseEvent) => {
    let Y = me.clientY;
    let x1 = new Coordinate(0, Y);
    let x2 = new Coordinate(window.innerWidth, Y);
    if (this.xAxis) this.xAxis.remove();
    this.xAxis = this.graphic.drawLine(this.lineStyle, x1, x2);
  }

  drawYAxis = (me: MouseEvent) => {
    let X = me.clientX;
    let y1 = new Coordinate(X, 0);
    let y2 = new Coordinate(X, window.innerHeight);
    if (this.yAxis) this.yAxis.remove();
    this.yAxis = this.graphic.drawLine(this.lineStyle, y1, y2);
  }
}
export class MouseMovePlugin {
  onInit(_initX: number, _initY: number) {

  }
  onMove(_initX: number, _initY: number, _X: number, _Y: number) {

  }
  onStop(_initX: number, _initY: number, _X: number, _Y: number) {

  }
}
export function MouseMove(me: any, plugin: MouseMovePlugin) {
  let initX = me.clientX;
  let initY = me.clientY;
  let stop = false;

  let mouseMoveRuller = new MouseMoveRuller();
  plugin.onInit(initX, initY);

  let disableSelect = (event: any) => {
    event.preventDefault();
  }

  const onStop = (me: MouseEvent) => {
    if (stop) return;
    stop = true;
    let X = me.clientX;
    let Y = me.clientY;
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener('selectstart', disableSelect);
    let layer = document.getElementById("ruller-layer");
    if (layer) layer.remove();
    plugin.onStop(initX, initY, X, Y);
  }

  const onMove = (me: MouseEvent) => {
    let X = me.clientX;
    let Y = me.clientY;
    mouseMoveRuller.drawXAxis(me);
    mouseMoveRuller.drawYAxis(me);
    plugin.onMove(initX, initY, X, Y);
  }
  window.addEventListener("mousemove", onMove)
  window.addEventListener("mouseup", onStop);
  window.addEventListener('selectstart', disableSelect);
}
