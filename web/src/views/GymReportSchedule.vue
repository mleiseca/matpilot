<template>
  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card
          title="Schedule Report"
          text="">

          <v-container class="grey lighten-5">
            <v-row no-gutters>
              <v-menu
                v-model="fromDateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="Start"
                    prepend-icon="mdi-calendar"
                    readonly
                    :value="fromDateDisp"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  v-model="fromDateVal"
                  no-title
                  @input="fromDateMenu = false"
                ></v-date-picker>
              </v-menu>

              <v-menu
                v-model="toDateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="End"
                    prepend-icon="mdi-calendar"
                    readonly
                    :value="toDateDisp"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  v-model="toDateVal"
                  no-title
                  @input="toDateMenu = false"
                ></v-date-picker>
              </v-menu>
            </v-row>

            <v-row no-gutters>
              <v-btn depressed
              color="primary"
              @click="loadReport">
                Load report
              </v-btn>
            </v-row>
            <v-row no-gutters>
              <v-data-table
                :headers="headers"
                :items="reportData"
                :items-per-page="5"
                class="elevation-1"
                :loading="loading"
                hide-default-footer
              ></v-data-table>
            </v-row>
          </v-container>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from "moment";
import {mapActions} from "vuex";

export default {
  name: 'GymReportsSchedule.vue',
  props: {
    gymId: [String, Number],
  },
  data() {
    return {
      fromDateMenu: false,
      fromDateVal: moment().subtract(6, 'month').format('YYYY-MM-DD'),

      toDateMenu: false,
      toDateVal: moment().format('YYYY-MM-DD'),

      loading: false,
      reportData: [],
      headers: [
        {
          text: 'Class name',
          value: 'scheduled_event_title'
        },
        {text: "Number of classes", value: "number_of_classes"},
        {text: "Total student visits", value: "total_students"},
        {text: "Unique students", value: "unique_students"},
      ]
    }
  },
  computed: {
    fromDateDisp() {
      return this.fromDateVal;
    },
    toDateDisp() {
      return this.toDateVal;
    }
  },
  methods: {
    ...mapActions('scheduled-events', {
      findScheduledEvents: 'find'
    }),
    loadReport: async function (m) {
      this.loading = true
      const response = await this.findScheduledEvents({
        query: {
          $limit: 50,
          $customQuery: {
            type: 'SCHEDULE_REPORT',
            bind: {
              startDateTime: this.fromDateVal,
              endDateTime: this.toDateVal,
              gymId: this.gymId
            }
          }
        } })

      this.reportData = response[0]
      this.loading = false
      }
    }
}
</script>

<style scoped>

</style>
