
  // let url = 'http://192.168.59.100:31705/velocity?V=50&A=20&H=15000';
  // httpGet(url, 'json', true, function(response) { earthquakes = response });

let zvuvon;
let g = 9.81;

function preload() {
  logo = loadImage('utils/iaf.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  
  zvuvon = new Rocket();
  
  setupUI();
}

function draw() {
  background(220);
  if (zvuvon.v && zvuvon.a && zvuvon.h) zvuvon.draw();
  drawUI();
}

function keyPressed() {
  if (keyCode === 13) {
    Calc();
  }
}

class Rocket {
  constructor(h, v, a) {
    this.x = menuWidth + 150;
    this.y = 50;
    this.h = h;
    this.v = v;
    this.a = a;
    this.i = 0;
    this.factor = 1;

    this.draw = function() {
      push();
      
      let w = width - this.x - (this.x - menuWidth);
      let h = height - 100;
      
      let maxh = this.h;
      let maxw = finalPos;
      
      if (this.a >= 0) {
        let t = tan(this.a)/(2*(-g/(2*this.v*this.v*cos(this.a)*cos(this.a))));
        maxh = this.h -t*tan(this.a) - (g*t*t)/(2*this.v*this.v*cos(this.a)*cos(this.a));
      }
      
      if (maxh - h > maxw - w) this.factor = h/maxh;
      else this.factor = w/maxw;
      
      stroke(150)
      strokeWeight(10);
      translate(this.x, height - this.y)
      
      for (let x = 0; x < finalPos - finalPos/w; x+=finalPos/w) {
        let y = x*tan(this.a) - (g*x*x)/(2*this.v*this.v*cos(this.a)*cos(this.a));
        let nexty = (x+finalPos/w)*tan(this.a) - (g*(x+finalPos/w)*(x+finalPos/w))/(2*this.v*this.v*cos(this.a)*cos(this.a));
        line(x*this.factor, (-this.h-y)*this.factor, (x+finalPos/w)*this.factor, (-this.h-nexty)*this.factor);
      }
      
      stroke(40)
      strokeWeight(2);
      line(0, 0, 0, -this.h*this.factor);
      line(0, 0, finalPos*this.factor, 0);
      
      noStroke();
      fill(75, 126, 214);
      circle(0 ,-this.h*this.factor, 15)
      
      pop();
      
      noStroke();
      fill(209, 69, 74);
      circle(this.x + finalPos*this.factor, height - this.y, 15);
      fill(40);
      
      textAlign(CENTER);
      textSize(24);
      textFont('Roboto');
      text(round(finalPos*10)/10 + 'm', this.x + finalPos*this.factor/2, height - 20 - this.y);
    }
  }
}
