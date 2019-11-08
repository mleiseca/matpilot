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

      <v-flex xs12 v-show="!attendanceLoading">

        <div v-for="attendance in attendances"
             v-bind:key="attendance.id"
             class="attendanceRecord"
             @click="openEvent(attendance.eventId)">
          {{formatClassDateTime(attendance.startDateTime)}} - {{attendance.title}}
        </div>
        <div v-if="attendances.length === 0" class="noAttendance">
          No attendance
        </div>
      </v-flex>
      <v-flex xs12 v-show="attendanceLoading" class="noAttendance">
        ... loading ...
      </v-flex>
    </v-layout>
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
      trainingSincePromo: null
    }
  },
  mounted: async function () {
    this.activeMonth = moment().startOf('month')
    this.setActiveMonth()
    //    await this.getMember(this.memberId).then(result => {
    //      this.member = result
    //    })

    //    TODO:
    //    console.log('m.rankAwardDate', this.member.rankAwardDate)
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
    openEvent (eventId) {
      console.log('opening eventid: ', eventId)
      this.$router.push({ name: 'gym-event-checkin', params: { gymId: this.gymId, eventId: eventId } })
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
          $limit: 50,
          $customQuery: {
            type: 'ATTENDANCE_DURING_PERIOD',
            bind: {
              startDateTime: this.activeMonth.clone().startOf('month').format('YYYY-MM-DD'),
              endDateTime: this.activeMonth.clone().endOf('month').format('YYYY-MM-DD'),
              gymId: this.gymId,
              memberId: this.memberId
            }
          }
        } })

      this.attendances = results[0]
      this.attendanceMeta = results[1]

      const lastWeekTrainingResults = await this.findMemberEventAttendance({
        query: {
          $limit: 50,
          $customQuery: {
            type: 'TRAINING_TIME_DURING_PERIOD',
            bind: {
              startDateTime: moment().subtract(1, 'week').format('YYYY-MM-DD'),
              endDateTime: moment().add(1, 'day').format('YYYY-MM-DD'),
              gymId: this.gymId,
              memberId: this.memberId
            }
          }
        } })

      console.log(lastWeekTrainingResults)
      this.trainingTimeThisWeek = this.getHoursSpent(lastWeekTrainingResults, 1)

      const averageTrainingResults = await this.findMemberEventAttendance({
        query: {
          $limit: 50,
          $customQuery: {
            type: 'TRAINING_TIME_DURING_PERIOD',
            bind: {
              startDateTime: moment().subtract(4, 'week').format('YYYY-MM-DD'),
              endDateTime: moment().add(1, 'day').format('YYYY-MM-DD'),
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
</style>
