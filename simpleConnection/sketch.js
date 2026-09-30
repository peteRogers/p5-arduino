let latestMessage = "waiting...";
let drums;

const arduino = new ArduinoSerial({ baudRate: 115200 });
arduino.onLine = (line) => {
  latestMessage = line;
};

async function setup() {
  createCanvas(windowWidth, windowHeight);
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

// Browsers block audio until a user gesture, so start the loop on the first click
function mousePressed() {
  if (drums && !drums.playing) {
    drums.start();
  }else{
    drums.stop()
  }
}