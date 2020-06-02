import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import '@/plugins/bootstrap'
import '@/plugins/fontawesome'
import '@/plugins/socket'
import '@/assets/scss/style.scss'
import App from './App.vue'
import router from './router'
import store from '@/store/index'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
