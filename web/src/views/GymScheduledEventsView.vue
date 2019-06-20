<template>

  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout  justify-center wrap>
      <v-flex xs12 md8>
        <material-card
          title="Edit scheduled event"
          text="">
          <scheduled-event-form
            v-on:scheduled-event-save="saveScheduledEventAndDisplay"
            v-bind:scheduled-event="scheduledEvent"></scheduled-event-form>
          <!--<member-form-->
            <!--v-on:member-save="saveMemberAndDisplay"-->
            <!--v-bind:member="member"></member-form>-->

        </material-card>
      </v-flex>

    </v-layout>
  </v-container>

</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'GymScheduledEventsView',
  props: ['gymId', 'scheduledEventId'],
  data () {
    return {
      gym: {},
      scheduledEvent: {}
    }
  },
  computed: {
  },
  mounted: async function () {
    console.log('scheduledEventId for id: ', this.gymId, this.scheduledEventId)
    if (!this.gymId || !this.scheduledEventId) {
      return
    }

    await this.getGym(this.gymId).then(result => {
      this.gym = result
    })

    await this.getScheduledEvent(this.scheduledEventId).then(result => {
      console.log('loaded scheduled event ')
      this.scheduledEvent = result
    })
  },
  methods: {
    ...mapActions('gyms', {
      getGym: 'get'
    }),
    ...mapActions('scheduled-events', {
      getScheduledEvent: 'get'
    }),
    saveScheduledEventAndDisplay: function (event) {
      console.log('Saving scheduled event and redisplaying:', event)
      event.save()
        .then((result) => {
          console.log('Got result:', result)
          this.$router.push({ name: 'gym-scheduled-events', params: { id: this.gymId } })
        })
    },
    enterEditMode: function (event) {
      console.log('Entering edit mode')
      //      event.gymId = this.gymId
      //      console.log('Saving member and redisplaying:', event)
      //      this.$store.dispatch('members/create', event)
      //        .then((result) => {
      //          console.log('Got result:', result)
      //          this.$router.push({ name: 'gym-members', params: { id: this.gymId } })
      //        })
    }
  }
}
</script>

<style scoped>

</style>
