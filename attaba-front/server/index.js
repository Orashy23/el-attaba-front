import { createServer } from 'node:http'
import { createApp } from './createApp.js'
import { createStore } from './store.js'
import { log } from './logger.js'

const port = Number(process.env.PORT) || 3001
const server = createServer(createApp(createStore()))
server.listen(port, () => {
  log('info', 'api_listen', { port })
})
