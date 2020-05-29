const actions = {
  SET_USERNAME ({ commit }, username) {
    commit('SET_USERNAME', username)
  },

  REGISTER_USER ({ commit, state, dispatch }) {
    this._vm.$socket.client.emit('register', state.username, (userid) => {
      commit('SET_USERID', userid)
      commit('SET_CONNECTED')
      dispatch('LIST_PLAYERS')
    })
  },
  LIST_PLAYERS ({ commit }) {
    this._vm.$socket.client.emit('listPlayers', (players) => {
      commit('SET_PLAYERS', players)
    })
  },
  RECONNECT ({ commit, state, dispatch }) {
    this._vm.$socket.client.emit('reconnectPlayer', state.userid, (success) => {
      if (!success) {
        commit('SET_USERID', null)
      } else {
        commit('SET_CONNECTED')
        dispatch('LIST_PLAYERS')
      }
    })
  }
}
export default actions
