<template>

  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card color="green">
          <v-flex slot="header">
            <v-layout justify-center wrap>
              <v-flex sm6>
                Check In <br>TODO CLASS NAME:
              </v-flex>
              <v-flex sm6 >
                <v-text-field
                  v-model="search"
                  class="mr-0 mt-0"
                  append-icon="mdi-search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-data-table
            :headers="headers"
            :items="members"
            :pagination.sync="pagination"
            :total-items="totalMembers"
            :loading="loading"
            :rows-per-page-items="[10, 25, 50]">

            <template v-slot:items="props">
              <!--<td >{{ props.item.id }} {{ props.item.attendance }}</td>-->
              <td>
                <v-checkbox v-model="attendance[props.item.id]" :label="props.item.firstName + ' ' + props.item.lastName"></v-checkbox>
              </td>
              <!--<td >{{ props.item.firstName }} {{ props.item.lastName}}</td>-->
            </template>
            <!--<template v-slot:no-results>-->
              <!--<v-alert :value="true" color="error" icon="warning">-->
                <!--Your search for "{{ search }}" found no results.-->
              <!--</v-alert>-->
            <!--</template>-->
          </v-data-table>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
const { paramsForServer } = require('feathers-hooks-common')

export default {
  name: 'GymEventCheckin',
  props: ['gymId', 'eventId'],
  data () {
    return {
      totalMembers: 0,
      members: [],
      loading: true,
      pagination: {},
      search: '',
      attendance: {},
      attendanceRecords: {},
      headers: [
        {
          sortable: false,
          text: 'Member',
        }
      ]
    }
  },
  watch: {
    pagination: {
      handler () {
        this.getDataFromApi()
          .then(data => {
            this.members = data.data
            this.totalMembers = data.total

            const attendance = []
            const attendanceRecords = []
            this.members.forEach(function(member) {
              attendance[member.id] = member.attendance
              attendanceRecords[member.id] = member.attendance
            })
            this.attendance = attendance
            this.attendanceRecords = attendanceRecords
          })
      },
      deep: true
    },
    search: {
      handler () {
        this.getDataFromApi()
          .then(data => {
            this.members = data.data
            this.totalMembers = data.total

            const attendance = []
            const attendanceRecords = []
            this.members.forEach(function(member) {
              attendance[member.id] = member.attendance
              attendanceRecords[member.id] = member.attendance
            })
            this.attendance = attendance
            this.attendanceRecords = attendanceRecords
          })
      }
    },
    attendance: {
      handler () {
        console.log(this.attendance)
        for (const memberId in this.attendance) {
          if (this.attendance[memberId] === true) {
            console.log('Adding memberId', memberId)
            const attendance = {
              eventId: this.eventId,
              gymId: this.gymId,
              memberId: memberId,
              text: 'asdf'
            }
            this.$store.dispatch('event-member-attendance/create', attendance)
              .then((result) => {
                console.log('Created...result:', result)
                this.attendance[result.memberId] = result
                this.attendanceRecords[result.memberId] = result
              })

          } else if (this.attendance[memberId] === false) {
            console.log('Deleting memberId', memberId)
            this.$store.dispatch('event-member-attendance/remove', this.attendanceRecords[memberId].id)
              .then((result) => {
                console.log('Deleted...result:', result)
                this.attendance[memberId] = null
                this.attendanceRecords[memberId] = null
              })
          }
        }
      },
      deep: true
    },
  },
  methods: {
    ...mapActions('members', {
      findGymMembers: 'find'
    }),
    ...mapActions('event-member-attendance', {
      findMemberEventAttendance: 'find'
    }),
    getDataFromApi: async function () {
      const { page, rowsPerPage } = this.pagination
      this.loading = true

      const query = {
        gymId: this.gymId
      }

      if (rowsPerPage > 0) {
        query['$limit'] = rowsPerPage
        query['$skip'] = rowsPerPage * (page - 1)
      }

      if (this.search.length > 0) {
        // TODO: this needs to be case insensitive
        query['$or'] = [
          { firstName: { $like: '%' + this.search + '%'}},
          { lastName: { $like: '%' + this.search + '%'}}
        ]
      }

      const foundMembers = await this.findGymMembers(paramsForServer({
        query,
        populate: {
          entity: 'event-member-attendance',
          id: this.eventId
        }
      }))

      console.log("members:" , foundMembers)

      this.loading = false
      return foundMembers
    },
    toggleAttendance: function(memberId) {
      console.log('toggling memberId: ', memberId)
    }
  }
}
</script>
