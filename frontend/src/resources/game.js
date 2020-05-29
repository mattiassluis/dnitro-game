import { getRuntimeConfig } from '@/config'

const env = getRuntimeConfig()

const gameSocket = {
  ws: null,
  reconnectInterval: 1000
}
gameSocket.install = (Vue, options) => {
  gameSocket.ws = new WebSocket('wss://' + env.VUE_APP_API_WEBSOCKET)
  gameSocket.reconnectInterval = 1000

  Vue.prototype.$wsConnect = () => {
    gameSocket.ws = new WebSocket('wss://' + env.VUE_APP_API_WEBSOCKET)
    gameSocket.ws.onopen = () => {
      gameSocket.reconnectInterval = 1000
    }
    gameSocket.ws.onclose = event => {
      if (event && event.code !== 1000) {
        const maxReconnectInterval = 3000
        setTimeout(() => {
          if (gameSocket.reconnectInterval < maxReconnectInterval) {
            gameSocket.reconnectInterval += 1000
          }
          Vue.prototype.$wsConnect()
        }, gameSocket.reconnectInterval)
      }
    }
    gameSocket.ws.onerror = error => {
      window.console.log(error)
      gameSocket.ws.close()
    }
    gameSocket.ws.onmessage = event => {
      window.console.log(event)
      const data = JSON.parse(event.data)
      if (data.type === 'GAME') {
        options.store.commit('game/SET_CURRENTGAME', data.game)
      }
    }
  }

  Vue.prototype.$wsClose = () => {
    gameSocket.ws.close()
  }

  Vue.prototype.$wsSend = (data) => {
    gameSocket.ws.send(JSON.stringify(data))
  }
}

export default gameSocket
