<template>
  <v-list-tile v-on:click='presentChange()'>
    <v-list-tile-action >
      <transition name="bounce">
        <v-icon color="pink" v-if="present">mdi-check-bold</v-icon>
      </transition>
    </v-list-tile-action>

    <v-list-tile-content>
      <template v-if="member.nickname">
        {{ member.nickname }}
      </template>
      <template v-else>
        {{ member.firstName }}
      </template>
       {{ member.lastName }}
    </v-list-tile-content>

  </v-list-tile>
</template>

<script>
export default {
  name: 'CheckinMemberRow',
  props: {
    attendanceRecords: Array,
    member: Object
  },
  data () {
    return {
      eventMemberAttendanceId: null,
      present: false
    }
  },
  mounted () {
    if (this.attendanceRecords) {
      this.updateAttendanceRecords(this.attendanceRecords)
    }
  },
  methods: {
    updateAttendanceRecords (value) {
      for (let i = 0; i < value.length; i++) {
        let record = value[i]
        if (record.memberId === this.member.id) {
          this.present = true
          this.eventMemberAttendanceId = record.eventMemberAttendanceId
          return
        }
      }
      // No record found - member isn't attending
      this.eventMemberAttendanceId = null
      this.present = false
    },
    presentChange () {
      let value = !this.present
      console.log('CHANGING ATTENDANCE ', {
        memberId: this.member.id,
        eventMemberAttendanceId: this.eventMemberAttendanceId,
        value: value
      })
      this.$emit('attendance-change', {
        memberId: this.member.id,
        eventMemberAttendanceId: this.eventMemberAttendanceId,
        value: value
      })
    }
  },
  watch: {
    attendanceRecords: {
      handler: function (value) {
        this.updateAttendanceRecords(value)
      },
      deep: true
    }
  }
}

</script>

<style scoped>
  .bounce-enter-active {
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
