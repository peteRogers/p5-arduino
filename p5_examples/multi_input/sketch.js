const NUM_BUTTONS = 2;

const arduino = new ArduinoSerial({baudRate: 115200});

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  // One circle per button id, side by side
  for (let i = 0; i < NUM_BUTTONS; i++) {
    
    let x = columnX(i);
    console.log(x)

    // White when pressed (1), black when released (0)
    if (arduino.sensors[i] == 1) {
      fill(255);
    } else {
      fill(0);
    }
    circle(x, height / 2, 50);
  }
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Returns the x position for column i (0-based), spacing
// NUM_BUTTONS columns evenly across the canvas width
function columnX(i) {
  return (width / (NUM_BUTTONS + 1)) * (i + 1);
}
