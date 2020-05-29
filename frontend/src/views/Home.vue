<template>
  <b-container fluid class="p-5">
    <b-container fluid v-if="userScreen">
      <div v-if="userid">
        <b-button type="submit" class="mt-3" variant="primary" @click="createUser">Reconnect</b-button>
      </div>
      <div v-else>
        <b-form-input v-model="usernameInput" placeholder="Enter your name"></b-form-input>
        <b-button type="submit" class="mt-3" variant="primary" @click="createUser">Set user</b-button>
      </div>
    </b-container>
    <b-container fluid v-else-if="lobbyScreen">
      <h1>Welcome to the lobby</h1>

      <b-row>
        <b-col cols="6">
          <b-card title="Available Games">
            <b-card-text v-if="gameList.length">
              <ul>
                <li v-for="game in gameList" :key="game.identifier">
                  {{ game.name }} ({{ game.players }} players) <b-button size="xs" variant="outline-primary" @click="joinGame(game.identifier)">Join</b-button>
                </li>
              </ul>
            </b-card-text>
            <b-card-text v-else>
              There are no games available at this moment but you can create one.
            </b-card-text>
          </b-card>
        </b-col>
        <b-col cols="6">
          <b-card title="Players online">
            <b-card-text v-if="players.length">
              <ul>
                <li v-for="player in players" :key="player.identifier">
                  {{ player.name }}
                </li>
              </ul>
            </b-card-text>
            <b-card-text v-else>
              There are no other players online
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>

      <b-card title="Create a new game" class="mt-3">
        <b-card-text>
          <b-form-input v-model="gameNameInput" placeholder="Name of the game"></b-form-input>
          <b-button type="submit"  class="mt-3" variant="primary" @click="createGame">Create game</b-button>
        </b-card-text>
      </b-card>
    </b-container>
    <b-container fluid v-else-if="game">
      <b-row v-if="otherPlayers" class="p-4">
        <b-col size="12">
          <b-card-group deck class="justify-content-md-center">
            <Player v-for="player in otherPlayers" :key="player.identifier" :player="player" :swap="swap"></Player>
          </b-card-group>
        </b-col>
      </b-row>
      <b-row class="p-4" >
        <b-col cols="3">
          <Player v-if="playerLeft" :player="playerLeft" :swap="swap"></Player>
        </b-col>
        <b-col cols="3">
          <Card :card="stackTop" @card-clicked="drawFromStack()" />
        </b-col>
        <b-col cols="3">
          <Card :card="stackTop" :covered="true" @card-clicked="draw()" />
        </b-col>
        <b-col cols="3">
          <Player v-if="playerRight" :player="playerRight" :swap="swap"></Player>
        </b-col>
      </b-row>
      <b-row>
        <b-col size="12">
          <b-card-group deck class="mb-4 justify-content-md-center">
            <Card v-for="(card, i) in playerSelf.cards" :key="i" class="my-3" :card="card" @card-clicked="play(card)" />
          </b-card-group>
          <b-button v-if="finished" variant="primary" @click="restart">Restart</b-button>
        </b-col>
      </b-row>
      <h4>Controls for the game master</h4>
      <b-row>
        <b-col>
          <b-button class="outline-info" @click="restart">Restart the game</b-button>
        </b-col>
        <b-col>
          <b-button class="outline-info" @click="rotate('left')">&lt; Rotate clockwise</b-button>
        </b-col>
        <b-col>
          <b-button class="outline-info" @click="rotate('right')">Rotate counter clockwise &gt;</b-button>
        </b-col>
        <b-col>
          <b-button class="outline-info" @click="restack">Restack</b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-for="player in game.players" :key="player.identifier">
          {{ player.name }} <b-button size="xs" variant="outline-primary" @click="kick(player)">Kick</b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid v-else>
      <b-container>
        <b-alert show>Oops, something is wrong, try refreshing the page</b-alert>
      </b-container>
    </b-container>

    <div class="text-center">version 0.0.1</div>
  </b-container>
</template>

<script>
import Card from '@/components/Card'
import Player from '@/components/Player'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    Card,
    Player
  },
  data () {
    return {
      usernameInput: '',
      gameNameInput: 'Jennies Hour'
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
      list: 'game/LIST',
      restart: 'game/RESTART',
      draw: 'game/DRAW',
      drawFromStack: 'game/DRAW_FROM_STACK',
      swap: 'game/SWAP',
      rotate: 'game/ROTATE',
      play: 'game/PLAY'
    }),
    createUser () {
      if (this.userid) {
        console.log('Attempt reconnect')
        this.reconnect()
        this.list()
      } else {
        console.log('Registering')
        this.setUsername(this.usernameInput)
        this.registerUser()
        this.list()
      }
    },
    createGame: function () {
      this.create(this.gameNameInput)
    },
    joinGame: function (gameId) {
      this.join(gameId)
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
      currentPlayer: 'game/currentPlayer'
    }),
    finished () {
      return this.playerSelf && Object.keys(this.playerSelf.cards).length === 0
    },
    userScreen () {
      return !(this.userid && this.connected)
    },
    lobbyScreen () {
      return !this.gameid
    },
    stackTop () {
      return this.game.stack[this.game.stack.length - 1]
    },
    playerSelf () {
      if (!this.game) {
        return undefined
      }
      return this.currentPlayer(this.userid)
    },
    playerLeft () {
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
    playerRight () {
      if (!this.game) {
        return undefined
      }
      let i = this.game.players.indexOf(this.playerSelf) + 1
      if (i === this.game.players.length) {
        i = 0
      }
      const player = this.game.players[i]
      if (player === this.playerSelf || player === this.playerLeft) {
        return undefined
      }
      return player
    },
    otherPlayers () {
      if (!this.game) {
        return []
      }
      return this.game.players.filter(item => {
        return item !== this.playerLeft && item !== this.playerSelf && item !== this.playerRight
      })
    },
    stack () {
      if (!this.game) {
        return undefined
      }
      return this.game.stack
    }
  }
}
</script>
