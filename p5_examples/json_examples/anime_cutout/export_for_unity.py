"""
Turns the cut-outs made by make_cutouts.py into files Unity can use with
transparency. It reads the WebP files in cutouts/, so it doesn't run the model
again and takes seconds, not minutes.

For each cut-out it makes, in unity_export/:

  sheets/<name>.png   a sprite sheet: every frame laid out in a grid
  sheets/<name>.json  the grid size, frame count and frame rate for that sheet
  video/<name>.webm   a VP8 WebM video with an alpha channel (needs ffmpeg)

Run it (after make_cutouts.py):
    source .venv/bin/activate
    python export_for_unity.py

The videos need ffmpeg (on macOS: brew install ffmpeg). Without it, you
still get the sprite sheets.
"""

import json
import math
import os
import shutil
import statistics
import subprocess
import tempfile

from PIL import Image, ImageSequence

MAKE_SHEETS = True
MAKE_VIDEOS = True
MAX_SHEET_SIZE = 4096  # biggest sheet width/height; frames shrink to fit under it

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "unity_export")


def read_frames(path):
    """Returns every frame of an animated WebP as RGBA, and how many ms each one shows for."""
    image = Image.open(path)
    frames = []
    durations = []
    for frame in ImageSequence.Iterator(image):
        frames.append(frame.convert("RGBA"))
        durations.append(frame.info.get("duration") or 100)
    return frames, durations


def frame_rate(durations):
    """Unity plays sprite animations and videos at a fixed rate, so pick the most typical one."""
    return round(1000 / statistics.median(durations), 3)


def make_sheet(name, frames, fps):
    count = len(frames)
    width, height = frames[0].size

    # Choose the number of columns that makes the sheet closest to square.
    columns = min(range(1, count + 1),
                  key=lambda c: abs(c * width - math.ceil(count / c) * height))
    rows = math.ceil(count / columns)

    # Shrink the frames if the sheet would be bigger than MAX_SHEET_SIZE.
    scale = min(1.0, MAX_SHEET_SIZE / (columns * width), MAX_SHEET_SIZE / (rows * height))
    cell_w = math.floor(width * scale)
    cell_h = math.floor(height * scale)

    sheet = Image.new("RGBA", (columns * cell_w, rows * cell_h), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        if scale < 1:
            frame = frame.resize((cell_w, cell_h), Image.LANCZOS)
        sheet.paste(frame, ((i % columns) * cell_w, (i // columns) * cell_h))

    sheet_dir = os.path.join(OUT_DIR, "sheets")
    sheet.save(os.path.join(sheet_dir, f"{name}.png"), optimize=True)

    info = {
        "image": f"{name}.png",
        "columns": columns,
        "rows": rows,
        "frameCount": count,
        "frameWidth": cell_w,
        "frameHeight": cell_h,
        "fps": fps,
    }
    with open(os.path.join(sheet_dir, f"{name}.json"), "w") as f:
        json.dump(info, f, indent=2)

    return f"{columns}x{rows} grid, {sheet.width}x{sheet.height}px"


def make_video(name, frames, durations, fps):
    with tempfile.TemporaryDirectory() as temp:
        # The concat list keeps each frame's own timing; ffmpeg then resamples
        # to a steady frame rate, which Unity's VideoPlayer expects.
        lines = []
        for i, frame in enumerate(frames):
            frame_path = os.path.join(temp, f"{i:04d}.png")
            frame.save(frame_path)
            lines.append(f"file '{frame_path}'\nduration {durations[i] / 1000}")
        lines.append(f"file '{frame_path}'")  # the last frame has to be listed twice
        list_path = os.path.join(temp, "frames.txt")
        with open(list_path, "w") as f:
            f.write("\n".join(lines))

        out_path = os.path.join(OUT_DIR, "video", f"{name}.webm")
        subprocess.run([
            "ffmpeg", "-y", "-loglevel", "error",
            "-f", "concat", "-safe", "0", "-i", list_path,
            "-r", str(fps), "-fps_mode", "cfr",
            # Video sizes must be even numbers.
            "-vf", "pad=ceil(iw/2)*2:ceil(ih/2)*2:0:0:color=black@0",
            "-c:v", "libvpx",           # VP8: the WebM codec Unity can play with alpha
            "-pix_fmt", "yuva420p",     # the "a" is the alpha channel
            "-auto-alt-ref", "0",       # VP8 drops alpha without this
            "-b:v", "4M", "-crf", "10",
            "-an",
            out_path,
        ], check=True)


def main():
    with open(os.path.join(HERE, "cutouts.json")) as f:
        cutouts = json.load(f)

    has_ffmpeg = shutil.which("ffmpeg") is not None
    if MAKE_VIDEOS and not has_ffmpeg:
        print("ffmpeg not found, so only making sprite sheets (on macOS: brew install ffmpeg)")

    os.makedirs(os.path.join(OUT_DIR, "sheets"), exist_ok=True)
    os.makedirs(os.path.join(OUT_DIR, "video"), exist_ok=True)

    for i, cutout in enumerate(cutouts):
        name = os.path.splitext(os.path.basename(cutout["file"]))[0]
        frames, durations = read_frames(os.path.join(HERE, cutout["file"]))
        fps = frame_rate(durations)
        print(f"[{i + 1}/{len(cutouts)}] {name}: {len(frames)} frames at {fps} fps")

        if MAKE_SHEETS:
            print(f"    sheet: {make_sheet(name, frames, fps)}")
        if MAKE_VIDEOS and has_ffmpeg:
            try:
                make_video(name, frames, durations, fps)
                print("    video: done")
            except subprocess.CalledProcessError as error:
                print(f"    video skipped: {error}")

    print(f"Done: files are in {os.path.relpath(OUT_DIR, HERE)}/")


if __name__ == "__main__":
    main()
