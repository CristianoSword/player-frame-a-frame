# ▶ player frame a frame

<h4 align="center">
    <p>
        <a href="./README-ptbr.md">Português</a> |
        <b>English</b>
    </p>
</h4>

Frame-by-frame video viewer that runs directly in the browser with no dependencies.  
Link: https://cristianosword.github.io/player-frame-a-frame/

![HTML only](https://img.shields.io/badge/HTML-only-333)
![no install](https://img.shields.io/badge/no-install-333)
![lang](https://img.shields.io/badge/lang-EN%20%7C%20PT--BR-333)

---

![2026-04-14 23_21_43-Window](https://github.com/user-attachments/assets/b0d70042-9676-447a-aeeb-95b24cc9fe5c)


## About

Precise frame-by-frame video analysis tool. Useful for animation, motion analysis, scene review, and any workflow that needs exact playback control.

## How to use

Open `index.html` in any modern browser. No install or local server is required.

Load a video by dragging it into the drop area or clicking to open the file picker. Supported formats include `MP4`, `WebM`, `MOV`, `AVI`, and any other format accepted by the browser.

## Controls

| Control | Description |
|---|---|
| progress bar | Jump to any point in the video by dragging the slider. |
| prev / next | Move exactly one frame backward or forward using the configured FPS. |
| play / pause | Start or pause playback in real time. |
| speed | Goes from `-8x` to `8x`, including reverse playback. |
| FPS | Defines the frame duration used by frame stepping. Default: 24 fps. |
| loop | Repeats automatically when the video reaches the beginning or end. |

## Keyboard shortcuts

| Key | Action |
|---|---|
| `←` `→` | Step backward / forward one frame |
| `space` | Play / pause |

Shortcuts are ignored while an editable field is focused.

## Displayed info

| Field | Description |
|---|---|
| frame | Current frame number calculated from time and FPS. |
| time | Current position in seconds with millisecond precision. |
| duration | Total video length. |
| resolution | Width x height in pixels. |

## Development

The main code is split into:

- `index.html`: page structure.
- `style/main.css`: styles.
- `player-core.js`: pure player logic helpers.
- `app.js`: DOM integration, events, state, and translations.

## Tests

```bash
npm test
```

## Technical notes

The video is rendered onto a `<canvas>` layered over the `<video>` element, allowing precise frame inspection. Files stay local and are never uploaded.

Frame accuracy depends on how the browser seeks through the source video. Videos with sparse keyframes may still be imprecise on long jumps.
