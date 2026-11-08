"""
Downloads 20 anime GIFs from nekos.best and cuts the characters out of the
background with the isnet-anime model (through rembg).

Every frame of every GIF goes through the model, and the results are saved as
transparent animated WebP files in cutouts/. It also writes cutouts.json, a
list of the files, which the p5 sketch loads.

Setup (once, from this folder):
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt

Run it:
    source .venv/bin/activate
    python make_cutouts.py

The first run downloads the model (about 170 MB). Every GIF has lots of
frames, so expect it to take a while: usually 10 to 20 minutes for all 20.
"""

import io
import json
import os
import urllib.request

from PIL import Image, ImageSequence
from rembg import new_session, remove

CATEGORY = "dance"  # try: wave, pat, hug, happy, cry, smile, wink, nod
AMOUNT = 20         # 20 is the most the API will give at once
OUT_DIR = "cutouts"

HERE = os.path.dirname(os.path.abspath(__file__))


def download(url):
    request = urllib.request.Request(url, headers={"User-Agent": "p5-anime-cutouts"})
    with urllib.request.urlopen(request) as response:
        return response.read()


def cut_out_gif(gif_bytes, session):
    """Runs the model on every frame and returns the cut-out frames and how long each one shows for."""
    gif = Image.open(io.BytesIO(gif_bytes))
    frames = []
    durations = []
    for frame in ImageSequence.Iterator(gif):
        durations.append(frame.info.get("duration", 100))
        frames.append(remove(frame.convert("RGB"), session=session))
    return frames, durations


def main():
    os.makedirs(os.path.join(HERE, OUT_DIR), exist_ok=True)

    print("Loading the isnet-anime model...")
    session = new_session("isnet-anime")

    api_url = f"https://nekos.best/api/v2/{CATEGORY}?amount={AMOUNT}"
    results = json.loads(download(api_url))["results"]

    cutouts = []
    for i, result in enumerate(results):
        name = f"{CATEGORY}_{i:02d}.webp"
        print(f"[{i + 1}/{len(results)}] {result['anime_name']}")
        try:
            frames, durations = cut_out_gif(download(result["url"]), session)
            frames[0].save(
                os.path.join(HERE, OUT_DIR, name),
                save_all=True,
                append_images=frames[1:],
                duration=durations,
                loop=0,
                quality=80,
            )
        except Exception as error:
            print(f"    skipped: {error}")
            continue

        cutouts.append({
            "file": f"{OUT_DIR}/{name}",
            "anime_name": result["anime_name"],
            "width": frames[0].width,
            "height": frames[0].height,
        })

    with open(os.path.join(HERE, "cutouts.json"), "w") as f:
        json.dump(cutouts, f, indent=2)

    print(f"Done: {len(cutouts)} cut-outs saved, listed in cutouts.json")


if __name__ == "__main__":
    main()
