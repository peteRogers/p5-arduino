let latestMessage = "waiting...";
let smoothValue = 0; // eased version of arduino.value, for fluid motion
let angle = 0;

const arduino = new ArduinoSerial({ baudRate: 115200 });
arduino.onLine = (line) => {
  latestMessage = line;
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // ease toward the latest value so updates feel fluid, not jumpy
  smoothValue = lerp(smoothValue, arduino.value ?? 0, 0.08);
  const level = constrain(smoothValue / 1023, 0, 1);

  // low-alpha background instead of a hard clear, for motion trails
  background(220, 30, 8, 15);

  const cx = width / 2;
  const cy = height / 2;
  const particleCount = floor(map(level, 0, 1, 4, 60));
  const baseRadius = map(level, 0, 1, 40, min(width, height) * 0.4);
  const hueBase = (frameCount * 0.5 + level * 360) % 360;

  for (let i = 0; i < particleCount; i++) {
    const a = angle + (TWO_PI / particleCount) * i;
    const wobble = sin(frameCount * 0.05 + i) * 20 * level;
    const r = baseRadius + wobble;
    const x = cx + cos(a) * r;
    const y = cy + sin(a) * r;
    const size = map(level, 0, 1, 4, 24);
    fill((hueBase + i * (360 / particleCount)) % 360, 80, 100, 80);
    circle(x, y, size);
  }

  angle += map(level, 0, 1, 0.002, 0.08);

  fill(0, 0, 100);
  textSize(16);
  text('Last message: ' + latestMessage, 20, height - 50);
  text('Status: ' + arduino.status, 20, height - 25);
}
