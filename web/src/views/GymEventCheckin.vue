<template>
  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card>
          <v-flex slot="header" py-0>
            <div class="title font-weight-heavy">{{ get(event, 'title') }}</div>

            <div>{{ get(event, 'startDateTime')| moment("dddd, MMMM Do") }}</div>
          </v-flex>

          <v-flex pt-0>
            <v-layout>
              <v-flex>
                <v-text-field
                  v-model="search"
                  class="mr-0 mt-0"
                  append-icon="mdi-search"
                  label="Search"
                  single-line
                  hide-details
                  px-100
                  clearable
                ></v-text-field>
              </v-flex>
              <!--<v-flex shrink>-->
                <!--<v-switch v-model="showAttendeesOnly" label="Attendees Only"-->
                <!--&gt;</v-switch>-->
              <!--</v-flex>-->
            </v-layout>
          </v-flex>

          <div v-for="member in members" v-bind:key="member.id"
               v-if="search !== null && search.length > 1">
            <mp-checkin-member-row
              v-bind:member="member"
              v-bind:attendance-records="attendanceByMember"
              v-on:attendance-change="attendanceChange">
            </mp-checkin-member-row>
          </div>

        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { get } from 'lodash'
import CheckinMemberRow from '@/components/CheckinMemberRow.vue'
const { paramsForServer } = require('feathers-hooks-common')

export default {
  name: 'GymEventCheckin',
  props: ['gymId', 'eventId'],
  data () {
    return {
      members: [],
      search: '',
      showAttendeesOnly: false,
      attendanceByMember: []
    }
  },
  components: {
    'mp-checkin-member-row': CheckinMemberRow
  },
  computed: {
    ...mapGetters('event-member-attendance', {
      findEventMemberAttendanceInStore: 'find'
    }),
    ...mapGetters('events', {
      getEventInStore: 'get'
    }),
    event () {
      return this.getEventInStore(this.eventId)
    },
    attendance () {
      return this.findEventMemberAttendanceInStore({
        query: {
          eventId: parseInt(this.eventId, 10)
        }
      }).data
    }
  },

  methods: {
    get,
    ...mapActions('members', {
      findGymMembers: 'find'
    }),
    ...mapActions('event-member-attendance', {
      findMemberEventAttendance: 'find'
    }),
    ...mapActions('events', {
      findEvents: 'find'
    }),

    async findMembers (searchValue) {
      const query = {
        gymId: this.gymId,
        $limit: 50
      }

      if (this.search !== null && this.search.length > 1) {
        query['$or'] = [
          { lowerFirstName: { $like: searchValue.toLowerCase() + '%' } },
          { lowerLastName: { $like: searchValue.toLowerCase() + '%' } }
        ]
      }
      const foundMembers = await this.findGymMembers(paramsForServer({
        query,
        populate: {
          entity: 'event-member-attendance',
          id: this.eventId
        }
      }))
      this.members = foundMembers.data
    },
    attendanceChange (event) {
      if (event.value) {
        this.$store.dispatch('event-member-attendance/create', {
          eventId: this.eventId,
          gymId: this.gymId,
          memberId: event.memberId
        })
          .then((result) => {
            console.log('Created...result:', result)
          })
      } else {
        this.$store.dispatch('event-member-attendance/remove', event.eventMemberAttendanceId)
          .then((result) => {
            console.log('Deleted...result:', result)
          })
      }
    }
  },
  watch: {
    attendance: {
      handler (newAttendance, old) {
        const attendanceMap = []
        newAttendance.forEach(function (record) {
          attendanceMap.push({
            memberId: record.memberId,
            eventMemberAttendanceId: record.id
          })
        })
        this.attendanceByMember = attendanceMap
        console.log('ATTENDANCE!! ', this.attendanceByMember)
      },
      deep: true
    },
    search: async function (searchValue) {
      return this.findMembers(searchValue)
    }

  },
  mounted () {
    this.findMembers('')

    this.findEvents({
      query: {
        id: this.eventId
      }
    })
    this.findMemberEventAttendance({
      query: {
        eventId: this.eventId
      }
    })
    //        .then(function(result) {
    //        console.log('found', result)
    //      })
    //      this.findAttendance()
  }
}
</script>
