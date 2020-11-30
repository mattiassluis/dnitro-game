const mutations = {
  SOCKET_GAMECREATED (state, message) {
    state.remoteId = message.identifier
  },
  SOCKET_GAMES (state, games) {
    state.gameList = games
  },
  SET_GAMELIST (state, games) {
    state.gameList = games
  },
  SOCKET_LOG (state, message) {
    console.log(message.message)
    const logs = state.gameLogs
    if (message.game) {
      if (logs[message.game] === undefined) {
        logs[message.game] = []
      }
      logs[message.game] = [].concat(logs[message.game], [message.message])
      state.gameLogs = { ...logs }
    }
  },
  SOCKET_GAME (state, game) {
    state.games[game.identifier] = game
    state.games = { ...state.games }
  },
  SET_GAMEID (state, gameid) {
    state.remoteId = gameid
  },
  TOGGLE_COMPACT (state) {
    state.compact = !state.compact
  }
}
export default mutations
