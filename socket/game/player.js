const uuidv4 = require('uuid').v4;

const playerCreate = (socket, name) => {
  return {
    socket: socket,
    identifier: uuidv4(),
    name: name,
    cards: [],
    number_of_cards: 0,
    score: 0
  }
}

module.exports = playerCreate
