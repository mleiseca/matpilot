<template>
  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card
          title="Scheduled Events"
          text="">
          <v-data-table
            :headers="headers"
            :items="scheduledEvents"
            :mobile-breakpoint="100"
            @click:row="navigateToScheduledEvent"
          >
            <template v-slot:item.times="{ item }">
              {{ item.startTime }} - {{ item.endTime }}

            </template>
            <template v-slot:item.description="{ item }">
              {{ scheduleDescription(item) }}
            </template>

          </v-data-table>

        </material-card>

        <v-btn @click="navigateToAddScheduledEvent" fab color="success">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { rrulestr } from 'rrule'
import moment from 'moment'

// todo: search?
export default {
  name: 'GymScheduledEvents',
  props: ['gymId'],
  data () {
    return {
      headers: [
        {
          sortable: false,
          text: 'Title',
          value: 'title'
        },
        {
          sortable: false,
          text: 'Times',
          value: 'times'
        },
        {
          sortable: false,
          text: 'Description',
          value: 'description'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('scheduled-events', {
      findScheduledEventsInStore: 'find'
    }),
    scheduledEvents () {
      return this.findScheduledEventsInStore({
        query: {
          gymId: parseInt(this.gymId, 10),
          $sort: { createdAt: -1 },
          $limit: 25
        }
      }).data
    }
  },
  methods: {
    ...mapActions('scheduled-events', {
      findScheduledEvents: 'find'
    }),
    navigateToAddScheduledEvent: function () {
      this.$router.push({ name: 'gym-scheduled-event-add', params: { gymId: this.gymId } })
    },
    navigateToScheduledEvent: function (event) {
      console.log('editing event: ', event)
      this.$router.push({ name: 'gym-scheduled-event-view', params: { gymId: this.gymId, scheduledEventId: event.id } })
    },
    scheduleDescription: function (scheduledEvent) {
      if (scheduledEvent.rrules) {
        return rrulestr(scheduledEvent.rrules).toText()
      } else {
        return moment(scheduledEvent.startDate).format('MMMM D, YYYY')
      }
    }
  },
  mounted () {
    console.log('Looking for scheduled events...')
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
