#!/usr/bin/env python3
"""Remove checkerboard backgrounds while preserving white logo letters and mascot eye whites."""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
SOURCES = {
    'logo.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-c1196c9d-5261-4044-a496-3ba42188554d.png'),
    'mascot-thinking.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-5b91d180-855c-4214-a893-721d12a7da73.png'),
    'mascot-idea.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-a468c32f-89a7-422a-8f34-a005ec01cbca.png'),
    'mascot-spelling.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-721c1157-33e1-4ec9-8522-2f3088e21e90.png'),
    'icon-home.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-2e43d994-2af8-49c9-85f6-25e31b11d45f.png'),
    'icon-learn.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-0f524ed3-1c61-457d-aeb6-6f389ff960ea.png'),
    'icon-segment.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-98a8e13c-5d99-440e-b780-8aaca7b4a697.png'),
    'icon-activities.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-4a259e1a-6433-48be-bbd5-09f7be324585.png'),
    'icon-teacher.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-1c9108cf-b0e3-4c3a-b92d-a85105857318.png'),
    'icon-activity-word-build.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-081eb6bb-915c-4cee-b3f4-19f0a5f64bf6.png'),
    'icon-activity-spell-check.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-8a6c23f2-7733-413f-b818-7688adfb0f3d.png'),
    'icon-activity-suffix-match.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-2b4652d3-614c-4aea-ba39-79501debec3d.png'),
    'icon-activity-handwriting.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-6dda4eb7-a0c4-4f27-906f-ddd2de50a328.png'),
    'icon-activity-test-mode.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-8fdb20e2-eae0-42e3-9661-a95c8963c032.png'),
    'icon-stat-sounds.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-24b4bbb7-1a6a-4470-895e-f181efc0016b.png'),
    'icon-stat-suffixes.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-5b34a46e-a721-4f90-ba70-a5acd59a1bba.png'),
    'icon-stat-prefixes.png': Path('/Users/niccomino/.cursor/projects/Users-niccomino-Desktop-spellwaves/assets/image-ecb8cd03-a8d9-4800-b8ba-06df9e4110f6.png'),
}


def sat(rgb: np.ndarray) -> np.ndarray:
    return rgb.max(axis=2) - rgb.min(axis=2)


def checker_mask(rgb: np.ndarray) -> np.ndarray:
    return (sat(rgb) <= 16) & (rgb.min(axis=2) >= 228)


def flood_checkerboard_from_edges(arr: np.ndarray) -> None:
    h, w = arr.shape[:2]
    check = checker_mask(arr[:, :, :3])
    bg = np.zeros((h, w), bool)
    visited = np.zeros((h, w), bool)
    seeds = [(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)]
    seeds += [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)]
    for sx, sy in seeds:
        if visited[sy, sx] or not check[sy, sx]:
            continue
        q: deque[tuple[int, int]] = deque([(sx, sy)])
        visited[sy, sx] = True
        while q:
            x, y = q.popleft()
            if check[y, x]:
                bg[y, x] = True
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < w and 0 <= ny < h and not visited[ny, nx] and check[ny, nx]:
                        visited[ny, nx] = True
                        q.append((nx, ny))
    arr[bg, 3] = 0
    arr[bg, :3] = 0


def keep_connected(arr: np.ndarray, *, ink_mask: np.ndarray, include_neutral: bool) -> None:
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3].astype(np.int16)
    visible = arr[:, :, 3] > 10
    neutral = visible & (sat(rgb) <= 18) & (rgb.min(axis=2) >= 225)
    keep = ink_mask.copy()
    visited = ink_mask.copy()
    q: deque[tuple[int, int]] = deque([(x, y) for y in range(h) for x in range(w) if ink_mask[y, x]])
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if not (0 <= nx < w and 0 <= ny < h) or visited[ny, nx] or not visible[ny, nx]:
                continue
            if ink_mask[ny, nx] or (include_neutral and neutral[ny, nx]):
                visited[ny, nx] = True
                keep[ny, nx] = True
                q.append((nx, ny))
    remove = visible & ~keep
    arr[remove, 3] = 0
    arr[remove, :3] = 0


def flood_solid_bg_from_edges(arr: np.ndarray, bg_mask: np.ndarray) -> None:
    h, w = arr.shape[:2]
    bg = np.zeros((h, w), bool)
    visited = np.zeros((h, w), bool)
    seeds = [(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)]
    seeds += [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)]
    for sx, sy in seeds:
        if visited[sy, sx] or not bg_mask[sy, sx]:
            continue
        q: deque[tuple[int, int]] = deque([(sx, sy)])
        visited[sy, sx] = True
        while q:
            x, y = q.popleft()
            if bg_mask[y, x]:
                bg[y, x] = True
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < w and 0 <= ny < h and not visited[ny, nx] and bg_mask[ny, nx]:
                        visited[ny, nx] = True
                        q.append((nx, ny))
    arr[bg, 3] = 0
    arr[bg, :3] = 0


def strip_logo_outer_fringe(arr: np.ndarray, passes: int = 14) -> None:
    for _ in range(passes):
        visible = arr[:, :, 3] > 0
        trans = arr[:, :, 3] == 0
        near = visible & ndimage.binary_dilation(trans, iterations=1)
        rgb = arr[:, :, :3].astype(np.int16)
        white_body = ndimage.binary_dilation(visible & (rgb.min(axis=2) > 235), iterations=10)
        purple_body = ndimage.binary_dilation(
            visible & (rgb[:, :, 2] > rgb[:, :, 0] + 20) & (sat(rgb) > 20),
            iterations=12,
        )
        bad = near & ~(white_body | purple_body) & (rgb.min(axis=2) > 155)
        arr[bad, 3] = 0
        arr[bad, :3] = 0


def shrink_alpha(arr: np.ndarray, px: int = 1) -> None:
    fg = arr[:, :, 3] > 0
    for _ in range(px):
        fg = ndimage.binary_erosion(fg, structure=np.ones((3, 3), bool))
    arr[~fg, 3] = 0
    arr[~fg, :3] = 0
    arr[fg, 3] = 255


def green_bg_mask(rgb: np.ndarray, *, threshold: int = 12) -> np.ndarray:
    r, g, b = rgb[:, :, 0].astype(np.int16), rgb[:, :, 1].astype(np.int16), rgb[:, :, 2].astype(np.int16)
    dominance = g - np.maximum(r, b)
    return (g > 70) & (dominance > threshold)


def strip_green_spill(arr: np.ndarray, *, passes: int = 20) -> None:
    """Remove green-screen spill on anti-aliased edges."""
    for _ in range(passes):
        visible = arr[:, :, 3] > 0
        trans = arr[:, :, 3] == 0
        near = visible & ndimage.binary_dilation(trans, iterations=2)
        rgb = arr[:, :, :3].astype(np.int16)
        r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
        spill = near & (g > r + 3) & (g > b + 3) & (g > 45)
        strong = spill & green_bg_mask(rgb, threshold=5)
        arr[strong, 3] = 0
        arr[strong, :3] = 0
        mild = spill & ~strong
        arr[mild, 1] = np.clip(((r[mild] + b[mild]) // 2), 0, 255)


def strip_green_fringe(arr: np.ndarray, *, passes: int = 16) -> None:
    for _ in range(passes):
        visible = arr[:, :, 3] > 0
        trans = arr[:, :, 3] == 0
        near = visible & ndimage.binary_dilation(trans, iterations=1)
        rgb = arr[:, :, :3].astype(np.int16)
        white_body = ndimage.binary_dilation(visible & (rgb.min(axis=2) > 230), iterations=12)
        purple_body = ndimage.binary_dilation(
            visible & (rgb[:, :, 2] > rgb[:, :, 0] + 15) & (sat(rgb) > 15),
            iterations=14,
        )
        black_body = ndimage.binary_dilation(visible & (rgb.max(axis=2) < 60), iterations=10)
        core = white_body | purple_body | black_body
        bad = near & ~core & (rgb[:, :, 1] > rgb[:, :, 0]) & (rgb[:, :, 1] > rgb[:, :, 2])
        arr[bad, 3] = 0
        arr[bad, :3] = 0


def purple_sidebar_bg_mask(rgb: np.ndarray) -> np.ndarray:
    rgb = rgb.astype(np.int16)
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    s = sat(rgb)
    return (b >= 130) & (b > r + 12) & (g < 200) & (s >= 6)


def process_logo(arr: np.ndarray) -> None:
    """Remove solid export backgrounds while keeping artwork."""
    rgb = arr[:, :, :3].astype(np.int16)
    h, w = rgb.shape[:2]
    corners = np.array([rgb[0, 0], rgb[0, w - 1], rgb[h - 1, 0], rgb[h - 1, w - 1]])

    edge_pixels = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    if purple_sidebar_bg_mask(edge_pixels.reshape(1, -1, 3)).mean() > 0.12:
        flood_solid_bg_from_edges(arr, purple_sidebar_bg_mask(rgb))
        rgb = arr[:, :, :3].astype(np.int16)
        visible = arr[:, :, 3] > 10
        s = sat(rgb)
        mx = rgb.max(axis=2)
        ink = visible & ((mx < 95) | (rgb.min(axis=2) > 215) | (s > 12))
        keep_connected(arr, ink_mask=ink, include_neutral=True)
        whiten_dark_in_white_regions(arr)
        strip_logo_outer_fringe(arr)
        shrink_alpha(arr, px=1)
        return

    # Chroma-key green screen export
    if green_bg_mask(rgb)[0, 0] or green_bg_mask(rgb)[h - 1, w - 1]:
        flood_solid_bg_from_edges(arr, green_bg_mask(rgb, threshold=10))
        for _ in range(8):
            visible = arr[:, :, 3] > 0
            stragglers = visible & green_bg_mask(arr[:, :, :3].astype(np.int16), threshold=8)
            arr[stragglers, 3] = 0
            arr[stragglers, :3] = 0
        strip_green_spill(arr)
        strip_green_fringe(arr)
        shrink_alpha(arr, px=1)
        return

    if corners.max() < 35:
        flood_solid_bg_from_edges(arr, rgb.max(axis=2) < 28)
        return

    ref = np.median(
        [rgb[0, 0], rgb[0, w - 1], rgb[h - 1, 0], rgb[h - 1, w - 1], rgb[0, w // 2], rgb[h - 1, w // 2]],
        axis=0,
    ).astype(np.int16)

    bg_mask = np.abs(rgb - ref).max(axis=2) <= 38
    flood_solid_bg_from_edges(arr, bg_mask)

    rgb = arr[:, :, :3].astype(np.int16)
    visible = arr[:, :, 3] > 10
    s = sat(rgb)
    mx = rgb.max(axis=2)
    ink = visible & ((mx < 95) | (rgb.min(axis=2) > 215) | (s > 12))
    keep_connected(arr, ink_mask=ink, include_neutral=True)
    whiten_dark_in_white_regions(arr)
    strip_logo_outer_fringe(arr)
    shrink_alpha(arr, px=1)


def whiten_dark_in_white_regions(arr: np.ndarray, passes: int = 12) -> None:
    """Remove dark inner-shadow specks inside white SPELL letter fills."""
    h, w = arr.shape[:2]
    for _ in range(passes):
        rgb = arr[:, :, :3]
        visible = arr[:, :, 3] > 10
        mx = rgb.max(axis=2)
        white = visible & (rgb.min(axis=2) > 248)
        trans = arr[:, :, 3] == 0
        outer_black = visible & (mx < 85) & ndimage.binary_dilation(trans, iterations=4)

        fix = np.zeros((h, w), bool)
        for y in range(2, h - 2):
            for x in range(2, w - 2):
                if not visible[y, x] or outer_black[y, x] or mx[y, x] > 115:
                    continue
                wn = sum(
                    1 for dy in range(-2, 3) for dx in range(-2, 3) if white[y + dy, x + dx]
                )
                if wn >= 6:
                    fix[y, x] = True
        arr[fix] = [255, 255, 255, 255]


def process_mascot(orig: np.ndarray, arr: np.ndarray) -> None:
    rgb = arr[:, :, :3].astype(np.int16)
    orig_rgb = orig[:, :, :3].astype(np.int16)
    visible = arr[:, :, 3] > 10
    blue = visible & (rgb[:, :, 2] > rgb[:, :, 0] + 8) & (rgb[:, :, 2] > 75)
    blue_near = ndimage.binary_dilation(blue, iterations=7)
    orig_white = (orig_rgb.min(axis=2) >= 240) & (sat(orig_rgb) <= 8)
    restore = (~visible) & blue_near & orig_white
    arr[restore] = orig[restore]
    flood_checkerboard_from_edges(arr)

    s = sat(rgb)
    mx = rgb.max(axis=2)
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    visible = arr[:, :, 3] > 10
    fg = visible & (
        ((b > r + 8) & (b > 75))
        | ((r > 130) & (g > 60) & (b < 150))
        | (mx < 95)
        | (s > 40)
    )
    keep_connected(arr, ink_mask=fg, include_neutral=True)

    for _ in range(10):
        a = arr[:, :, 3]
        rgb2 = arr[:, :, :3]
        trans = a == 0
        light = (a > 0) & (sat(rgb2) <= 10) & (rgb2.min(axis=2) >= 232)
        halo = light & ndimage.binary_dilation(trans, iterations=1)
        arr[halo, 3] = 0
        arr[halo, :3] = 0


def add_white_border(arr: np.ndarray, px: int = 5) -> np.ndarray:
    """Add a white border that follows the logo silhouette."""
    h, w = arr.shape[:2]
    pad = px + 2
    padded = np.zeros((h + 2 * pad, w + 2 * pad, 4), dtype=np.uint8)
    padded[pad : pad + h, pad : pad + w] = arr

    mask = padded[:, :, 3] > 10
    dilated = mask.copy()
    struct = np.ones((3, 3), dtype=bool)
    for _ in range(px):
        dilated = ndimage.binary_dilation(dilated, structure=struct)

    out = np.zeros_like(padded)
    out[dilated] = [255, 255, 255, 255]
    out[mask] = padded[mask]
    return out


NAV_ICONS = {
    'icon-home.png',
    'icon-learn.png',
    'icon-segment.png',
    'icon-activities.png',
    'icon-teacher.png',
}


def process_icon(orig: np.ndarray, arr: np.ndarray) -> None:
    """Sticker-style sidebar icons: remove checkerboard, keep purple/white/black art."""
    process_mascot(orig, arr)


def process_all() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)
    for name, src in SOURCES.items():
        orig = np.array(Image.open(src).convert('RGBA'))
        arr = orig.copy()
        flood_checkerboard_from_edges(arr)
        if name == 'logo.png':
            process_logo(arr)
            arr = add_white_border(arr, px=12)
        elif name.startswith('icon-'):
            process_icon(orig, arr)
            if name in NAV_ICONS:
                arr = add_white_border(arr, px=48)
        else:
            process_mascot(orig, arr)
        out = Image.fromarray(arr)
        bbox = out.getbbox()
        if bbox:
            out = out.crop(bbox)
        out.save(PUBLIC / name, optimize=True)
        print(f'wrote {name} -> {out.size}')


if __name__ == '__main__':
    process_all()
