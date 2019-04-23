<template>

  <div>
    <h1>Schedule an event</h1>
    <mp-scheduled-event-form
      v-on:scheduled-event-save="saveScheduledEventAndDisplay"></mp-scheduled-event-form>
  </div>
</template>

<script>
import ScheduledEventForm from '@/components/ScheduledEventForm.vue'

export default {
  name: 'GymScheduledEventsAdd',
  props: ['gymId'],
  data () {
    return {}
  },
  components: {
    'mp-scheduled-event-form': ScheduledEventForm
  },
  computed: {
  },
  methods: {
    saveScheduledEventAndDisplay: function (event) {
      event.gymId = this.gymId
      console.log('Saving scheduled event and redisplaying:', event)
      this.$store.dispatch('scheduled-events/create', event)
        .then((result) => {
          console.log('Got result:', result)
          this.$router.push({ name: 'gym-members', params: { id: this.gymId } })
        })
    }
  }
}
</script>

<style scoped>

</style>
