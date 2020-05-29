import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  gameList: [],
  remoteId: null,
  games: {},
  gameLogs: {},
  gameName: null,
  currentGame: null,
  socket: null,
  currentPlayer: 0,
  gameId: null // localStorage.getItem('uno-gameid')
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
