<template>

  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex xs12 md8>
        <material-card
          title="Create a waiver"
          text="">
          <waiver-form v-on:gym-waiver-save="saveGymWaiverAndDisplay">
          </waiver-form>

        </material-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'GymWaiversAdd',
  props: ['gymId'],
  data () {
    return {}
  },
  computed: {
  },
  methods: {
    saveGymWaiverAndDisplay: function (event) {
      event.gymId = this.gymId
      console.log('Saving waiver and redisplaying:', event)
      this.$store.dispatch('gym-waivers/create', event)
        .then((result) => {
          console.log('Got result:', result)
          this.$router.push({ name: 'gym-waivers', params: { id: this.gymId } })
        })
    }
  }
}
</script>

<style scoped>

</style>
