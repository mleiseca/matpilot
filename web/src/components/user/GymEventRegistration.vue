<template>
  <div>
    <div v-for="event in events" v-bind:key="event.date">
      <v-flex xs12 class="date-header">{{ event.date }} </v-flex>
      <v-flex xs12 v-for="e in event.events" v-bind:key="e.id"
              class="event-detail">
        <user-gym-event-registration-row v-bind:event-details="e" />
      </v-flex>
    </div>
  </div>
</template>

<script>
import scheduledEventsDisplay from '../../mixins/scheduledEventsDisplay'
import UserGymEventRegistrationRow from './GymEventRegistrationRow.vue'

export default {
  components: { UserGymEventRegistrationRow },
  name: 'UserGymEventRegistration',
  mixins: [scheduledEventsDisplay],
  data () {
    return {
      includePastEvents: false
    }
  }
}
</script>

<style>
  @media (max-width: 600px) {
    .event-detail {
      padding-left:0 !important;
      padding-right:0 !important;
    }
  }
  .date-header{
    padding: 10px 32px;
    background-color: rgba(0,0,0,0.03);
    border-color: rgba(0,0,0,0.1);
    border-top-style: none;
    border-bottom-style: solid;
    border-width: 1px;
  }
  .event-detail {
    padding: 10px 32px;
    border-color: rgba(0,0,0,0.1);
    border-top-style: none;
    border-bottom-style: solid;
    border-width: 1px;
  }
</style>
