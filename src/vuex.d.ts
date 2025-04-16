// vuex.d.ts
import { Store } from 'vuex'
import type { PhotosRootSate } from '.'
import type { PhotosContext } from './store'

declare module 'vue' {
  interface ComponentCustomProperties {
    $store: PhotosContext
  }
}
