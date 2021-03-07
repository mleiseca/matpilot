<template>
  <div>
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
<!--          <v-flex xs12 class="date-header">{{ selectedEventDetails.date }} </v-flex>-->
          <v-flex xs12 v-for="m in members" v-bind:key="m.id"
                  class="event-detail">

            <user-gym-event-registration-row v-bind:event-details="selectedEventDetails"
                                             v-bind:member-id="m.id"
                                             v-bind:registrationRecords="registrationRecords"
                                             v-on:unregister="unregisterForEvent"
                                             v-on:register="registerForEvent"
            >

              <div class="event-dialog-name">
                {{ m.firstName }} {{ m.lastName }}
              </div>

            </user-gym-event-registration-row>
          </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="multiMemberRegistrationDialog = false">Done</v-btn>
<!--          <v-btn color="primary" text @click="saveNewRank">Save</v-btn>-->
        </v-card-actions>
      </v-card>
    </v-dialog>
<!--    {{ members }}-->
    <div v-for="event in events" v-bind:key="event.date">
      <v-flex xs12 class="date-header">{{ event.date }} </v-flex>
      <v-flex xs12 v-for="e in event.events" v-bind:key="e.id"
              class="event-detail">
        <user-gym-event-registration-row v-bind:event-details="e"
                                         v-bind:member-ids="memberIds"
                                         v-bind:registrationRecords="registrationRecords"
                                         v-on:unregister="unregisterForEvent"
                                         v-on:register="registerForEvent"
        >

          <div class="event-title">
            <div class="event-title">
              <span class="">{{ e.scheduledEvent.title }}</span>
              <span class="event-description" v-if="e.scheduledEvent.description"> - {{ e.scheduledEvent.description }}</span>
            </div>
            <div class="times">
              {{ e.startDateTime | moment("h:mma") }} - {{ e.endDateTime | moment("h:mma") }}
            </div>
          </div>
        </user-gym-event-registration-row>
      </v-flex>
    </div>
  </div>
</template>

<script>
import scheduledEventsDisplay from '../../mixins/scheduledEventsDisplay'
import UserGymEventRegistrationRow from './GymEventRegistrationRow.vue'
import {mapActions, mapGetters} from 'vuex'
import eventCreation from '../../mixins/eventCreation'

export default {
  components: { UserGymEventRegistrationRow },
  name: 'UserGymEventRegistration',
  mixins: [scheduledEventsDisplay, eventCreation],
  props: {
    gymId: [String, Number],
    members: Array,
    scheduledEvents: Array,
    existingEvents: Array
  },
  data () {
    return {
      multiMemberRegistrationDialog: false,
      selectedEventDetails: null,
      includePastEvents: false,
      memberIds: []
    }
  },
  computed: {
    ...mapGetters('event-member-registration', {
      findEventMemberRegistrationInStore: 'find'
    }),
    registrationRecords () {
      return this.findEventMemberRegistrationInStore({
        query: {
          gymId: parseInt(this.gymId, 10)
        }
      }).data
    }
  },
  mounted: async function () {
    if (this.members) {
      this.extractIds(this.members)
    }

    await this.findEventMemberRegistration({
      query: {
        // near past and future!
        $limit: 50,
        memberId: this.memberIds,
        gymId: this.gymId
      }
    })
  },
  watch: {
    members: {
      handler: function (value) {
        this.extractIds(value)
      }
    }
  },
  methods: {
    ...mapActions('event-member-registration', {
      findEventMemberRegistration: 'find'
    }),
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
        const eventId = eventDetails.event.id
        console.log('eventid', eventId)
        await this.$store.dispatch('event-member-registration/create', {
          eventId: eventId,
          gymId: eventDetails.scheduledEvent.gymId,
          memberId: memberIds[0]
        })

        // console.log('created registration', registration)
      } else {
        this.selectedEventDetails = eventDetails
        this.$nextTick(() => {
          this.multiMemberRegistrationDialog = true
        })
        console.log('need to choose a person to register')

        // TODO: need to choose a person to register
      }
      // .then((result) => {
      //   console.log('Got result:', result)
      //
      //   // TODO: ok...need to actually add a registration
      //   //            this.$router.push({ name: 'gym-event-checkin', params: { gymId: scheduledEvent.gymId, eventId: result.id } })
      // })
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

  .event-dialog-name {
    padding: 10px 0px;
    /*border-color: rgba(0,0,0,0.1);*/
    /*border-top-style: none;*/
    /*border-bottom-style: solid;*/
    /*border-width: 1px;*/
  }
</style>
