// Gets anime GIFs from the nekos.best API and shows them.
// It asks the API for 20 GIFs once at the start, then each click
// picks a random one from that list (so we don't keep asking the server).
// Other categories to try: wave, pat, dance, happy, cry, smile, wink, nod
// Full list: https://nekos.best/api/v2/endpoints

let category = "dance";

let gifList = [];  // the 20 results from the API
let gif;           // the image we draw
let animeName = "";
let loading = false;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);

  // The API sends back JSON like:
  // { "results": [ { "url": "...gif", "anime_name": "...", "dimensions": {...} }, ... ] }
  // ?amount=20 asks for 20 results at once (20 is the most it will give)
  let data = await loadJSON("https://nekos.best/api/v2/" + category + "?amount=20");
  gifList = data.results;
  console.log(gifList);

  await showRandomGif();
}

function draw() {
  background(20);

  if (gif) {
    // Scale the GIF to fit the screen, keeping its shape
    let s = min(width / gif.width, (height - 80) / gif.height);
    image(gif, width / 2, height / 2 - 20, gif.width * s, gif.height * s);
  }

  fill(255);
  textSize(20);
  // if (loading) {
  //   text("loading...", width / 2, height - 40);
  // } else {
  //   text(animeName + "  (click for another " + category + ")", width / 2, height - 40);
  // }
}

async function showRandomGif() {
  loading = true;

  // random() with a list picks one item from it
  let result = random(gifList);

  gif = await loadImage(result.url);
  animeName = result.anime_name;
  loading = false;
}

function mousePressed() {
  if (!loading) {
    showRandomGif();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
