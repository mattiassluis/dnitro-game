const createDeck = require('./deck');

const mutations = {
  JOIN (game, player) {
    if (game.players.indexOf(player) >= 0) {
      return
    }
    for (let i = 0; i < 7; i++) {
      player.cards = [...player.cards].concat([game.drawpile.pop()])
      player.number_of_cards = player.cards.length
    }
    game.stack = [game.drawpile.pop()]
    game.drawpile = [...game.drawpile]
    game.players = [...game.players].concat([player])
  },
  KICK (game, player) {
    // Drop the cards to the bottom of the pile
    game.stack = [].concat(player.cards, game.stack)
    player.cards = []
    player.number_of_cards = player.cards.length
    game.players = game.players.filter(p => p.identifier !== player.identifier)
  },
  FINISH (game) {
    let winner = game.players.filter(p => p.cards.length === 0)
    let score = 0
    game.players.forEach(player => {
      score += player.cards.map(c => c.value).reduce((a, b) => a + b, 0)
      player.cards = []
      player.number_of_cards = player.cards.length
    })
    if (winner.length) {
      winner[0].score += score
    }
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
      player.cards = []
      player.number_of_cards = player.cards.length
    })

    for (let i = 0; i < 7; i++) {
      game.players.forEach(player => {
        player.cards = [...player.cards].concat([game.drawpile.pop()])
        player.number_of_cards = player.cards.length
      })
    }
    game.stack = [game.drawpile.pop()]
    game.drawpile = [...game.drawpile]
  },
  DRAW (game, player) {
    if (game.drawpile.length <= 1) {
      console.log('restacking')
      let lastCard = game.stack.pop()
      game.drawpile = [].concat(game.drawpile, game.stack)
      game.stack = [lastCard]
      console.log(game.drawpile)
      console.log(game.stack)
    }
    if (game.drawpile.length) {
      player.cards = [...player.cards].concat([game.drawpile.pop()])
      player.number_of_cards = player.cards.length
      game.drawpile = [...game.drawpile]
    } else {
      console.log('Drawpile empty')
    }
  },
  DRAW_FROM_STACK (game, player) {
    if (game.stack.length > 1) {
      player.cards = [...player.cards].concat([game.stack.pop()])
      player.number_of_cards = player.cards.length
      game.stack = [...game.stack]
    } else {
      console.log('Cannot draw from stack')
    }
  },
  PLAY (game, player, card) {
    player.cards = player.cards.filter(c => c !== card)
    game.stack = [...game.stack].concat([card])
    player.number_of_cards = player.cards.length
  },
  SWAP (from, to) {
    const cards = from.cards
    from.cards = to.cards
    from.number_of_cards = from.cards.length
    to.cards = cards
    to.number_of_cards = to.cards.length
  },
  ROTATE (game, direction) {
    const players = [...game.players]
    if (direction === 'right') {
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
