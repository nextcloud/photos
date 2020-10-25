import { loadState } from '@nextcloud/initial-state'

const photosDir = loadState('photos', 'photos_dir')
export default photosDir
