const deck = []
const colors = ['GREEN', 'RED', 'BLUE', 'YELLOW']

colors.forEach(color => {
  for (let x = 0; x < 2; x++) {
    for (let value = 0; value < 10; value++) {
      deck.push({ color: color, value: value, category: 'REGULAR' })
    }
    deck.push({ color: color, value: 20, category: 'REVERSE' })
    deck.push({ color: color, value: 20, category: 'SKIP' })
    deck.push({ color: color, value: 20, category: 'PLUS_TWO' })
  }
})
for (let x = 0; x < 4; x++) {
  deck.push({ color: 'BLACK', value: 40, category: 'BLANK' })
  deck.push({ color: 'BLACK', value: 50, category: 'CHANGE_COLOR' })
  deck.push({ color: 'BLACK', value: 50, category: 'DRAW_FOUR' })
}
deck.push({ color: 'BLACK', value: 40, category: 'SWITCH_HAND' })

const shuffleArray = arr => arr
  .map(a => [Math.random(), a])
  .sort((a, b) => a[0] - b[0])
  .map(a => a[1])

const createDeck = () => {
  return shuffleArray([...deck])
}

export default createDeck
