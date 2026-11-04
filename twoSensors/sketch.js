const THRESHOLD = 10;

// One entry per sensor: sensors[0] reads the first number on each line, sensors[1] the second
const sensors = [
  { file: "knocker.mp3", sound: null, isAboveThreshold: false },
  { file: "drums.wav", sound: null, isAboveThreshold: false },
];

const arduino = new ArduinoSerial({ baudRate: 115200 });

// Runs on every reading, so a short spike between frames still triggers a sound
arduino.onValues = (values) => {
  sensors.forEach((sensor, i) => {
    const isAbove = values[i] > THRESHOLD;
    // Only play on the way up, not on every reading while the value stays high
    if (isAbove && !sensor.isAboveThreshold && sensor.sound) {
      // If the sound is still playing, start() cuts it off and plays it from the beginning.
      // It throws if called again before audio is unlocked (the audio clock isn't moving yet),
      // and an error here would stop the serial read loop, so ignore that case.
      try {
        sensor.sound.start();
      } catch (err) {
        console.warn("Sound skipped:", err.message);
      }
    }
    sensor.isAboveThreshold = isAbove;
  });
};

async function setup() {
  createCanvas(windowWidth, windowHeight);
  for (const sensor of sensors) {
    sensor.sound = await loadSound(sensor.file);
  }
}

function draw() {
  background(220);
  // One circle per sensor, side by side
  sensors.forEach((sensor, i) => {
    const x = (width * (i + 1)) / (sensors.length + 1);
    circle(x, height / 2, arduino.values[i] ?? 0);
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Browsers block audio until a user gesture, so unlock it on the first click
function mousePressed() {
  userStartAudio();
}
