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

class Cone {
  p5:P5;
  index:number;
  angleIterate:number;
  location:any;
  centreLine:LineObject;
  guideLeftLine:any;
  guideRightLine:any;
  trapezoid:TrapezoidObject;

  constructor(p5: P5, index:number, angleIterate:number, location:any) {
    this.p5 = p5;
    this.index = index;
    this.angleIterate = angleIterate;
    this.location = location;

    this.setupLines();
    this.setupTrap();
  }

  setupLines = () => {
    let centrePoint = polarToCartesian(this.location.x,this.location.y, this.angleIterate * this.index, 2000);
    this.centreLine = {
      x1: this.location.x,
      y1: this.location.y,
      x2: centrePoint.x,
      y2: centrePoint.y,
      angle: this.angleIterate * this.index
    }

    let guideLeftPoint = polarToCartesian(this.location.x,this.location.y, (this.angleIterate * this.index) - this.angleIterate/2, 2000);
    this.guideLeftLine = {
      x1: this.location.x,
      y1: this.location.y,
      x2: guideLeftPoint.x,
      y2: guideLeftPoint.y,
      angle: (this.angleIterate * this.index) - this.angleIterate/2
    }

    let guideRightPoint = polarToCartesian(this.location.x,this.location.y, (this.angleIterate * this.index) + this.angleIterate/2, 2000);
    this.guideRightLine = {
      x1: this.location.x,
      y1: this.location.y,
      x2: guideRightPoint.x,
      y2: guideRightPoint.y,
      angle: (this.angleIterate * this.index) + this.angleIterate/2
    }
  }

  setupTrap = () => {
    
    let leftPoint = findPointBetweenTwo(0.5,this.guideLeftLine.x1,this.guideLeftLine.y1,this.guideLeftLine.x2,this.guideLeftLine.y2);
    let rightPoint = findPointBetweenTwo(0.5,this.guideRightLine.x1,this.guideRightLine.y1,this.guideRightLine.x2,this.guideRightLine.y2);
    
    let dx = leftPoint.x - rightPoint.x;
    let dy = leftPoint.y - rightPoint.y;
    let radians = Math.atan2(dy,dx);

    let adjustRad = this.p5.radians(45);
    let bottomLine = polarToCartesian(rightPoint.x,rightPoint.y,radians-adjustRad, 2000);
    let bottomPoint = intersect(this.guideLeftLine.x1,this.guideLeftLine.y1,this.guideLeftLine.x2,this.guideLeftLine.y2, rightPoint.x,rightPoint.y, bottomLine.x, bottomLine.y);

    let adjustTopRad = this.p5.radians(135);
    let topLine = polarToCartesian(leftPoint.x,leftPoint.y,radians+adjustTopRad, 2000);
    let topPoint = intersect(this.guideRightLine.x1,this.guideRightLine.y1,this.guideRightLine.x2,this.guideRightLine.y2, leftPoint.x, leftPoint.y, topLine.x, topLine.y);

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
    this.p5.strokeWeight(1);
    this.p5.stroke(0, 0, 0);
    this.p5.line(this.centreLine.x1,this.centreLine.y1, this.centreLine.x2,this.centreLine.y2);
    this.p5.stroke(255, 204, 0);
    this.p5.line(this.guideLeftLine.x1,this.guideLeftLine.y1, this.guideLeftLine.x2,this.guideLeftLine.y2);
    this.p5.stroke('blue');
    this.p5.line(this.guideRightLine.x1,this.guideRightLine.y1, this.guideRightLine.x2, this.guideRightLine.y2);


    let dx = this.trapezoid.leftX - this.trapezoid.rightX;
    let dy = this.trapezoid.leftY - this.trapezoid.rightY;
    let radians = Math.atan2(dy,dx);
    let guideLine = polarToCartesian(this.trapezoid.rightX,this.trapezoid.rightY,radians, 2000);
    this.p5.stroke(50, 50, 50);
    this.p5.line(guideLine.x, guideLine.y, this.trapezoid.rightX, this.trapezoid.rightY);

    let adjustRad = this.p5.radians(45);
    let angleLine = polarToCartesian(this.trapezoid.rightX,this.trapezoid.rightY,radians-adjustRad, 2000);
    this.p5.stroke('#fae');
    this.p5.line(angleLine.x, angleLine.y, this.trapezoid.rightX, this.trapezoid.rightY);

    let adjustTopRad = this.p5.radians(135);
    let angleTopLine = polarToCartesian(this.trapezoid.leftX,this.trapezoid.leftY,radians+adjustTopRad, 2000);
    this.p5.stroke('#fae');
    this.p5.line(angleTopLine.x, angleTopLine.y, this.trapezoid.leftX, this.trapezoid.leftY);

    /*this.p5.fill('red');
    this.p5.circle(this.trapezoid.leftX, this.trapezoid.leftY, 20);
    this.p5.circle(this.trapezoid.rightX, this.trapezoid.rightY, 20);
    this.p5.circle(this.trapezoid.topX, this.trapezoid.topY, 20);
    this.p5.circle(this.trapezoid.bottomX, this.trapezoid.bottomY, 20);*/

    this.p5.fill('black');
    this.p5.beginShape();
    this.p5.vertex(this.trapezoid.rightX, this.trapezoid.rightY);
    this.p5.vertex(this.trapezoid.bottomX, this.trapezoid.bottomY);
    this.p5.vertex(this.trapezoid.leftX, this.trapezoid.leftY);
    this.p5.vertex(this.trapezoid.topX, this.trapezoid.topY);
    this.p5.endShape(this.p5.CLOSE);
  }
}

export default Cone;