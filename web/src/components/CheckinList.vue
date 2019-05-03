<template>
    <material-card color="green">
      <div slot="header">
        <div class="title font-weight-light mb-2">Upcoming events</div>
      </div>

      <v-card-text>
        <v-flex xs12 v-for="event in events" v-bind:key="event.id">
          <checkin-event v-bind:event-details="event" />
        </v-flex>
      </v-card-text>
    </material-card>

</template>

<script>
import { rrulestr } from 'rrule'
import moment from 'moment-timezone'
import CheckinEvent from './CheckinEvent.vue'

export default {
  components: { CheckinEvent },
  name: 'CheckinList',
  props: {
    scheduledEvents: Array
  },
  data () {
    return {
      events: []
    }
  },
  methods: {
  },
  mounted: function () {
    this.$watch('scheduledEvents', ses => {
      const upcomingEvents = []
      for (const seIndex in ses) {
        const se = ses[seIndex]
        console.log(se)

        // TODO: this '5' should really be controlled by a toggle on the material card. maybe day/week/month?
        const newEvents = rrulestr(se.rrules).all(function (date, i) { return i < 5 })

        for (const newEventIndex in newEvents) {
          const newEvent = newEvents[newEventIndex]

          const startDateTime = moment.tz(se.startTime, 'HH:mm', se.timezone)
            .year(newEvent.getUTCFullYear()).month(newEvent.getUTCMonth()).date(newEvent.getUTCDate())
          const endDateTime = moment.tz(se.endTime, 'HH:mm', se.timezone)
            .year(newEvent.getUTCFullYear()).month(newEvent.getUTCMonth()).date(newEvent.getUTCDate())
          upcomingEvents.push({ startDateTime: startDateTime, endDateTime: endDateTime, scheduledEvent: se, id: 'se-' + se.id + '-' + startDateTime })
        }
      }
      upcomingEvents.sort(function (a, b) {
        return a.startDateTime.diff(b.startDateTime)
      })

      this.events = upcomingEvents
    })
  }
}
</script>
