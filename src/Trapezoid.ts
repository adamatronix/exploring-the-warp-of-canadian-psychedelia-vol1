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
  t:number = 0;

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


    let centerPoint = this.getPositionOffset(this.p5,this.guideCenter.angle,position*2000, position*2600);
    let centerDistance = distanceOfLine(this.guideCenter.x1, this.guideCenter.y1, centerPoint.x, centerPoint.y);

    // the coordinates of the A3 Point


    let leftPoint = {
      x: this.guideLeft.x1 + centerDistance * Math.cos(this.guideLeft.angle),
      y: this.guideLeft.y1 + centerDistance * Math.sin(this.guideLeft.angle)
    }

    let rightPoint = {
      x: this.guideRight.x1 + centerDistance * Math.cos(this.guideRight.angle),
      y: this.guideRight.y1 + centerDistance * Math.sin(this.guideRight.angle)
    }

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


  getPositionOffset = (p5: P5, angle:number, minPos:number, maxPos:number) => {
    let radius = 2;
    let x = p5.cos(angle) * radius;
    let y = p5.sin(angle) * radius;
    let p = p5.createVector(x,y).normalize();
    let n = p5.map(p5.noise(p.x+this.t, p.y+this.t),  0, 1, minPos, maxPos)
    
    p.mult(n*2);    
  
    return {
      x: this.guideCenter.x1 + p.x, 
      y: this.guideCenter.y1 + p.y
    };
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

    this.t += 0.007;
    
  }
}

export default Trapezoid;