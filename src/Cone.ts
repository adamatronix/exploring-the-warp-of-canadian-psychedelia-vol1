import * as P5 from 'p5';

interface LineObject {
  x1:number,
  y1:number,
  x2:number,
  y2:number,
  angle:number
}

class Cone {
  p5:P5;
  index:number;
  angleIterate:number;
  location:any;
  centreLine:LineObject;
  guideLeftLine:any;
  guideRightLine:any;

  constructor(p5: P5, index:number, angleIterate:number, location:any) {
    this.p5 = p5;
    this.index = index;
    this.angleIterate = angleIterate;
    this.location = location;

    this.setupLines();
  }

  setupLines = () => {
    let x =  this.location.x + (this.p5.cos(this.angleIterate * this.index) * 2000);
    let y =  this.location.y + (this.p5.sin(this.angleIterate * this.index) * 2000);
    this.centreLine = {
      x1: this.location.x,
      y1: this.location.y,
      x2: x,
      y2: y,
      angle: this.angleIterate * this.index
    }

    let guideLeftX = this.location.x + this.p5.cos((this.angleIterate * this.index) - this.angleIterate/2) * 2000;
    let guideLeftY = this.location.y + this.p5.sin((this.angleIterate * this.index) - this.angleIterate/2) * 2000;

    this.guideLeftLine = {
      x1: this.location.x,
      y1: this.location.y,
      x2: guideLeftX,
      y2: guideLeftY,
      angle: (this.angleIterate * this.index) - this.angleIterate/2
    }

    let guideRightX = this.location.x + this.p5.cos((this.angleIterate * this.index) + this.angleIterate/2) * 2200;
    let guideRightY = this.location.y + this.p5.sin((this.angleIterate * this.index) + this.angleIterate/2) * 2200;

    this.guideRightLine = {
      x1: this.location.x,
      y1: this.location.y,
      x2: guideRightX,
      y2: guideRightY,
      angle: (this.angleIterate * this.index) + this.angleIterate/2
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
  }
}

export default Cone;