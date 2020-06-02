<template>
  <div>
    <b-card no-body body-class="align-middle" @click="cardClicked" :class="'mx-1 unocard' + (small ? ' small': '')">
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
    }
  },
  methods: {
    cardClicked () {
      this.$emit('card-clicked', this.card)
    }
  }
}
</script>
