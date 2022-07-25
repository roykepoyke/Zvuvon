let txtSize = 18;
let font = 'Roboto';
let blue = [75, 126, 214];
let red = [209, 69, 74];

let menuWidth = 280;
let titleSpacing = 40;

let valueSpacing = 30;
let margin = valueSpacing/2;

let inputsHeight = 15;
let inputSize = 65;
let inputSpacing = 3;

let calc;
let btnHeight = 60;

let initV, initA, initH;
let finalPos, finalV, finalA;

function setupUI() {
  calc = new Button('CALCULATE', menuWidth/2, 2*titleSpacing + btnHeight/2 + 3*valueSpacing);
  
  initV = createInput('50');
  initA = createInput('20');
  initH = createInput('15000');
  
  initV.position(menuWidth - 93, 2*titleSpacing - inputsHeight - inputSpacing);
  initA.position(menuWidth - 93, 2*titleSpacing + valueSpacing - inputsHeight - inputSpacing);
  initH.position(menuWidth - 93, 2*titleSpacing + 2*valueSpacing - inputsHeight - inputSpacing);
  
  initV.addClass('inp');
  initA.addClass('inp');
  initH.addClass('inp');
  
  initV.style('font-size', txtSize + 'px');
  initA.style('font-size', txtSize + 'px');
  initH.style('font-size', txtSize + 'px');
  
  initV.size(inputSize);
  initA.size(inputSize);
  initH.size(inputSize);  
}

function drawUI() {
  push();
  textSize(txtSize);
  textFont(font);
  textAlign(CENTER);
  
  fill(35);
  noStroke();
  rect(0, 0, menuWidth, height);
  
  fill(140);
  text('RELEASE VALUES', menuWidth/2, titleSpacing);
  text('IMPACT VALUES', menuWidth/2, calc.y + btnHeight/2 + titleSpacing);
  
  textAlign(LEFT);
  textStyle(BOLD);
  
  fill(blue);
  text('VELOCITY (m/s)', margin, 2*titleSpacing);
  text('ANGLE (°)', margin, 2*titleSpacing + valueSpacing);
  text('ALTITUDE (m)', margin, 2*titleSpacing + 2*valueSpacing);
  
  fill(red);
  text('ΔX (m)', margin, calc.y + calc.h/2 + 2*titleSpacing);
  text('VELOCITY (m/s)', margin, calc.y + calc.h/2 + 2*titleSpacing + valueSpacing);
  text('ANGLE (°)', margin, calc.y + calc.h/2 + 2*titleSpacing + 2*valueSpacing);
  
  stroke(220)
  noFill();
  rect(menuWidth - 111, calc.y + calc.h/2 + 2*titleSpacing - 18, 90, 24, 5);
  rect(menuWidth - 111, calc.y + calc.h/2 + 2*titleSpacing + valueSpacing - 18, 90, 24, 5);
  rect(menuWidth - 111, calc.y + calc.h/2 + 2*titleSpacing + 2*valueSpacing - 18, 90, 24, 5);
  
  textStyle(NORMAL);
  textAlign(RIGHT);
  fill(220);
  noStroke();
  if (finalPos) text(round(finalPos*10)/10, menuWidth - margin - 10, calc.y + calc.h/2 + 2*titleSpacing);
  if (finalV) text(round(finalV*10)/10, menuWidth - margin - 10, calc.y + calc.h/2 + 2*titleSpacing + valueSpacing);
  if (finalA) text(round(finalA*10)/10, menuWidth - margin - 10, calc.y + calc.h/2 + 2*titleSpacing + 2*valueSpacing);
  
  imageMode(CENTER);
  tint(255, 50);
  image(logo, menuWidth/2, height - 120, menuWidth-60, menuWidth-60)
  pop();
  
  calc.draw();
}

class Button {
  constructor(txt, x, y, func) {
    this.txt = txt;
    this.x = x;
    this.y = y;
    this.w = menuWidth - 2*margin;
    this.h = btnHeight;
    this.func = func;
    this.btnShrink = 0;
    
    this.draw = function() {
      if (mouseX < this.x + this.w/2 && mouseX > this.x - this.w/2 &&
          mouseY < this.y + this.h/2 && mouseY > this.y - this.h/2) {
        document.body.style.cursor="pointer";
        if (mouseIsPressed) this.btnShrink = 1;
        else this.btnShrink = 0;
      } else document.body.style.cursor="default";
      push();
      noStroke();
      noFill();
      rectMode(CENTER)
      textAlign(CENTER);
      textSize(txtSize - this.btnShrink);
      textFont(font);
      fill(220);
      rect(this.x, this.y+1, this.w - 2*this.btnShrink, this.h - this.btnShrink, 5);
      fill(50);
      textStyle(BOLD);
      text(this.txt, this.x, this.y + 8);
      pop();
    }
  }
}

function mousePressed() {
  if (mouseX < calc.x + calc.w/2 && mouseX > calc.x - calc.w/2 &&
      mouseY < calc.y + calc.h/2 && mouseY > calc.y - calc.h/2) {
    Calc();
  }
}

function keyPressed() {
  if (keyCode === 13) {
    Calc();
  }
}

function Calc() {
  
  if (initV.value() < 0.1) { initV.value(0.1); } 
  if (initV.value() > 1000) { initV.value(1000); } 
  
  if (initA.value() < -89.9) { initA.value(-89.9); } 
  if (initA.value() > 89.9) { initA.value(89.9); } 
  
  if (initH.value() < 0) { initH.value(0); } 
  if (initH.value() > 15000) { initH.value(15000); }
  
  zvuvon.v = initV.value();
  zvuvon.a = initA.value();
  zvuvon.h = initH.value();

  let Purl = 'http://192.168.59.100:31705/position?V=' + zvuvon.v +'&A=' + zvuvon.a +'&H=' + zvuvon.h;
  httpGet(Purl, 'json', true, function(response) { finalPos = response.position });

  let Vurl = 'http://192.168.59.100:31705/velocity?V=' + zvuvon.v +'&A=' + zvuvon.a +'&H=' + zvuvon.h;
  httpGet(Vurl, 'json', true, function(response) { finalV = response.position });

  let Aurl = 'http://192.168.59.100:31705/angle?V=' + zvuvon.v +'&A=' + zvuvon.a +'&H=' + zvuvon.h;
  httpGet(Aurl, 'json', true, function(response) { finalA = response.position });
}
