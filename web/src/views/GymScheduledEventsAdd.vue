<template>

  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex xs12 md8>
        <material-card
          title="Schedule an Event"
          text="">
          <scheduled-event-form
            v-on:scheduled-event-save="saveScheduledEventAndDisplay"></scheduled-event-form>

        </material-card>
      </v-flex>
      <!--TODO: this might be a helpful help-text display or something-->
      <!--<v-flex-->
      <!--xs12-->
      <!--md4-->
      <!--&gt;-->
      <!--<material-card class="v-card-profile">-->
      <!--<v-avatar-->
      <!--slot="offset"-->
      <!--class="mx-auto d-block"-->
      <!--size="130"-->
      <!--&gt;-->
      <!--<img-->
      <!--src="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg"-->
      <!--&gt;-->
      <!--</v-avatar>-->
      <!--<v-card-text class="text-xs-center">-->
      <!--<h6 class="category text-gray font-weight-thin mb-3">CEO / CO-FOUNDER</h6>-->
      <!--<h4 class="card-title font-weight-light">Alec Thompson</h4>-->
      <!--<p class="card-description font-weight-light">Don't be scared of the truth because we need to restart the human foundation in truth And I love you like Kanye loves Kanye I love Rick Owens’ bed design but the back is...</p>-->
      <!--<v-btn-->
      <!--color="success"-->
      <!--round-->
      <!--class="font-weight-light"-->
      <!--&gt;Follow</v-btn>-->
      <!--</v-card-text>-->
      <!--</material-card>-->
      <!--</v-flex>-->
    </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'GymScheduledEventsAdd',
  props: ['gymId'],
  data () {
    return {}
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
          this.$router.push({ name: 'gym-scheduled-events', params: { id: this.gymId } })
        })
    }
  }
}
</script>

<style scoped>

</style>
