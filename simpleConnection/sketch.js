let latestMessage = "waiting...";

const arduino = new ArduinoSerial({ baudRate: 115200 });
arduino.onLine = (line) => {
  latestMessage = line;
};

function setup() {
  createCanvas(400, 200);
}

function draw() {
  background(220);
  textSize(16);
  text('Last message: ' + latestMessage, 20, 100);
  text('Status: ' + arduino.status, 20, 130);
}
