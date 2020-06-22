<template>
  <div role="tablist">
    <b-card no-body bg-variant="light" border-variant="light" class="mb-1">
      <b-card-header header-tag="header" role="tab">
        <b-button block v-b-toggle.docs-controls variant="outline-dark">Controls</b-button>
      </b-card-header>
      <b-collapse id="docs-controls" visible accordion="docs" role="tabpanel">
        <b-card-body>
          <p>
            <strong>Everyone is admin.</strong>
          </p>
          <ul>
            <li>There are no enforced rules.</li>
            <li>You can swap cards with anyone without their consent, you can restart or finish the game at any time.</li>
            <li>You can pick cards from both the draw pile as the play stack (but you can only play cards on the stack).</li>
            <li>The game does not track who's turn it is.</li>
            <li>New players can join and will receive 7 cards.</li>
          </ul>
          <p><strong>Controls</strong></p>
          <ul>
            <li>
              <b-button disabled variant="info" class="mb-1 mr-1">
                <font-awesome-icon icon="angle-left" class="mr-2"></font-awesome-icon>
                <font-awesome-icon icon="redo"></font-awesome-icon>
              </b-button>
              Rotate the cards in clockwise direction
            </li>
            <li>
              <b-button disabled variant="info" class="mb-1 mr-1">
                <font-awesome-icon icon="undo"></font-awesome-icon>
                <font-awesome-icon icon="angle-right" class="ml-2"></font-awesome-icon>
              </b-button>
              Rotate the cards in counter-clockwise direction
            </li>
            <li>
              <b-button disabled variant="dark" class="mb-1 mr-1">
                <font-awesome-icon icon="flag-checkered"></font-awesome-icon>
              </b-button>
              Finishes the game.
              The player with 0 cards left will receive the accumulated points of the other players and the game will restart.
            </li>
            <li>
              <b-button disabled variant="danger" class="mb-1 mr-1">
                <font-awesome-icon icon="play"></font-awesome-icon>
              </b-button>
              Restart the game.
              Everyone will receive new cards and no points are counted.
            </li>
          </ul>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="mb-1" bg-variant="light" border-variant="light" >
      <b-card-header header-tag="header" role="tab">
        <b-button block v-b-toggle.docs-cards variant="outline-dark">Special cards</b-button>
      </b-card-header>
      <b-collapse id="docs-cards" visible accordion="docs" role="tabpanel">
        <b-card-body>
          <b-card-group deck class="justify-content-md-center">
            <b-card v-for="(card, i) in specialCards" :key="i + '-help'" class="my-3" :title="card.title" :footer="card.description">
              <Card class="mt-3" center :card="card.card"/>
            </b-card>
          </b-card-group>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="mb-1" bg-variant="light" border-variant="light">
      <b-card-header header-tag="header" role="tab">
        <b-button block v-b-toggle.docs-house-rules variant="outline-dark">D-Nitro House Rules</b-button>
      </b-card-header>
      <b-collapse id="docs-house-rules" visible accordion="docs" role="tabpanel">
        <b-card-body>
          <ul>
            <li>If you say the word One, or UNO (in any language), draw 2 cards</li>
            <li>+4 can be stacked with +2 (and vice-versa) if color matches</li>
            <li>If you lose an UNO Challenge (called out for not saying UNO when having only 1 card) - draw 5 cards</li>
            <li>Rotation of cards - When the same card color and face value (only colored cards) is played on the stack by two different players, all hands are swapped in the direction of the game</li>
            <li>Rotation of cards - When +2 cards result in rotation of cards the cards must be picked up before the hands are swapped</li>
            <li>Black blank card action - play again (any card)</li>
            <li>Black Swap hands - in your turn you can swap hands with another player of your choice</li>
            <li>Black Swap hands - choose color before swapping hands or the other player can choose the color</li>
            <li>Playing a reverse of the matching color in a +2 or +4 will reverse the action of drawing the cards</li>
            <li>Player can play 2 identical cards at the same time (same face value and color)</li>
          </ul>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body bg-variant="light" border-variant="light" class="mb-1">
      <b-card-header header-tag="header" role="tab">
        <b-button block v-b-toggle.docs-rules variant="outline-dark">Applicable official rules</b-button>
      </b-card-header>
      <b-collapse id="docs-rules" visible accordion="docs" role="tabpanel">
        <b-card-body>
          <ul>
            <li>Official UNO rule: You can only play a +4 if you don't have any other cards of the color on the table, if the player receiving the +4 challenges you, you have to draw 4 cards, if the challenge wrong, the player challenging draws 2 additional cards (total of 6)</li>
            <li>Official UNO rule: Failed UNO challenge (draw 2)</li>
          </ul>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import Card from './Card'

export default {
  components: {
    Card
  },
  data: () => ({
    specialCards: [
      { card: { color: 'BLACK', category: 'BLANK' }, title: 'Blank card', description: 'Used for house rules (see D-Nitro house rules)' },
      { card: { color: 'BLACK', category: 'SWITCH_HAND' }, title: 'Switch hand', description: 'Play, define color and switch hands with a player of your choice' },
      { card: { color: 'BLACK', category: 'CHANGE_COLOR' }, title: 'Change color', description: 'Change to any color' },
      { card: { color: 'RED', category: 'REVERSE' }, title: 'Colored reverse', description: 'Change the direction of the game (or counter a +2/+4)' }
    ]
  })
}
</script>
