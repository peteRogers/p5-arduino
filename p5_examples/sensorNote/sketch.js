const arduino = new ArduinoSerial({ baudRate: 115200 });
const notes = new Notes();

const NOTE = "A";
const THRESHOLD = 10; // the note plays when the sensor goes above this
const SECONDS = 0.5; // how long the note lasts

let audioOn = false;
let wasAbove = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(64);
}

function draw() {
  background(220);
  text(arduino.value ?? "waiting...", width / 2, height / 2);

  if (!audioOn) {
    textSize(24);
    text("click to turn the sound on", width / 2, height / 2 + 70);
    textSize(64);
  }

  // Play once each time the value goes above the threshold, not on every frame it stays high
  let isAbove = arduino.value > THRESHOLD;
  if (isAbove && !wasAbove && audioOn) {
    notes.play(NOTE, SECONDS);
  }
  wasAbove = isAbove;
}

// Browsers block audio until the user clicks
function mousePressed() {
  audioOn = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
