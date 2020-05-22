<template>
  <!--createdAt: (...)-->
  <!--createdBy: (...)-->
  <!--description: (...)-->
  <!--endDate: (...)-->
  <!--endTime: (...)-->
  <!--gymId: (...)-->
  <!--id: (...)-->
  <!--rrules: (...)-->
  <!--startDate: (...)-->
  <!--startTime: (...)-->
  <!--timezone: (...)-->
  <!--title: (...)-->
  <!--updatedAt: (...)-->
  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout wrap class="row" v-bind:class="{ active: eventDetails.active, past:eventDetails.past }">
      <v-flex xs12 md6 sm6 lg6 py-0>
        <div class="description title">
          {{ eventDetails.scheduledEvent.title }}
        </div>
        <div class="times caption">
          {{ eventDetails.startDateTime | moment("h:mma") }} - {{ eventDetails.endDateTime | moment("h:mma") }}
        </div>
      </v-flex>
      <v-flex xs12 md6 sm6 lg6 py-0 class="checkinButtonHolder">
            <v-btn color="primary" class="checkinButton" @click="checkinScheduledEvent(eventDetails.scheduledEvent, eventDetails.time)">
              Check in</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import eventCreation from '../mixins/eventCreation'
export default {
  name: 'CheckinEvent',
  props: {
    //  {startDateTime (Moment): startDateTime
    //    endDateTime (Moment): endDateTime,
    //    scheduledEvent: se,
    //    id: 'se-' + se.id + '-' + startDateTime}
    eventDetails: Object
  },
  mixins: [eventCreation],
  methods: {
    checkinScheduledEvent: function (scheduledEvent) {
      this.createEvent(scheduledEvent, this.eventDetails)
        .then((result) => {
          console.log('Got result:', result)
          this.$router.push({ name: 'gym-event-checkin', params: { gymId: scheduledEvent.gymId, eventId: result.id } })
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

  .description {
    font-weight: 600;
  }

  .row.active {
    box-shadow: 0 .05rem .25rem .15rem #4caf50;
  }

  .row.past {
    background-color: lightgrey;
  }

  .row {
    border-radius: .333rem;
    margin: .5rem auto 1rem auto;
    background-color: white;
    box-shadow: 0 .05rem .25rem rgba(0,0,0,.25);
    padding: 0.5rem;
  }
</style>
