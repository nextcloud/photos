<!--
SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Demo library generator

Generates a large synthetic photo library for demos and performance work. The pictures are drawn procedurally — a gradient with a few shapes — so there is nothing to license, and every one carries EXIF data: a capture date, a GPS position and a camera name.

```bash
php tests/demo-library/generate.php --count=10000 --seed=1 /tmp/demo-library
```

| Option    | Default | Meaning                                                    |
|-----------|---------|------------------------------------------------------------|
| `--count` | 10000   | Number of photos, up to 100000                             |
| `--seed`  | 1       | Seed of the random numbers                                 |
| `--end`   | today   | Day of the newest photos (`YYYY-MM-DD`)                    |
| `--size`  | 640     | Long edge of the pictures in pixels                        |

It needs PHP with the `gd` extension and nothing else — no Nextcloud, no `occ`. At the default size a photo takes about 12 kB and 10000 of them well under a minute to write.

## What the library looks like

- The photos are spread over the 15 years before `--end`, more of them in recent years, and stored as `<year>/<month>/IMG_<date>_<time>.jpg`. The modification time of each file is its capture date.
- They come in clusters: **daily life** (a few photos within some hours, around a home city), **bursts** (up to twenty photos a second or two apart) and **trips** (dozens to hundreds of photos over 3 to 14 days around another of 50 world cities). The photos of a cluster share a colour scheme, so clusters can be told apart on the timeline.
- Aspect ratios vary between landscape, portrait, square and panorama.
- The same `--count`, `--seed` and `--end` plan the same library: same files, dates and positions. Pass `--end` to reproduce a library on another day. The encoded pixels can differ between versions of `gd`.

## Loading it into a Nextcloud

Copy the folder into the files of an account, below a folder the Photos app shows (`Photos` by default), and let the server index it:

```bash
cp -R /tmp/demo-library "<data directory>/demo/files/Photos/Demo library"
chown -R www-data: "<data directory>/demo/files/Photos"

occ files:scan demo
occ files:scan demo --generate-metadata
```

Scan **without** `--generate-metadata` first: because of a server bug with files it sees for the first time, the metadata has to be generated in a second pass, once the files are registered. Name the account before the option, otherwise it is taken as the value of the option.

The second pass reads the dates and positions and resolves the places. Previews are generated when they are first asked for; the [preview generator](https://github.com/nextcloud/previewgenerator) app can do that ahead of time.

## Publishing a read-only demo

The library should belong to an account nobody else can sign in to. Two ways to let others look at it without being able to change it:

- **A public album link.** Create an album, add the photos and choose *Share via public link* in its sharing dialog. Visitors need no account and can only view. `occ photos:albums:create demo <album>` and `occ photos:albums:add demo <album> <file>` fill an album from the command line, one photo per call.
- **A read-only share.** Share the folder of the library from the owning account with a demo account or group, with all permissions but reading removed. The demo account can still change its own settings, so keep its password to people you trust or lock those down separately.
