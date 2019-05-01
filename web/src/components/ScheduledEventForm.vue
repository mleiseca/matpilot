<template>
  <v-form>
    <v-container py-0>
      <v-layout wrap>
        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Title"
            v-model="form.title"/>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Description (optional)"
            v-model="form.description"/>
        </v-flex>

        <!--TODO: add parts of mdc-form-field ?-->

        <v-flex xs12 sm6 md4>
          <v-dialog
            ref="dialogStartDate"
            v-model="modalStartDate"
            :return-value.sync="form.startDate"
            persistent
            lazy
            full-width
            width="290px">
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="form.startDate"
                label="Schedule starts"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="form.startDate" scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="modalStartDate= false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.dialogStartDate.save(form.startDate)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-flex>


        <v-flex xs12 sm6 md4>
          <v-dialog
            ref="dialogEndDate"
            v-model="modalEndDate"
            :return-value.sync="form.endDate"
            persistent
            lazy
            full-width
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
              <v-btn flat color="primary" @click="modalEndDate = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.dialogEndDate.save(form.endDate)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-flex>
          <!--<v-menu-->
            <!--ref="menuEndDate"-->
            <!--v-model="menuEndDate"-->
            <!--:close-on-content-click="false"-->
            <!--:nudge-right="40"-->
            <!--:return-value.sync="form.endDate"-->
            <!--lazy-->
            <!--persistent-->
            <!--transition="scale-transition"-->
            <!--offset-y-->
            <!--full-width-->
            <!--min-width="290px"-->
          <!--&gt;-->
            <!--<template v-slot:activator="{ on }">-->
              <!--<v-text-field-->
                <!--v-model="form.endDate"-->
                <!--clearable-->
                <!--label="and repeats until (optional)"-->
                <!--prepend-icon="mdi-calendar"-->
                <!--readonly-->
                <!--v-on="on"-->
              <!--&gt;</v-text-field>-->
            <!--</template>-->
            <!--<v-date-picker v-model="form.endDate" no-title scrollable>-->
              <!--<v-spacer></v-spacer>-->
              <!--<v-btn flat color="primary" @click="menu = false">Cancel</v-btn>-->
              <!--<v-btn flat color="primary" @click="$refs.menuEndDate.save(form.endDate)">OK</v-btn>-->
            <!--</v-date-picker>-->
          <!--</v-menu>-->
        <!--<div class="datepicker">-->
          <!--&lt;!&ndash;TODO: add mdc-floating-label ?&ndash;&gt;-->
          <!--<label for="startDate">Schedule starts:</label>-->
          <!--<datepicker v-model="form.startDate" id="startDate" :format="dateFormat" wrapper-class="calendar-wrapper " :clear-button="true"></datepicker>-->
        <!--</div>-->

        <!--<div class="datepicker">-->
          <!--<label for="endDate">and repeats until (optional)</label>-->
          <!--<datepicker v-model="form.endDate" id="endDate" :format="dateFormat" wrapper-class="calendar-wrapper" :clear-button="true"></datepicker>-->
        <!--</div>-->

        <!--<div>-->
          <!--Events start at <mc-time-range-picker @update-times="updateTimes" :start="form.startTime" :end="form.endTime" ></mc-time-range-picker>-->
        <!--</div>-->
        <v-flex xs11 sm5>
          <v-dialog
            ref="startTimeDialog"
            v-model="modalStartTime"
            :return-value.sync="form.startTime"
            persistent
            lazy
            full-width
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="form.startTime"
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
              <v-btn flat color="primary" @click="modalStartTime = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.startTimeDialog.save(form.startTime)">OK</v-btn>
            </v-time-picker>
          </v-dialog>
        </v-flex>
        <v-flex xs11 sm5>
          <v-dialog
            ref="endTimeDialog"
            v-model="modalEndTime"
            :return-value.sync="form.endTime"
            persistent
            lazy
            full-width
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="form.endTime"
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
              <v-btn flat color="primary" @click="modalEndTime = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.endTimeDialog.save(form.endTime)">OK</v-btn>
            </v-time-picker>
          </v-dialog>
        </v-flex>

        <v-container fluid>
          <div v-for="day in weekdays" v-bind:key="day.value">
            <v-checkbox :label="day.text" v-model="form.byweekday[day.value]" />
          </div>
        </v-container>

        <v-flex xs12 text-xs-right>
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
import moment from 'moment'
import { RRule, rrulestr } from 'rrule'

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
      modalEndTime: false
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
      const pad = function (num) {
        let norm = Math.floor(Math.abs(num))
        return (norm < 10 ? '0' : '') + norm
      }
      return dateTime +  'T00:00:00'
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

      const startTime = new Date('1970-01-01T' + this.form.startTime)
      const dtstart = moment(this.form.startDate)
        .startOf('day').utcOffset(0).hours(startTime.getHours()).minutes(startTime.getMinutes()).toDate()

      const rule = new RRule({
        freq: 2,
        //        freq: this.form.repeatPeriod,
        interval: 1,
        //        interval: this.form.repeatEvery,
        byweekday: this.parseWeekdays(this.form.byweekday),
        dtstart: dtstart,
        tzid: 'America/Chicago' // TODO: should not hardcode
      })

      const se = this.scheduledEvent ? this.scheduledEvent : {}
      se.title = this.form.title
      se.description = this.form.description

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
      se.rrules = rule.toString()

      // TODO: validation
      console.log('scheduled-event saved!', se)
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

  .repeatPeriodSelector {
    .width: 10em;
  }

  /*.mdc-form-field {*/
    /*font-family: Roboto, sans-serif;*/
    /*-moz-osx-font-smoothing: grayscale;*/
    /*-webkit-font-smoothing: antialiased;*/
    /*font-size: 0.875rem;*/
    /*line-height: 1.25rem;*/
    /*font-weight: 400;*/
    /*letter-spacing: 0.01786em;*/
    /*text-decoration: inherit;*/
    /*text-transform: inherit;*/
    /*color: rgba(0, 0, 0, 0.87);*/
    /*!* @alternate *!*/
    /*color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));*/
    /*display: inline-flex;*/
    /*align-items: center;*/
    /*vertical-align: middle; }*/
  /*.mdc-form-field > label {*/
    /*order: 0;*/
    /*margin-right: auto;*/
    /*padding-left: 4px; }*/
  /*[dir="rtl"] .mdc-form-field > label, .mdc-form-field[dir="rtl"] > label {*/
    /*margin-left: auto;*/
    /*padding-right: 4px; }*/

</style>
