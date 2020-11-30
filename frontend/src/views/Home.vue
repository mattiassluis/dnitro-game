<template>
  <b-container fluid class="pb-5 px-0">
    <b-navbar type="dark" variant="dark">
      <b-navbar-brand gref="#">D-Nitro's Jennies Hour</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item :active="lobbyScreen" :disabled="userScreen" @click="gotoLobby">
          Game Lobby
          <span v-if="!userScreen && !lobbyScreen"> (leave game)</span>
        </b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item @click="$bvModal.show('help')">
          <font-awesome-icon icon="question-circle"></font-awesome-icon>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <b-modal id="help" size="xl" title="Help" hide-footer>
      <help></help>
    </b-modal>

    <b-container fluid class="p-5">
      <b-container fluid v-if="userScreen">
        <b-row>
          <b-col cols="12" lg="6" offset-lg="3" class="text-center">
            <div v-if="userid">
              <p>If you dropped from the game you can</p>
              <b-button type="submit" class="mb-3" variant="primary" @click="reconnectUser">Reconnect</b-button>
              <p>or</p>
            </div>
            <div class="mt-3">
              <div class="d-flex justify-content-center">
                <div class="px-2"><b-form-input class="float-right" v-model="usernameInput" placeholder="Enter your name"></b-form-input></div>
                <div class="px-2"><b-button type="submit" class="float-left" variant="primary" @click="createUser">Connect</b-button></div>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
      <b-container fluid v-else-if="lobbyScreen">
        <h1>Welcome to the lobby</h1>

        <b-row>
          <b-col cols="12">
            <b-card-group deck class="mb-3">
              <b-card title="Available Games" class="shadow-sm border-0">
                <b-card-text v-if="gameList.length">
                  <ul>
                    <li v-for="game in gameList" :key="game.identifier">
                      {{ game.name }} ({{ game.players }} players) <b-button size="sm" variant="outline-primary" @click="joinGame(game.identifier)">Join</b-button>
                    </li>
                  </ul>
                </b-card-text>
                <b-card-text v-else>
                  There are no games available at this moment but you can create one.
                </b-card-text>
              </b-card>
              <b-card title="Players online" class="shadow-sm border-0">
                <b-card-text v-if="lobbyPlayers.length">
                  <ul>
                    <li v-for="player in lobbyPlayers" :key="player.identifier">
                      {{ player.name }}
                    </li>
                  </ul>
                </b-card-text>
                <b-card-text v-else>
                  There are no other players online
                </b-card-text>
              </b-card>
            </b-card-group>
          </b-col>
        </b-row>

        <b-card title="Create a new game" class="mt-3 shadow-sm border-0">
          <b-card-text>
            <div class="d-flex">
              <div class="px-2"><b-form-input v-model="gameNameInput" placeholder="Name of the game"></b-form-input></div>
              <div class="px-2"><b-button type="submit" variant="primary" @click="createGame">Create game</b-button></div>
            </div>
          </b-card-text>
        </b-card>
      </b-container>
      <b-container fluid v-else-if="game">
        <b-row>
          <b-col cols="12" xl="10">
            <b-row v-if="otherPlayers" class="p-4">
              <b-col size="12">
                <b-card-group deck class="justify-content-md-center">
                  <Player class="d-lg-none" v-if="playerLeft" :player="playerLeft" :swap="swap"></Player>
                  <Player v-for="player in otherPlayers" :key="player.identifier" :player="player" :swap="swap"></Player>
                  <Player class="d-lg-none" v-if="playerRight" :player="playerRight" :swap="swap"></Player>
                </b-card-group>
              </b-col>
            </b-row>
            <b-row class="p-4">
              <b-col cols="3" xl="2" class="d-none d-lg-block">
                <Player class="float-left" v-if="playerLeft" :player="playerLeft" :swap="swap"></Player>
              </b-col>
              <b-col cols="6" lg="3" xl="2" style="position: relative" class="card-stack right">
                <Card :small="compactMode" v-if="reverseStack.length" :card="reverseStack[0]" @card-clicked="drawFromStack()" />
                <Card :small="compactMode" v-if="reverseStack.length > 1" :card="reverseStack[1]" @card-clicked="drawFromStack()" />
                <Card :small="compactMode" v-if="reverseStack.length > 2" :card="reverseStack[2]" @card-clicked="drawFromStack()" />
                <Card :small="compactMode" v-if="reverseStack.length > 3" :card="reverseStack[3]" @card-clicked="drawFromStack()" />
                <Card :small="compactMode" v-if="reverseStack.length <= 1" />
              </b-col>
              <b-col cols="0" xl="3" class="d-none d-xl-flex">
                <pre style="height: 150px; width: 100%; overflow-y: scroll; overflow-x: hidden"><code>{{ logMessages }}</code></pre>
              </b-col>
              <b-col cols="6" lg="3" xl="2" style="position: relative">
                <Card :small="compactMode" v-if="drawPileReverse.length" :covered="true" @card-clicked="draw()" style="position: absolute; left: 25px; top: 0; z-index: 5"/>
                <Card :small="compactMode" v-if="drawPileReverse.length <= 1" @card-clicked="draw()" />
                <Card :small="compactMode" v-if="drawPileReverse.length > 1" :covered="true" />
              </b-col>
              <b-col cols="3" xl="2" class="d-none d-lg-block">
                <Player class="float-right" v-if="playerRight" :player="playerRight" :swap="swap"></Player>
              </b-col>
            </b-row>
            <b-row class="mt-1 d-xl-none">
              <b-col cols="12">
                <b-container>
                  <pre style="height: 50px; width: 100%; overflow-y: scroll; overflow-x: hidden"><code>{{ logMessages }}</code></pre>
                </b-container>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col cols="12" class="text-center">
                <b-button variant="outline-secondary" @click="drawFour" size="sm">
                  <span class="d-none d-xl-inline">Draw </span>+4
                </b-button>
                <b-button variant="outline-secondary" @click="drawTwo" class="ml-1" size="sm">
                  <span class="d-none d-xl-inline">Draw </span>+2
                </b-button>
                <b-button variant="danger" @click="messageColor('red')" class="ml-1" size="sm">Red</b-button>
                <b-button variant="warning" @click="messageColor('yellow')" class="ml-1" size="sm">Yellow</b-button>
                <b-button variant="success" @click="messageColor('green')" class="ml-1" size="sm">Green</b-button>
                <b-button variant="primary" @click="messageColor('blue')" class="ml-1" size="sm">Blue</b-button>
                <b-button variant="outline-secondary" @click="message('calls UNO')" class="ml-1" size="sm">Call UNO!</b-button>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col cols="12" md="6" lg="4" offset-lg="4" offset-md="3" class="text-center">
                <b-container>
                  <b-form-input v-model="chatInput" @keyup.enter="chat" type="text" size="sm" placeholder="Send a message to the others"></b-form-input>
                </b-container>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <b-card-group deck class="mb-4 justify-content-md-center">
                  <Card :small="compactMode" v-for="(card, i) in playerSelfCards" :key="i" class="my-3" :card="card" @card-clicked="play(card)" />
                </b-card-group>
                <div v-if="finished" class="text-center">
                  <b-button v-b-tooltip.hover title="Game finished, count score" variant="dark" class="mb-2" @click="finish">
                    <font-awesome-icon icon="flag-checkered" class="mr-1"></font-awesome-icon> Restart
                  </b-button>
                  <p>
                    Looks like you won! Restart the game to gather your score and start a new game.
                  </p>
                </div>
              </b-col>
            </b-row>
          </b-col>

          <b-col cols="12" xl="2">
            <h4>Controls</h4>
            <b-row>
              <b-col cols="12">
                <b-btn-toolbar>
                  <b-button v-b-tooltip.hover title="Rotate cards clockwise" variant="info" class="mb-3 mr-1" @click="rotate('left')">
                    <font-awesome-icon icon="angle-left" class="mr-2"></font-awesome-icon>
                    <font-awesome-icon icon="redo"></font-awesome-icon>
                  </b-button>
                  <b-button v-b-tooltip.hover title="Game finished, count score" variant="dark" class="mb-3 mr-1" @click="finish">
                    <font-awesome-icon icon="flag-checkered"></font-awesome-icon>
                  </b-button>
                  <b-button v-b-tooltip.hover title="Restart the game" variant="danger" class="mb-3 mr-1" @click="restart">
                    <font-awesome-icon icon="play"></font-awesome-icon>
                  </b-button>
                  <b-button v-b-tooltip.hover title="Rotate cards counter clockwise" variant="info" class="mb-3" @click="rotate('right')">
                    <font-awesome-icon icon="undo"></font-awesome-icon>
                    <font-awesome-icon icon="angle-right" class="ml-2"></font-awesome-icon>
                  </b-button>
                </b-btn-toolbar>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <b-form-checkbox v-model="sortCards">Sort my cards</b-form-checkbox>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <b-form-checkbox v-model="compactMode" @change="toggleCompact">Compact mode</b-form-checkbox>
              </b-col>
            </b-row>

            <h5 class="mt-3">Players</h5>
            <b-list-group class="mt-3">
              <b-list-group-item v-for="player in game.players" :key="player.identifier" class="d-flex flex-row align-content-between">
                <div class="flex-grow-1">{{ player.name }}</div>
                <div class="px-2"><b-badge variant="primary" pill>{{ player.score }}</b-badge></div>
                <b-button v-b-tooltip.hover title="Remove this user from the game" size="sm" variant="outline-primary" :disabled="player.identifier === playerSelf.identifier" @click="kick(player)">Kick</b-button>
              </b-list-group-item>
            </b-list-group>
          </b-col>
        </b-row>
      </b-container>
      <b-container fluid v-else>
        <b-container>
          <b-alert show>Oops, something is wrong, try refreshing the page</b-alert>
        </b-container>
      </b-container>
    </b-container>

    <div class="text-center">
      <small>version 0.0.9 | D-Nitro | Card design inspired by <a href="https://opengameart.org/content/uno-playing-cards-2d" target="_blank">mehrasaur</a> and <a href="https://www.instagram.com/warlesonoliveira/?utm_source=ig_embed" target="_blank">Warleson Oliveira</a></small>
    </div>
  </b-container>
</template>

<script>
import Card from '@/components/Card'
import Help from '@/components/Help'
import Player from '@/components/Player'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    Card,
    Help,
    Player
  },
  data () {
    return {
      usernameInput: '',
      gameNameInput: 'Jennies Hour',
      lobbyInterval: null,
      sortCards: false,
      chatInput: ''
    }
  },
  methods: {
    ...mapActions({
      setUsername: 'user/SET_USERNAME',
      registerUser: 'user/REGISTER_USER',
      reconnect: 'user/RECONNECT',
      create: 'game/CREATE',
      join: 'game/JOIN',
      kick: 'game/KICK',
      restack: 'game/RESTACK',
      message: 'game/MESSAGE',
      finish: 'game/FINISH',
      leaveGame: 'game/LEAVE',
      listGames: 'game/LIST',
      listPlayers: 'user/LIST_PLAYERS',
      restart: 'game/RESTART',
      draw: 'game/DRAW',
      drawFromStack: 'game/DRAW_FROM_STACK',
      swap: 'game/SWAP',
      rotate: 'game/ROTATE',
      play: 'game/PLAY',
      toggleCompact: 'game/TOGGLE_COMPACT'
    }),
    createUser () {
      console.log('Registering')
      this.setUsername(this.usernameInput)
      this.registerUser()
      this.listGames()
    },
    messageColor (color) {
      this.message('Change color to ' + color)
    },
    chat () {
      if (this.chatInput) {
        const message = this.chatInput
        this.chatInput = ''
        this.message(message)
      }
    },
    reconnectUser () {
      console.log('Attempt reconnect')
      this.reconnect()
      this.listGames()
    },
    createGame () {
      this.create(this.gameNameInput)
    },
    joinGame (gameId) {
      this.join(gameId)
    },
    updateLobby () {
      this.listGames()
      this.listPlayers()
    },
    gotoLobby () {
      this.kick(this.playerSelf)
      this.leaveGame()
    },
    drawTwo () {
      this.draw()
      this.draw()
    },
    drawFour () {
      this.drawTwo()
      this.drawTwo()
    }
  },
  computed: {
    ...mapGetters({
      username: 'user/username',
      userid: 'user/userid',
      players: 'user/players',
      connected: 'user/connected',
      game: 'game/currentGame',
      gameList: 'game/gameList',
      gameid: 'game/gameId',
      currentPlayer: 'game/currentPlayer',
      logs: 'game/logs',
      compactMode: 'game/compact'
    }),
    logMessages () {
      if (!this.logs[this.gameid]) {
        return ''
      }
      const messages = [...this.logs[this.gameid]]
      messages.reverse()
      return messages.join('\n')
    },
    finished () {
      return this.playerSelf && Object.keys(this.playerSelf.cards).length === 0
    },
    userScreen () {
      return !(this.userid && this.connected)
    },
    lobbyScreen () {
      return !this.userScreen && !this.gameid
    },
    reverseStack () {
      const stack = [...this.game.stack]
      stack.reverse()
      return stack
    },
    lobbyPlayers () {
      return this.players.filter(player => !player.disconnected)
    },
    playerSelfCards () {
      if (!this.playerSelf) {
        return []
      }
      const cards = [...this.playerSelf.cards]

      if (!this.sortCards) {
        return cards
      }

      cards.sort((a, b) => {
        if (a.color !== b.color) {
          return a.color > b.color ? -1 : 1
        }
        if (a.value === b.value) {
          return a.category > b.category ? -1 : 1
        }
        return a.value < b.value ? -1 : 1
      })
      return cards
    },
    drawPileReverse () {
      if (this.game.drawpile) {
        const drawPile = [...this.game.drawpile]
        drawPile.reverse()
        return drawPile
      }
      return null
    },
    playerSelf () {
      if (!this.game) {
        return undefined
      }
      return this.currentPlayer(this.userid)
    },
    playerRight () {
      if (!this.game) {
        return undefined
      }
      let i = this.game.players.indexOf(this.playerSelf) - 1
      if (i < 0) {
        i = this.game.players.length - 1
      }
      const player = this.game.players[i]
      if (player === this.playerSelf) {
        return undefined
      }
      return player
    },
    playerLeft () {
      if (!this.game) {
        return undefined
      }
      let i = this.game.players.indexOf(this.playerSelf) + 1
      if (i === this.game.players.length) {
        i = 0
      }
      const player = this.game.players[i]
      if (player === this.playerSelf || player === this.playerRight) {
        return undefined
      }
      return player
    },
    otherPlayers () {
      if (!this.game) {
        return []
      }

      let players = [...this.game.players]
      const pos = this.game.players.indexOf(this.playerSelf)
      if (pos > 0) {
        players = [].concat(this.game.players.slice(pos), this.game.players.slice(0, pos))
      }

      return players.filter(item => {
        return item !== this.playerLeft && item !== this.playerSelf && item !== this.playerRight
      })
    },
    stack () {
      if (!this.game) {
        return undefined
      }
      return this.game.stack
    }
  },
  watch: {
    lobbyScreen: function (value) {
      if (value && !this.userScreen) {
        this.updateLobby()
        this.lobbyInterval = setInterval(this.updateLobby, 3000)
      } else if (this.lobbyInterval) {
        clearInterval(this.lobbyInterval)
      }
    }
  }
}
</script>
