import { Coordinate, Graphic, Element } from './common'

export class ConnectableElement extends Element {

  constructor(ele: string | HTMLElement) {
    super(ele);
    this.element.style.position = "absolute";
  }

  translate(Point: any, vector: any) {
    return { left: Point.left + vector[0], top: Point.top + vector[1], width: Point.width, height: Point.height }
  }

  setLeft(Point: any, left: number) {
    var res = { ...Point }
    res.left = left
    return res
  }

  createCoordinate(Point: any) {
    return new Coordinate(Point.left, Point.top);
  }

  setTop(Point: any, top: number) {
    var res = { ...Point }
    res.top = top
    return res
  }

  connect(other: ConnectableElement) {
    let { translate, createCoordinate, setLeft, setTop } = this
    let Points = []
    let e1 = this.element
    let e2 = other.element
    if (e1 != null && e2 != null) {
      var Point1 = { top: e1.offsetTop + e1.offsetHeight / 2, left: e1.offsetLeft + e1.offsetWidth, width: e1.offsetWidth, height: e1.offsetHeight }
      var Point2 = { top: e2.offsetTop + e2.offsetHeight / 2, left: e2.offsetLeft, width: e2.offsetWidth, height: e2.offsetHeight }
      var TPoint1 = translate(Point1, [20, 0]);
      var TPoint2 = translate(Point2, [-20, 0])

      Points.push(createCoordinate(Point1));
      Points.push(createCoordinate(TPoint1));
      if (TPoint1.left <= TPoint2.left) {
        Points.push(new Coordinate(Point1.left + 20, Point2.top));
      } else {
        if (TPoint1.height / 2 + TPoint2.height / 2 < Math.abs(TPoint1.top - TPoint2.top)) {
          var sp = Math.abs(TPoint1.top - TPoint2.top) - (TPoint1.height / 2 + TPoint2.height / 2)
          sp = sp / 2 + TPoint1.height / 2
          if (TPoint1.top > TPoint2.top)
            sp = -sp
          Points.push(createCoordinate(translate(TPoint1, [0, sp])));
          Points.push(createCoordinate(setLeft(translate(TPoint1, [0, sp]), TPoint2.left)));
        } else {
          if (TPoint1.left <= Point2.left + Point2.width) {
            Points.push(createCoordinate(translate(TPoint1, [Point2.width, 0])));
            TPoint1 = translate(TPoint1, [Point2.width, 0])
          }
          let sd = Math.max(Point1.top + Point1.height / 2, Point2.top + Point2.height / 2) + 20
          Points.push(createCoordinate(setTop(TPoint1, sd)));
          Points.push(createCoordinate(setTop(TPoint2, sd)));
        }
      }
      Points.push(createCoordinate(TPoint2));
      Points.push(createCoordinate(Point2));
      let graphic = new Graphic('svg');
      graphic.drawConnectedLines({ "stroke": "rgb(255,0,0)", "stroke-width": 2 }, Points)
    }
  }
}