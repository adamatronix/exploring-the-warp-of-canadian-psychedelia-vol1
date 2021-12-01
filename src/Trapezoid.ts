import * as P5 from 'p5';
import findPointBetweenTwo from './utils/findPointBetweenTwo';
import polarToCartesian from './utils/polarToCartesian';
import intersect from './utils/intersect';

interface LineObject {
  x1:number,
  y1:number,
  x2:number,
  y2:number,
  angle:number
}

interface TrapezoidObject {
  leftX:number,
  leftY:number,
  rightX:number,
  rightY:number,
  bottomX:any,
  bottomY:any,
  topX:any,
  topY:any
}

class Trapezoid {
  p5:P5;
  trapezoid:TrapezoidObject;
  position:number;
  guideCenter:LineObject;
  guideLeft:LineObject;
  guideRight:LineObject;

  constructor(p5:P5, position:number, guideCenter:LineObject, guideLeft:LineObject, guideRight:LineObject) {
    this.p5 = p5;
    this.position = position;
    this.guideCenter = guideCenter;
    this.guideLeft = guideLeft;
    this.guideRight = guideRight;

    this.init();
  }

  init = () => {
    this.calcTrapezoidPosition(this.position);
    
  }

  calcTrapezoidPosition = (position:any) => {
    let leftPoint = findPointBetweenTwo(position,this.guideLeft.x1,this.guideLeft.y1,this.guideLeft.x2,this.guideLeft.y2);
    let rightPoint = findPointBetweenTwo(position,this.guideRight.x1,this.guideRight.y1,this.guideRight.x2,this.guideRight.y2);
    let dx = leftPoint.x - rightPoint.x;
    let dy = leftPoint.y - rightPoint.y;
    let radians = Math.atan2(dy,dx);

    let adjustRad = this.p5.radians(60);
    let bottomLine = polarToCartesian(rightPoint.x,rightPoint.y,radians-adjustRad, 2000);
    let bottomPoint = intersect(this.guideLeft.x1,this.guideLeft.y1,this.guideLeft.x2,this.guideLeft.y2, rightPoint.x,rightPoint.y, bottomLine.x, bottomLine.y);

    let adjustTopRad = this.p5.radians(120);
    let topLine = polarToCartesian(leftPoint.x,leftPoint.y,radians+adjustTopRad, 2000);
    let topPoint = intersect(this.guideRight.x1,this.guideRight.y1,this.guideRight.x2,this.guideRight.y2, leftPoint.x, leftPoint.y, topLine.x, topLine.y);

    this.trapezoid = {
      leftX: leftPoint.x,
      leftY: leftPoint.y,
      rightX: rightPoint.x,
      rightY: rightPoint.y,
      bottomX: bottomPoint ? bottomPoint.x : null,
      bottomY: bottomPoint ? bottomPoint.y : null,
      topX: topPoint ? topPoint.x : null,
      topY: topPoint ? topPoint.y : null
    }

  }

  draw = () => {
    this.calcTrapezoidPosition(this.position);
    this.p5.fill('white');
    this.p5.beginShape();
    this.p5.vertex(this.trapezoid.rightX, this.trapezoid.rightY);
    this.p5.vertex(this.trapezoid.bottomX, this.trapezoid.bottomY);
    this.p5.vertex(this.trapezoid.leftX, this.trapezoid.leftY);
    this.p5.vertex(this.trapezoid.topX, this.trapezoid.topY);
    this.p5.endShape(this.p5.CLOSE);
  }
}

export default Trapezoid;