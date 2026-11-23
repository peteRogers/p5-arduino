// Upload arduino_code/buttons/multi_bounce to the Arduino. It sends "id,1" when
// a button is pressed and "id,0" when it's released.
const arduino = new ArduinoSerial({ baudRate: 115200 });

// One wav per button, kept in the sounds folder: sounds/a.wav, sounds/b.wav ...
// Button 0 plays a.wav, button 1 plays b.wav, and so on.
//const FILES = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];

const FILES = ["a"];

// Web Audio plays the loops without gaps and lets us fade in and out,
// which stops the clicks you get when a sound starts or stops suddenly
const audioCtx = new AudioContext();
const FADE = 0.02; // fade time in seconds - raise it if you still hear clicks

let audioOn = false;
let buffers = []; // the loaded sound for each button
let playing = []; // the sound each button is playing right now

// Runs on every message, so a quick press between frames still counts
arduino.onSensor = (id, value) => {
  if (!audioOn) return;

  if (value === 1) {
    startSound(id);
  } else {
    stopSound(id);
  }
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);

  loadSounds();
}

async function loadSounds() {
  for (let i = 0; i < FILES.length; i++) {
    let path = "sounds/" + FILES[i] + ".wav";
    try {
      let response = await fetch(path);
      let data = await response.arrayBuffer();
      buffers[i] = await audioCtx.decodeAudioData(data);
    } catch (err) {
      console.warn("Could not load " + path, err);
    }
  }
}

// Pressed: start from the beginning, fade in, and keep looping
function startSound(id) {
  if (!buffers[id]) return;
  stopSound(id); // in case it is still fading out

  let now = audioCtx.currentTime;
  let source = audioCtx.createBufferSource();
  source.buffer = buffers[id];
  source.loop = true;

  let gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(1, now + FADE);

  source.connect(gain).connect(audioCtx.destination);
  source.start(now);
  playing[id] = { source, gain };
}

// Released: fade out quickly, then stop
function stopSound(id) {
  let sound = playing[id];
  if (!sound) return;

  let now = audioCtx.currentTime;
  sound.gain.gain.cancelScheduledValues(now);
  sound.gain.gain.setValueAtTime(sound.gain.gain.value, now);
  sound.gain.gain.linearRampToValueAtTime(0, now + FADE);
  sound.source.stop(now + FADE);
  playing[id] = null;
}

function draw() {
  background(220);

  // One circle per sound: white while its button is held down
  for (let i = 0; i < FILES.length; i++) {
    let x = columnX(i);
    if (arduino.sensors[i] == 1) {
      fill(255);
    } else {
      fill(0);
    }
    circle(x, height / 2, 100);

    fill(0);
    text(FILES[i], x, height / 2 + 90);
  }

  if (!audioOn) {
    text("click to turn the sound on", width / 2, height - 60);
  }
}

// Browsers block audio until the user clicks
function mousePressed() {
  audioCtx.resume();
  audioOn = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function columnX(i) {
  return (width / (FILES.length + 1)) * (i + 1);
}
