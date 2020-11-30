<template>
  <b-card class="mx-3 text-center" style="max-width: 250px">
    <b-card-title>
      {{ player.name }}
    </b-card-title>
    <b-card-text v-if="player.disconnected">
      <b-badge>disconnected</b-badge>
    </b-card-text>
    <b-card-text style="position: relative" class="d-none d-xl-block" v-if="!compactMode">
      <Card v-if="player.number_of_cards" covered small />
      <Card v-if="player.number_of_cards > 1" covered small style="position: absolute; left: 7px; top: 0; z-index: 1" />
      <Card v-if="player.number_of_cards > 2" covered small style="position: absolute; left: 14px; top: 0; z-index: 2" />
      <Card v-if="player.number_of_cards > 3" covered small style="position: absolute; left: 21px; top: 0; z-index: 3" />
      <Card v-if="player.number_of_cards > 4" covered small style="position: absolute; left: 28px; top: 0; z-index: 4" />
      <Card v-if="player.number_of_cards > 5" covered small style="position: absolute; left: 35px; top: 0; z-index: 5" />
      <b-badge variant="secondary" pill style="position: absolute; top: 31px; right: 0; z-index: 100">{{ player.number_of_cards }} cards</b-badge>
    </b-card-text>
    <b-card-text :class="[!compactMode ? 'd-xl-none' : '']">
      <b-badge variant="secondary" pill>{{ player.number_of_cards }} cards</b-badge>
    </b-card-text>
    <b-btn size="sm" variant="outline-secondary" v-if="swap" @click="swap(player)">
      <font-awesome-icon icon="exchange-alt"></font-awesome-icon>
      <span class="d-none d-xl-inline">Swap cards</span>
    </b-btn>
  </b-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Card from '@/components/Card'
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
  },
  computed: {
    ...mapGetters({
      compactMode: 'game/compact'
    })
  },
  components: {
    Card
  }
}
</script>
