<template>
  <div>
    <form>
      <div>
        <mdc-textfield v-model="scheduledEvent.title" label="Title" />
      </div>
      <div>
        <mdc-textfield v-model="scheduledEvent.description" label="Description (optional)" />
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
        Repeats On
        <div v-for="day in weekdays">
          <mdc-checkbox :label="day.text" v-model="form.byweekday[day.value]" />
        </div>

        <p class="repeats-every">Repeat Every</p>
        <div class="flex-wrapper repeats-every">

          <mdc-textfield v-model="form.repeatEvery" label="Frequency" />

          <!--<div class="small">-->
          <mdc-select v-model="form.repeatPeriod" label="Repeat every" class="repeatPeriodSelector">
            <option v-for="repeatPeriod in repeatPeriods" :value="repeatPeriod.value">
              {{ repeatPeriod.text }}
            </option>
          </mdc-select>

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
    scheduledEvent: {

      type: Object,
      default: function () {
        return new this.$FeathersVuex.ScheduledEvent({
          title: '',
          description: ''
        })
      }
    }
  },
  data () {
    return {
      dateFormat: 'MMM d, yyyy',
      repeatPeriods: [
        { value: '2', text: 'week' },
        { value: '1', text: 'month' },
        { value: '0', text: 'year' }
      ],
      weekdays: [
        { value: 0, text: 'Monday' },
        { value: 1, text: 'Tuesday' },
        { value: 2, text: 'Wednesday' },
        { value: 3, text: 'Thursday' },
        { value: 4, text: 'Friday' },
        { value: 5, text: 'Saturday' },
        { value: 6, text: 'Sunday' }
      ],
      form: {
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        byweekday: [],
        repeatEvery: null,
        repeatPeriod: null
      }
    }
  },
  methods: {
    updateTimes (datePair) {
      this.form.startTime = datePair.start
      this.form.endTime = datePair.end
    },
    formatDateTime(dateTime) {
      const pad = function(num) {
        let norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
      }
      return dateTime.getFullYear() +
        '-' + pad(dateTime.getMonth() + 1) +
        '-' + pad(dateTime.getDate()) +
        'T' + pad(0) +
        ':' + pad(0) +
        ':' + pad(0)
    },
    parseWeekdays(dayArray) {
      const result = []
      for(let i = 0; i < dayArray.length; i++) {
        if (dayArray[i]) {
          result.push(i)
        }
      }
      return result
    },
    save: function (event) {
      event.preventDefault()

      const startTime = new Date('1970-01-01T' + this.form.startTime);
      const dtstart = moment(this.form.startDate)
        .startOf('day').utcOffset(0).hours(startTime.getHours()).minutes(startTime.getMinutes()).toDate()

      const rule = new RRule({
        freq: this.form.repeatPeriod,
        interval: this.form.repeatEvery,
        byweekday: this.parseWeekdays(this.form.byweekday),
        dtstart: dtstart,
        tzid: 'America/Chicago' // TODO: should not hardcode
      });

      // TODO: this should come from the gym
      this.scheduledEvent.timezone = 'America/Chicago'
      this.scheduledEvent.startDate = this.formatDateTime(this.form.startDate)
      if (this.form.endDate) {
        this.scheduledEvent.endDate = this.formatDateTime(this.form.endDate)
      } else {
        this.scheduledEvent.endDate = null
      }
      this.scheduledEvent.startTime = this.form.startTime
      this.scheduledEvent.endTime = this.form.endTime
      this.scheduledEvent.rrules = rule.toString()

      // TODO: validation
      console.log('scheduled-event saved!', this.scheduledEvent)
      this.$emit('scheduled-event-save', this.scheduledEvent)
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
