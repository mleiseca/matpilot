<template>
  <v-form ref="form">
    <v-container py-0>
      <v-layout wrap>
        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Title"
            :rules="[rules.required]"
            v-model="form.title"/>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Description (optional)"
            v-model="form.description"/>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Maximum Attendance (optional)"
            :rules="[rules.integer]"
            :clearable="true"
            v-model="form.maximumAttendance"/>
        </v-flex>

        <!--TODO: add parts of mdc-form-field ?-->

        <v-flex xs12 sm6 md4>
          <v-dialog
            ref="dialogStartDate"
            v-model="modalStartDate"
            :return-value.sync="form.startDate"
            persistent
            width="290px">
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="form.startDate"
                :rules="[rules.required]"
                label="Schedule starts"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="form.startDate" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modalStartDate= false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.dialogStartDate.save(form.startDate)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-flex>

        <v-flex xs12 sm6 md4>
          <v-dialog
            ref="dialogEndDate"
            v-model="modalEndDate"
            :return-value.sync="form.endDate"
            persistent
            width="290px">
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="form.endDate"
                label="and repeats until (optional)"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="form.endDate" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modalEndDate = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.dialogEndDate.save(form.endDate)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-flex>

        <v-flex xs11 sm5>
          <v-dialog
            ref="startTimeDialog"
            v-model="modalStartTime"
            :return-value.sync="form.startTime"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="form.startTime"
                :rules="[rules.required]"
                label="Start time"
                prepend-icon="mdi-clock-outline"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="modalStartTime"
              v-model="form.startTime"
              format="24hr"
              full-width
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modalStartTime = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.startTimeDialog.save(form.startTime)">OK</v-btn>
            </v-time-picker>
          </v-dialog>
        </v-flex>
        <v-flex xs11 sm5>
          <v-dialog
            ref="endTimeDialog"
            v-model="modalEndTime"
            :return-value.sync="form.endTime"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="form.endTime"
                :rules="[rules.required]"
                label="End time"
                prepend-icon="mdi-clock-outline"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="modalEndTime"
              v-model="form.endTime"
              format="24hr"
              full-width
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modalEndTime = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.endTimeDialog.save(form.endTime)">OK</v-btn>
            </v-time-picker>
          </v-dialog>
        </v-flex>

        <v-container fluid>
          <div v-for="day in weekdays" v-bind:key="day.value">
            <v-checkbox :label="day.text" v-model="form.byweekday[day.value]" />
          </div>
        </v-container>

        <v-flex xs12 text-right>
          <v-btn
            class="mx-0 font-weight-light"
            color="success"
            @click="save">
            Save
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>

</template>

<script>
import { isNil } from 'lodash'
import moment from 'moment'
import { RRule, rrulestr } from 'rrule'
import { EventBus } from './../event-bus.js'

export default {
  name: 'ScheduleForm',
  props: {
    //    Note: if you provide a vuex member object, the vuex object will be included with the 'member-save' event
    //    If you don't provide a member, you will get back just a data object.
    scheduledEvent: Object
  },
  data () {
    return {
      dateFormat: 'MMM d, yyyy',
      repeatPeriods: [
        { value: '2', text: 'week' },
        { value: '1', text: 'month' }
        // ,{ value: '0', text: 'year' }
      ],
      weekdays: [
        { value: '0', text: 'Monday' },
        { value: '1', text: 'Tuesday' },
        { value: '2', text: 'Wednesday' },
        { value: '3', text: 'Thursday' },
        { value: '4', text: 'Friday' },
        { value: '5', text: 'Saturday' },
        { value: '6', text: 'Sunday' }
      ],
      form: {
        title: '',
        description: '',
        maximumAttendance: null,
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        byweekday: [],
        repeatPeriod: null
      },
      modalStartDate: false,
      modalEndDate: false,
      modalStartTime: false,
      modalEndTime: false,
      rules: {
        required: value => !!value || 'Required.',
        integer: value => {
          const pattern = /^\d*$/
          // console.log(value, pattern.test(value))
          return isNil(value) || value.length === 0 || pattern.test(value) || 'Invalid.'
        }
      }
    }
  },
  mounted: function () {
    this.$watch('scheduledEvent', se => {
      console.log(se)

      if (!se) {
        return
      }
      if (se.title) {
        this.form.title = se.title
      }

      if (se.description) {
        this.form.description = se.description
      }

      if (se.maximumAttendance !== undefined) {
        this.form.maximumAttendance = se.maximumAttendance
      }

      if (se.startDate) {
        this.form.startDate = moment(se.startDate).format('YYYY-MM-DD')
      }

      if (se.endDate) {
        this.form.endDate = moment(se.endDate).format('YYYY-MM-DD')
      }

      if (se.startTime) {
        this.form.startTime = se.startTime
      }
      if (se.endTime) {
        this.form.endTime = se.endTime
      }

      if (this.scheduledEvent.rrules) {
        const rule = rrulestr(se.rrules)
        this.form.byweekday = this.formatWeekdays(rule.options.byweekday)
        this.form.repeatPeriod = rule.options.freq.toString()
        this.form.repeatPeriod = '2'
      }
    }, { immediate: true })
  },
  methods: {
    updateTimes (datePair) {
      this.form.startTime = datePair.start
      this.form.endTime = datePair.end
    },
    formatDateTime (dateTime) {
      return dateTime + 'T00:00:00'
    },
    parseWeekdays (dayArray) {
      const result = []
      for (let i = 0; i < dayArray.length; i++) {
        if (dayArray[i]) {
          result.push(i)
        }
      }
      return result
    },
    formatWeekdays (dayArray) {
      const result = []
      for (let i = 0; i < dayArray.length; i++) {
        result[dayArray[i]] = true
      }
      return result
    },
    save: function (event) {
      event.preventDefault()
      if (!this.$refs.form.validate()) {
        EventBus.$emit('user-message', { message: 'Please correct the errors above', type: 'error' })
        return
      }
      const startTime = new Date('1970-01-01T' + this.form.startTime)
      const dtstart = moment(this.form.startDate)
        .startOf('day').utcOffset(0).hours(startTime.getHours()).minutes(startTime.getMinutes()).toDate()

      let selectedWeekdays = this.parseWeekdays(this.form.byweekday)

      const se = this.scheduledEvent ? this.scheduledEvent.clone() : {}

      if (selectedWeekdays.length > 0) {
        const rule = new RRule({
          freq: RRule.WEEKLY,
          byweekday: selectedWeekdays,
          interval: 1,
          //        interval: this.form.repeatEvery,
          //        freq: this.form.repeatPeriod,

          dtstart: dtstart
        })
        se.rrules = rule.toString()
      } else {
        se.rrules = ''
      }

      se.title = this.form.title
      se.description = this.form.description
      se.maximumAttendance = this.form.maximumAttendance || null

      // TODO: timezone should come from the gym
      se.timezone = 'America/Chicago'
      se.startDate = this.formatDateTime(this.form.startDate)
      if (this.form.endDate) {
        se.endDate = this.formatDateTime(this.form.endDate)
      } else {
        se.endDate = null
      }
      se.startTime = this.form.startTime
      se.endTime = this.form.endTime

      this.$emit('scheduled-event-save', se)
    }
  }
}
</script>

<style scoped>
  .calendar-wrapper{
    color: black;
  }

  #startDate {
    border: 0;
    border-bottom: 1px solid;
  }

  .datepicker {
    margin-right: .5rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
  }

  h1 {
    padding-left: .5rem;
  }

</style>
