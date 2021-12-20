import { Element } from './common'

type onDrag = (ele: DraggableElement, x: number, y: number) => void;
export class DraggableElement extends Element {
  onDrag: onDrag;
  initX: number = 0;
  initY: number = 0;
  mouseX: number = 0;
  mouseY: number = 0;
  static hold: DraggableElement | null = null;

  constructor(ele: string | HTMLElement, onDrag: onDrag) {
    super(ele);
    this.onDrag = onDrag;
    let { initX, initY, mouseX, mouseY } = this;

    this.element.style.cursor = "move";

    const move = (e: MouseEvent) => {
      this.element.style.left = initX + (e.clientX - mouseX) + "px";
      this.element.style.top = initY + (e.clientY - mouseY) + "px";
      onDrag(this, e.clientX, e.clientY);
    }

    const stopMove = (_e: MouseEvent) => {
      DraggableElement.hold = null;
      window.removeEventListener("mousemove", move, true);
      window.removeEventListener("mouseup", stopMove, true);
    }

    const initMove = (e: MouseEvent) => {

      this.element.style.zIndex = "1"
      DraggableElement.hold = this;
      initX = this.findTopLeftPos().x;
      initY = this.findTopLeftPos().y;
      mouseX = e.clientX;
      mouseY = e.clientY;

      window.addEventListener("mousemove", move, true);
      window.addEventListener("mouseup", stopMove, true);
    }
    this.element.addEventListener("mousedown", initMove);
  }
}

type onDrop = (dragEle: DraggableElement, dropEle: DroppableElement, x: number, y: number) => void;
export class DroppableElement extends Element {
  onDrop: onDrop;

  constructor(ele: string | HTMLElement, onDrop: onDrop) {
    super(ele);
    this.onDrop = onDrop;
    this.mouseover = this.mouseover.bind(this);
    this.mouseup = this.mouseup.bind(this);

    document.body.addEventListener("mousemove", this.mouseover, true);
    this.element.addEventListener("mouseup", this.mouseup, true);
  }

  mouseup() {
    document.body.removeEventListener("mousemove", this.mouseover, true);
    this.element.removeEventListener("mouseup", this.mouseup, true);
  }

  mouseover(e: MouseEvent) {
    let ele = this.element;
    if (DraggableElement.hold && ele.offsetLeft < e.clientX
      && ele.offsetLeft + ele.offsetWidth > e.clientX
      && ele.offsetTop < e.clientY
      && ele.offsetTop + ele.offsetHeight > e.clientY) {
      this.onDrop(DraggableElement.hold, this, e.clientX, e.clientY);
    } else {
      this.element.style.border = "";
    }
  }
}
