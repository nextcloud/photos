<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Face fixtures

These images are used by the faces end-to-end test (`cypress/e2e/faces.cy.ts`)
to exercise the recognize WebDAV integration (the people view, moving photos
between people, removing/merging people, …).

They are taken from the Nextcloud
[recognize](https://github.com/nextcloud/recognize) repository's
`test-files/FaceID-550` dataset and are grouped by identity, one subfolder per
person.

recognize only starts forming face clusters once it has gathered at least
`FaceClusterAnalyzer::MIN_DATASET_SIZE` (120) face detections. This fixture set
is intentionally small, so the test uploads every image several times (see
`FACE_UPLOAD_MULTIPLIER` in `cypress/e2e/facesUtils.ts`) to clear that
threshold. The duplicated detections share the same face vector and therefore
cluster tightly, which keeps the resulting clusters deterministic.
