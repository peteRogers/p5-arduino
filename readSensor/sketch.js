const arduino = new ArduinoSerial({ baudRate: 115200 });

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(64);
}

function draw() {
  background(220);
  // arduino.value is null until the first reading arrives
  text(arduino.value ?? "waiting...", width / 2, height / 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
