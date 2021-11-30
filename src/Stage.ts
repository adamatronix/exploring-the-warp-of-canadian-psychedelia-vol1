import * as P5 from 'p5';
import Cone from './Cone';

class Stage {
  container:HTMLDivElement;
  cones:any = [];
  points:any = Array(10).fill(''); 
  location:any;
  constructor() {
    new P5(this.sketch);
  }

  coneSetup = (p5: P5) => {
    const angleIterate = p5.radians(360) /this.points.length;
    console.log(angleIterate);
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
      p5.frameRate(10);
      this.location = { x: p5.width / 2, y: p5.height / 2 };
      this.coneSetup(p5);
    }


    p5.draw = () => {
      p5.clear();
      this.cones.forEach((cone:Cone) => {
        cone.draw();
      })
    }
  }

}

export default Stage;