<template>
  <span>
    <input type="text" class="time start" data-time-format="H:i"/> and end at
    <input type="text" class="time end" data-time-format="H:i"/>
  </span>
</template>

<script>
const $ = require('jquery')
window.jQuery = $
require('timepicker/dist/jquery.timepicker.min')
require('datepair.js/dist/datepair.min')
require('datepair.js/dist/jquery.datepair.min')

export default {
  props: ['start', 'end'],

  data () {
    return {
      startTimeElement: null,
      endTimeElement: null,
      thisDatePicker: null
    }
  },
  watch: {
    start: function (newVal) {
      // eslint-disable-next-line
      $(this.$el).find('.start').val(newVal)
      // eslint-disable-next-line
      $(this.$el).datepair("refresh")
    },
    end: function (newVal) {
      // eslint-disable-next-line
      $(this.$el).find('.end').val(newVal)
      // eslint-disable-next-line
      $(this.$el).datepair("refresh")
    }
  },
  mounted: function () {
    const self = this

    // eslint-disable-next-line
    let root = $(this.$el)

    root.find('.time').timepicker({
      'autoclose': true,
      'showDuration': true,
      // 'minTime': '5:00am',
      'step': 5,
      'timeFormat': 'g:ia'
    })

    // eslint-disable-next-line
    root.datepair();

    root.on('change', function () {
      // eslint-disable-next-line
      self.$emit('update-times', {
        // eslint-disable-next-line
        start: $(self.$el).find('.start').val(),
        // eslint-disable-next-line
        end: $(self.$el).find('.end').val(),
      })
    })
  },
  beforeDestroy: function () {
    // eslint-disable-next-line
    $(this.$el).datepair("refresh")
  }
}
</script>

<style>
  @import "../../node_modules/timepicker/dist/jquery.timepicker.css";

</style>
