import * as P5 from 'p5';
import findPointBetweenTwo from './utils/findPointBetweenTwo';
import polarToCartesian from './utils/polarToCartesian';
import distanceOfLine from './utils/distanceOfLine';
import Trapezoid from './Trapezoid';

interface LineObject {
  x1:number,
  y1:number,
  x2:number,
  y2:number,
  angle:number
}

interface MaskPoint {
  x:number,
  y:number,
  distance:number
}

class Cone {
  p5:P5;
  index:number;
  angleIterate:number;
  location:any;
  centreLine:LineObject;
  guideLeftLine:any;
  guideRightLine:any;
  trapezoids:any = [];
  maskPoint:MaskPoint;
  maskPointDistanceFromLocation:number;
  counter:any = 0;
  maskDirection:string = 'down';


  constructor(p5: P5, index:number, angleIterate:number, location:any) {
    this.p5 = p5;
    this.index = index;
    this.angleIterate = angleIterate;
    this.location = location;

    this.setupLines();
    this.setupTrap();
  }

  setupLines = () => {
    let centrePoint = polarToCartesian(this.location.x,this.location.y, this.angleIterate * this.index, 4500);
    this.centreLine = {
      x1: this.location.x,
      y1: this.location.y,
      x2: centrePoint.x,
      y2: centrePoint.y,
      angle: this.angleIterate * this.index
    }

    let guideLeftPoint = polarToCartesian(this.location.x,this.location.y, (this.angleIterate * this.index) - this.angleIterate/2, 4500);
    this.guideLeftLine = {
      x1: this.location.x,
      y1: this.location.y,
      x2: guideLeftPoint.x,
      y2: guideLeftPoint.y,
      angle: (this.angleIterate * this.index) - this.angleIterate/2
    }


    let guideRightPoint = polarToCartesian(this.location.x,this.location.y, (this.angleIterate * this.index) + this.angleIterate/2, 4500);
    this.guideRightLine = {
      x1: this.location.x,
      y1: this.location.y,
      x2: guideRightPoint.x,
      y2: guideRightPoint.y,
      angle: (this.angleIterate * this.index) + this.angleIterate/2
    }
  }

  setupTrap = () => {

    for(let i = 0; i < 30; i++) {
      let t =  i / 30;
      let position = t*t*t*t*t*t;

      this.trapezoids.push(new Trapezoid(this.p5,position,this.centreLine,this.guideLeftLine,this.guideRightLine));
    }
  }

  calculateMaskPoint = (percent:any) => {
    const point = findPointBetweenTwo(percent,this.guideRightLine.x1,this.guideRightLine.y1,this.guideRightLine.x2,this.guideRightLine.y2);
    this.maskPoint = {
      x: point.x,
      y: point.y,
      distance: distanceOfLine(this.location.x,this.location.y,point.x,point.y)
    }
  }

  draw = () => {
    this.calculateMaskPoint(this.counter);
    if(this.counter <= 0) {
      this.maskDirection = 'up';
    } else if(this.counter >= 1){
      this.maskDirection = 'down';
    }
    /*
    if(this.maskDirection === 'up') {
      this.counter += 0.002;
    } else if(this.maskDirection === 'down'){
      this.counter -= 0.002;
    }*/
    
    
    /*this.p5.strokeWeight(1);
    this.p5.stroke(0, 0, 0);
    this.p5.line(this.centreLine.x1,this.centreLine.y1, this.centreLine.x2,this.centreLine.y2);
    this.p5.stroke(255, 204, 0);
    this.p5.line(this.guideLeftLine.x1,this.guideLeftLine.y1, this.guideLeftLine.x2,this.guideLeftLine.y2);
    this.p5.stroke('blue');
    this.p5.line(this.guideRightLine.x1,this.guideRightLine.y1, this.guideRightLine.x2, this.guideRightLine.y2);*/


    

    /*this.p5.fill('red');
    this.p5.circle(this.trapezoid.leftX, this.trapezoid.leftY, 20);
    this.p5.circle(this.trapezoid.rightX, this.trapezoid.rightY, 20);
    this.p5.circle(this.trapezoid.topX, this.trapezoid.topY, 20);
    this.p5.circle(this.trapezoid.bottomX, this.trapezoid.bottomY, 20);*/
    this.p5.fill('red');
    //this.p5.circle(this.maskPoint.x,this.maskPoint.y,10);

    this.trapezoids.forEach((trapezoid:Trapezoid) => {
      trapezoid.draw(this.maskPoint);

      /*let dx = trapezoid.trapezoid.leftX - trapezoid.trapezoid.rightX;
      let dy = trapezoid.trapezoid.leftY - trapezoid.trapezoid.rightY;
      let radians = Math.atan2(dy,dx);
      let guideLine = polarToCartesian(trapezoid.trapezoid.rightX,trapezoid.trapezoid.rightY,radians, 2000);
      this.p5.stroke(50, 50, 50);
      this.p5.line(guideLine.x, guideLine.y, trapezoid.trapezoid.rightX, trapezoid.trapezoid.rightY);

      let adjustRad = this.p5.radians(45);
      let angleLine = polarToCartesian(trapezoid.trapezoid.rightX,trapezoid.trapezoid.rightY,radians-adjustRad, 2000);
      this.p5.stroke('#fae');
      this.p5.line(angleLine.x, angleLine.y, trapezoid.trapezoid.rightX, trapezoid.trapezoid.rightY);

      let adjustTopRad = this.p5.radians(135);
      let angleTopLine = polarToCartesian(trapezoid.trapezoid.leftX,trapezoid.trapezoid.leftY,radians+adjustTopRad, 2000);
      this.p5.stroke('#fae');
      this.p5.line(angleTopLine.x, angleTopLine.y, trapezoid.trapezoid.leftX, trapezoid.trapezoid.leftY);*/
    })
  }
}

export default Cone;