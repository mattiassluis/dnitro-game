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
    console.log(message)
  },
  SOCKET_GAME (state, game) {
    state.games[game.identifier] = game
    state.games = { ...state.games }
  },
  SET_GAMEID (state, gameid) {
    state.remoteId = gameid
  }
}
export default mutations
