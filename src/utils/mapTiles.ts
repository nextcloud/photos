/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/** Tile server the maps of Photos load their tiles from. */
export const TILE_SERVER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

/**
 * Host name of a tile server, without the placeholder subdomain.
 *
 * @param url - Tile URL template such as `https://{s}.tile.example.org/{z}/{x}/{y}.png`
 */
export function tileServerHost(url: string): string {
	return new URL(url.replace(/\{[a-z]+\}\./g, '')).hostname
}
