const arduino = new ArduinoSerial({ baudRate: 115200 });
const notes = new Notes();

const NOTE = "A";
const SENSOR_MAX = 1100; // at this value and above the pitch is at its highest
const SEMITONES = 12; // how far the pitch rises at SENSOR_MAX (12 = one octave)

let sound; // empty until the click starts the note

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(64);
}

function draw() {
  background(220);
  text(arduino.value ?? "waiting...", width / 2, height / 2);

  if (sound) {
    sound.bend(arduino.value, SENSOR_MAX, SEMITONES);
  } else {
    textSize(24);
    text("click to start the note", width / 2, height / 2 + 70);
    textSize(64);
  }
}

// Browsers block audio until the user clicks
function mousePressed() {
  sound ??= notes.hold(NOTE); // start the note once, on the first click
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
