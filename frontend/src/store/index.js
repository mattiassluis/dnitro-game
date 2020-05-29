import Vue from 'vue'
import Vuex from 'vuex'
import game from './game'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    game
  },
  strict: false
})
