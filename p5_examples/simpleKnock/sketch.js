const arduino = new ArduinoSerial({ baudRate: 115200 });

let knock;
let audioOn = false;
let wasAbove = false;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(64);
  knock = await loadSound("knocker.mp3");
}

function draw() {
  background(220);
  text(arduino.value ?? "waiting...", width / 2, height / 2);

  // Play once each time the value goes above 10, not on every frame it stays high
  let isAbove = arduino.value > 10;
  if (isAbove && !wasAbove && audioOn) {
    knock.start();
  }
  wasAbove = isAbove;
}

// Browsers block audio until the user clicks
function mousePressed() {
  userStartAudio();
  audioOn = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
