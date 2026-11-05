const notes = new Notes();

// One button on the screen for each note
const NOTES = ["C4", "G4"];
const SIZE = 150; // how wide the buttons are

let pressed = null; // which button is held down, or null if none
let sound; // the note playing right now

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);
}

function draw() {
  background(220);

  for (let i = 0; i < NOTES.length; i++) {
    // White while it's held down
    if (i === pressed) {
      fill(255);
    } else {
      fill(0);
    }
    circle(buttonX(i), height / 2, SIZE);

    fill(0);
    text(NOTES[i], buttonX(i), height / 2 + SIZE / 2 + 40);
  }
}

// Space the buttons evenly across the canvas
function buttonX(i) {
  return (width * (i + 1)) / (NOTES.length + 1);
}

// Start a note if the click landed on a button
function mousePressed() {
  for (let i = 0; i < NOTES.length; i++) {
    if (dist(mouseX, mouseY, buttonX(i), height / 2) < SIZE / 2) {
      pressed = i;
      sound = notes.hold(NOTES[i]);
    }
  }
}

// Stop the note when the mouse lets go, even if it has moved off the button
function mouseReleased() {
  if (sound) {
    sound.stop();
    sound = null;
  }
  pressed = null;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
