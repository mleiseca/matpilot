<!--gymWaiverId-->
<template>
  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex xs12 md8>
        <material-card
          title="Edit waiver"
          text="">
          <waiver-form
            v-on:gym-waiver-save="saveGymWaiverAndDisplay"
            v-bind:waiver="gymWaiver"
            v-bind:gym="gym"></waiver-form>

        </material-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { EventBus } from '../event-bus'

export default {
  name: 'GymWaiversView',
  props: ['gymId', 'gymWaiverId'],
  data () {
    return {
      gym: {},
      gymWaiver: {}
    }
  },
  computed: {
  },
  methods: {
    ...mapActions('gyms', {
      getGym: 'get'
    }),
    ...mapActions('gym-waivers', {
      getGymWaiver: 'get'
    }),

    saveGymWaiverAndDisplay: function (event) {
      event.gymId = this.gymId
      console.log('Saving waiver and redisplaying:', event)
      event.save()
        .then((result) => {
          console.log('Got result:', result)
          EventBus.$emit('loading', { done: true })
          EventBus.$emit('user-message', { message: 'Saved' })
          this.$router.push({ name: 'gym-waivers', params: { id: this.gymId } })
        })
        .catch((e) => {
          console.log('** Login catch: ', e)
          EventBus.$emit('loading', { done: true })
          EventBus.$emit('user-message', { message: `Error saving member: ${e.message}`, type: 'error' })
        })
    }
  },
  mounted: async function () {
    console.log('bmounted...')
    if (!this.gymId || !this.gymWaiverId) {
      console.log('cant load waiver', this.gymId, this.gymWaiverId)
      return
    }

    await this.getGym(this.gymId).then(result => {
      this.gym = result
    })

    await this.getGymWaiver(this.gymWaiverId).then(result => {
      console.log('waiver', result)
      this.gymWaiver = result
    })
  }

}
</script>

<style scoped>

</style>
