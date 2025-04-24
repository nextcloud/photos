// vuex.d.ts
import type { PhotosStore } from './store'

declare module 'vue' {
  interface ComponentCustomProperties {
    $store: PhotosStore
  }
}
