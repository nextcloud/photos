/*
 * Copyright (c) 2018
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

/**
 *
 * @param {number} capacity - The number of simultaneous access to the ressource.
 */
export default class SemaphoreWithPriority {

	#capacity = 0
	/** @type {{symbol: symbol, priority: Function, resolve: Function}[]} */
	#queue = []
	#active = []

	constructor(capacity) {
		this.#capacity = capacity

	}

	/**
	 * @param {Function} priority - A function that return a priority. This function will be call when looking for a next job to run so keep it quick.
	 * @param {string} info - An additional string to initialise the Symbol and help debugging.
	 */
	async acquire(priority = () => 1, info = '') {
		const symbol = Symbol(info)

		return new Promise((resolve) => {
			this.#queue.push({ symbol, priority, resolve })
			if (this.#active.length < this.#capacity) {
				this.#callNextJob()
			}
		})
	}

	/**
	 *
	 * @param {symbol} symbol - The symbole returned by the acquire method.
	 */
	release(symbol) {
		const symbolIndex = this.#active.indexOf(symbol)
		if (symbolIndex === -1) {
			throw new Error("Can't release non active symbol")
		}
		this.#active.splice(symbolIndex, 1)

		if (this.#queue.length > 0 && this.#active.length < this.#capacity) {
			this.#callNextJob()
		}
	}

	#callNextJob() {
		const prioritizedQueue = {}

		for (const item of this.#queue) {
			const itemPriority = item.priority()
			prioritizedQueue[itemPriority] = prioritizedQueue[itemPriority] ?? []
			prioritizedQueue[itemPriority].push(item)
		}

		const highestPriority = Object.keys(prioritizedQueue).sort()[0]
		const nextJob = prioritizedQueue[highestPriority][0]
		const jobIndex = this.#queue.indexOf(nextJob)
		if (jobIndex === -1) {
			throw new Error("Can't call non existant job")
		}
		this.#queue.splice(jobIndex, 1)

		this.#active.push(nextJob.symbol)
		nextJob.resolve(nextJob.symbol)
	}

}
