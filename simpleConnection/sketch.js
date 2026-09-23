let latestMessage = "waiting...";

const arduino = new ArduinoSerial({ baudRate: 115200 });
arduino.onLine = (line) => {
  latestMessage = line;
};

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  textSize(16);
  text('Last message: ' + latestMessage, 20, 100);
  text('Numeric value: ' + (arduino.value !== null ? arduino.value : 'n/a'), 20, 130);
  text('Status: ' + arduino.status, 20, 160);
}
