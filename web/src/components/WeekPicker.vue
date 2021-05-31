<template>
  <div>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="1"> <v-icon v-on:click="weekChange(-1)" v-if="canMoveToPreviousWeek">mdi-chevron-left</v-icon> </v-col>
        <v-col cols="7" align="center"> Week starting {{ startDateStr }} </v-col>
        <v-col cols="1"> <v-icon  v-on:click="weekChange(1)" v-if="canMoveToNextWeek">mdi-chevron-right</v-icon> </v-col>
      </v-row>
    </v-container>
   </div>
</template>

<script>

import { isNil } from 'lodash'

export default {
  name: 'WeekPicker',
  props: ['startDate', 'allowPastWeeks', 'maxStartDate'],
  model: {
    prop: 'startDate'
  },
  data () {
    return {
    }
  },
  methods: {
    weekChange: function (amount) {
      this.$emit('week-change', amount)
    }
  },
  computed: {
    startDateStr: function () {
      return this.startDate.format('dddd MMMM Do, YYYY')
    },
    canMoveToPreviousWeek: function () {
      return this.allowPastWeeks || this.startDate.isAfter()
    },
    canMoveToNextWeek: function () {
      return isNil(this.maxStartDate) || this.startDate.clone().add(7, 'days').isBefore(this.maxStartDate)
    }
  }
}
</script>

<style>
</style>
