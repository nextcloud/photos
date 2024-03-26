/**
 * @copyright Copyright (c) 2023 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import type { AxiosError } from 'axios'
import type { FileStat, ResponseDataDetailed, StatOptions } from 'webdav'
import { genFileInfo } from '../utils/fileUtils.js'
import { davClient } from './DavClient'
import { getPropFind } from './DavRequest'

/**
 * @param fileName - The full file's name
 * @param options - Options to forward to the webdav client.
 */
export async function fetchFile(fileName: string, options: StatOptions = {}) {
	try {
		const response = await davClient.stat(fileName, {
			data: getPropFind(),
			details: true,
			...options,
		}) as ResponseDataDetailed<FileStat>

		return genFileInfo(response.data)
	} catch (error) {
		if ((error as AxiosError).code === 'ERR_CANCELED') {
			return null
		}

		throw error
	}
}
