<template>
  <b-card :title="player.name" class="mx-3" style="max-width: 250px">
    <b-card-text>
      Cards left: {{ player.number_of_cards }}
    </b-card-text>
    <b-btn v-if="swap" @click="swap(player)">Swap cards</b-btn>
  </b-card>
</template>

<script>
export default {
  props: {
    player: {
      type: Object,
      required: true
    },
    swap: {
      type: Function,
      required: false
    }
  }
}
</script>
