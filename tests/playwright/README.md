<!--
SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Playwright end-to-end tests

End-to-end tests for the Photos app. The runner starts a Nextcloud instance in Docker itself — no manual setup is needed.

## Running the tests

```bash
# Install the browser binary once
npm run playwright:install

# Run everything except the people tests (starts the server automatically)
npm run playwright

# Run a single spec
npx playwright test tests/playwright/e2e/albums.spec.ts

# Interactive UI, recommended while writing tests
npx playwright test --ui

# Watch the browser while it works
npx playwright test --headed tests/playwright/e2e/albums.spec.ts
```

The container is reused between local runs (`reuseExistingServer`), so only the first run pays for starting it.

The instance runs on SQLite, where writers take turns. CI runs one worker per shard, but locally Playwright uses as many as the machine has cores, and the seeding of several tests at once can then lose that race — the setup helpers retry, but a request the app itself makes cannot be retried and surfaces as a failed save. If a local run fails where CI does not, try `npm run playwright -- --workers=2` before looking for a bug.

## Viewing traces

Traces are recorded on the first retry of a failing test, which only happens on CI (`retries` is 0 locally — pass `--retries=1` to get one).

```bash
npx playwright show-report
npx playwright show-trace test-results/<test-name>/trace.zip
```

For a failure on CI, download the "HTML report" artifact from the job summary, extract it and open it with `npx playwright show-report <folder>`.

## Directory layout

```
tests/playwright/
├── e2e/                      # The specs, one file per feature area
│   └── install-recognize.ts  # Setup step of the people tests, installs recognize
├── fixtures/
│   ├── media/                # The five photos every test account is seeded with
│   └── faces/                # Portraits for the people tests, from recognize's dataset
├── support/
│   ├── fixtures/             # Playwright fixture extensions (accounts, page objects)
│   ├── sections/             # Page Object Models
│   └── utils/                # DAV, occ and request helpers
├── global-setup.ts           # Warms the city database used to resolve places
├── merge.config.ts           # Merges the blob reports of the CI shards
└── start-nextcloud-server.js # Starts and configures the test container
```

## How a test gets its data

Every test gets an account of its own, seeded with the five photos of `fixtures/media`. Nothing is shared between tests: they favorite, delete, rename and share things, and Playwright runs them in parallel.

Uploading a photo is enough for it to show up on the timeline — the server extracts the EXIF data, the dimensions and the date it was taken while writing the file. Only the **place** of a photo is resolved in a deferred pass, which costs an `occ` round trip, so a spec that needs places asks for it explicitly:

```typescript
test.use({ withPlaces: true })
```

Use `createAccounts(n)` for the tests that need several people, and `openSession(account)` to drive a second browser session:

```typescript
test('shares an album', async ({ photosApp, user, createAccounts, openSession }) => {
	const [bobAccount] = await createAccounts(1)

	await photosApp.albums.open()
	await photosApp.albums.createAlbum('holidays')
	await (await photosApp.album.openCollaborators()).addCollaborators(bobAccount.user.userId)

	const bob = await openSession(bobAccount)
	await bob.app.sharedAlbum.open('holidays', user.userId)
})
```

Ask for all extra accounts in a single `createAccounts` call: creating them shells out to `occ`, which every worker of the run contends over, and that is the slowest part of the setup.

The views built on a whole library need more than the five fixtures — memories only calls a stretch of photos a trip from eight of them on, and only sums a year up from thirty. `seedPhotos` adds as many photos as a test needs, each taken when it says:

```typescript
const names = await seedPhotos('recap', [new Date(Date.UTC(2024, 0, 5, 12)), …])
```

They are server-side copies of a fixture, so a library of dozens of them costs no upload, and their taken date is stored the way the metadata editor of the app does it. Date them around noon UTC: the day a photo counts as taken on is read in the timezone the browser runs in, which differs between a local run and CI. `removePhotoLocations()` is the counterpart for the tests about a library with nothing to place on a map.

## Writing a test

- `test` and `expect` come from `support/fixtures/photos-app.ts`; `photosApp` gathers the page objects of all the views of one session.
- **Locate by role and accessible name.** A photo tile is found through the link that opens it (`Open the full size "…" image`), its selection through the checkbox (`Select image …`), its menu through the trigger (`Actions for …`). Fall back to a class or a `data-*` attribute only for elements that carry no accessible name — a face cover, the filter chips, a Leaflet map, the position line of the slideshow, the track and graduation of the date scrubber — and say so in a comment.
- **The viewer belongs to another app.** A photo opened from the timeline, a map marker or a trip card lands in the viewer app, which `sections/ViewerModal.ts` addresses through the roles of its dialog only. Its arrows are what says a view handed it a gallery rather than the single photo that was clicked.
- **Assert the outcome, not the wait.** `toHaveCount`, `toBeVisible` and friends retry, so they need no explicit sleep.
- **Arm a `waitForResponse` before the action that triggers it.** The grid keeps showing the previous listing until a new one arrives, so "the list did not change yet" and "the list is final" look the same to an assertion. `support/utils/requests.ts` has the helpers, and the page objects wrap the ones that belong to an action.
- **Read state back from the server** where a test is about something being stored: the app marks favorites and adds album entries optimistically, so re-open the view instead of trusting the one on screen.

## The people tests

`e2e/faces.spec.ts` covers the views built on the faces [recognize](https://github.com/nextcloud/recognize) finds. They have a Playwright project of their own, so the minutes they cost never hold up the rest:

```bash
npm run playwright:faces
```

The project brings its own recognize: `e2e/install-recognize.ts` runs ahead of the spec as a setup dependency and installs the app from the app store into the container, so nothing has to be mounted or built by hand. When that does not work out — no app store reachable, or no release for the server under test — `isRecognizeAvailable()` says so and the spec marks its tests as expected failures (`test.fail`) instead of reporting green.

Getting from the fixtures to a cluster is three steps, all in `support/utils/faces.ts`:

- **Seeding.** The portraits of `fixtures/faces` are uploaded into a fresh account, each one seven times over (`FACE_UPLOAD_MULTIPLIER`). recognize forms no cluster before it has gathered 120 detections, which the committed set is far short of; the copies share the face vector of their original, so they cluster tightly and the outcome stays something a test can assert on.
- **Classifying.** `files:scan --generate-metadata`, then `recognize:classify`, then several `recognize:cluster-faces` passes — one does not necessarily assign every detection to its final cluster.
- **Checking.** `expectFaceClusters` asks the very recognize WebDAV endpoint the app uses whether there are clusters, and if there are none it fails with the number of stored detections and the tail of what recognize logged. Without it an empty pipeline only surfaced much later, as an opaque "no person found" timeout.

Because all of that is minutes of TensorFlow work, the whole spec shares one classified account (the worker-scoped `faceAccount` of `support/fixtures/faces.ts`), the project runs a single worker with a 45-minute timeout, and the tests run in declaration order — the one that merges two people comes last, as it leaves fewer of them behind than the others need. Each test still signs in on a session of its own.

On CI the project is a matrix entry of its own, next to the four shards the default project is split over.
