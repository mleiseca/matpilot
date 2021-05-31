<template>
  <v-fade-transition mode="out-in">
    <material-card>
      <template >
        <div slot="header">
          <div class="text-h6 font-weight-light mb-2" v-if="gym !== undefined">{{ gym.name }}</div>
        </div>
        <v-card-text class="pa-0">
          <v-alert
            prominent
            text
            outlined
            type="error"
            v-if="!hasAcknowledgedMessage && gym !== undefined && gym.registrationMessage !== null"
          >
            <v-row align="center">
              <v-col class="grow">
                {{ gym.registrationMessage }}
              </v-col>
              <v-col class="shrink" >
                <v-btn v-on:click="acknowledgeMessage">

                  ACKNOWLEDGE</v-btn>
              </v-col>
            </v-row>
          </v-alert>
          <v-expansion-panels popout>
            <v-expansion-panel v-show="waiversAllSigned && (hasAcknowledgedMessage || gym.registrationMessage === null)">
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
            <v-expansion-panel v-if="!waiversAllSigned">
              <v-expansion-panel-header>

                <span class="waiver-warning-icon">
                  <v-icon class="error--text">mdi-alert</v-icon>
                </span>
                Waivers
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div v-for="member in members" :key="member.id">
                  {{ member.firstName }} {{ member.lastName }}
                                  <member-waivers v-bind:gym-id="member.gymId"
                                                  v-bind:member="member"
                                                  v-bind:alert-unsigned="true"
                                  />

                </div>

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
import fetchWaivers from "../../mixins/fetchWaivers";
import fetchMemberWaivers from "../../mixins/fetchMemberWaivers";
import { isNil} from 'lodash'

export default {
  name: 'UserGymOverviewCard',
  mixins: [fetchGymScheduledEvents, fetchMemberWaivers, fetchWaivers],
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
      registrationsRemaining: null,
      waiversAllSigned: false,
      hasAcknowledgedMessage: this.$cookies.get("acknowledgedGymMessage_" +this.gymId)
    }
  },
  watch: {
    gymWaivers: function(x){
      if (!this.alertUnsigned) {
        this.$nextTick(function () {
          this.currentWaiver = 1
        })
      }
      this.updateWaiversAllSigned()
    },
    memberWaivers: function(x) {
      this.updateWaiversAllSigned()
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
    },
    updateWaiversAllSigned() {
      console.log("(gymoverview) updateWaiversAllSigned" )
      if (isNil(this.gymWaivers) || this.gymWaivers.length === 0 || isNil(this.memberWaivers) || this.memberWaivers.length === 0) {
        this.waiversAllSigned = false;
        return
      }
      const existSigsByMemberAndWaiverId = new Map()
      for (const memberSignture of this.memberWaivers) {
        existSigsByMemberAndWaiverId.set([memberSignture.memberId, memberSignture.gymWaiverId].join('-'), memberSignture)
      }
      this.waiverAndSignatures = []
      for (const member of this.members) {
        for (const waiver of this.gymWaivers) {
          const key = [member.id, waiver.id].join('-')
          if (!existSigsByMemberAndWaiverId.has(key)) {
            console.log("(gymoverview) updateWaiversAllSigned ... missing ", existSigsByMemberAndWaiverId, waiver.id)
            this.waiversAllSigned = false;
            return
          }
        }
      }
      this.waiversAllSigned = true;
    },
    acknowledgeMessage() {
      this.hasAcknowledgedMessage = true
      this.$cookies.set("acknowledgedGymMessage_" +this.gymId, true)
    }
  }
}
</script>

<style scoped>
  .waiver-warning-icon {
    flex: 0 1 auto;
    margin-right: 5px;
  }
  /*.v-card__text {*/
    /*display: inline-block;*/
    /*width: 100%;*/
    /*!*padding: 0px;*!*/
    /*padding-left: 10px !important;*/
    /*padding-right: 10px !important;*/
    /*padding-top: 10px !important;*/
  /*}*/
</style>
