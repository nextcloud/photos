/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from '../services/collectionFetcher.ts'

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { davClient } from '../services/DavClient.ts'
import store from '../store/index.ts'
import { mountComposable } from './mountComposable.ts'
import { useFetchFaces } from './useFetchFaces.ts'

/** A photo of a face, as the mocked `resultToNode` builds it. */
type FaceNode = { filename: string, attributes: { 'face-detections': unknown } }

vi.mock('../router/index.ts', () => ({ default: { beforeEach: () => () => {} } }))
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))
vi.mock('@nextcloud/files/dav', () => ({
	// The nodes only have to carry through what the composable reads and writes.
	resultToNode: (file: { filename: string, props?: Record<string, unknown> }) => ({
		fileid: file.props?.fileid,
		basename: file.filename,
		filename: file.filename,
		attributes: { ...file.props },
	}),
}))
vi.mock('../services/DavRequest.ts', () => ({ getPropFind: (props: string[]) => props.join('') }))
vi.mock('../services/logger.ts', () => ({ default: { debug: vi.fn(), error: vi.fn() } }))
vi.mock('../services/DavClient.ts', () => ({
	davClient: { getDirectoryContents: vi.fn(), stat: vi.fn() },
}))
vi.mock('../store/index.ts', async () => {
	const { reactive } = await import('vue')

	return {
		default: {
			state: reactive({
				faces: {
					faces: {} as Record<string, Collection>,
					facesFiles: {} as Record<string, string[]>,
					unassignedFiles: [] as string[],
				},
			}),
			dispatch: vi.fn(),
			commit: vi.fn(),
		},
	}
})

/**
 * Answer the next DAV listing with the given entries. The client overloads do
 * not know about the detailed answer the composable asks for, hence the cast.
 *
 * @param entries - The raw DAV entries to answer with
 */
function givenDirectoryContents(entries: object[]): void {
	vi.mocked(davClient.getDirectoryContents).mockResolvedValue({ data: entries } as never)
}

/**
 * The photos of the last `appendFiles` dispatch.
 */
function appendedFiles(): FaceNode[] {
	const call = vi.mocked(store.dispatch).mock.calls.findLast(([action]) => action === 'appendFiles')

	return call![1] as FaceNode[]
}

/**
 * A photo of a face, as the recognize DAV endpoint returns it.
 *
 * @param fileid - File id of the photo
 * @param detections - The `face-detections` property, still encoded
 */
function facePhoto(fileid: number, detections: string) {
	return {
		filename: `/recognize/alice/faces/Bob/1-photo-${fileid}.jpg`,
		props: {
			fileid,
			realpath: `/alice/files/Photos/photo-${fileid}.jpg`,
			'face-detections': detections,
		},
	}
}

describe('useFetchFaces', () => {
	beforeEach(() => {
		store.state.faces.faces = {}
		store.state.faces.facesFiles = {}
		store.state.faces.unassignedFiles = []
		vi.mocked(davClient.getDirectoryContents).mockReset()
		vi.mocked(davClient.stat).mockReset()
		vi.mocked(store.dispatch).mockClear()
		vi.mocked(store.commit).mockClear()
	})

	describe('fetchFaces', () => {
		test('fetches the face list as soon as the component is mounted', async () => {
			givenDirectoryContents([])

			mountComposable(() => useFetchFaces())

			await vi.waitFor(() => expect(davClient.getDirectoryContents).toHaveBeenCalledWith(
				'/recognize/alice/faces/',
				expect.objectContaining({ details: true, signal: expect.any(AbortSignal) }),
			))
		})

		test('puts the faces it fetched in the store', async () => {
			givenDirectoryContents([{ filename: 'Bob', props: { fileid: 1 } }])
			const { result } = mountComposable(() => useFetchFaces())

			await result.fetchFaces()

			expect(store.dispatch).toHaveBeenCalledWith('addFaces', { faces: expect.any(Array) })
			expect(result.loadingFaces.value).toBe(false)
			expect(result.errorFetchingFaces.value).toBeUndefined()
		})

		test('does not fetch a face list the store already holds', async () => {
			store.state.faces.faces = { Bob: {} as Collection }
			const { result } = mountComposable(() => useFetchFaces())
			vi.mocked(davClient.getDirectoryContents).mockClear()

			await result.fetchFaces()

			expect(davClient.getDirectoryContents).not.toHaveBeenCalled()
		})

		test('reports a missing recognize endpoint as a 404', async () => {
			vi.mocked(davClient.getDirectoryContents).mockRejectedValue({ response: { status: 404 } })
			const { result } = mountComposable(() => useFetchFaces())

			await result.fetchFaces()

			expect(result.errorFetchingFaces.value).toBe(404)
			expect(result.loadingFaces.value).toBe(false)
		})

		test('exposes the faces of the store', () => {
			givenDirectoryContents([])
			const { result } = mountComposable(() => useFetchFaces())

			store.state.faces.faces = { Bob: {} as Collection }

			expect(result.faces.value).toEqual({ Bob: {} })
		})
	})

	describe('fetchFaceContent', () => {
		test('addresses the photos of a face by their real path', async () => {
			givenDirectoryContents([facePhoto(1, '[{&quot;id&quot;:7}]')])
			const { result } = mountComposable(() => useFetchFaces())

			await result.fetchFaceContent('Bob')

			expect(appendedFiles()[0].filename).toBe('/files/alice/Photos/photo-1.jpg')
		})

		test('parses the detections of the photos it fetched', async () => {
			givenDirectoryContents([facePhoto(1, '[{&quot;id&quot;:7,&quot;clusterId&quot;:3}]')])
			const { result } = mountComposable(() => useFetchFaces())

			await result.fetchFaceContent('Bob')

			expect(appendedFiles()[0].attributes['face-detections']).toEqual([{ id: 7, clusterId: 3 }])
		})

		test('attaches the photos it fetched to the face', async () => {
			givenDirectoryContents([facePhoto(1, '[]'), facePhoto(2, '[]')])
			const { result } = mountComposable(() => useFetchFaces())

			await result.fetchFaceContent('Bob')

			expect(store.commit).toHaveBeenCalledWith('addFilesToFace', {
				faceName: 'Bob',
				fileIdsToAdd: ['1', '2'],
			})
		})

		test('does not fetch a face the store already holds photos of', async () => {
			store.state.faces.facesFiles = { Bob: ['1'] }
			const { result } = mountComposable(() => useFetchFaces())
			vi.mocked(davClient.getDirectoryContents).mockClear()

			await result.fetchFaceContent('Bob')

			expect(davClient.getDirectoryContents).not.toHaveBeenCalled()
		})

		test('fetches a face again when forced to', async () => {
			store.state.faces.facesFiles = { Bob: ['1'] }
			givenDirectoryContents([])
			const { result } = mountComposable(() => useFetchFaces())
			vi.mocked(davClient.getDirectoryContents).mockClear()

			await result.fetchFaceContent('Bob', true)

			expect(davClient.getDirectoryContents).toHaveBeenCalledOnce()
		})
	})

	describe('fetchUnassignedFaces', () => {
		test('puts the unassigned photos in the store', async () => {
			givenDirectoryContents([facePhoto(1, '[]'), facePhoto(2, '[]')])
			const { result } = mountComposable(() => useFetchFaces())

			await result.fetchUnassignedFaces()

			expect(davClient.getDirectoryContents).toHaveBeenCalledWith(
				'/recognize/alice/unassigned-faces',
				expect.objectContaining({ details: true }),
			)
			expect(store.commit).toHaveBeenCalledWith('addUnassignedFiles', { fileIdsToAdd: ['1', '2'] })
		})

		test('never attaches the same photo twice', async () => {
			givenDirectoryContents([facePhoto(1, '[]'), facePhoto(1, '[]')])
			const { result } = mountComposable(() => useFetchFaces())

			await result.fetchUnassignedFaces()

			expect(store.commit).toHaveBeenCalledWith('addUnassignedFiles', { fileIdsToAdd: ['1'] })
		})

		test('does not fetch unassigned photos the store already holds', async () => {
			store.state.faces.unassignedFiles = ['1']
			const { result } = mountComposable(() => useFetchFaces())
			vi.mocked(davClient.getDirectoryContents).mockClear()

			await result.fetchUnassignedFaces()

			expect(davClient.getDirectoryContents).not.toHaveBeenCalled()
		})
	})

	describe('fetchUnassignedFacesCount', () => {
		test('puts the count in the store', async () => {
			givenDirectoryContents([])
			vi.mocked(davClient.stat).mockResolvedValue({ data: { props: { nbItems: '42' } } } as never)
			const { result } = mountComposable(() => useFetchFaces())

			await result.fetchUnassignedFacesCount()

			expect(store.commit).toHaveBeenCalledWith('setUnassignedFilesCount', 42)
		})

		test('leaves the count alone when the request fails', async () => {
			givenDirectoryContents([])
			vi.mocked(davClient.stat).mockRejectedValue(new Error('Network down'))
			const { result } = mountComposable(() => useFetchFaces())

			await result.fetchUnassignedFacesCount()

			expect(store.commit).not.toHaveBeenCalled()
		})
	})
})
