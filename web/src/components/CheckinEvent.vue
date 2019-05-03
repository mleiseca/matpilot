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
    <v-container fill-height fluid grid-list-xl>
      <v-layout wrap class="row">
        <v-flex md8 sm8 lg8>
          <div class="description title">
            {{ eventDetails.scheduledEvent.title }}
          </div>
          <!--TODO: ideally, the date would be displayed only once, so we could group events by date-->
          <div class="times caption">
            {{ eventDetails.startDateTime | moment("dddd, MMMM Do") }} {{ eventDetails.scheduledEvent.startTime }} - {{ eventDetails.scheduledEvent.endTime}}
          </div>
        </v-flex>
        <v-flex>
          <v-btn color="primary" @click="checkinScheduledEvent(eventDetails.scheduledEvent, eventDetails.time)">
            Check in</v-btn>
        </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'CheckinEvent',
  props: {
    //  {startDateTime (Moment): startDateTime
    //    endDateTime (Moment): endDateTime,
    //    scheduledEvent: se,
    //    id: 'se-' + se.id + '-' + startDateTime}
    eventDetails: Object
  },
  data () {
    return {}
  },
  methods: {
    checkinScheduledEvent: function (scheduledEvent) {
      const event = {
        scheduledEventId: scheduledEvent.id,
        gymId: scheduledEvent.gymId,
        title: scheduledEvent.title,
        description: scheduledEvent.description,
        timezone: scheduledEvent.timezone,
        startDateTime: this.eventDetails.startDateTime.toISOString(),
        endDateTime: this.eventDetails.endDateTime.toISOString()
      }
      console.log('with event', event, 'startdatetime', this.eventDetails.startDateTime.inspect())
      this.$store.dispatch('events/create', event)
        .then((result) => {
          console.log('Got result:', result)
          this.$router.push({ name: 'gym-event-checkin', params: { gymId: scheduledEvent.gymId, eventId: result.id } })
        })
    }
  }
}
</script>

<style scoped>

  .description {
    font-weight: 600;
  }

  .row {
    border-radius: .333rem;
    margin: .5rem auto 1rem auto;
    background-color: white;
    box-shadow: 0 .05rem .25rem rgba(0,0,0,.25);
    padding: 0.5rem;
  }
</style>
