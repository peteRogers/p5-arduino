const NUM_BLOBS = 2000;
const ARDUINO_MAX = 1023; // analogRead()-style range: 0-1023
const SEPARATION_RADIUS = 26; // also used as the spatial grid cell size

let blobs = [];
let smoothLevel = 0; // eased 0..1 version of the Arduino value

const arduino = new ArduinoSerial({ baudRate: 115200 });

class Blob {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    const angle = random(TWO_PI);
    const speed = random(1, 2);
    this.vx = cos(angle) * speed;
    this.vy = sin(angle) * speed;
    this.baseSize = random(14, 30);
    this.noiseOffset = random(1000);
    this.hue = random(360);
    this._col = 0; // grid cell, set by buildGrid() each frame
    this._row = 0;
  }

  steer(level, centroidX, centroidY) {
    // gentle pull toward the swarm's center of mass - keeps it a "swarm", not scattered dots
    const cohesionX = (centroidX - this.x) * 0.004;
    const cohesionY = (centroidY - this.y) * 0.004;

    // slow-changing noise field for organic base motion; level speeds up how fast it shifts
    const t = frameCount * map(level, 0, 1, 0.003, 0.02);
    const flowAngle = noise(this.noiseOffset, t) * TWO_PI * 2;
    const flowX = cos(flowAngle) * 0.2;
    const flowY = sin(flowAngle) * 0.2;

    // erratic jitter: higher level = sharper, more frequent random kicks
    const jitterMag = map(level, 0, 1, 0.05, 3) * random();
    const jitterAngle = random(TWO_PI);
    const jitterX = cos(jitterAngle) * jitterMag;
    const jitterY = sin(jitterAngle) * jitterMag;

    this.vx += cohesionX + flowX + jitterX;
    this.vy += cohesionY + flowY + jitterY;

    const maxSpeed = map(level, 0, 1, 1.2, 9);
    const speed = Math.hypot(this.vx, this.vy);
    if (speed > maxSpeed) {
      const scale = maxSpeed / speed;
      this.vx *= scale;
      this.vy *= scale;
    }
  }

  // Only checks blobs sharing this blob's grid cell or an adjacent one (see buildGrid),
  // instead of the whole flock, so this stays ~O(n) instead of O(n^2) at large counts.
  separate(grid) {
    const desiredSq = SEPARATION_RADIUS * SEPARATION_RADIUS;
    let pushX = 0;
    let pushY = 0;
    for (let dc = -1; dc <= 1; dc++) {
      for (let dr = -1; dr <= 1; dr++) {
        const cell = grid.get((this._col + dc) + ',' + (this._row + dr));
        if (!cell) continue;
        for (const other of cell) {
          if (other === this) continue;
          const dx = this.x - other.x;
          const dy = this.y - other.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 0 && distSq < desiredSq) {
            // push strength falls off as 1/distSq - no sqrt needed
            pushX += dx / distSq;
            pushY += dy / distSq;
          }
        }
      }
    }
    this.vx += pushX * 0.5;
    this.vy += pushY * 0.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.95; // damping so speed doesn't run away
    this.vy *= 0.95;
  }

  wrapEdges() {
    const r = this.baseSize / 2;
    if (this.x < -r) this.x = width + r;
    if (this.x > width + r) this.x = -r;
    if (this.y < -r) this.y = height + r;
    if (this.y > height + r) this.y = -r;
  }

  display(level) {
    const pulse = sin(frameCount * 0.08 + this.noiseOffset) * (2 + level * 6);
    fill((this.hue + level * 140) % 360, 70, 95, 85);
    circle(this.x, this.y, this.baseSize + pulse);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  for (let i = 0; i < NUM_BLOBS; i++) {
    blobs.push(new Blob());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function swarmCentroid() {
  let sumX = 0;
  let sumY = 0;
  for (const b of blobs) {
    sumX += b.x;
    sumY += b.y;
  }
  return [sumX / blobs.length, sumY / blobs.length];
}

// Buckets blobs into cells of SEPARATION_RADIUS so separate() only has to scan
// nearby cells instead of every other blob. Rebuilt every frame since blobs move.
function buildGrid() {
  const grid = new Map();
  for (const b of blobs) {
    const col = Math.floor(b.x / SEPARATION_RADIUS);
    const row = Math.floor(b.y / SEPARATION_RADIUS);
    b._col = col;
    b._row = row;
    const key = col + ',' + row;
    let cell = grid.get(key);
    if (!cell) {
      cell = [];
      grid.set(key, cell);
    }
    cell.push(b);
  }
  return grid;
}

function draw() {
  const rawLevel = constrain((arduino.value ?? 0) / ARDUINO_MAX, 0, 1);
  smoothLevel = lerp(smoothLevel, rawLevel, 0.05);

  background(225, 45, 10, 30); // low-alpha fade for soft motion trails

  const [centroidX, centroidY] = swarmCentroid();
  const grid = buildGrid();

  for (const b of blobs) {
    b.steer(smoothLevel, centroidX, centroidY);
    b.separate(grid);
    b.update();
    b.wrapEdges();
    b.display(smoothLevel);
  }

  fill(0, 0, 100);
  textSize(14);
  text('Arduino value: ' + (arduino.value !== null ? arduino.value : 'n/a'), 20, height - 40);
  text('Erraticism: ' + nf(smoothLevel, 1, 2), 20, height - 22);
}
