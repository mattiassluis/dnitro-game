import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  username: localStorage.getItem('uno-username'),
  userid: localStorage.getItem('uno-userid'),
  connected: false,
  players: []
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
