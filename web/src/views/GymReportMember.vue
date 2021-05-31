<template>
  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card
          title="Member Report"
          text="">

          <v-container class="grey lighten-5">
            <v-row no-gutters>
              <v-data-table
                :headers="headers"
                :items="reportData"
                class="elevation-1"
                :loading="loading"
                @click:row="navigateToMember"
              >
                <template
                  v-slot:item.dateOfBirth="{ item }"
                >
                  {{ item.dateOfBirth | moment("YYYY-MM-DD") }}
                </template>
                <template
                  v-slot:item.rankAwardDate="{ item }"
                >
                  {{ item.rankAwardDate | moment("YYYY-MM-DD") }}
                </template>

                <template
                  v-slot:item.training_time="{ item }"
                >
                  {{ item.training_time | getHoursSpent }}
                </template>

              </v-data-table>
            </v-row>
          </v-container>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'

export default {
  name: 'MembersReport.vue',
  props: {
    gymId: [String, Number]
  },
  data () {
    return {
      fromDateMenu: false,
      fromDateVal: moment().subtract(6, 'month').format('YYYY-MM-DD'),

      toDateMenu: false,
      toDateVal: moment().format('YYYY-MM-DD'),

      loading: false,
      baseHeaders: [
        {
          text: 'First name',
          value: 'firstName'
        },
        {
          text: 'Last name',
          value: 'lastName'
        },
        {
          text: 'Date of birth',
          value: 'dateOfBirth'
        },
        {
          text: 'Rank',
          value: 'rank'
        },
        {
          text: 'Last promotion date',
          value: 'rankAwardDate'
        },
        {
          text: 'Training hours',
          value: 'training_time_in_hours'
        },
        {
          text: 'Attendance count',
          value: 'attendance_count'
        },
        {
          text: 'Signed waiver count',
          value: 'signed_waiver_count'
        }
      ],
      reportData: [],
      headers: [
      ]
    }
  },
  mounted: async function () {
    await this.loadReport()
  },
  filters: {
    getHoursSpent (value) {
      if (!value) return

      // # TODO can I get postgres to only return hours instead of interval broken down by field?
      // 0 years 0 mons 0 days 1 hours 5 mins 0.00 secs
      // hours: 2
      // minutes: 5
      console.log('gethoursspent', value)

      return '0h'

      // const times = results[0]
      // console.log('gethoursspent', times, divisor)
      // if (times.length > 0) {
      //   const hours = times[0].total_time.hours || 0
      //   const minutes = times[0].total_time.minutes || 0
      //   let time = (hours + minutes / 60) / divisor
      //   time = Math.round(time * 10) / 10
      //   if (isNaN(time)) {
      //     return '0h'
      //   } else {
      //     return time + 'h'
      //   }
      // } else {
      // }
    }
  },
  methods: {
    ...mapActions('members', {
      findGymMembers: 'find'
    }),
    navigateToMember: function (member) {
      console.log('Report - open member', member)
      let routeData = this.$router.resolve({ name: 'gym-members-view', params: { gymId: this.gymId, memberId: member.id } })
      window.open(routeData.href, '_blank')
    },
    loadReport: async function () {
      this.loading = true
      const query = {
        $limit: 10000,
        $customQuery: {
          type: 'MEMBER_REPORT',
          bind: { gymId: this.gymId }
        }
      }
      const response = await this.findGymMembers({ query })

      const extractedTags = []
      const processedResponse = []
      for (let i = 0; i < response.length; i++) {
        let member = response[i]

        // attendance_count: (...)
        // dateOfBirth: (...)
        // firstName: (...)
        // lastName: (...)
        // rank: (...)
        // rankAwardDate: (...)
        // tags: (...)
        // training_time_in_hours: (...)
        for (let j = 0; j < member.tags.length; j++) {
          let tag = member.tags[j]
          if (!extractedTags.includes(tag)) {
            extractedTags.push(tag)
          }
          member['tag_' + tag] = true
        }
        processedResponse.push(member)
      }

      this.reportData = processedResponse
      console.log(response)

      // tags
      this.headers = this.baseHeaders
      for (let i = 0; i < extractedTags.length; i++) {
        this.headers.push({
          'text': extractedTags[i],
          'value': 'tag_' + extractedTags[i]
        })
      }
      this.loading = false
    }
  }

}
</script>

<style scoped>

</style>
