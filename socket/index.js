const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const mutations = require('./game/mutations');
const gameCreate = require('./game/game');
const playerCreate = require('./game/player');

app.get('/', (req, res) => {
  res.send('<h1>D-Nitro Uno Server</h1>');
});

const games = {}
const players = {}

const getPlayerById = (identifier) => {
  const results = Object.entries(players).map(([_, p]) => p).filter(p => p.identifier === identifier)
  if (results) {
    return results[0]
  }
  return null
}

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

const cardString = (card) => {
  if (card === undefined) {
    return 'unknown card'
  }
  if (card.category === 'REGULAR') {
    return `${capitalize(card.color)} ${card.value}`
  } else {
    return `${capitalize(card.color)} ${capitalize(card.category).replace('_', ' ')}`
  }
}

const cleanUp = () => {
  console.log('Clean up script running')
  Object.entries(players).forEach(([_, player]) => {
    if (player.disconnected && (player.disconnected+(1000 * 60 * 5)) < Date.now()) {
      console.log(`Cleaning up ${player.name} for being idle`)
      delete players[player.socket]
      Object.entries(games).forEach(([_, game]) => {
        if (game.players.indexOf(player) >= 0) {
          mutations.KICK(game, player)
        }
      })
    }
  })

  Object.entries(games).forEach(([_, game]) => {
    if (!game.players.length) {
      console.log(`Removing empty game ${game.name}`)
      delete games[game.identifier]
    }
  })
}

setInterval(cleanUp, 300000)


io.on('connection', (socket) => {
  console.log('user connected')

  socket.on('disconnect', () => {
    const player = players[socket.id]
    if (player) {
      player.disconnected = Date.now()
      socket.broadcast.emit('log', { message: `${player.name} disconnected` })
    }
    console.log('user disconnected')
  })

  socket.on('register', (username, fn) => {
    const player = playerCreate(socket.id, username)
    players[socket.id] = player
    fn(player.identifier)
    socket.broadcast.emit('log', { message: `${player.name} registered` })
    console.log('player registered as:' + username)
  })

  socket.on('reconnectPlayer', (identifier, fn) => {
    console.log('reconnect attempt for:' + identifier)
    const player = getPlayerById(identifier)
    if (player) {
      delete players[player.socket]
      player.socket = socket.id
      players[socket.id] = player
      player.disconnected = false
      fn(true)
    }
    fn(false)
  })

  socket.on('listGames', (fn) => {
    fn(Object.entries(games).map(([_, g]) => ({
      name: g.name, identifier: g.identifier, players: g.players.length
    })))
  })

  socket.on('listPlayers', (fn) => {
    fn(Object.entries(players).map(([_, p]) => ({
      name: p.name, identifier: p.identifier
    })))
  })

  socket.on('createGame', (name) => {
    const game = gameCreate(name)
    const player = players[socket.id]
    games[game.identifier] = game
    socket.emit('gameCreated', { identifier: game.identifier })
    mutations.JOIN(game, player)
    console.log('game created:' + name)
    io.emit('game', game)
  })

  socket.on('join', (gameId, fn) => {
    const game = games[gameId]
    const player = players[socket.id]

    if (game) {
      mutations.JOIN(game, player)
      io.emit('log', {
        message: 'Player ' + player.name + ' joined game ' + game.name,
        player: player.identifier,
        game: game.identifier
      })
      io.emit('game', game)
      fn(true)
    } else {
      fn(false)
    }
  })

  socket.on('finish', (gameId) => {
    const game = games[gameId]
    const player = players[socket.id]
    if (!game || !player) {
      return
    }
    mutations.FINISH(game)
    mutations.RESTART(game)
    io.emit('log', {
      message: `${player.name} finished game ${game.name}`,
      game: game.identifier
    })
    io.emit('game', game)
  })

  socket.on('kickPlayer', (gameId, playerId) => {
    const game = games[gameId]
    const player = players[socket.id]
    const target = getPlayerById(playerId)
    io.emit('log', {
      message: `${player.name} kicked ${target.name} from '${game.name}'`,
      player: player.identifier,
      game: game.identifier
    })
    io.emit('game', game)
    mutations.KICK(game, target)
  })

  socket.on('action', (event) => {
    const gameId = event.gameId
    const game = games[gameId]
    const player = players[socket.id]

    if (game === undefined || player === undefined || game.players.indexOf(player) === -1) {
      console.log(`Invalid action game (${game}), player (${player})`)
      return
    }

    console.log(`Attempting ${event.action} for ${game.name} on request of ${player.name}`)

    if (event.action === 'RESTART') {
      mutations.RESTART(game)
      io.emit('log', {
        message: `${player.name} restarted the game`,
        player: player.identifier,
        game: game.identifier
      })
    } else if(event.action === 'RESTACK') {
      mutations.RESTACK(game)
      io.emit('log', {
        message: `${player.name} restacked pile'`,
        player: player.identifier,
        game: game.identifier
      })
    } else if (event.action === 'DRAW') {
      mutations.DRAW(game, player)
      io.emit('log', {
        message: `${player.name} drew a card`,
        player: player.identifier,
        game: game.identifier
      })
    } else if (event.action === 'DRAW_FROM_STACK') {
      mutations.DRAW_FROM_STACK(game, player)
      io.emit('log', {
        message: `${player.name} pulled card from stack`,
        player: player.identifier,
        game: game.identifier
      })
    } else if (event.action === 'PLAY') {
      const matches = player.cards.filter(c => c.identifier === event.card)
      if (matches) {
        mutations.PLAY(game, player, matches[0])
        io.emit('log', {
          message: `${player.name} played ` + cardString(matches[0]),
          player: player.identifier,
          game: game.identifier
        })
      }
    } else if (event.action === 'SWAP') {
      const target = getPlayerById(event.target)
      if (player && target) {
        mutations.SWAP(player, target)
        io.emit('log', {
          message: `${player.name} swapped cards with ${target.name}`,
          player: player.identifier,
          game: game.identifier
        })
      }
    } else if (event.action === 'ROTATE') {
      mutations.ROTATE(game, event.direction)
      io.emit('log', {
        message: `${player.name} rotated cards in ${event.direction} direction`,
        player: player.identifier,
        game: game.identifier
      })
    }
    io.emit('game', game)
  })

})

http.listen(port, () => {
  console.log('version: 0.0.4')
  console.log('listening on port: ' + port)
});
