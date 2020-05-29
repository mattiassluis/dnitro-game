import Vue from 'vue'
import Router from 'vue-router'
import HomeView from './views/Home.vue'
import { getRuntimeConfig } from './config.js'

Vue.use(Router)

const routes = [
  { name: 'home', path: '/', component: HomeView }
]

const env = getRuntimeConfig()

export default new Router({
  mode: 'history',
  base: env.BASE_URL,
  routes: routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      window.console.log(to.hash)
      return { selector: to.hash }
    } else {
      return { x: 0, y: 0 }
    }
  }
})
