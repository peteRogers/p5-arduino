const arduino = new ArduinoSerial({ baudRate: 115200 });

const SENSOR_MAX = 1100; // at this value and above the ropes hang still
const NUM_ROPES = 50;
const MAX_WAVE = 0.5; // how hard the waves push the ropes at a sensor value of 0
const WAVE_SPEED = 0.2; // how fast the waves travel along each rope
const WAVE_TIGHTNESS = 0.5; // higher = more bends along each rope

let ropes = [];
let level = 0; // the sensor value smoothed and scaled to 0-1

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);
  makeRopes();
}

function draw() {
  background(220);

  // arduino.value is null until the first reading arrives, so stay still until then
  const reading = arduino.value ?? SENSOR_MAX;
  // Lower readings give more movement: 0 gives 1, SENSOR_MAX and above give 0
  const target = 1 - constrain(reading / SENSOR_MAX, 0, 1);
  level = lerp(level, target, 0.1);

  for (let i = 0; i < ropes.length; i++) {
    const rope = ropes[i];

    // Push every point sideways with a sine wave. Each point is a little further
    // along the wave than the one above it, which bends the rope into curves.
    for (let j = 0; j < rope.points.length; j++) {
      const p = rope.points[j];
      if (p.pinned) continue;
      // Adding i starts each rope at a different place in the wave
      p.x += sin(frameCount * WAVE_SPEED - j * WAVE_TIGHTNESS + i) * level * MAX_WAVE;
    }

    rope.update();
    rope.draw();
  }

  fill(0);
  noStroke();
  text(arduino.value ?? "waiting...", width / 2, height - 40);
}

// A row of evenly spaced ropes, with lengths that vary from rope to rope
function makeRopes() {
  ropes = [];
  for (let i = 0; i < NUM_ROPES; i++) {
    const x = width * ((i + 0.5) / NUM_ROPES);
    const length = height * (0.4 + 0.4 * ((i * 0.382) % 1));
    ropes.push(new Rope(x, 0, { length: length, segments: 20, thickness: 4 }));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  makeRopes(); // rebuild them to fit the new size
}
