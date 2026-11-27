/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { chromium } from '@playwright/test'
import { parseArgs } from 'node:util'
import { frameStats, median, round } from './frame-stats.js'

const { values: options } = parseArgs({
	options: {
		/** Address of the timeline to measure. */
		url: { type: 'string' },
		/** Account to sign in to a Nextcloud with; without one the timeline is opened right away. */
		user: { type: 'string' },
		password: { type: 'string' },
		'login-url': { type: 'string' },
		/** The preview images of the timeline. */
		'photo-selector': { type: 'string', default: '[data-test="media"] img' },
		/** The control that jumps to the oldest month once the key below is pressed on it. */
		'jump-selector': { type: 'string', default: '[role="slider"][aria-label="Jump to a month"]' },
		'jump-key': { type: 'string', default: 'End' },
		runs: { type: 'string', default: '3' },
		viewport: { type: 'string', default: '1280x720' },
		/** Length of the scripted scroll in seconds, and its speed in pixels per second. */
		'scroll-seconds': { type: 'string', default: '5' },
		'scroll-speed': { type: 'string', default: '3000' },
		format: { type: 'string', default: 'markdown' },
		headed: { type: 'boolean', default: false },
	},
})

if (options.url === undefined) {
	console.error('Usage: node tests/playwright/perf/timeline-speed.js --url <timeline> [--user <name> --password <password>] [--runs 3] [--format markdown|json]')
	process.exit(1)
}

/** How long the previews in view have to stay loaded, and the page unscrolled, to count as settled. */
const SETTLE_MS = 500

/**
 * Runs in the page before its own scripts: provides the lookup of the element
 * that scrolls the timeline, which is the closest scrollable ancestor of a preview.
 */
function installScrollerLookup() {
	window.__timelineScroller = (selector) => {
		for (let parent = document.querySelector(selector)?.parentElement; parent; parent = parent.parentElement) {
			if (parent.scrollHeight > parent.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(parent).overflowY)) {
				return parent
			}
		}
		return document.scrollingElement
	}
}

/**
 * Runs in the page on every frame until the previews in view are all loaded and
 * nothing has moved for a while, then says when that state was reached.
 *
 * @param {{ selector: string, settleMs: number, from: number | null }} args - `from` is the scroll offset a jump has to leave first
 * @return {{ ms: number, previews: number } | false}
 */
function previewsSettled({ selector, settleMs, from }) {
	const images = [...document.querySelectorAll(selector)].filter((image) => {
		const box = image.getBoundingClientRect()
		return box.width > 0 && box.bottom > 0 && box.top < window.innerHeight
	})
	const scroller = window.__timelineScroller(selector)
	const state = window.__timelineSpeed ??= {}
	const loaded = images.length > 0 && images.every((image) => image.complete && image.naturalWidth > 0)

	if (!loaded || scroller.scrollTop === from || scroller.scrollTop !== state.scrollTop) {
		state.scrollTop = scroller.scrollTop
		state.since = undefined
		return false
	}

	state.since ??= performance.now()
	return performance.now() - state.since >= settleMs ? { ms: state.since, previews: images.length } : false
}

/**
 * Runs in the page: scrolls the timeline at a constant speed and records the time
 * between the frames the browser managed to draw meanwhile.
 *
 * @param {{ selector: string, seconds: number, speed: number }} args - What to scroll, for how long and how fast
 * @return {Promise<{ frameTimes: number[], scrolledPx: number, longAnimationFrames: number | null, blockedMs: number | null }>}
 */
async function scriptedScroll({ selector, seconds, speed }) {
	const scroller = window.__timelineScroller(selector)

	const longFrames = []
	const supported = PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')
	const observer = new PerformanceObserver((list) => longFrames.push(...list.getEntries()))
	if (supported) {
		observer.observe({ type: 'long-animation-frame' })
	}

	const frameTimes = []
	const top = scroller.scrollTop
	await new Promise((resolve) => {
		const start = performance.now()
		let last = start
		const step = (now) => {
			frameTimes.push(now - last)
			last = now
			scroller.scrollTop = top + (now - start) / 1000 * speed
			if (now - start < seconds * 1000) {
				requestAnimationFrame(step)
			} else {
				resolve()
			}
		}
		requestAnimationFrame(step)
	})

	longFrames.push(...observer.takeRecords())
	observer.disconnect()

	return {
		// The first entry is the wait for the first frame, not a frame of the scroll
		frameTimes: frameTimes.slice(1),
		scrolledPx: Math.round(scroller.scrollTop - top),
		longAnimationFrames: supported ? longFrames.length : null,
		blockedMs: supported ? longFrames.reduce((sum, frame) => sum + frame.blockingDuration, 0) : null,
	}
}

/**
 * Measure one cold visit of the timeline in a browser context of its own.
 *
 * @param {import('@playwright/test').Browser} browser - The browser to open the context in
 */
async function measure(browser) {
	const [width, height] = options.viewport.split('x').map(Number)
	const context = await browser.newContext({ viewport: { width, height } })
	await context.addInitScript(installScrollerLookup)
	const page = await context.newPage()
	page.setDefaultTimeout(120_000)

	try {
		if (options.user !== undefined) {
			await page.goto(options['login-url'] ?? options.url.replace(/\/apps\/.*$/, '/login'))
			await page.fill('#user', options.user)
			await page.fill('#password', options.password ?? '')
			await page.press('#password', 'Enter')
			await page.waitForURL((url) => !url.pathname.endsWith('/login'))
		}

		// Both times count from the start of this navigation, which is where performance.now() starts
		await page.goto(options.url, { waitUntil: 'commit' })
		const firstPhoto = await page.waitForFunction(
			(selector) => [...document.querySelectorAll(selector)].some((image) => image.complete && image.naturalWidth > 0) && performance.now(),
			options['photo-selector'],
		)
		const settle = { selector: options['photo-selector'], settleMs: SETTLE_MS }
		const firstScreen = await (await page.waitForFunction(previewsSettled, { ...settle, from: null })).jsonValue()

		const scroll = await page.evaluate(scriptedScroll, {
			selector: options['photo-selector'],
			seconds: Number(options['scroll-seconds']),
			speed: Number(options['scroll-speed']),
		})

		const result = {
			firstPhotoMs: round(await firstPhoto.jsonValue()),
			firstScreenMs: round(firstScreen.ms),
			firstScreenPreviews: firstScreen.previews,
			scroll: {
				...frameStats(scroll.frameTimes),
				scrolledPx: scroll.scrolledPx,
				longAnimationFrames: scroll.longAnimationFrames,
				blockedMs: scroll.blockedMs,
			},
			jumpToOldestMs: null,
		}

		// Without the control there is nothing to jump with, e.g. in a library of a single month
		const jump = page.locator(options['jump-selector'])
		if (await jump.count() > 0) {
			await jump.first().focus()
			const before = await page.evaluate((selector) => ({
				ms: performance.now(),
				scrollTop: window.__timelineScroller(selector).scrollTop,
			}), options['photo-selector'])
			await page.keyboard.press(options['jump-key'])
			const jumped = await (await page.waitForFunction(previewsSettled, { ...settle, from: before.scrollTop })).jsonValue()
			result.jumpToOldestMs = round(jumped.ms - before.ms)
		}

		return result
	} finally {
		await context.close()
	}
}

/**
 * @param {object[]} runs - The measurements of all visits
 * @param {(run: object) => number | null} pick - The number to take from each
 * @return {{ median: number | null, runs: (number | null)[] }}
 */
function summarize(runs, pick) {
	const numbers = runs.map(pick)
	const measured = numbers.filter((number) => number !== null)
	return { median: measured.length > 0 ? round(median(measured)) : null, runs: numbers }
}

const browser = await chromium.launch({ headless: !options.headed })
const runs = []
try {
	for (let run = 0; run < Number(options.runs); run++) {
		runs.push(await measure(browser))
	}
} finally {
	await browser.close()
}

const summary = {
	url: options.url,
	date: new Date().toISOString(),
	browser: `Chromium ${browser.version()}`,
	viewport: options.viewport,
	scroll: `${options['scroll-seconds']} s at ${options['scroll-speed']} px/s`,
	metrics: {
		'Time to first photo (ms)': summarize(runs, (run) => run.firstPhotoMs),
		'Time to first screen of previews (ms)': summarize(runs, (run) => run.firstScreenMs),
		'Previews on the first screen': summarize(runs, (run) => run.firstScreenPreviews),
		'Scroll: frames drawn': summarize(runs, (run) => run.scroll.frames),
		'Scroll: dropped frames': summarize(runs, (run) => run.scroll.droppedFrames),
		'Scroll: dropped frames (%)': summarize(runs, (run) => run.scroll.droppedPercent),
		'Scroll: longest frame (ms)': summarize(runs, (run) => run.scroll.longestFrameMs),
		'Scroll: long animation frames': summarize(runs, (run) => run.scroll.longAnimationFrames),
		'Scroll: blocked time (ms)': summarize(runs, (run) => run.scroll.blockedMs),
		'Scroll: distance (px)': summarize(runs, (run) => run.scroll.scrolledPx),
		'Jump to the oldest month (ms)': summarize(runs, (run) => run.jumpToOldestMs),
	},
}

if (options.format === 'json') {
	console.log(JSON.stringify(summary, null, '\t'))
} else {
	console.log(`Timeline speed of ${summary.url}`)
	console.log(`${summary.date}, ${summary.browser}, ${summary.viewport}, scroll of ${summary.scroll}\n`)
	console.log('| Metric | Median | Runs |')
	console.log('|---|---|---|')
	for (const [name, { median, runs }] of Object.entries(summary.metrics)) {
		console.log(`| ${name} | ${median ?? 'n/a'} | ${runs.map((number) => number ?? 'n/a').join(', ')} |`)
	}
}
