<template>
    <material-card>
      <div slot="header">
        <div class="title font-weight-light mb-2">Upcoming events</div>
      </div>

        <div v-for="event in events" v-bind:key="event.date">
          <v-flex xs12>{{ event.date }} </v-flex>
          <v-flex xs12 v-for="e in event.events" v-bind:key="e.id">
            <checkin-event v-bind:event-details="e" />
          </v-flex>
        </div>
    </material-card>

</template>

<script>
import { rrulestr } from 'rrule'
import momentTz from 'moment-timezone'
import CheckinEvent from './CheckinEvent.vue'
import moment from 'moment'

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
        console.log("scheduledEvent", se)

//        console.log('rules', se.rrules)

        const newEvents = rrulestr(se.rrules).between(moment().toDate(), moment().add(7, 'days').toDate(), true, function (date, i) {
          // TODO: this '7' should really be controlled by a toggle on the material card. maybe day/week/month?
          return i < 7
        })

        for (const newEventIndex in newEvents) {
          const newEvent = newEvents[newEventIndex]
//          console.log('newEvent', newEvent)

          const startDateTime = momentTz.tz(se.startTime, 'HH:mm', se.timezone)
            .year(newEvent.getUTCFullYear()).month(newEvent.getUTCMonth()).date(newEvent.getUTCDate())
          const endDateTime = momentTz.tz(se.endTime, 'HH:mm', se.timezone)
            .year(newEvent.getUTCFullYear()).month(newEvent.getUTCMonth()).date(newEvent.getUTCDate())
          const startDate = momentTz.tz(newEvent, se.timezone).format('MMMM D')

          upcomingEvents.push({ startDateTime: startDateTime, endDateTime: endDateTime, scheduledEvent: se, id: 'se-' + se.id + '-' + startDateTime, startDate: startDate })
        }
      }

      if (upcomingEvents.length === 0) {
        this.events = []
        return;
      }

      upcomingEvents.sort(function (a, b) {
        return a.startDateTime.diff(b.startDateTime)
      })

      this.events = []


      let currentDayEvents = []
      let currentDay = upcomingEvents[0].startDate

      for(let i = 0; i< upcomingEvents.length; i++) {
        let e = upcomingEvents[i]

//        console.log('startDate', e.startDate, currentDay)
        if (e.startDate !== currentDay) {
            this.events.push({
              date: currentDay,
              events: currentDayEvents
            })
          currentDay = e.startDate
          currentDayEvents = []
        }
        currentDayEvents.push(e)
      }

      this.events.push({
        date: currentDay,
        events: currentDayEvents
      })
//      console.log('events', this.events)



    })
  }
}
</script>
