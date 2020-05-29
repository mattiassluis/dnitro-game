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

const cardString = (card) => {
  return `[${card.color}][${card.category}](${card.value})`
}


io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('register', (username, fn) => {
    const player = playerCreate(socket.id, username)
    players[socket.id] = player
    fn(player.identifier); // Message to socket only
    socket.broadcast.emit('log', { message: `${player.name} registered` });
    console.log('player registered as:' + username);
  });
  socket.on('reconnectPlayer', (identifier, fn) => {
    console.log('reconnect attempt for:' + identifier);
    const player = getPlayerById(identifier)
    if (player) {
      delete players[player.socket]
      player.socket = socket.id
      players[socket.id] = player
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
    console.log('game created:' + name);
    io.emit('game', game)
  });
  socket.on('join', (gameId, fn) => {
    const game = games[gameId]
    const player = players[socket.id]

    if (game) {
      mutations.JOIN(game, player)
      io.emit('log', {
        message: 'Player ' + player.name + ' joined game ' + game.name,
        player: player.identifier,
        game: game.identifier
      });
      io.emit('game', game)
      fn(true)
    } else {
      fn(false)
    }
  })
  socket.on('finish', (gameId) => {
    const game = games[gameId]
    if (!game) {
      return
    }
    mutations.FINISH(game)
    mutations.RESTART(game)
    io.emit('log', {
      message: `Finished game ${game.name}`,
      game: game.identifier
    })
    io.emit('game', game)
  })
  socket.on('kickPlayer', (gameId, playerId) => {
    const game = games[gameId]
    const player = players[socket.id]
    const target = getPlayerById(playerId)
    io.emit('log', {
      message: 'Player ' + player.name + ' kicked ' + target.name,
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
      console.log('Invalid action')
      return
    }

    console.log(`Attempting ${event.action} for ${game.name} on request of ${player.name}`)

    if (event.action === 'RESTART') {
      mutations.RESTART(game)
      io.emit('log', {
        message: `Player ${player.name} restarted game ${game.name}`,
        player: player.identifier,
        game: game.identifier
      })
    } else if(event.action === 'RESTACK') {
      mutations.RESTACK(game)
      io.emit('log', {
        message: `Player ${player.name} restacked pile for game ${game.name}`,
        player: player.identifier,
        game: game.identifier
      });
    } else if (event.action === 'DRAW') {
      mutations.DRAW(game, player)
      io.emit('log', {
        message: `Player ${player.name} drew a card in game ${game.name}`,
        player: player.identifier,
        game: game.identifier
      });
    } else if (event.action === 'DRAW_FROM_STACK') {
      mutations.DRAW_FROM_STACK(game, player)
      io.emit('log', {
        message: `Player ${player.name} pulled card from stack in game ${game.name}`,
        player: player.identifier,
        game: game.identifier
      });
    } else if (event.action === 'PLAY') {
      const matches = player.cards.filter(c => c.identifier === event.card)
      if (matches) {
        mutations.PLAY(game, player, matches[0])
        io.emit('log', {
          message: `Player ${player.name} played card ` + cardString(matches[0]) + ` in ${game.name}`,
          player: player.identifier,
          game: game.identifier
        });
      }
    } else if (event.action === 'SWAP') {
      const target = getPlayerById(event.target)
      if (player && target) {
        mutations.SWAP(player, target)
        io.emit('log', {
          message: `Player ${player.name} swapped cards with ${target.name}`,
          player: player.identifier,
          game: game.identifier
        })
      }
    } else if (event.action === 'ROTATE') {
      mutations.ROTATE(game, event.direction)
      io.emit('log', {
        message: `Player ${player.name} rotated cards in ${event.direction}`,
        player: player.identifier,
        game: game.identifier
      })
    }
    io.emit('game', game)
  });
});

http.listen(port, () => {
  console.log('version: 0.0.3');
  console.log('listening on port: ' + port);
});
