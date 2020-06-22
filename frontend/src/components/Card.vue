<template>
  <div>
    <b-card no-body body-class="align-middle" v-b-tooltip.hover.bottom="cardName" @click.stop="cardClicked" :class="'unocard' + (small ? ' small': '') + (center ? ' mx-auto' : ' mx-1')">
      <b-card-body :class="cardClasses"></b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      default: null
    },
    covered: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    center: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cardClasses () {
      if (!this.card) {
        return 'color-black color-blue'
      }
      if (this.covered) {
        return 'color-black color-green'
      }

      const classes = [
        'color-' + this.card.color.toLowerCase()
      ]
      if (this.card.category === 'REGULAR') {
        classes.push('value-' + this.card.value)
      } else {
        classes.push('type-' + this.card.category.toLowerCase().replace('_', '-'))
      }
      return classes.join(' ')
    },
    cardName () {
      if (this.covered) {
        return 'You would like to know'
      }
      if (!this.card) {
        return 'Unknown card'
      }
      if (this.card.category === 'REGULAR') {
        return `${this.capitalize(this.card.color)} ${this.card.value}`
      } else {
        return `${this.capitalize(this.card.color)} ${this.capitalize(this.card.category).replace('_', ' ')}`
      }
    }
  },
  methods: {
    capitalize (s) {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
    },
    cardClicked () {
      this.$emit('card-clicked', this.card)
    }
  }
}
</script>
