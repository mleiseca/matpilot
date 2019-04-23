<template>

  <div>
    <h1>Edit scheduled event</h1>
    <mp-scheduled-event-form
      v-on:scheduled-event-save="saveScheduledEventAndDisplay"
      v-bind:scheduled-event="scheduledEvent"></mp-scheduled-event-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import ScheduledEventForm from '@/components/ScheduledEventForm.vue'

export default {
  name: 'GymScheduledEventsView',
  props: ['gymId', 'scheduledEventId'],
  data () {
    return {
      gym: {},
      scheduledEvent: {}
    }
  },
  components: {
    'mp-scheduled-event-form': ScheduledEventForm
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
