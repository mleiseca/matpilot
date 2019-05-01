<template>

  <!--<div>-->
    <!--<h1>Schedule</h1>-->
    <!--<mdc-list bordered interactive>-->
      <!--<mdc-list-item v-for="scheduledEvent in scheduledEvents"-->
                     <!--v-bind:key="scheduledEvent.id"-->
                     <!--@click="navigateToScheduledEvent"-->
                     <!--:data-scheduled-event-id="scheduledEvent.id">-->

      <!--</mdc-list-item>-->
    <!--</mdc-list>-->

    <!--<mdc-fab fixed icon="add" @click="navigateToAddScheduledEvent"></mdc-fab>-->

  <!--</div>-->

  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card
          color="green"
          title="Scheduled Events"
          text="">
          <v-data-table
            :headers="headers"
            :items="scheduledEvents"
            hide-actions>
            <!-- TODO: this pagination or search needs to work -->
            <!--:pagination.sync="pagination"-->
            <!--:rows-per-page-items="pagination.rowsPerPageItems"-->
            <!--:total-items="pagination.totalItems"-->
            <template
              slot="headerCell"
              slot-scope="{ header }">
              <span
                class="subheading font-weight-light text-success text--darken-3"
                v-text="header.text"
              />
            </template>
            <template
              slot="items"
              slot-scope="{ item }">
              <tr @click="navigateToScheduledEvent"
                  :data-scheduled-event-id="item.id">
                <td>{{ item.title }}</td>
                <td>{{ item.startTime }} -{{ item.endTime }}</td>
                <td>{{ scheduleDescription(item) }}</td>
              </tr>
            </template>
          </v-data-table>

        </material-card>

        <v-btn @click="navigateToAddScheduledEvent" fab
               color="green">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
import { mapActions } from 'vuex'
import { rrulestr } from 'rrule'

// todo: search?
export default {
  name: 'GymScheduledEvents',
  props: ['gymId'],
  data () {
    return {
      headers: [
        {
          sortable: false,
          text: 'Title'
        },
        {
          sortable: false,
          text: 'Times'
        },
        {
          sortable: false,
          text: 'Description'
        }
      ]
    }
  },
  computed: {
    scheduledEvents () {
      return this.$store.getters['scheduled-events/list']
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
      const scheduledEventId = event.currentTarget.dataset['scheduledEventId']
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
