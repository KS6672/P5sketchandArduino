let serial;                             // variable to hold an instance of the serialport library
let portName = 'COM4';  // fill in your serial port name here
let inData;                             // for incoming serial data
let portSelector;

let dataMode;
let buttonData;
let potentiometerData;


function setup() {
  createCanvas(600, 600);
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);       // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing

  serial.list();                      // list the serial ports
  serial.openPort(portName);              // open a serial port

  angleMode(DEGREES);
}

function draw() {
  // black background, white text:
  background(0);
  fill(255);
  // display the incoming serial data as a string:
  text("sensor value: " + inData, 30, 50);
  fill(inData, 200, 100);
  ellipse( 230, 150, inData*2);

//-----------------------------------------------------------------------------------------------------------------------------
  background(150);
  translate(width / 2, height / 2); //centering the canvas
  //rotate(-90);

  strokeWeight(5);
  strokeWeight(5);

  // arc(-100,-115,50,200,180,0, PIE); //right ear
  // //right ear
  beginShape();
  curveVertex(-135, -105);
  curveVertex(-135, -105);
  curveVertex(-120, -175);
  curveVertex(-100, -185);
  curveVertex(-74, -175);
  curveVertex(-50, -105);
  curveVertex(-50, -105);
  endShape();

  //fold on right ear
  push();
  fill(0);
  triangle(-112, -185, -88, -185, -110, -155);
  pop();

  //arc(100,-115,50,200,180,0, PIE); //arc-ed left ear
  //left ear
  beginShape();
  curveVertex(135, -105);
  curveVertex(135, -105);
  curveVertex(120, -175);
  curveVertex(104, -215);
  curveVertex(55, -105);
  curveVertex(55, -105);
  endShape();

  //right ear unfolds/raises on mouseClick
  if (mouseIsPressed) {
    beginShape();
    curveVertex(-135, -105);
    curveVertex(-135, -105);
    curveVertex(-120, -175);
    curveVertex(-104, -215);
    curveVertex(-74, -175);
    curveVertex(-50, -105);
    curveVertex(-50, -105);
    endShape();
  }

  //face of the clock in white
  circle(0, 0, 350);

  //eyes
  push();
  strokeWeight(5);
  stroke(120, 120, 103);
  fill(211, 211, 211);
  arc(-70, -55, 60, 100, 180, 0, PIE); //left eye
  arc(70, -55, 60, 100, 180, 0, PIE); //right eye
  pop();

  //moving pupils
  push();
  fill("black");
  pupilX = map(mouseX - width / 2, 0, width, -20, 0); //movement in the x-axis
  pupilY = map(mouseY - height / 2, 0, height, 55, 60); //movement in the y-axis
  circle(pupilX - 60, pupilY - width / 4, 20); //pupil of the right eye
  circle(pupilX + 80, pupilY - width / 4, 20); //pupil of the left eye
  if (mouseIsPressed) {
    noStroke();
    fill(178, 190, 181); //eyelid color is gray
    arc(-70, -55, 60, 100, 180, 0, PIE); //left eye closes on mouseClick
    arc(70, -55, 60, 100, 180, 0, PIE); //right eye closes on mouseClick
    noStroke();
    fill(244, 194, 194); //tongue color is baby pink
    arc(0, 80, 80, 240, 0, 180, PIE); //tongue out on mouseClick
  }
  pop();

  //specifying variabls for time
  let h = hour();
  let m = minute();
  let s = second();

  //specifying lengths of clock hands
  let secLen = 110;
  let minLen = 95;
  let hourLen = 64;

  //drawing the second, minute and hour hands of the clock
  push();
  drawClock(s * 6, secLen, 2);
  drawClock(m * 6, minLen, 4);
  drawClock((h % 12) * 30, hourLen, 4);
  pop();

  //inner arcs for hour
  push();
  noFill();
  strokeWeight(4);
  stroke(102, 178, 255);
  for (let i = 1; i <= 4; i++) {
    arc(0, 0, 32 * i, 32 * i, -90, (h % 12) * 30 - 90);
  }
  pop();
  //end of inner arcs for hour

  //inner arcs for minute
  push();
  noFill();
  strokeWeight(2.5);
  stroke(178, 255, 102);
  for (let i = 1; i <= 10; i++) {
    arc(0, 0, 19 * i, 19 * i, -90, m * 6 - 90);
  }
  pop();
  //end of inner arcs for minute

  //inner arcs for second
  push();
  noFill();
  strokeWeight(2);
  stroke(246, 113, 113);
  for (let i = 1; i <= 19; i++) {
    arc(0, 0, 12 * i, 12 * i, -90, s * 6 - 90);
  }
  pop();
  //end of inner arcs for second

  //Center of the clock as the nose
  push();
  fill("gray");
  circle(0, 0, 20);
  pop();

  //numbers to be displayed in RomanNumeral
  push();
  textSize(20);
  fill(0, 102, 103);
  text("XII", -10, -140);
  text("II", 115, -58);
  //text('III',140,+5);
  text("IV", 113, 70);
  text("VI", -5, 160);
  text("VIII", -133, 70);
  //text('IX',-160,+5);
  text("X", -125, -58);
  pop();
}

//defining the clock drawing function
function drawClock(rotation, length, weight) {
  push();
  strokeWeight(weight);
  rotate(rotation);
  line(0, 0, 0, -length);
  pop();
}

//----------------------------------------------------------------------------------------------------------------------------------------------------

// make a serial port selector object:
function printList(portList) {
  // create a select object:
  portSelector = createSelect();
  portSelector.position(10, 10);
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // add this port name to the select object:
    portSelector.option(portList[i]);
  }
  // set an event listener for when the port is changed:
  portSelector.changed(mySelectEvent);
}

function mySelectEvent() {
  let item = portSelector.value();
  // if there's a port open, close it:
  if (serial.serialport != null) {
    serial.close();
  }
  // open the new port:
  serial.openPort(item);
}

function serverConnected() {
  console.log('connected to server.');
}

function portOpen() {
  console.log('the serial port opened.')
}

function serialEvent() {
  // read a byte from the serial port, convert it to a number:
  inString = serial.readLine();
if (inString == "potentiometer"){
  dataMode = "potentiometer"
}
else if(inString =="button"){
  dataMode = "button";
}
else if(dataMode == "potentiometer"){
  potentiometerData= inString
}
else if(dataMode == "button"){
  buttonData= inString
}

  inData = inString
}

function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
  console.log('The serial port closed.');
}