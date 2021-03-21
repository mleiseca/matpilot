import momentTz from 'moment-timezone'
import { rrulestr } from 'rrule'
import { mapActions, mapGetters } from 'vuex'
const { defaultTo } = require('lodash')

export default {
  props: {
    scheduledEvents: Array,
    existingEvents: Array
  },
  data () {
    return {
      events: []
    }
  },
  computed: {
    ...mapGetters('events', {
      findEventsInStore: 'find'
    })
    // gym() {
    //   console.log('gymID', this.gymId)
    //   return this.getGymInStore(parseInt(this.gymId))
    // },
  },
  methods: {
    ...mapActions('events', {
      findEvents: 'find'
    }),
    buildEvents: function (ses, ee) {
      // console.log('rebuilding scheduled events...')
      // console.log('scheduled events', ses, ee)
      const upcomingEvents = []

      const existingEventsByIdentifier = {}
      if (ee) {
        ee.forEach(e => {
          existingEventsByIdentifier['se-' + e.scheduledEventId + '-' + e.startDateTime] = e
        })
      }
      function addEvent (se, date) {
        let now = momentTz.tz(se.timezone)
        const startDateTime = momentTz.tz(se.startTime, 'HH:mm', se.timezone).year(date.getUTCFullYear()).month(date.getUTCMonth()).date(date.getUTCDate())
        const endDateTime = momentTz.tz(se.endTime, 'HH:mm', se.timezone).year(date.getUTCFullYear()).month(date.getUTCMonth()).date(date.getUTCDate())
        const startDate = startDateTime.format('dddd, MMMM D')

        let isActive = now.clone().add(1, 'hours').isAfter(startDateTime) && now.isBefore(endDateTime)

        // Only show events that are in progress or in the future
        let displayStartTime = endDateTime.clone().add(48, 'hours')

        //          console.log('startDateTime', startDateTime.format('MMMM Do YYYY, h:mm:ss a'))
        //          console.log('endDateTime', endDateTime.format('MMMM Do YYYY, h:mm:ss a'))
        //          console.log('displayStartTime', displayStartTime.format('MMMM Do YYYY, h:mm:ss a'))
        if (now.isBefore(displayStartTime)) {
          const identifier = 'se-' + se.id + '-' + startDateTime.toISOString()
          upcomingEvents.push({
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            scheduledEvent: se,
            id: identifier,
            startDate: startDate,
            active: isActive,
            past: now.isAfter(startDateTime),
            event: existingEventsByIdentifier[identifier]
          })
        }
      }

      ses.forEach(se => {
        if (se.rrules) {
          let now = momentTz.tz(se.timezone)
          // TODO: this '7' should really be controlled by a toggle on the material card. maybe day/week/month?
          let earliestEventTime = defaultTo(this.earliestEventDate, this.includePastEvents ? now.clone().subtract(2, 'days') : now.clone())
          let lastDateToDisplay = defaultTo(this.latestEventDate, earliestEventTime.clone().add(7, 'days'))

          // this.findEvents()
          if (se.endDate) {
            const endDate = momentTz.tz(se.endDate, se.timezone)
            if (endDate.isBefore(lastDateToDisplay)) {
              lastDateToDisplay = endDate
            }
          }

          rrulestr(se.rrules).between(earliestEventTime.toDate(), lastDateToDisplay.toDate(), true, function (date, i) {
            addEvent(se, date)
            return true
          })
        } else {
          addEvent(se, new Date(se.startDate))
        }
      })

      if (upcomingEvents.length === 0) {
        this.events = []
        return
      }

      upcomingEvents.sort(function (a, b) {
        return a.startDateTime.diff(b.startDateTime)
      })

      this.events = []

      /**
       * Group events by day
       */
      let currentDayEvents = []
      let currentDay = upcomingEvents[0].startDate

      for (let i = 0; i < upcomingEvents.length; i++) {
        let e = upcomingEvents[i]

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
    }
  },
  watch: {
    scheduledEvents: {
      handler: function (value) {
        // console.log('Building events from scheduledEvents')
        this.buildEvents(value, this.existingEvents)
      },
      deep: true
    },
    existingEvents: {
      handler: function (value) {
        // console.log('Building events from existingEvents' + value)
        this.buildEvents(this.scheduledEvents, value)
      },
      deep: true
    }
  }
}
