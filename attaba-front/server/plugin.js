import { createApp } from './createApp.js'
import { createStore } from './store.js'

const store = createStore()

export function figuresApiPlugin() {
  const api = createApp(store)
  return {
    name: 'figures-api',
    configureServer(server) {
      server.middlewares.use('/api', api)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api', api)
    },
  }
}
