<template>
  <v-container grid-list-md>

  <v-layout wrap>

    <v-flex shrink>
      <v-switch pt-0 mt-0
                v-model="present"
                @change="presentChange"
      ></v-switch>
    </v-flex>
    <v-flex px-0>
      {{ member.firstName }} {{ member.lastName }}
    </v-flex>
  </v-layout>
  </v-container>
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
      //      console.log('UDPATED ATTENDANCE REOCRDS', value)
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
    presentChange (value) {
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
