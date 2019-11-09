<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <div class="headline">Training Record</div>
      </v-flex>

      <v-flex xs4>
        <div class="circle">
          {{ trainingTimeThisWeek }}
        </div>
        <div class="circlehelper">this week</div>

      </v-flex>
      <v-flex xs4>
        <div class="circle">
          {{ trainingAverage }}
        </div>
        <div class="circlehelper">per week</div>
        <div class="circlehelper circlehelperaux">past month</div>
      </v-flex>
      <v-flex xs4>
        <div v-if="trainingSincePromo">
          <div class="circle">
            {{ trainingSincePromo }}
          </div>
          <div class="circlehelper">since promo</div>
        </div>
      </v-flex>

      <v-flex xs12>
        <div class="headline">Attendance</div>
      </v-flex>

      <v-flex xs3 pb-0 pt-0 pl-0 class="monthArrow">
        <v-btn flat @click="changeMonth(-1)">
          <v-icon>mdi-arrow-left-bold</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs7 pb-0>
        <div class="title attendanceMonth">{{ activeMonthText }}</div>
      </v-flex>
      <v-flex xs2 pb-0 pt-0 class="monthArrow" >
        <v-btn flat @click="changeMonth(1)" v-show="nextAttendanceMonthShown" >
          <v-icon>mdi-arrow-right-bold</v-icon>
        </v-btn>
      </v-flex>

      <div v-for="attendance in attendances"
           v-bind:key="attendance.id"
           v-bind:class="getAttendanceClass(attendance.id)"
           v-show="!attendanceLoading"
           class="attendanceRow"
           @click="selectedAttendanceId = attendance.id">

        <div class="attendanceRecord">
          {{formatClassDateTime(attendance.startDateTime)}} - {{attendance.title}}
        </div>
        <div v-if="attendance.id == selectedAttendanceId" class="action">
          <v-btn flat @click="editAttendance(attendance)">
            <v-icon>mdi-redo</v-icon>
          </v-btn>
        </div>
        <div v-if="attendance.id == selectedAttendanceId"  class="action">
          <v-btn flat @click="attendanceDeleteConfirmDialog = true">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </div>
      </div>

      <v-flex xs12 v-if="attendances.length === 0 && !attendanceLoading"
              class="noAttendance">
        No attendance
      </v-flex>

      <v-flex xs12 v-if="attendanceLoading"  class="noAttendance">
        ... loading ...
      </v-flex>



    </v-layout>

    <v-dialog
      v-model="attendanceDeleteConfirmDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Delete attendance?</v-card-title>

        <v-card-text>
          Confirm that you want to delete this attendance record.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="grey darken-1"
            flat="flat"
            @click="attendanceDeleteConfirmDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="red darken-1"
            flat="flat"
            @click="deleteSelectedAttendance()"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'MemberAttendance',
  props: {
    member: { type: Object },
    gymId: { type: String },
    memberId: { type: String }
  },
  data () {
    return {
      attendances: [],
      attendanceMeta: {},
      activeMonth: null,
      activeMonthText: '',
      attendanceLoading: false,
      nextAttendanceMonthShown: true,
      trainingTimeThisWeek: '...',
      trainingAverage: '...',
      trainingSincePromo: null,
      selectedAttendanceId: null,
      attendanceDeleteConfirmDialog: null
    }
  },
  mounted: async function () {
    this.activeMonth = moment().startOf('month')
    this.setActiveMonth()
    this.loadHoursSinceLastPromo(this.member)

    this.$watch('member', async function (m) {
      console.log('m.rankAwardDate', m.rankAwardDate)
      this.loadHoursSinceLastPromo(m)
    })
  },
  methods: {
    ...mapActions('event-member-attendance', {
      findMemberEventAttendance: 'find'
    }),
    getAttendanceClass(id) {
      return id === this.selectedAttendanceId ? 'selectedAttendanceRow' : ''
    },
    editAttendance(attendance){
      this.$router.push({ name: 'gym-event-checkin', params: { gymId: this.gymId, eventId: attendance.eventId } })
    },
    deleteSelectedAttendance() {
      console.log('deleting attendance ', this.selectedAttendanceId)
      this.attendanceDeleteConfirmDialog = null
      this.$store.dispatch('event-member-attendance/remove', this.selectedAttendanceId)
        .then((result) => {
          this.loadMonthAttendance()
          this.loadHoursSinceLastPromo(this.member)
        })
        .catch((e) => {
          console.log('** Login catch: ', e)
          EventBus.$emit('user-message', { message: `Error deleting attendance: ${e.message}`, type: 'error' })
        })

//      this.selectedAttendance.remove()
    },
    loadHoursSinceLastPromo: async function (m) {
      if (m.rankAwardDate) {
        const sinceLastPromoResults = await this.findMemberEventAttendance({
          query: {
            $limit: 50,
            $customQuery: {
              type: 'TRAINING_TIME_DURING_PERIOD',
              bind: {
                startDateTime: moment(m.rankAwardDate).format('YYYY-MM-DD'),
                endDateTime: moment().add(1, 'day').format('YYYY-MM-DD'),
                gymId: this.gymId,
                memberId: this.memberId
              }
            }
          } })
        this.trainingSincePromo = this.getHoursSpent(sinceLastPromoResults, 1)
      }
    },
    formatClassDateTime (dateTime) {
      return moment(dateTime).format('MMM D, H:mmA')
    },
    changeMonth (diff) {
      this.activeMonth.add(diff, 'months')
      this.setActiveMonth()
    },
    setActiveMonth () {
      this.activeMonthText = this.activeMonth.format('MMMM YYYY')
      this.loadMonthAttendance()
      this.nextAttendanceMonthShown = moment().startOf('month').isAfter(this.activeMonth)
    },
    getHoursSpent (results, divisor) {
      const times = results[0]
      console.log('gethoursspent', times, divisor)
      if (times.length > 0) {
        const hours = times[0].total_time.hours || 0
        const minutes = times[0].total_time.minutes || 0
        let time = (hours + minutes / 60) / divisor
        time = Math.round(time * 10) / 10
        if (isNaN(time)) {
          return '0h'
        } else {
          return time + 'h'
        }
      } else {
        return '0h'
      }
    },
    loadMonthAttendance: async function () {
      this.attendanceLoading = true

      const results = await this.findMemberEventAttendance({
        query: {
          $customQuery: {
            type: 'ATTENDANCE_DURING_PERIOD',
            bind: {
              startDateTime: this.activeMonth.clone().startOf('month').toDate(),
              endDateTime: this.activeMonth.clone().endOf('month').toDate(),
              gymId: this.gymId,
              memberId: this.memberId
            }
          }
        } })

      this.attendances = results[0]
      this.attendanceMeta = results[1]

      const lastWeekTrainingResults = await this.findMemberEventAttendance({
        query: {
          $customQuery: {
            type: 'TRAINING_TIME_DURING_PERIOD',
            bind: {
              startDateTime: moment().subtract(1, 'week').toDate(),
              endDateTime: moment().add(1, 'day').toDate(),
              gymId: this.gymId,
              memberId: this.memberId
            }
          }
        } })

      this.trainingTimeThisWeek = this.getHoursSpent(lastWeekTrainingResults, 1)

      const averageTrainingResults = await this.findMemberEventAttendance({
        query: {
          $customQuery: {
            type: 'TRAINING_TIME_DURING_PERIOD',
            bind: {
              startDateTime: moment().subtract(4, 'week').toDate(),
              endDateTime: moment().add(1, 'day').toDate(),
              gymId: this.gymId,
              memberId: this.memberId
            }
          }
        } })
      this.trainingAverage = this.getHoursSpent(averageTrainingResults, 4)

      this.attendanceLoading = false
    }
  }
}
</script>

<style scoped>

.circle {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  font-size: 24px;
  color: #fff;
  line-height: 75px;
  text-align: center;
  background: #7986cb ;
  font-weight: bold;
}
.circlehelper{
  font-size: 12px;
  font-weight: bold;
  padding-left: 8px;
}
.circlehelperaux{
  font-size: 10px;
  font-weight: normal;
}
.attendanceMonth{
  text-align: center;
  vertical-align: bottom;
  width:100%;

}
.monthArrow{
  margin-left: -20px;
}
.attendanceRecord{
  padding: 5px;
}
.noAttendance{
  text-align: center;
}
.selectedAttendanceRow {
  background-color: #dadada;
  border-radius: 25px;
  padding: 20px;
}
.attendanceRow{
  width: 100%;
}
.action {
  display: inline;
}
</style>
