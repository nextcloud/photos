export let abortController = new AbortController()

/**
 * Cancel all running http requests
 */
export function cancelAll() {
	abortController.abort()
	abortController = new AbortController()
}
