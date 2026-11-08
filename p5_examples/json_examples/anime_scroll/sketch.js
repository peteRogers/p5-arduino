// Gets 20 anime GIFs from the nekos.best API, loads them all,
// and scrolls them up the screen in one long column.
// Each GIF's top sits on the bottom of the one above it,
// and when the column runs out it starts again from the first one.
// Other categories to try: wave, pat, hug, happy, cry, smile, wink, nod
// Full list: https://nekos.best/api/v2/endpoints

let category = "dance";

let gifs = [];      // all the loaded images
let speed = 512;      // how many pixels the column moves up each frame
let scrollY = 0;    // how far the column has scrolled so far

async function setup() {
  createCanvas(windowWidth, windowHeight);

  // show something while the GIFs download
  background(20);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("loading 20 GIFs...", width / 2, height / 2);
  speed = windowHeight
  // ?amount=20 asks for 20 results at once (20 is the most it will give)
  let data = await loadJSON("https://nekos.best/api/v2/" + category + "?amount=20");

  // start loading every GIF at the same time,
  // then wait until they have all finished
  let loads = [];
  for (let i = 0; i < data.results.length; i++) {
    loads.push(loadImage(data.results[i].url));
  }
  gifs = await Promise.all(loads);
}

function draw() {
  background(20);

  // every GIF is drawn this wide, and keeps its own shape
  let w = min(width, windowWidth);
  let x = (width - w) / 2;

  // add up the heights of all the GIFs to get the length of the column
  let total = 0;
  for (let i = 0; i < gifs.length; i++) {
    total += gifHeight(gifs[i], w);
  }

  // move up, and wrap round to 0 once the whole column has gone past
  scrollY = (scrollY + speed) % total;

  // start drawing above the screen and go down until we reach the bottom,
  // going back to the first GIF whenever we run out
  let y = -scrollY;
  let i = 0;
  while (y < height) {
    let h = gifHeight(gifs[i], w);
    image(gifs[i], x, y, w, h);
    y += h;                    // the next GIF starts where this one ends
    i = (i + 1) % gifs.length;
  }
}

// how tall a GIF is when it is drawn w pixels wide
function gifHeight(img, w) {
  return img.height * (w / img.width);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
