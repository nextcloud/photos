/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

type SemaphoreWithPriorityItem = {
	symbol: symbol
	priority: () => number
	resolve: (value: symbol) => void
}

/**
 *
 * @param capacity - The number of simultaneous access to the ressource.
 */
export default class SemaphoreWithPriority {
	#capacity: number = 0
	#queue: SemaphoreWithPriorityItem[] = []
	#active: symbol[] = []

	constructor(capacity: number) {
		this.#capacity = capacity
	}

	/**
	 * @param priority - A function that return a priority. This function will be call when looking for a next job to run so keep it quick.
	 * @param info - An additional string to initialise the Symbol and help debugging.
	 */
	async acquire(priority: () => number = () => 1, info: string = ''): Promise<symbol> {
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
	 * @param symbol - The symbole returned by the acquire method.
	 */
	release(symbol: symbol) {
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
		const prioritizedQueue: Record<number, SemaphoreWithPriorityItem[]> = {}

		for (const item of this.#queue) {
			const itemPriority = item.priority()
			prioritizedQueue[itemPriority] = prioritizedQueue[itemPriority] ?? []
			prioritizedQueue[itemPriority].push(item)
		}

		const highestPriority = Number.parseInt(Object.keys(prioritizedQueue).sort()[0])
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
