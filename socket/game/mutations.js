const createDeck = require('./deck');

const mutations = {
  JOIN (game, player) {
    console.log(game.players)
    console.log(player)
    if (game.players.indexOf(player) >= 0) {
      // Player already joined
      console.log('Player found')
      return
    }
    for (let i = 0; i < 7; i++) {
      player.number_of_cards++
      player.cards = [...player.cards].concat([game.drawpile.pop()])
    }
    game.stack = [game.drawpile.pop()]
    game.drawpile = [...game.drawpile]
    game.players = [...game.players].concat([player])
  },
  KICK (game, player) {
    // Drop the cards to the bottom of the pile
    game.stack = [].concat(player.cards, game.stack)
    game.players = game.players.filter(p => p.identifier !== player.identifier)
  },
  RESTACK (game) {
    let stack = game.stack.pop()
    game.drawpile = [].concat([game.drawpile], game.stack)
    game.stack = [stack]
  },
  RESTART (game) {
    game.drawpile = createDeck()
    game.stack = []
    game.players.forEach(player => {
      player.number_of_cards = 0
      player.cards = []
    })

    for (let i = 0; i < 7; i++) {
      game.players.forEach(player => {
        player.number_of_cards++
        player.cards = [...player.cards].concat([game.drawpile.pop()])
      })
    }
    game.stack = [game.drawpile.pop()]
    game.drawpile = [...game.drawpile]
  },
  DRAW (game, player) {
    if (game.drawpile.length) {
      player.number_of_cards++
      player.cards = [...player.cards].concat([game.drawpile.pop()])
      game.drawpile = [...game.drawpile]
    }
  },
  DRAW_FROM_STACK (game, player) {
    if (game.stack.length) {
      player.number_of_cards++
      player.cards = [...player.cards].concat([game.stack.pop()])
      game.stack = [...game.stack]
    }
  },
  PLAY (game, player, cardId) {
    const matches = player.cards.filter(c => c.identifier === cardId)
    if (matches.length) {
      const card = matches[0]
      player.number_of_cards--
      player.cards = player.cards.filter(c => c !== card)
      game.stack = [...game.stack].concat([card])
    }
  },
  SWAP (from, to) {
    const cards = from.cards
    from.cards = to.cards
    to.cards = cards
  },
  ROTATE (game, direction) {
    const players = [...game.players]
    if (direction === 'left') {
      players.reverse()
    }
    let prev = players[players.length-1]
    let next = players[players.length-1].cards
    players.forEach(p => {
      console.log(p.name + ' gets cards from ' + prev.name)
      const cards = p.cards
      p.cards = next
      p.number_of_cards = p.cards.length
      next = cards
      prev = p
    })
  }
}
module.exports = mutations
