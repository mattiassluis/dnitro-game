const mutations = {
  SOCKET_PLAYERS (state, players) {
    state.players = players
  },
  SOCKET_REGISTERED (state, data) {
    state.userid = data.identifier
    state.connected = true
    localStorage.setItem('uno-userid', data.identifier)
  },
  SET_PLAYERS (state, players) {
    state.players = players
  },
  SET_USERNAME (state, username) {
    state.username = username
    localStorage.setItem('uno-username', username)
  },
  SET_USERID (state, userid) {
    state.userid = userid
    localStorage.setItem('uno-userid', userid)
  },
  SET_CONNECTED (state) {
    state.connected = true
  }
}
export default mutations
