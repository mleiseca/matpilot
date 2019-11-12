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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'GymHome',
  props: ['gymId'],
  data () {
    return {
      gym: {}
    }
  },
  computed: {
    ...mapGetters('scheduled-events', {
      findScheduledEventsInStore: 'find'
    }),
    gymScheduledEvents () {
      return this.findScheduledEventsInStore({
        query: {
          gymId: parseInt(this.gymId, 10)
        }
      }).data
    }
  },
  methods: {
    ...mapActions('gyms', {
      getGym: 'get'
    }),
    ...mapActions('scheduled-events', {
      findScheduledEvents: 'find'
    })
  },

  mounted: async function () {
    console.log('GymHome for id: ', this.gymId)
    if (!this.gymId) {
      return
    }

    await this.getGym(this.gymId).then(result => { this.gym = result })

    this.findScheduledEvents({
      query: {
        gymId: this.gymId
      }
    })
  }
}
</script>

<style scoped>

</style>
