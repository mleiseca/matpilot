<template>
  <v-fade-transition mode="out-in">

    <v-container fill-height fluid grid-list-xl pa-2>
      <v-layout wrap class="row" v-bind:class="{ active: eventDetails.active, past:eventDetails.past }">
        <v-flex xs8 md10 py-0>
          <slot v-bind:eventDetails="eventDetails"></slot>
        </v-flex>
        <v-flex xs4 md2 py-0 class="checkinButtonHolder ">

          <v-btn v-if="!present && !loading && !loadingRegistration"
                 :disabled="eventFull"
                 outlined color="primary" class="checkinButton" @click="registerForEvent()">

            <template v-if="!eventFull">Book</template>
            <template v-else>Full</template>

          </v-btn>

          <v-btn v-if="present && !loading && !loadingRegistration"
                 color="primary" class="checkinButton" @click="unregisterForEvent()">
            Booked</v-btn>

          <v-progress-circular v-if="loading || loadingRegistration"
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
import { isUndefined, isNil } from 'lodash'

export default {
  name: 'UserGymEventRegistrationRow',
  mixins: [eventCreation],
  props: {
    //  {startDateTime (Moment): startDateTime
    //    endDateTime (Moment): endDateTime,
    //    scheduledEvent: se,
    //    id: 'se-' + se.id + '-' + startDateTime}
    eventDetails: Object,
    memberIds: Array,
    memberId: Number,
    registrationRecords: Array,
    loadingRegistration: Boolean
  },
  data () {
    return {
      eventMemberRegistrationId: null,
      present: false, // Is any member registered for this event?
      loading: false
    }
  },
  methods: {
    unregisterForEvent: async function () {
      if (this.registeringMemberIds.length === 1) {
        this.loading = true
        this.$emit('unregister', this.eventMemberRegistrationId)
      } else {
        this.$emit('register', this.eventDetails, this.registeringMemberIds)
      }
    },
    registerForEvent: async function () {
      if (isUndefined(this.eventDetails.event)) {
        await this.createEvent(this.eventDetails.scheduledEvent, this.eventDetails)
      }
      if (this.registeringMemberIds.length === 1) {
        this.loading = true
      }

      this.$emit('register', this.eventDetails, this.registeringMemberIds)
    },
    updateRegistrationRecords (newRegistrationRecords, newEventDetails) {
      // console.log('have', newRegistrationRecords.length, ' registration records', newRegistrationRecords, this.registeringMemberIds)
      if (isUndefined(this.registeringMemberIds) || this.registeringMemberIds.length === 0) {
        this.eventMemberRegistrationId = null
        this.present = false
        return
      }
      // console.log('event', newEventDetails)
      if (isUndefined(newEventDetails)) {
        this.eventMemberRegistrationId = null
        this.present = false
        return
      }
      if (isUndefined(newEventDetails.event)) {
        this.eventMemberRegistrationId = null
        this.present = false
        this.loading = false
        return
      }
      for (let i = 0; i < newRegistrationRecords.length; i++) {
        let record = newRegistrationRecords[i]

        if (newEventDetails.event.id !== record.eventId) {
          continue
        }

        if (this.registeringMemberIds.includes(record.memberId)) {
          this.present = true
          this.eventMemberRegistrationId = record.id
          this.loading = false
          // console.log('MATCHED')
          return
        }
      }

      // console.log("NOT MATCHED")

      // No record found - member isn't registered
      this.eventMemberRegistrationId = null
      this.present = false
      this.loading = false
    }
  },

  mounted () {
    this.loading = true
    if (!isUndefined(this.memberId)) {
      // console.log('using memberId', this.memberId)
      this.registeringMemberIds = [this.memberId]
    } else {
      // console.log('using memberIdSSSS', this.memberIds)
      this.registeringMemberIds = this.memberIds
    }
    if (this.registrationRecords) {
      // console.log('mount registration records', this.registrationRecords)
      this.updateRegistrationRecords(this.registrationRecords, this.eventDetails)
    }
  },
  computed: {
    eventFull: function () {
      if (isNil(this.eventDetails.event) || isNil(this.eventDetails.event.maximumAttendance)) {
        return false
      } else {
        return this.eventDetails.event.registrationCount >= this.eventDetails.event.maximumAttendance
      }
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
        // console.log('eventDetails updatedd.....', value)
        this.updateRegistrationRecords(this.registrationRecords, value)
      },
      deep: true
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

</style>
