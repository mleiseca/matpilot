<template>

  <v-container fill-height fluid grid-list-xl pa-2>
    <v-layout wrap class="row" v-bind:class="{ active: eventDetails.active, past:eventDetails.past }">
      <v-flex xs8 md10 py-0>
        <div class="event-title">
          <span class="">{{ eventDetails.scheduledEvent.title }}</span>
          <span class="event-description" v-if="eventDetails.scheduledEvent.description"> - {{ eventDetails.scheduledEvent.description }}</span>
        </div>
        <div class="times">
          {{ eventDetails.startDateTime | moment("h:mma") }} - {{ eventDetails.endDateTime | moment("h:mma") }}
        </div>
      </v-flex>
      <v-flex xs4 md2 py-0 class="checkinButtonHolder">
        <!-- TODO: need to show something else if the person has already registered -->
        <v-btn outline color="primary" class="checkinButton" @click="registerForEvent(eventDetails.scheduledEvent, eventDetails.time)">
          Book</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import eventCreation from '../../mixins/eventCreation'
export default {
  name: 'UserGymEventRegistrationRow',
  props: {
    //  {startDateTime (Moment): startDateTime
    //    endDateTime (Moment): endDateTime,
    //    scheduledEvent: se,
    //    id: 'se-' + se.id + '-' + startDateTime}
    eventDetails: Object
  },

  mixins: [eventCreation],
  methods: {
    registerForEvent: function (scheduledEvent) {
      // TODO: need to choose a person to register

      this.createEvent(scheduledEvent, this.eventDetails)
        .then((result) => {
          console.log('Got result:', result)

          // TODO: ok...need to actually add a registration
          //            this.$router.push({ name: 'gym-event-checkin', params: { gymId: scheduledEvent.gymId, eventId: result.id } })
        })
    }
  }
}
</script>

<style scoped>

  @media (max-width: 600px) {
    .checkinButtonHolder {
      padding-left:0 !important;
      padding-right:0 !important;
    }
    .checkinButton {
      padding-left:.8rem !important;
      padding-right:.8rem !important;
    }
  }

  .event-description {
    color: rgba(0,0,0,0.65);
  }

</style>
