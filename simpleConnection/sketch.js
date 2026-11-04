let latestMessage = "waiting...";
let drums;
let knock;
let isAboveThreshold = false;

const KNOCK_THRESHOLD = 10;

const arduino = new ArduinoSerial({ baudRate: 115200 });
arduino.onLine = (line) => {
  latestMessage = line;
};

// Runs on every reading, so a short spike between frames still triggers a knock
arduino.onValue = (value) => {
  const isAbove = value > KNOCK_THRESHOLD;
  // Only play on the way up, not on every reading while the value stays high
  if (isAbove && !isAboveThreshold && knock) {
    // If the knock is still playing, start() cuts it off and plays it from the beginning.
    // It throws if called again before audio is unlocked (the audio clock isn't moving yet),
    // and an error here would stop the serial read loop, so ignore that case.
    try {
      knock.start();
    } catch (err) {
      console.warn("Knock skipped:", err.message);
    }
  }
  isAboveThreshold = isAbove;
};

async function setup() {
  createCanvas(windowWidth, windowHeight);
  knock = await loadSound('knocker.mp3');
  //drums = await loadSound('drums.wav');
  //drums.loop(true);
}



function draw() {
  background(220);
  circle(width/2, height/2, arduino.value);
  // drums.rate(map(arduino.value, 0, 1023, 0, 2))
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Browsers block audio until a user gesture, so unlock it on the first click
function mousePressed() {
  userStartAudio();
  if (!drums) return;
  if (drums && !drums.playing) {
    drums.start();
  }else{
    drums.stop()
  }
}