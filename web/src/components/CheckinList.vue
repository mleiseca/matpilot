<template>
    <material-card>
      <div slot="header">
        <div class="title font-weight-light mb-2">Upcoming events</div>
      </div>

        <div v-for="event in events" v-bind:key="event.date">
          <v-flex xs12>{{ event.date }} </v-flex>
          <v-flex xs12 v-for="e in event.events" v-bind:key="e.id"
                  class="event">
            <checkin-event v-bind:event-details="e" />
          </v-flex>
        </div>
    </material-card>

</template>

<script>

import scheduledEventsDisplay from '../mixins/scheduledEventsDisplay'

export default {
  name: 'CheckinList',
  mixins: [scheduledEventsDisplay],
  data () {
    return {
      includePastEvents: true
    }
  }
}
</script>

<style>
  @media (max-width: 600px) {
    .event {
      padding-left:0 !important;
      padding-right:0 !important;
    }
  }
</style>
