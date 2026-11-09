# anime_cutout

Plays anime dancing GIFs with the backgrounds removed, all at once and layered on top of each other in the middle of the screen.

The GIFs come from the [nekos.best](https://nekos.best) API. A Python script runs each frame through a machine-learning model that cuts the characters out of the background, and saves the results for the p5.js sketch to show.

## What's in this folder

- `sketch.js` — the p5.js sketch. It loads `cutouts.json` and shows every cut-out on top of the others.
- `make_cutouts.py` — the Python script that downloads the GIFs and makes the cut-outs.
- `cutouts/` — the cut-out files made by the script (transparent animated WebP).
- `cutouts.json` — the list of cut-outs that the sketch loads.
- `requirements.txt` — the Python packages the script needs.

## Running the sketch

The cut-outs are already made, so you don't need Python just to run the sketch.

Open the folder with a local server (for example, Live Server in VS Code), the same way as the other sketches. It has to be a server, not a double-clicked `index.html`, because the browser won't load `cutouts.json` from a plain file.

If the screen says *"No cutouts.json yet"*, run the script below first.

## Making new cut-outs

You only need this if you want a new set of GIFs, or a different category.

### 1. Set up (once per computer)

You need Python 3.10 or newer. From inside this folder:

macOS / Linux:
```
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Windows:
```
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

The `.venv` folder only works on the computer that made it, so don't copy it to another machine — run the setup again there instead.

### 2. Run the script

```
python make_cutouts.py
```

(Run `source .venv/bin/activate`, or `.venv\Scripts\activate` on Windows, first if you've opened a new terminal.)

- The computer needs to be online: the script downloads the GIFs and, the first time, the model (176 MB). The model is saved in a `.rembg` folder in your home folder, so it only downloads once.
- It runs every frame of every GIF through the model, so it can take a few minutes on a fast computer and 15–30 minutes on a slower one. It prints each GIF as it goes.
- It **replaces** everything in `cutouts/` and `cutouts.json` with a fresh set of 20.

### Changing the GIFs

At the top of `make_cutouts.py`:

- `CATEGORY` — which kind of GIF to get, such as `dance`, `wave`, `hug`, `happy` or `cry`. The full list is at <https://nekos.best/api/v2/endpoints>.
- `AMOUNT` — how many to get (20 at most).

## How it works

### The model

The script uses [rembg](https://github.com/danielgatis/rembg) with the `isnet-anime` model, which was trained on anime characters. It looks at each frame and works out which pixels belong to a character and which belong to the background, then makes the background transparent.

GIFs with one or a few clear characters come out well. Busy scenes, blurry frames, or wide shots can come out faint, patchy, or flickery. If one looks bad, delete its entry from `cutouts.json` and the sketch will leave it out.

### Why WebP and not GIF

GIF transparency is all-or-nothing for each pixel, so cut-out edges look jagged. Animated WebP keeps soft edges.

### Why the sketch doesn't draw on the canvas

A p5 canvas can only draw the first frame of an animated WebP. So each cut-out is added to the page as an image with `createImg()`, and the browser keeps it animating. The sketch sets each image's `z-index` to choose which one is on top, and every frame they all move down one layer, with the bottom one going back to the top. Change `framesPerStep` in `sketch.js` to slow this down.

Each GIF starts playing when it finishes loading and has its own length, so they don't start or loop in step with each other.
