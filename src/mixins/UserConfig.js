/**
 * @copyright Copyright (c) 2020 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { emit, subscribe, unsubscribe } from '@nextcloud/event-bus'
import { generateUrl } from '@nextcloud/router'
import { loadState } from '@nextcloud/initial-state'
import axios from '@nextcloud/axios'

const eventName = 'photos:user-config-changed'

export default {
	data() {
		const croppedLayoutLocalStorage = localStorage.getItem('photos:croppedLayout')
		const galleryLayoutLocalStorage = localStorage.getItem('photos:galleryLayout')
		return {
			croppedLayout: croppedLayoutLocalStorage !== null
				? croppedLayoutLocalStorage === 'true'
				: loadState('photos', 'croppedLayout') === 'true',

			galleryLayout: galleryLayoutLocalStorage !== null
				? galleryLayoutLocalStorage === 'true'
				: loadState('photos', 'galleryLayout') === 'true',
			
		}
	},

	created() {
		subscribe(eventName, this.updateLocalSetting)
		this.checkLocalSettings();
	},

	beforeDestroy() {
		unsubscribe(eventName, this.updateLocalSetting)
	},

	methods: {
		updateLocalSetting({ setting, value }) {
			this[setting] = value
		},

		checkLocalSettings(){
			var v = "galleryLayout"
			var oldVal = localStorage.getItem('photos:' +v)
			if(oldVal==="true"){
				console.log("route"+ this.$route.name);
				if(this.$route.name!=="timeline1"){
					this.$router.push('/gallery'); 	
				}
				
			}
		},
		
		updateGallerySettings(setting){
			const value = this[setting]
			// Long time save setting
			axios.put(generateUrl('apps/photos/api/v1/config/' + setting), {
				value: value.toString(),
			})
			var v ="galleryLayout";
			var oldVal = localStorage.getItem('photos:' + setting)
			console.log(oldVal);
			// Current session save setting
			localStorage.setItem('photos:' + setting, value)
			// Visible elements update setting
			emit(eventName, { setting, value })
			if(value){
				console.log("aaaa"+ value);
				this.$router.push('/gallery'); 
			}
			else{
				this.$router.push('/'); 
			}
			
		},


		updateSetting(setting) {
			const value = this[setting]
			// Long time save setting
			axios.put(generateUrl('apps/photos/api/v1/config/' + setting), {
				value: value.toString(),
			})
			// Current session save setting
			localStorage.setItem('photos:' + setting, value)
			// Visible elements update setting
			emit(eventName, { setting, value })
		},
	},
}
