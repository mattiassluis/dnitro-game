import Vue from 'vue'
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'
import store from '../store'

const socket = io('http://uno-server.d-nitro.com:80')

Vue.use(VueSocketIOExt, socket, { store })
