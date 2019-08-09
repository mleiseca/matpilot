<template>
  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card offset="12">
          <v-flex slot="header" py-0>
            <div class="title font-weight-heavy">{{ get(event, 'title') }}</div>

            <div>{{ get(event, 'startDateTime')| moment("dddd, MMMM Do") }}</div>
          </v-flex>

          <v-layout justify-center wrap row>
            <v-flex xs9>
              <v-text-field
                v-if="bottomNav === 'search'"
                v-model="search"
                @input="updateSearch"
                @focus="focusSearchBox"
                v-on:blur="unfocusSearchBox"
                label="Search by Name"
                single-line
                hide-details
                clearable
                class="pt-0 pl-4"
              >
              </v-text-field>
            </v-flex>
            <v-flex xs3>
              <div class="attendee-count pt-2">
              {{ attendanceByMember.length }} total
              </div>
            </v-flex>
          </v-layout>

          <transition>
            <v-list v-if="members.length > 0">
              <mp-checkin-member-row
                v-for="member in members"
                v-bind:key="member.id"
                v-bind:member="member"
                v-bind:attendance-records="attendanceByMember"
                v-on:attendance-change="attendanceChange">
              </mp-checkin-member-row>
            </v-list>
          </transition>
          <transition>
            <div class="loading" key="loading" v-show="loading">
              <v-progress-linear
                :size="50"
                color="primary"
                indeterminate
              ></v-progress-linear>
            </div>
          </transition>
        </material-card>
      </v-flex>
      <v-bottom-nav
        v-if="!keyboardUp"
        :active.sync="bottomNav"
        :value="true"
        fixed
      >
        <v-btn
          color="teal"
          flat
          value="search"
        >
          <span>Search</span>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn
          color="teal"
          flat
          value="attendees"
          v-on:click="findAttendees()"
        >
          <span>Attendees</span>
          <v-icon>mdi-account-check</v-icon>
        </v-btn>

        <!--<v-btn-->
          <!--color="teal"-->
          <!--flat-->
          <!--value="suggestions"-->
        <!--&gt;-->
          <!--<span>Suggestions</span>-->
          <!--<v-icon>mdi-account-clock-outline</v-icon>-->
        <!--</v-btn>-->
      </v-bottom-nav>
    </v-layout>

  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { get, debounce } from 'lodash'
import CheckinMemberRow from '@/components/CheckinMemberRow.vue'

export default {
  name: 'GymEventCheckin',
  props: ['gymId', 'eventId'],
  data () {
    return {
      //      members: [],
      search: '',
      attendanceByMember: [],
      loading: false,
      bottomNav: 'search',
      keyboardUp: false
    }
  },
  components: {
    'mp-checkin-member-row': CheckinMemberRow
  },
  computed: {
    ...mapGetters('event-member-attendance', {
      findEventMemberAttendanceInStore: 'find'
    }),
    ...mapGetters('members', {
      findMembersInStore: 'find'
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
    },

    members () {
      let query = { gymId: parseInt(this.gymId, 10) }

      if (this.bottomNav === 'attendees') {
        const memberIds = []
        this.attendance.forEach(function (record) {
          memberIds.push(record.memberId)
        })
        query.id = {
          $in: memberIds
        }
      } else if (this.bottomNav === 'search' && this.search !== null && this.search.length > 1) {
        query['$or'] = [
          { lowerFirstName: { $regex: '^' + this.escapeRegExp(this.search.toLowerCase()) } },
          { lowerLastName: { $regex: '^' + this.escapeRegExp(this.search.toLowerCase()) } }
        ]
      } else {
        return []
      }

      return this.findMembersInStore({ query }).data
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

    escapeRegExp (string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
    },

    focusSearchBox () {
      this.keyboardUp = true
    },
    unfocusSearchBox () {
      this.keyboardUp = false
    },

    async findMembers (searchValue) {
      if (searchValue === null || searchValue.length < 2) {
        return
      }
      this.startLoading()
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
      await this.findGymMembers({ query })
      this.stopLoading()
    },
    startLoading () {
      this.$nextTick(() => {
        this.loading = true
      })
    },
    stopLoading () {
      this.$nextTick(() => {
        this.loading = false
      })
    },

    async findAttendees () {
      this.startLoading()
      const query = {
        gymId: this.gymId,
        $limit: 50,
        $include: [{
          model: 'event-member-attendance',
          where: { eventId: this.eventId }
        }]
      }

      await this.findGymMembers({ query })
      this.stopLoading()
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
    },
    updateSearch: debounce(function (searchValue) {
      return this.findMembers(searchValue)
    }, 300)
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
    }
  },
  mounted () {
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
  }
}
</script>

<style>
  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .attendee-count {

  }

  .loading{
    padding-top: 1rem;
    width: auto;

  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
  }
</style>
