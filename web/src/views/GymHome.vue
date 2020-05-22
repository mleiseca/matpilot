<template>

  <v-container fluid grid-list-xl fill-height pt-0>
    <v-layout wrap>
      <v-flex xs12 py-0>
        <checkin-list v-bind:scheduled-events="gymScheduledEvents"></checkin-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import fetchGymScheduledEvents from '../mixins/fetchGymScheduledEvents'

export default {
  name: 'GymHome',
  props: ['gymId'],
  mixins: [fetchGymScheduledEvents]

}
</script>

<style scoped>

</style>
