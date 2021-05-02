<template>
  <div>
    <!--  MODAL DIALOG FOR MULTIPLE MEMBERS IN ACCOUNT  -->
    <v-dialog v-model="multiMemberRegistrationDialog" max-width="500px" :persistent=true>
      <v-card>
        <v-card-title>
          Event Registration
        </v-card-title>
        <v-card-text>
          <div class="event-dialog-header" v-if="selectedEventDetails">
            <div class="event-dialog-title">
              <span class="">{{ selectedEventDetails.scheduledEvent.title }}</span>
              <span class="event-dialog-description" v-if="selectedEventDetails.scheduledEvent.description"> - {{ selectedEventDetails.scheduledEvent.description }}</span>
            </div>
            <div class="times">
              {{ selectedEventDetails.startDateTime | moment("h:mma") }} - {{ selectedEventDetails.endDateTime | moment("h:mma") }}
            </div>
          </div>
          <v-flex xs12 v-for="m in members" v-bind:key="m.id"
                  class="event-detail">

            <user-gym-event-registration-row v-bind:event-details="selectedEventDetails"
                                             v-bind:member-id="m.id"
                                             v-bind:registrationRecords="registrationRecords"
                                             v-on:unregister="unregisterForEvent"
                                             v-on:register="registerForEvent"
                                             v-bind:loadingRegistration.sync="loadingRegistrations"
                                             v-bind:registrationsRemainingByMemberId="registrationsRemainingByMemberId"
            >

              <template  v-slot:eventDescription>
                <div class="event-dialog-name" >
                  {{ m.firstName }} {{ m.lastName }}
                </div>
                <div class="event-member-remaining" v-if="registrationsTextForMemberId(m.id) !== ''">
                  {{ registrationsTextForMemberId(m.id) }} registrations remaining for the week
                </div>
              </template>

            </user-gym-event-registration-row>
          </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="multiMemberRegistrationDialog = false">Done</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END MODAL DIALOG FOR MULTIPLE MEMBERS IN ACCOUNT  -->

    <div v-for="event in events" v-bind:key="event.date">
      <v-flex xs12 class="date-header">{{ event.date }} </v-flex>
      <v-flex xs12 v-for="e in event.events" v-bind:key="e.id"
              class="event-detail">

        <user-gym-event-registration-row v-bind:event-details="e"
                                         v-bind:member-ids="memberIds"
                                         v-bind:registrationRecords="registrationRecords"
                                         v-on:unregister="unregisterForEvent"
                                         v-on:register="registerForEvent"
                                         v-bind:loadingRegistration.sync="loadingRegistrations"
                                         v-bind:registrationsRemainingByMemberId="registrationsRemainingByMemberId"
        >
          <template v-slot:eventDescription>
            <div>
              <span class="">{{ e.scheduledEvent.title }}</span>
              <span class="event-description" v-if="e.scheduledEvent.description"> - {{ e.scheduledEvent.description }}</span>
            </div>
            <div class="times">
              {{ e.startDateTime | moment("h:mma") }} - {{ e.endDateTime | moment("h:mma") }}
            </div>
          </template>
        </user-gym-event-registration-row>
      </v-flex>
    </div>
  </div>
</template>

<script>
import scheduledEventsDisplay from '../../mixins/scheduledEventsDisplay'
import UserGymEventRegistrationRow from './GymEventRegistrationRow.vue'
import { mapActions, mapGetters } from 'vuex'
import eventCreation from '../../mixins/eventCreation'
import { EventBus } from '../../event-bus'
const { debounce, isNil } = require('lodash')

export default {
  components: { UserGymEventRegistrationRow },
  name: 'UserGymEventRegistration',
  mixins: [scheduledEventsDisplay, eventCreation],
  props: {
    gymId: [String, Number],
    members: Array,
    scheduledEvents: Array,
    existingEvents: Array,
    earliestEventDate: Object,
    latestEventDate: Object
  },
  data () {
    return {
      multiMemberRegistrationDialog: false,
      selectedEventDetails: null,
      includePastEvents: false,
      memberIds: [],
      loadingRegistrations: false,
      registrationsRemainingByMemberId: {},
      registrations: []
    }
  },
  computed: {
    ...mapGetters('event-member-registration', {
      findEventMemberRegistrationInStore: 'find'
    }),
    ...mapGetters('gyms', {
      getGymInStore: 'get'
    }),
    registrationRecords () {
      return this.findEventMemberRegistrationInStore({
        query: {
          gymId: parseInt(this.gymId, 10)
        },
        qid: 'event_member_registration_by_gym'
      }).data
    }
  },
  mounted: async function () {
    if (this.members) {
      this.extractIds(this.members)
    }
    await this.loadRegistrations()
    this.buildEvents(this.scheduledEvents, this.existingEvents)
  },
  watch: {
    members: {
      handler: function (value) {
        this.extractIds(value)
      }
    },
    events: {
      handler: function (value, newValue) {
        console.log('events update', value, newValue)
        this.updateRegistrationsRemaining(this.registrations)
      }
    },
    registrationRecords: {
      handler: function (value, newValue) {
        console.log('registrationRecords update', value, newValue)
        this.updateRegistrationsRemaining(value)
        this.registrations = value
      }
    },
    earliestEventDate: function (value) {
      this.loadingRegistrations = true
      this.reloadDataDebounced()
    },
    latestEventDate: function (value) {
      this.loadingRegistrations = true
      this.reloadDataDebounced()
    }
  },
  methods: {
    ...mapActions('event-member-registration', {
      findEventMemberRegistration: 'find'
    }),
    reloadDataDebounced: debounce(function () { this.reloadData() }, 300),
    reloadData: async function () {
      await this.loadRegistrations()
    },
    registrationsTextForMemberId: function (memberId) {
      if (isNil(this.registrationsRemainingByMemberId[memberId])) {
        return ''
      } else {
        return this.registrationsRemainingByMemberId[memberId]
      }
    },
    loadRegistrations: async function () {
      const results = await this.findEventMemberRegistration({
        query: {
          $customQuery: {
            type: 'REGISTRATION_DURING_PERIOD',
            replacements: {
              startDateTime: this.earliestEventDate,
              endDateTime: this.latestEventDate,
              memberIds: this.memberIds,
              gymIds: [this.gymId]
            }
          }
        } })

      this.$store.commit('event-member-registration/addItems', results[0])
      this.$store.commit('event-member-registration/updatePaginationForQuery',
        { 'qid': 'event_member_registration_by_gym',
          'response': { 'data': results[0] }
        })
      // console.log('FOUND REGISTRATIONS', results[0])
      this.loadingRegistrations = false
    },
    updateRegistrationsRemaining: async function (registrations) {
      let maximumWeeklyRegistrationPerMember = this.getGymInStore(this.gymId).maximumWeeklyRegistrationPerMember
      const registrationsRemaining = {}

      if (!isNil(maximumWeeklyRegistrationPerMember)) {
        const registrationsByMemberId = {}
        const eventIds = this.getEventIds()
        for (let i = 0; i < registrations.length; i++) {
          const registration = registrations[i]

          console.log('updateRegistrationsRemaining registrations', registrations)
          if (eventIds.includes(registration.eventId)) {
            const count = registrationsByMemberId[registration.memberId] || 0
            registrationsByMemberId[registration.memberId] = count + 1
          }
        }
        // console.log("registrationsByMemberId", registrationsByMemberId)
        for (let i = 0; i < this.memberIds.length; i++) {
          let memberId = this.memberIds[i]
          const registrationCount = registrationsByMemberId[memberId] || 0
          registrationsRemaining[memberId] = maximumWeeklyRegistrationPerMember - registrationCount
        }
      }

      if (this.memberIds.length === 1) {
        this.$emit('registrations-remaining', registrationsRemaining[this.members[0].id])
      } else {
        this.$emit('registrations-remaining', null)
      }

      this.registrationsRemainingByMemberId = {}
      for (let i = 0; i < this.memberIds.length; i++) {
        this.registrationsRemainingByMemberId[this.members[i].id] = registrationsRemaining[this.members[i].id]
      }
    },
    extractIds: function (members) {
      const memberIds = []
      members.forEach(member => {
        memberIds.push(parseInt(member.id, 10))
      })
      this.memberIds = memberIds
    },
    unregisterForEvent: async function (eventMemberRegistrationId) {
      console.log('unregister')
      // this.loading = true
      await this.$store.dispatch('event-member-registration/remove', eventMemberRegistrationId)
      // this.loading = false
    },
    registerForEvent: async function (eventDetails, memberIds) {
      // const { eventDetails, members } = args
      console.log('register', eventDetails, memberIds)
      // console.log('details', eventDetails)
      // console.log('member',  members)

      if (memberIds.length === 1) {
        let memberId = memberIds[0]
        const eventId = eventDetails.event.id
        // console.log('eventid', eventId)
        if (!isNil(this.registrationsRemainingByMemberId[memberId]) && this.registrationsRemainingByMemberId[memberId] <= 0) {
          EventBus.$emit('user-message', { message: `You have reached your registration limit for the week.`, type: 'error' })
          this.loading = false
          return
        }
        try {
          await this.$store.dispatch('event-member-registration/create', {
            eventId: eventId,
            gymId: eventDetails.scheduledEvent.gymId,
            memberId: memberId
          })
        } catch (e) {
          EventBus.$emit('user-message', { message: `Error: ${e.message}`, type: 'error' })
          this.loading = false
        }

        // console.log('created registration', registration)
      } else {
        this.selectedEventDetails = eventDetails
        this.$nextTick(() => {
          this.multiMemberRegistrationDialog = true
        })
        // console.log('need to choose a person to register')
      }
    }
  }
}
</script>

<style>
  @media (max-width: 600px) {
    .event-detail {
      padding-left:0 !important;
      padding-right:0 !important;
    }
  }
  .date-header{
    padding: 10px 32px;
    background-color: rgba(0,0,0,0.03);
    border-color: rgba(0,0,0,0.1);
    border-top-style: none;
    border-bottom-style: solid;
    border-width: 1px;
  }
  .event-detail {
    padding: 10px 32px;
    border-color: rgba(0,0,0,0.1);
    border-top-style: none;
    border-bottom-style: solid;
    border-width: 1px;
  }

  .event-dialog-header {
    border-color: rgba(0,0,0,0.1);
    border-top-style: none;
    border-bottom-style: solid;
    border-width: 1px;
    padding-bottom: 10px;
  }
  .event-description {
    color: rgba(0,0,0,0.65);
  }

  .event-dialog-description {
    color: rgba(0,0,0,0.65);
  }

  .event-member-remaining {

  }

  .times {
  }

  .event-dialog-name {
    padding: 10px 0px 0px 0px;
    /*border-color: rgba(0,0,0,0.1);*/
    /*border-top-style: none;*/
    /*border-bottom-style: solid;*/
    /*border-width: 1px;*/
  }
</style>
