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
    <v-layout wrap class="row" v-bind:class="{ active: eventDetails.active }">
      <v-flex md6 sm6 lg6 py-0>
        <div class="description title">
          {{ eventDetails.scheduledEvent.title }}
        </div>
        <div class="times caption">
          {{ eventDetails.startDateTime | moment("h:mma") }} - {{ eventDetails.endDateTime | moment("h:mma") }}
        </div>
      </v-flex>
      <v-flex py-0>
            <v-btn color="primary" @click="selfCheckinScheduledEvent(eventDetails.scheduledEvent, eventDetails.time)">
              Self Check in</v-btn>

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
    selfCheckinScheduledEvent: function (scheduledEvent) {
      const event = {
        scheduledEventId: scheduledEvent.id,
        gymId: scheduledEvent.gymId,
        title: scheduledEvent.title,
        description: scheduledEvent.description,
        timezone: scheduledEvent.timezone,
        startDateTime: this.eventDetails.startDateTime.toISOString(),
        endDateTime: this.eventDetails.endDateTime.toISOString()
      }
//      console.log('with event', event, 'startdatetime', this.eventDetails.startDateTime.inspect())
      this.$store.dispatch('events/create', event)
        .then((result) => {
          console.log('Got result:', result)
          let route = this.$router.resolve({ name: 'gym-event-self-checkin', params: { gymId: scheduledEvent.gymId, eventId: result.id } })
          window.open(route.href, '_blank')
        })
    },
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

  .row.active {
    box-shadow: 0 .05rem .25rem .15rem #4caf50;
  }

  .row {
    border-radius: .333rem;
    margin: .5rem auto 1rem auto;
    background-color: white;
    box-shadow: 0 .05rem .25rem rgba(0,0,0,.25);
    padding: 0.5rem;
  }
</style>
