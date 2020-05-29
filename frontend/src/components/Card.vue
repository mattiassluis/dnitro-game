<template>
  <b-card style="width: 150px; min-width: 150px; max-width: 150px; height: 220px;" body-class="align-middle" @click="cardClicked" :class="'shadow-sm ' + cardClass">
    <b-card-text v-if="!card" class="pt-4"></b-card-text>
    <b-card-text v-else-if="covered" class="pt-4">
      <small>UNO</small>
    </b-card-text>
    <b-card-text v-else class="pt-4">
      <span v-if="card.color === 'BLACK'" class="black-card">
        <div class="bg-white rounded-circle" style="width: 85px; height: 90px;">
          <span v-if="card.category === 'DRAW_FOUR'">+4</span>
          <span v-if="card.category === 'CHANGE_COLOR'" style="color: black">
            <font-awesome-icon :icon="['fab', 'delicious']"></font-awesome-icon>
          </span>
          <span v-if="card.category === 'BLANK'"></span>
          <span v-if="card.category === 'SWITCH_HAND'" style="color: black">
            <font-awesome-icon :icon="['fa', 'hands-helping']"></font-awesome-icon>
          </span>
        </div>
      </span>
      <span v-else class="big-value">
        <span v-if="card.category === 'REGULAR'">{{ card.value }}</span>
      <span v-if="card.category === 'REVERSE'">
        <font-awesome-icon :icon="['fa', 'sync']"></font-awesome-icon>
      </span>
      <span v-if="card.category === 'SKIP'">
        <font-awesome-icon :icon="['fa', 'ban']"></font-awesome-icon>
      </span>
      <span v-if="card.category === 'PLUS_TWO'">+2</span>
      </span>
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      required: true
    },
    covered: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cardClass () {
      if (!this.card) {
        return 'bg-grey'
      }
      if (this.covered) {
        return 'bg-black'
      }
      return `bg-${this.card.color.toLowerCase()}`
    }
  },
  methods: {
    cardClicked () {
      this.$emit('card-clicked', this.card)
    }
  }
}
</script>

<style scoped>
  .card {
    border-radius: 10px;
    border: 1px solid rgb(230, 230, 230);
    background-color: rgb(250, 250, 250);
    padding: 10px;
  }

  .card-body {
    text-align: center;
    border-radius: 7px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 60px;
    color: white;
    -webkit-text-stroke: 2px black;
    font-weight: bold;
    text-shadow: -3px 3px 0 #000;
  }

  .card-body small {
    font-size: 30px;
  }

  .card.bg-black .card-body {
    background-color: black;
  }

  .card.bg-grey .card-body {
    background-color: grey;
  }

  .card.bg-red .card-body {
    background-color: red;
  }

  .card.bg-yellow .card-body {
    background-color: yellow;
  }

  .card.bg-blue .card-body {
    background-color: blue;
  }

  .card.bg-green .card-body {
    background-color: green;
  }
</style>
