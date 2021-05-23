<template>
  <v-fade-transition mode="out-in">
    <material-card>
      <template >
        <div slot="header">
          <div class="text-h6 font-weight-light mb-2" v-if="gym !== undefined">{{ gym.name }}</div>
        </div>
        <v-card-text class="pa-0">

          <v-expansion-panels popout>
            <v-expansion-panel>
              <v-expansion-panel-header>
                Register for classes
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-progress-circular :indeterminate="true" v-if="gymScheduledEvents === null"/>
                <week-picker
                  v-bind:startDate.sync="earliestEventDate"
                  v-bind:allowPastWeeks="false"
                  v-bind:maxStartDate="maxStartDate"
                  v-on:week-change="weekChange"/>

                <span v-if="registrationsRemaining !== null">
                  Registrations remaining for the week: {{ registrationsRemaining }}
                </span>
                <user-gym-event-registration
                  v-bind:scheduled-events.sync="gymScheduledEvents"
                  v-bind:existing-events.sync="gymEvents"
                  v-bind:members="members"
                  v-bind:gymId="gymId"
                  v-bind:earliestEventDate="earliestEventDate"
                  v-bind:latestEventDate="latestEventDate"
                  v-on:registrations-remaining="updateRegistrationsRemaining"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </template>
    </material-card>
  </v-fade-transition>
</template>

<script>
import fetchGymScheduledEvents from '../../mixins/fetchGymScheduledEvents'
import moment from 'moment'

export default {
  name: 'UserGymOverviewCard',
  mixins: [fetchGymScheduledEvents],
  props: {
    gymId: [String, Number],
    members: Array,
    registrationRecords: Array
  },
  data () {
    let start = moment().startOf('isoWeek')
    let end = moment().startOf('isoWeek').add(7, 'days')
    // maxStartDate will remain constant, even as earliestEventDate/latestEventDate move
    let maxStartDate = moment().startOf('isoWeek').add(3, 'weeks')
    return {
      earliestEventDate: start,
      latestEventDate: end,
      maxStartDate: maxStartDate,
      registrationsRemaining: null
    }
  },
  methods: {
    weekChange: function (amount) {
      this.earliestEventDate = this.earliestEventDate.clone().add(7 * amount, 'days')
      this.latestEventDate = this.earliestEventDate.clone().add(7, 'days')
      this.loadEventsForTimeRange()
    },
    updateRegistrationsRemaining: function (value) {
      console.log('updateRegistrationsRemaining', value)
      this.registrationsRemaining = value
    }
  }
}
</script>

<style>
  /*.v-card__text {*/
    /*display: inline-block;*/
    /*width: 100%;*/
    /*!*padding: 0px;*!*/
    /*padding-left: 10px !important;*/
    /*padding-right: 10px !important;*/
    /*padding-top: 10px !important;*/
  /*}*/
</style>
