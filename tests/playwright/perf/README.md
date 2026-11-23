<!--
SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Timeline speed measurement

`timeline-speed.js` opens a timeline in Chromium and measures how fast it feels. It is a plain Node script on top of the Playwright that the end-to-end tests already use — it starts no server and asserts nothing, it only prints numbers.

```bash
npm run playwright:install   # once

node tests/playwright/perf/timeline-speed.js \
	--url https://cloud.example.com/index.php/apps/photos/ \
	--user alice --password secret
```

## What is measured

Every run is a cold visit: a new browser context with an empty cache, signed in first when an account is given.

| Metric | Meaning |
|---|---|
| Time to first photo | From the start of the navigation to the timeline until the first preview image has loaded. |
| Time to first screen of previews | The same, until every preview image in the viewport has loaded and stayed so for half a second. The half second is not part of the number. |
| Previews on the first screen | How many images that were. Photos stacks a small and a large preview per tile, both count. |
| Scroll: dropped frames | The timeline is scrolled at a constant speed, one step per animation frame. The usual time between two frames is taken as the refresh interval, and a frame that took n intervals counts as n − 1 dropped ones. |
| Scroll: long animation frames, blocked time | What the [Long Animation Frames API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Long_animation_frame_timing) reported during the scroll: frames over 50 ms and the time they blocked the main thread. `n/a` where the browser lacks it. |
| Scroll: distance | How far the scroll got. Less than seconds × speed means the end of the library was reached. |
| Jump to the oldest month | From pressing `End` on the date scrubber until the grid has stopped moving and the previews in view have loaded. Includes the scroll animation of the jump; `n/a` when the scrubber is absent, as in a library of a single month. |

The summary gives the median and the value of every run. `--format json` prints the same as JSON.

## Options

| Option | Default | |
|---|---|---|
| `--url` | | The timeline to measure |
| `--user`, `--password` | | Nextcloud account to sign in with; left out, the timeline is opened right away |
| `--login-url` | `--url` up to `/apps/`, plus `/login` | The Nextcloud login page |
| `--runs` | 3 | Number of cold visits |
| `--viewport` | 1280x720 | Size of the browser window |
| `--scroll-seconds`, `--scroll-speed` | 5, 3000 | Length of the scripted scroll and its speed in pixels per second |
| `--photo-selector` | `[data-test="media"] img` | The preview images of the timeline |
| `--jump-selector`, `--jump-key` | the slider of the date scrubber, `End` | The control jumping to the oldest month and the key doing it |
| `--format` | markdown | `markdown` or `json` |
| `--headed` | | Show the browser |

## Reading the numbers

- They describe one machine, one server and one library. Compare runs of the same setup — before and after a change, or two libraries — and say what they ran on when quoting them. A busy machine shows up first in the dropped frames.
- The browser cache is cold, the server is not: previews the server already generated are served from its cache. Open the timeline once before measuring when the first-ever load is not the point.
- Headless Chromium draws at 60 frames a second, whatever the display.

## Other timelines

Nothing but the sign-in and the three selector options is specific to Photos: the element that scrolls is found as the closest scrollable ancestor of a preview. To measure another web timeline, pass its address, a `--photo-selector` matching its preview images, and — when it has a control that jumps to the oldest photos on a key press — `--jump-selector` and `--jump-key`. An app with a login page of its own needs the sign-in in `measure()` adapted.

## Tests

The frame statistics are covered by `node --test tests/playwright/perf`.
