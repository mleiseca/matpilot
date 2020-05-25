<template>
  <v-fade-transition mode="out-in">

    <v-container fill-height fluid grid-list-xl pa-2>
      <v-layout wrap class="row" v-bind:class="{ active: eventDetails.active, past:eventDetails.past }">
        <v-flex xs8 md10 py-0>
          <div class="event-title">
            <span class="">{{ eventDetails.scheduledEvent.title }}</span>
            <span class="event-description" v-if="eventDetails.scheduledEvent.description"> - {{ eventDetails.scheduledEvent.description }}</span>
          </div>
          <div class="times">
            {{ eventDetails.startDateTime | moment("h:mma") }} - {{ eventDetails.endDateTime | moment("h:mma") }}
<!--                      <div>{{ eventDetails }}</div>-->
            <!--          <div>{{ registrationRecords }}</div>-->
<!--                      <div>{{ members }}</div>-->
          </div>
        </v-flex>
        <v-flex xs4 md2 py-0 class="checkinButtonHolder">
          <!--        {{ present }}-->

          <v-btn v-if="!present && !loading"
                 outline color="primary" class="checkinButton" @click="registerForEvent(eventDetails.scheduledEvent, eventDetails.time)">
            Book</v-btn>

          <v-btn v-if="present && !loading"
                 color="primary" class="checkinButton" @click="unregisterForEvent(eventDetails.scheduledEvent, eventDetails.time)">
            Booked</v-btn>

          <v-progress-circular v-if="loading"
                               indeterminate
                               color="primary"
          ></v-progress-circular>
        </v-flex>
      </v-layout>
    </v-container>
  </v-fade-transition>
</template>

<script>
import eventCreation from '../../mixins/eventCreation'
import { isUndefined } from 'lodash'

export default {
  name: 'UserGymEventRegistrationRow',
  mixins: [eventCreation],
  props: {
    //  {startDateTime (Moment): startDateTime
    //    endDateTime (Moment): endDateTime,
    //    scheduledEvent: se,
    //    id: 'se-' + se.id + '-' + startDateTime}
    eventDetails: Object,
    members: Array,
    registrationRecords: Array
  },
  data () {
    return {
      eventMemberRegistrationId: null,
      memberIds: [],
      present: false, // Is any member registered for this event?
      loading: false
    }
  },
  methods: {
    extractIds: function (members) {
      const memberIds = []
      members.forEach(member => {
        memberIds.push(parseInt(member.id, 10))
      })
      this.memberIds = memberIds
    },
    unregisterForEvent: async function () {
      this.loading = true
      // console.log('unregister')
      await this.$store.dispatch('event-member-registration/remove', this.eventMemberRegistrationId)
      this.loading = false
    },
    registerForEvent: async function (scheduledEvent) {
      this.loading = true
      if (this.members.length === 1) {
        let eventId
        if (isUndefined(this.eventDetails.event)) {
          const event = await this.createEvent(scheduledEvent, this.eventDetails)
          eventId = event.id
        } else {
          eventId = this.eventDetails.event.id
        }
        await this.$store.dispatch('event-member-registration/create', {
          eventId: eventId,
          gymId: this.members[0].gymId,
          memberId: this.members[0].id
        })

        // console.log('created registration', registration)
      } else {
        // TODO: need to choose a person to register
      }
      this.loading = false
      // .then((result) => {
      //   console.log('Got result:', result)
      //
      //   // TODO: ok...need to actually add a registration
      //   //            this.$router.push({ name: 'gym-event-checkin', params: { gymId: scheduledEvent.gymId, eventId: result.id } })
      // })
    },
    updateRegistrationRecords (newRegistrationRecords, newEventDetails) {
      // console.log('have', newRegistrationRecords.length, ' registration records', newRegistrationRecords)
      if (isUndefined(newEventDetails) || isUndefined(newEventDetails.event)) {
        // console.log('not possible to register - event not found')
        return
      }
      for (let i = 0; i < newRegistrationRecords.length; i++) {
        let record = newRegistrationRecords[i]

        if (newEventDetails.event.id !== record.eventId) {
          continue
        }

        // console.log('MATCHED')

        // TODO: multiple members

        if (this.memberIds.includes(record.memberId)) {
          this.present = true
          this.eventMemberRegistrationId = record.id
          return
        }
      }
      // No record found - member isn't registered
      this.eventMemberRegistrationId = null
      this.present = false
    },
    presentChange () {
      let value = !this.present
      console.log('CHANGING REGISTRATION ', {
        memberId: this.member.id,
        eventMemberRegistrationId: this.eventMemberRegistrationId,
        value: value
      })
      // this.$emit('registration-change', {
      //   memberId: this.member.id,
      //   eventMemberRegistrationId: this.eventMemberRegistrationId,
      //   value: value
      // })
    }
  },

  mounted () {
    if (this.members) {
      this.extractIds(this.members)
    }
    if (this.registrationRecords) {
      // console.log('mount registration records', this.registrationRecords)
      this.updateRegistrationRecords(this.registrationRecords)
    }
  },
  watch: {
    registrationRecords: {
      handler: function (value) {
        // console.log('updating registration records', value)
        this.updateRegistrationRecords(value, this.eventDetails)
      },
      deep: true
    },
    eventDetails: {
      handler: function (value) {
        // console.log('updating registration records', value)
        this.updateRegistrationRecords(this.registrationRecords, value)
      },
      deep: true
    },
    members: {
      handler: function (value) {
        this.extractIds(value)
      }
    }
  }

}
</script>

<style scoped>

  @media (max-width: 600px) {
    .checkinButtonHolder {
      padding-left:0 !important;
      padding-right:0 !important;
    }
    .checkinButton {
      padding-left:.8rem !important;
      padding-right:.8rem !important;
    }
  }

  .event-description {
    color: rgba(0,0,0,0.65);
  }

</style>
