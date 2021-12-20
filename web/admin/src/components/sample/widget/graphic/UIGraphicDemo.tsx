import React, { Component } from 'react'
import {
  ConnectableElement, DraggableElement, DroppableElement, ResizableElement
} from 'components/widget/graphic'

export class UIGraphicDemo extends Component {
  componentDidMount() {
    let div1 = new ConnectableElement("div1")
    let div2 = new ConnectableElement("div2")

    div2.connect(div1)

    new DraggableElement("div3", () => { })

    new ResizableElement("div4", { debug: true });

    new DroppableElement("div5", (_dragEle, dropEle, _x, _y) => { dropEle.element.style.border = "5px solid red"; })

    let frame = document.getElementById("frame");
    if (frame) {
      frame.ondragstart = () => { return false };
      frame.ondrop = () => { return false };
    }
  }

  render() {
    let html = (
      <div style={{ height: "100%" }}>
        <div style={{ top: 0, left: 0, height: "200px", width: "400px", border: "1px solid", position: "relative" }}>
          <svg width="100%" height="100%" style={{ top: 0, left: 0, position: "relative" }} id="sgv" />
          <div id="div1" style={{ width: "50px", height: "50px", top: 0, left: 30, background: "#4287f5" }}></div>
          <div id="div2" style={{ width: "50px", height: "50px", top: 100, left: 100, background: "#4287f5" }}></div>
        </div>
        <div id="frame" style={{ height: 200, width: 400, border: "1px solid" }}>
          <div id="div3" style={{ width: "50px", height: "50px", top: 0, left: 50, background: "#4287f5" }}></div>
          <div id="div5" style={{ width: "200px", height: "50px", top: 40, left: 150, background: "blue" }}></div>
        </div>
        <div style={{ height: 200, border: "1px solid", padding: 20 }}>
          <div id="div4" style={{ background: "#4287f5" }}>
            <div >some text!!!</div>
          </div>
        </div>
      </div>
    );
    return html;
  }
}