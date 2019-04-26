<template>

  <div>
    <h1>Schedule</h1>
    <mdc-list bordered interactive>
      <mdc-list-item v-for="scheduledEvent in scheduledEvents"
                     v-bind:key="scheduledEvent.id"
                     @click="navigateToScheduledEvent"
                     :data-scheduled-event-id="scheduledEvent.id">

        {{ scheduledEvent.title }}
        {{ scheduledEvent.startTime }} -{{ scheduledEvent.endTime }}
        ({{ scheduleDescription(scheduledEvent) }})

        <!--{-->
        <!--"id": 17,-->
        <!--"title": "lkjlkj",-->
        <!--"description": "lkj",-->
        <!--"timezone": "America/Chicago",-->
        <!--"rrules": "DTSTART;TZID=America/Chicago:20190401T001000\nRRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=TU",-->
        <!--"startTime": "00:10",-->
        <!--"endTime": "01:10",-->
        <!--"startDate": "2019-04-01T05:00:00.000Z",-->
        <!--"endDate": "2019-04-02T05:00:00.000Z",-->
        <!--"createdAt": "2019-04-23T03:29:12.162Z",-->
        <!--"updatedAt": "2019-04-23T03:29:12.162Z",-->
        <!--"gymId": 1,-->
        <!--"createdBy": 1-->
        <!--}-->

      </mdc-list-item>
    </mdc-list>

    <mdc-fab fixed icon="add" @click="navigateToAddScheduledEvent"></mdc-fab>

  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { rrulestr } from 'rrule'

// todo: search?
export default {
  name: 'GymScheduledEvents',
  props: ['gymId'],
  data () {
    return {}
  },
  computed: {
    ...mapGetters('scheduled-events', {
      scheduledEvents: 'list'
    })
  },
  methods: {
    ...mapActions('scheduled-events', {
      findScheduledEvents: 'find'
    }),
    navigateToAddScheduledEvent: function () {
      this.$router.push({ name: 'gym-scheduled-event-add', params: { gymId: this.gymId } })
    },
    navigateToScheduledEvent: function (event) {
      const scheduledEventId = event.target.dataset['scheduledEventId']
      this.$router.push({ name: 'gym-scheduled-event-view', params: { gymId: this.gymId, scheduledEventId: scheduledEventId } })
    },
    scheduleDescription: function (scheduledEvent) {
      if (scheduledEvent.rrules) {
        return rrulestr(scheduledEvent.rrules).toText()
      } else {
        return 'invalid schedule'
      }
    }
  },
  mounted () {
    this.findScheduledEvents({
      query: {
        $sort: { createdAt: -1 },
        $limit: 25,
        gymId: this.gymId
      }
    })
  }
}
</script>

<style scoped>
  #app .input-group input {
    margin-bottom: 2rem;
  }

</style>
