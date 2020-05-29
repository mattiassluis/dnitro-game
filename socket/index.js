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
    console.log(results[0])
    return results[0]
  }
  return null
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
    socket.broadcast.emit('log', player.name + ' registered'); // Message to everyone but socket
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
    const gameList = Object.entries(games).map(([_, g]) => ({
      name: g.name, identifier: g.identifier, players: g.players.length
    }))
    console.log(gameList)
    fn(gameList)
  })
  socket.on('listPlayers', (fn) => {
    fn(Object.entries(players).map(([_, p]) => ({
      name: p.name, identifier: p.identifier
    })))
  })
  socket.on('createGame', (name) => {
    const game = gameCreate(name)
    const player = players[socket.id]
    console.log(players)
    console.log(player)
    console.log(socket.id)
    games[game.identifier] = game
    socket.emit('gameCreated', { identifier: game.identifier })
    mutations.JOIN(game, player)
    console.log('game created:' + name);
    console.log(game.players)
    io.emit('game', game)
  });
  socket.on('join', (gameId, fn) => {
    const game = games[gameId]
    const player = players[socket.id]

    if (game) {
      mutations.JOIN(game, player)
      io.emit('log', 'Player ' + player.name + ' joined game ' + game.name);
      io.emit('game', game)
      fn(true)
    } else {
      fn(false)
    }
  })
  socket.on('kickPlayer', (gameId, playerId) => {
    const game = games[gameId]
    const player = players[socket.id]
    const target = getPlayerById(playerId)
    io.emit('log', 'Player ' + player.name + ' kicked ' + target.name);
    mutations.KICK(game, target)
  })
  socket.on('action', (event) => {
    const gameId = event.gameId
    const game = games[gameId]

    if (game === undefined) {
      return
    }

    const player = players[socket.id]

    if (event.action === 'RESTART') {
      mutations.RESTART(game)
      io.emit('log', 'Player ' + player.name + ' restarted game ' + game.name);
    } else if(event.action === 'RESTACK') {
      mutations.RESTACK(game)
      io.emit('log', 'Player ' + player.name + ' restacked the pile for ' + game.name);
    } else if (event.action === 'DRAW') {
      mutations.DRAW(game, player)
      io.emit('log', 'user drew card');
    } else if (event.action === 'DRAW_FROM_STACK') {
      mutations.DRAW_FROM_STACK(game, player)
      io.emit('log', 'user pulled card from stack');
    } else if (event.action === 'PLAY') {
      mutations.PLAY(game, player, event.card)
      io.emit('log', 'user played card')
    } else if (event.action === 'SWAP') {
      const target = getPlayerById(event.target)
      if (player && target) {
        mutations.SWAP(player, target)
        io.emit('log', player.name + ' swapped cards with ' + target.name)
      }
    } else if (event.action === 'ROTATE') {
      mutations.ROTATE(game, event.direction)
      io.emit('log', player.name + ' rotated cards in ' + event.direction)
    }
    io.emit('game', game)
  });
});

http.listen(port, () => {
  console.log('version: 0.0.2');
  console.log('listening on port: ' + port);
});
