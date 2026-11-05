const NUM_BUTTONS = 2;


const arduino = new ArduinoSerial({baudRate: 115200});

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



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
