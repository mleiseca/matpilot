<template>
  <div>
    <form>
      <div>
        <mdc-textfield v-model="form.title" label="Title" />
      </div>
      <div>
        <mdc-textfield v-model="form.description" label="Description (optional)" />
      </div>

      <!--TODO: add parts of mdc-form-field ?-->
      <div class="datepicker">
        <!--TODO: add mdc-floating-label ?-->
        <label for="startDate">Schedule starts:</label>
        <datepicker v-model="form.startDate" id="startDate" :format="dateFormat" wrapper-class="calendar-wrapper " :clear-button="true"></datepicker>
      </div>

      <div class="datepicker">
        <label for="endDate">and repeats until (optional)</label>
        <datepicker v-model="form.endDate" id="endDate" :format="dateFormat" wrapper-class="calendar-wrapper" :clear-button="true"></datepicker>
      </div>

      <div>
        Events start at <mc-time-range-picker @update-times="updateTimes" :start="form.startTime" :end="form.endTime" ></mc-time-range-picker>
      </div>

      <div>

          <!--<mdc-select v-model="form.repeatPeriod" label="Repeats every" class="repeatPeriodSelector">-->
            <!--<option v-for="repeatPeriod in repeatPeriods" :value="repeatPeriod.value">-->
              <!--{{ repeatPeriod.text }}-->
            <!--</option>-->
          <!--</mdc-select>-->

          <div>
            Repeats every
          </div>

          <!--<mdc-radio v-model="form.repeatPeriod" name="repeatPeriodRadio" value="1" label="Week" checked></mdc-radio>-->
          <!--<mdc-radio v-model="form.repeatPeriod" name="repeatPeriodRadio" value="2" label="Month"></mdc-radio>-->

          <!--<mdc-radio v-model="form.repeatPeriod"-->
                     <!--name="repeatPeriodRadio"-->
                     <!--v-for="repeatPeriod in repeatPeriods"-->
                     <!--:value="repeatPeriod.value"-->
                     <!--:label="repeatPeriod.text"-->
                     <!--class="repeatPeriodSelector">-->
          <!--</mdc-radio>-->

          <div v-for="day in weekdays" v-bind:key="day.value">
            <mdc-checkbox :label="day.text" v-model="form.byweekday[day.value]" />
          </div>

      </div>
      <div>
        <mdc-button @click="save" raised>Save</mdc-button>
      </div>
    </form>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import TimeRangePicker from '@/components/TimeRangePicker'
import moment from 'moment'
import { RRule, rrulestr } from 'rrule'

export default {
  name: 'ScheduleForm',
  components: {
    'mc-time-range-picker': TimeRangePicker,
    'datepicker': Datepicker
  },
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
      }
    }
  },
  mounted: function () {
    console.log('mounted', this.scheduledEvent)

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
        this.form.startDate = moment(se.startDate).toDate()
      }

      if (se.endDate) {
        this.form.endDate = moment(se.endDate).toDate()
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
      return dateTime.getFullYear() +
        '-' + pad(dateTime.getMonth() + 1) +
        '-' + pad(dateTime.getDate()) +
        'T' + pad(0) +
        ':' + pad(0) +
        ':' + pad(0)
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