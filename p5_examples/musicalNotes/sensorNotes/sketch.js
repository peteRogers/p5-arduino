// Upload arduino_code/buttons/multi_bounce to the Arduino. It sends "id,1" when
// a button is pressed and "id,0" when it's released.
const arduino = new ArduinoSerial({ baudRate: 115200 });
const notes = new Notes();


// 12 notes going up one semitone at a time from C3
const NOTES = ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3"];

let audioOn = false;
let sounds = []; // the note each button is playing right now

// Runs on every message, so a quick press between frames still counts
arduino.onSensor = (id, value) => {
  if (!audioOn || NOTES[id] === undefined) return;

  if (value === 1) {
    sounds[id] = notes.hold(NOTES[id]);
  } else if (sounds[id]) {
    sounds[id].stop();
    sounds[id] = null;
  }
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);
}

function draw() {
  background(220);

  // One circle per note: white while its button is held down
  for (let i = 0; i < NOTES.length; i++) {
    let x = columnX(i);
    if (arduino.sensors[i] == 1) {
      fill(255);
    } else {
      fill(0);
    }
    circle(x, height / 2, 100);

    fill(0);
    text(NOTES[i], x, height / 2 + 90);
  }

  if (!audioOn) {
    text("click to turn the sound on", width / 2, height - 60);
  }
}

// Browsers block audio until the user clicks
function mousePressed() {
  audioOn = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function columnX(i) {
  return (width / (NOTES.length + 1)) * (i + 1);
}
