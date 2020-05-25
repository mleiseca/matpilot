<template>
  <div>
<!--    {{ members }}-->
    <div v-for="event in events" v-bind:key="event.date">
      <v-flex xs12 class="date-header">{{ event.date }} </v-flex>
      <v-flex xs12 v-for="e in event.events" v-bind:key="e.id"
              class="event-detail">
        <user-gym-event-registration-row v-bind:event-details="e"
                                         v-bind:members="members"
                                         v-bind:registrationRecords="registrationRecords" />
      </v-flex>
    </div>
  </div>
</template>

<script>
import scheduledEventsDisplay from '../../mixins/scheduledEventsDisplay'
import UserGymEventRegistrationRow from './GymEventRegistrationRow.vue'
import { mapGetters } from 'vuex'

export default {
  components: { UserGymEventRegistrationRow },
  name: 'UserGymEventRegistration',
  mixins: [scheduledEventsDisplay],
  props: {
    gymId: [String, Number],
    members: Array,
    scheduledEvents: Array,
    existingEvents: Array
  },
  data () {
    return {
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
</style>
