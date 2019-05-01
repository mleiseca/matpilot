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
  import { RRule, rrulestr } from 'rrule'
  import CheckinEvent from "./CheckinEvent.vue";

  export default {
    components: {CheckinEvent},
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

          // TODO: this '5' should really be controlled by a toggle on the material card
          const newEvents = rrulestr(se.rrules).all(function (date, i){return i < 5})

          for(const newEventIndex in newEvents) {
            const newEvent = newEvents[newEventIndex]
            upcomingEvents.push({time: newEvent, scheduledEvent: se, id: 'se-' + se.id + '-' + newEvent})
          }
        }
//        console.log(upcomingEvents)
        upcomingEvents.sort(function(a, b) {
          return a.time - b.time
        })
        this.events = upcomingEvents
      })
    }
  }
</script>

<style scoped>

  h1 {
    padding-left: .5rem;
  }

</style>
