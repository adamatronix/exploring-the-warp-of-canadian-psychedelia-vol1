import * as P5 from 'p5';
import findPointBetweenTwo from './utils/findPointBetweenTwo';
import polarToCartesian from './utils/polarToCartesian';
import intersect from './utils/intersect';
import distanceOfLine from './utils/distanceOfLine';


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
  radians:number;

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
    this.radians = radians;

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

  calcTrapezoidDraw = (maskPoint:any) => {

    const rightDistance = distanceOfLine(this.guideRight.x1,this.guideRight.y1,this.trapezoid.rightX,this.trapezoid.rightY);
    const topDistance = distanceOfLine(this.guideRight.x1,this.guideRight.y1,this.trapezoid.topX,this.trapezoid.topY);

    if(maskPoint.distance >= topDistance)
      return;


    let rightX = this.trapezoid.rightX;
    let rightY = this.trapezoid.rightY;
    let bottomX = this.trapezoid.bottomX;
    let bottomY = this.trapezoid.bottomY;

    if(maskPoint.distance >= rightDistance) {
      rightX = maskPoint.x;
      rightY = maskPoint.y;
      let adjustRad = this.p5.radians(60);
      let bottomLine = polarToCartesian(rightX,rightY,this.radians-adjustRad, 2000);
      let bottomPoint = intersect(this.guideLeft.x1,this.guideLeft.y1,this.guideLeft.x2,this.guideLeft.y2, rightX,rightY, bottomLine.x, bottomLine.y);
      bottomX = bottomPoint ? bottomPoint.x : null;
      bottomY = bottomPoint ? bottomPoint.y : null;
    }
    

    return {
      leftX: this.trapezoid.leftX,
      leftY: this.trapezoid.leftY,
      rightX: rightX,
      rightY: rightY,
      bottomX: bottomX,
      bottomY: bottomY,
      topX: this.trapezoid.topX,
      topY: this.trapezoid.topY
    }    
  }

  draw = (maskPoint:any) => {
    this.calcTrapezoidPosition(this.position);
    const shape = this.calcTrapezoidDraw(maskPoint);

    if(shape) {
      this.p5.fill('white');
      this.p5.beginShape();
      this.p5.vertex(shape.rightX, shape.rightY);
      this.p5.vertex(shape.bottomX, shape.bottomY);
      this.p5.vertex(shape.leftX, shape.leftY);
      this.p5.vertex(shape.topX, shape.topY);
      this.p5.endShape(this.p5.CLOSE);
    }
    
  }
}

export default Trapezoid;