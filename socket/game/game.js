const createDeck = require('./deck')
const uuidv4 = require('uuid').v4;

const gameCreate = (name) => {
  return {
    name: name,
    identifier: uuidv4(),
    drawpile:  createDeck(),
    stack: [],
    players: []
  }
}

module.exports = gameCreate
