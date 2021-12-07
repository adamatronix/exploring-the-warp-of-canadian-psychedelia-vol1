import * as P5 from 'p5';
import Cone from './Cone';

class Stage {
  container:HTMLDivElement;
  cones:any = [];
  points:any = Array(120).fill(''); 
  location:any;
  angleIterate:number;
  t:number = 0;
  constructor() {
    new P5(this.sketch);
  }

  coneSetup = (p5: P5) => {
    const angleIterate = p5.radians(360) /this.points.length;
    this.angleIterate = angleIterate;
    this.points.forEach((item:any, index:any) => {
      this.cones.push(new Cone(p5,index,angleIterate, this.location));
    });
  }

  sketch = (p5: P5) => {

    p5.setup = () => {
      const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
      canvas.style('position', 'absolute');
      canvas.style('left', 0);
      canvas.style('top', 0);
      canvas.style('z-index', 1);
      p5.frameRate(60);
      this.location = { x: p5.width / 2, y: p5.height / 2 };
      this.coneSetup(p5);
    }

    p5.draw = () => {
      p5.clear();
      p5.background('black');
      this.cones.forEach((cone:Cone,index:number) => {
        cone.draw();
      })
      this.t += 0.002;
    }
  }

}

export default Stage;