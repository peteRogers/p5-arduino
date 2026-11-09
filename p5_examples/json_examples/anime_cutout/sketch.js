// All the cut-out characters play at once, layered on top of each other
// in the middle of the screen.
// Run make_cutouts.py first: it makes the cut-out files and cutouts.json.
//
// The cut-outs are animated WebP files. A canvas can only draw the first frame
// of those, so instead each one is an image on the page (createImg).
// The browser keeps them all animating.
// Every frame the layers move down one, so a different cut-out is on top.

let cutouts = [];   // each one is { img, width, height }
let message = "";

let framesPerStep = 1;  // how many frames before the layers move down one (1 = every frame)
let step = 0;           // how many times the layers have moved down so far

async function setup() {
  createCanvas(windowWidth, windowHeight);

  // cutouts.json is a list like:
  // [ { "file": "cutouts/dance_00.webp", "anime_name": "...", "width": 498, "height": 281 }, ... ]
  try {
    let list = await loadJSON("cutouts.json");
    for (let i = 0; i < list.length; i++) {
      cutouts.push({
        img: createImg(list[i].file, list[i].anime_name),
        width: list[i].width,
        height: list[i].height,
      });
    }
  } catch (error) {
    message = "No cutouts.json yet - run make_cutouts.py first";
  }

  placeCutouts();
}

function draw() {
  background(20);

  if (cutouts.length == 0) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(message, width / 2, height / 2);
    return;
  }

  if (frameCount % framesPerStep == 0) {
    step++;
  }

  // every cut-out moves down one layer each step,
  // and the one at the bottom goes back to the top.
  // z-index sets the layer: the biggest number is drawn on top
  let n = cutouts.length;
  for (let i = 0; i < n; i++) {
    let layer = (((i - step) % n) + n) % n;
    cutouts[i].img.style("z-index", layer);
  }
}

// make every cut-out as big as fits on the screen (keeping its shape)
// and put it in the middle, so they all overlap
function placeCutouts() {
  for (let i = 0; i < cutouts.length; i++) {
    let c = cutouts[i];
    let s = min(width / c.width, height / c.height);
    let w = c.width * s;
    let h = c.height * s;
    c.img.size(w, h);
    c.img.position((width - w) / 2, (height - h) / 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  placeCutouts();
}
