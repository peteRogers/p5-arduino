const NUM_BUTTONS = 2;

// Latched state of each button: flips on every press, ignores releases
const latched = [false, false];

const arduino = new ArduinoSerial({ baudRate: 115200 });

// Runs on every message, so a quick press between frames still counts
// arduino.onSensor = (id, value) => {
//   if (value === 1) {
//     latched[id] = !latched[id];
//   }
// };

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  

  // One circle per button id, side by side
  for (let i = 0; i < NUM_BUTTONS; i++) {
    let x = (width * (i + 1)) / (NUM_BUTTONS + 1);

    // White when pressed (1), black when released (0)
    if (arduino.sensors[i] == 1) {
      fill(255);
    } else {
      fill(0);
    }

    circle(x, height / 2, 50);
  }
}

// LATCHING VERSION: comment out the draw() above and uncomment this one
// Press once to turn a circle white, press again to turn it black
// function draw() {
//   background(220);
//   const diameter = min(width / 4, height / 2);
//
//   for (let i = 0; i < NUM_BUTTONS; i++) {
//     const x = (width * (i + 1)) / (NUM_BUTTONS + 1);
//
//     if (latched[i]) {
//       fill(255);
//     } else {
//       fill(0);
//     }
//
//     circle(x, height / 2, diameter);
//   }
// }

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
