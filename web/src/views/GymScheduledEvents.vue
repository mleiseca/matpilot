<template>
  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card
          title="Scheduled Events"
          text="">
          <v-data-table
            :headers="headers"
            :items="gymScheduledEvents"
            :items-per-page="15"
          >
            <!-- TODO: this pagination or search needs to work -->
            <!--:pagination.sync="pagination"-->
            <!--:rows-per-page-items="pagination.rowsPerPageItems"-->
            <!--:total-items="pagination.totalItems"-->
            <template
              slot="headerCell"
              slot-scope="{ header }">
              <span
                class="subheading font-weight-light text--darken-3"
                v-text="header.text"
              />
            </template>

            <template
              v-slot:item=" {item } "
              >
              <tr @click="navigateToScheduledEvent"
                  :data-scheduled-event-id="item.id">
                <td>{{ item.title }}</td>
                <td>{{ item.startTime }} - {{ item.endTime }}</td>
                <td>{{ scheduleDescription(item) }}</td>
                <td>{{ item.startDate | moment("dddd, MMMM Do YYYY") }}</td>
                <td>{{ item.endDate | moment("dddd, MMMM Do YYYY") }}</td>
              </tr>
            </template>
          </v-data-table>

        </material-card>

        <v-btn @click="navigateToAddScheduledEvent" fab
               color="success">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
import { rrulestr } from 'rrule'
import moment from 'moment'

import fetchGymScheduledEvents from '../mixins/fetchGymScheduledEvents'

// todo: search?
export default {
  name: 'GymScheduledEvents',
  mixins: [fetchGymScheduledEvents],
  data () {
    return {
      headers: [
        {
          sortable: true,
          text: 'Title',
          value: 'title'
        },
        {
          sortable: false,
          text: 'Times'
        },
        {
          sortable: false,
          text: 'Description'
        },
        {
          sortable: true,
          text: 'Start Date',
          value: 'startDate'
        },
        {
          sortable: true,
          text: 'End Date',
          value: 'endDate'
        },
      ]
    }
  },

  methods: {
    navigateToAddScheduledEvent: function () {
      this.$router.push({ name: 'gym-scheduled-event-add', params: { gymId: this.gymId } })
    },
    navigateToScheduledEvent: function (event) {
      const scheduledEventId = event.currentTarget.dataset['scheduledEventId']
      this.$router.push({ name: 'gym-scheduled-event-view', params: { gymId: this.gymId, scheduledEventId: scheduledEventId } })
    },
    scheduleDescription: function (scheduledEvent) {
      if (scheduledEvent.rrules) {
        return rrulestr(scheduledEvent.rrules).toText()
      } else {
        return moment(scheduledEvent.startDate).format('MMMM D, YYYY')
      }
    }
  }
}
</script>

<style scoped>
  #app .input-group input {
    margin-bottom: 2rem;
  }

</style>
