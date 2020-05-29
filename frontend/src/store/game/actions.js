const actions = {
  CREATE ({ state }, name) {
    this._vm.$socket.client.emit('createGame', name)
  },
  LIST ({ commit, state }) {
    this._vm.$socket.client.emit('listGames', (games) => {
      commit('SET_GAMELIST', games)
    })
  },
  JOIN ({ state, commit }, game) {
    this._vm.$socket.client.emit('join', game, (success) => {
      if (success) {
        commit('SET_GAMEID', game)
      }
    })
    console.log({ action: 'JOIN' })
  },
  LEAVE ({ commit }) {
    commit('SET_GAMEID', null)
  },
  KICK ({ state }, player) {
    this._vm.$socket.client.emit('kickPlayer', state.remoteId, player.identifier)
  },
  FINISH ({ state }) {
    this._vm.$socket.client.emit('finish', state.remoteId)
    console.log({ action: 'FINISH' })
  },
  RESTART ({ state }) {
    this._vm.$socket.client.emit('action', { action: 'RESTART', gameId: state.remoteId })
    console.log({ action: 'RESTART' })
  },
  RESTACK ({ state }) {
    this._vm.$socket.client.emit('action', { action: 'RESTACK', gameId: state.remoteId })
    console.log({ action: 'RESTACK' })
  },
  DRAW ({ state }) {
    this._vm.$socket.client.emit('action', { action: 'DRAW', gameId: state.remoteId })
    console.log({ action: 'DRAW' })
  },
  DRAW_FROM_STACK ({ state }) {
    this._vm.$socket.client.emit('action', { action: 'DRAW_FROM_STACK', gameId: state.remoteId })
    console.log({ action: 'DRAW_FROM_STACK' })
  },
  SWAP ({ commit, state }, target) {
    this._vm.$socket.client.emit('action', { action: 'SWAP', gameId: state.remoteId, target: target.identifier })
  },
  ROTATE ({ commit, state }, direction) {
    this._vm.$socket.client.emit('action', { action: 'ROTATE', gameId: state.remoteId, direction: direction })
  },
  PLAY ({ state, rootState }, card) {
    console.log({ action: 'PLAY', player: rootState.user.userid, card: card })
    this._vm.$socket.client.emit('action', { action: 'PLAY', gameId: state.remoteId, card: card.identifier })
  }
}
export default actions
