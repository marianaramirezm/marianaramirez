#!/usr/bin/env python3
"""Neutral photographic placeholders. Not pictures of real listings or of Mariana."""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "assets" / "placeholders"
PUBLIC = ROOT / "public"

SERIF = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
SANS = "/usr/share/fonts/truetype/macos/Inter-Regular.ttf"


def smoothstep(t: np.ndarray) -> np.ndarray:
    return t * t * (3 - 2 * t)


def scene(
    w: int,
    h: int,
    stops: list[tuple[float, tuple[int, int, int]]],
    glow: tuple[int, int, int],
    glow_pos: tuple[float, float],
    seed: int,
    glow_spread: float = 0.055,
    glow_gain: float = 70,
) -> Image.Image:
    rng = np.random.default_rng(seed)
    y = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    x = np.linspace(0, 1, w, dtype=np.float32)[None, :]
    ys = np.linspace(0, 1, h, dtype=np.float32)

    col_y = np.zeros((h, 3), dtype=np.float32)
    positions = [s[0] for s in stops]
    colors = [np.array(s[1], dtype=np.float32) for s in stops]
    for i in range(len(stops) - 1):
        p0, p1 = positions[i], positions[i + 1]
        span = max(p1 - p0, 1e-6)
        t = smoothstep(np.clip((ys - p0) / span, 0, 1))
        blend = colors[i][None, :] * (1 - t[:, None]) + colors[i + 1][None, :] * t[:, None]
        mask = (ys >= p0) & (ys <= p1 + 1e-6)
        col_y[mask] = blend[mask]
    col_y[ys <= positions[0]] = colors[0]
    col_y[ys >= positions[-1]] = colors[-1]

    cols = np.broadcast_to(col_y[:, None, :], (h, w, 3)).copy()

    gx, gy = glow_pos
    dist = np.sqrt((x - gx) ** 2 + ((y - gy) * (h / w)) ** 2)
    halo = np.exp(-(dist**2) / (2 * glow_spread))
    cols += halo[..., None] * (np.array(glow, dtype=np.float32) * (glow_gain / 255))

    horizon = positions[len(positions) // 2]
    water = np.clip((y - horizon) / max(0.001, 1 - horizon), 0, 1)
    ripple = np.sin(x * 18 + seed) * (2.2 * np.sqrt(water))
    cols += ripple[..., None]

    vx = (x - 0.5) * 1.15
    vy = (y - 0.46) * 1.2
    vig = np.clip(1 - (vx**2 + vy**2) * 0.55, 0.72, 1)
    cols *= vig[..., None]

    # Fine grain only. Chunkier noise reads as a broken photograph.
    grain = rng.normal(0, 2.2, (h, w, 1)).astype(np.float32)
    cols += grain

    img = Image.fromarray(np.clip(cols, 0, 255).astype(np.uint8), mode="RGB")
    return img.filter(ImageFilter.GaussianBlur(radius=0.35))


def save_jpg(img: Image.Image, path: Path, quality: int = 74) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "JPEG", quality=quality, optimize=True, progressive=True)


def og_card() -> None:
    img = Image.new("RGB", (1200, 630), (12, 12, 12))
    draw = ImageDraw.Draw(img)
    draw.rectangle((80, 168, 144, 172), fill=(255, 255, 255))
    serif = ImageFont.truetype(SERIF, 78)
    sans = ImageFont.truetype(SANS, 22)
    draw.text((80, 200), "Mariana Ramírez", font=serif, fill=(255, 255, 255))
    draw.text((82, 320), "LUXURY REAL ESTATE ADVISOR", font=sans, fill=(214, 214, 214))
    draw.text((82, 362), "MIAMI", font=sans, fill=(214, 214, 214))
    img.save(PUBLIC / "og.jpg", "JPEG", quality=86, optimize=True)


def icons() -> None:
    serif = ImageFont.truetype(SERIF, 64)
    icon = Image.new("RGB", (180, 180), (12, 12, 12))
    draw = ImageDraw.Draw(icon)
    draw.text((90, 108), "MR", font=serif, fill=(255, 255, 255), anchor="mm")
    icon.save(PUBLIC / "apple-touch-icon.png", "PNG", optimize=True)
    icon.resize((32, 32), Image.Resampling.LANCZOS).save(
        PUBLIC / "favicon.ico", format="ICO", sizes=[(32, 32)]
    )


def main() -> None:
    specs: list[tuple[str, int, int, list, tuple, tuple, int, float, float]] = [
        (
            "hero.jpg",
            2000,
            1400,
            [
                (0.0, (7, 12, 28)),
                (0.42, (18, 36, 72)),
                (0.58, (196, 156, 124)),
                (0.72, (22, 40, 64)),
                (1.0, (6, 10, 20)),
            ],
            (255, 214, 180),
            (0.72, 0.56),
            11,
            0.06,
            90,
        ),
        (
            "portrait.jpg",
            1200,
            1500,
            [
                (0.0, (186, 176, 164)),
                (0.45, (214, 206, 196)),
                (0.75, (150, 138, 126)),
                (1.0, (92, 84, 76)),
            ],
            (255, 244, 230),
            (0.35, 0.28),
            21,
            0.18,
            40,
        ),
        (
            "listing-active.jpg",
            1600,
            1100,
            [
                (0.0, (92, 86, 78)),
                (0.4, (196, 184, 168)),
                (0.7, (150, 132, 114)),
                (1.0, (62, 56, 50)),
            ],
            (255, 236, 210),
            (0.3, 0.34),
            31,
            0.14,
            55,
        ),
        (
            "listing-sold.jpg",
            1600,
            1100,
            [
                (0.0, (70, 78, 84)),
                (0.42, (176, 182, 184)),
                (0.7, (120, 128, 132)),
                (1.0, (42, 48, 52)),
            ],
            (230, 236, 238),
            (0.68, 0.3),
            32,
            0.12,
            40,
        ),
        (
            "brickell.jpg",
            1600,
            1000,
            [
                (0.0, (5, 10, 26)),
                (0.48, (12, 28, 64)),
                (0.62, (70, 98, 140)),
                (1.0, (4, 8, 18)),
            ],
            (170, 196, 230),
            (0.62, 0.58),
            41,
            0.05,
            60,
        ),
        (
            "edgewater.jpg",
            1600,
            1000,
            [
                (0.0, (48, 62, 72)),
                (0.5, (150, 166, 170)),
                (0.64, (210, 214, 210)),
                (1.0, (36, 52, 58)),
            ],
            (240, 244, 240),
            (0.5, 0.58),
            42,
            0.08,
            35,
        ),
        (
            "miami-beach.jpg",
            1600,
            1000,
            [
                (0.0, (28, 48, 68)),
                (0.46, (92, 124, 146)),
                (0.62, (214, 196, 170)),
                (1.0, (24, 48, 58)),
            ],
            (255, 220, 180),
            (0.78, 0.58),
            43,
            0.07,
            70,
        ),
        (
            "sunny-isles.jpg",
            1600,
            1000,
            [
                (0.0, (10, 36, 64)),
                (0.45, (28, 92, 130)),
                (0.62, (186, 206, 214)),
                (1.0, (8, 32, 48)),
            ],
            (220, 240, 245),
            (0.55, 0.56),
            44,
            0.07,
            55,
        ),
        (
            "coral-gables.jpg",
            1600,
            1000,
            [
                (0.0, (28, 26, 22)),
                (0.46, (72, 48, 36)),
                (0.62, (168, 120, 84)),
                (1.0, (22, 28, 22)),
            ],
            (220, 170, 120),
            (0.4, 0.58),
            45,
            0.08,
            50,
        ),
        (
            "west-palm-beach.jpg",
            1600,
            1000,
            [
                (0.0, (24, 36, 48)),
                (0.46, (70, 90, 100)),
                (0.62, (214, 176, 120)),
                (1.0, (18, 32, 30)),
            ],
            (255, 210, 150),
            (0.66, 0.57),
            46,
            0.07,
            65,
        ),
        (
            "new-york-city.jpg",
            1600,
            1000,
            [
                (0.0, (16, 16, 18)),
                (0.5, (48, 46, 44)),
                (0.66, (140, 110, 78)),
                (1.0, (10, 10, 12)),
            ],
            (210, 160, 100),
            (0.58, 0.62),
            47,
            0.06,
            55,
        ),
        (
            "residence-mercedes.jpg",
            1600,
            1000,
            [
                (0.0, (12, 14, 18)),
                (0.5, (36, 40, 48)),
                (0.68, (150, 154, 160)),
                (1.0, (8, 10, 14)),
            ],
            (200, 206, 214),
            (0.7, 0.6),
            51,
            0.07,
            40,
        ),
        (
            "residence-888.jpg",
            1600,
            1000,
            [
                (0.0, (20, 12, 16)),
                (0.48, (64, 32, 36)),
                (0.66, (176, 140, 120)),
                (1.0, (16, 10, 12)),
            ],
            (230, 190, 170),
            (0.42, 0.6),
            52,
            0.08,
            45,
        ),
        (
            "residence-aston.jpg",
            1600,
            1000,
            [
                (0.0, (10, 16, 18)),
                (0.5, (24, 48, 46)),
                (0.66, (120, 150, 130)),
                (1.0, (8, 14, 12)),
            ],
            (190, 220, 190),
            (0.6, 0.58),
            53,
            0.07,
            40,
        ),
        (
            "residence-cipriani.jpg",
            1600,
            1000,
            [
                (0.0, (24, 18, 14)),
                (0.48, (86, 64, 48)),
                (0.66, (196, 168, 130)),
                (1.0, (20, 16, 12)),
            ],
            (240, 210, 170),
            (0.5, 0.58),
            54,
            0.08,
            48,
        ),
        (
            "residence-mandarin.jpg",
            1600,
            1000,
            [
                (0.0, (18, 14, 12)),
                (0.5, (72, 40, 32)),
                (0.66, (160, 90, 64)),
                (1.0, (16, 10, 8)),
            ],
            (220, 140, 100),
            (0.64, 0.6),
            55,
            0.07,
            50,
        ),
        (
            "residence-museum.jpg",
            1600,
            1000,
            [
                (0.0, (14, 16, 20)),
                (0.48, (40, 48, 60)),
                (0.66, (160, 168, 176)),
                (1.0, (10, 12, 16)),
            ],
            (210, 216, 224),
            (0.48, 0.58),
            56,
            0.08,
            42,
        ),
    ]

    for name, w, h, stops, glow, pos, seed, spread, gain in specs:
        img = scene(w, h, stops, glow, pos, seed, spread, gain)
        quality = 76 if name == "hero.jpg" else 72
        save_jpg(img, OUT / name, quality)

    og_card()
    icons()
    print(f"Wrote placeholders to {OUT} and {PUBLIC}")


if __name__ == "__main__":
    main()
