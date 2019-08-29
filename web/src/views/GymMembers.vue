<template>
  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card>
          <template slot="header">
            <v-layout align-center justify-space-between fill-height>

              <v-flex>
                <h4 class="title font-weight-light mb-2">
                  Members
                </h4>
              </v-flex>

              <v-flex>

                <v-text-field
                  v-model="search"
                  append-icon="mdi-search"
                  label="Search"
                  placeholder="Search"
                  single-line
                  hide-details
                  pt-0
                  mt-0
                  outline
                ></v-text-field>
              </v-flex>
            </v-layout>
          </template>

          <v-data-table
            :headers="headers"
            :items="members"
            :pagination.sync="pagination"
            :total-items="totalMembers"
            :loading="loading"
          >
            <template
              slot="headerCell"
              slot-scope="{ header }">
              <span
                class="subheading font-weight-light text--darken-3"
                v-text="header.text"
              />
            </template>
            <template
              slot="items"
              slot-scope="{ item }">
              <tr @click="navigateToMember"
                  :data-member-id="item.id">
                <td>{{ item.firstName }}</td>
                <td>{{ item.lastName  }}</td>
              </tr>
            </template>

          </v-data-table>

        </material-card>

        <v-btn @click="navigateToAddMember" fab
               color="success">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

// todo: search?
export default {
  name: 'GymMembers',
  props: ['gymId'],
  data () {
    return {
      loading: true,
      search: '',
      pagination: {
        rowsPerPage: 5
      },
      totalMembers: 0,
      members: [],
      headers: [
        {
          sortable: true,
          text: 'First Name',
          value: 'firstName'
        },
        {
          sortable: true,
          text: 'Last Name',
          value: 'lastName'
        }
      ]
    }
  },

  watch: {
    pagination: {
      handler () {
        //        console.log('pagination updated: ', this.pagination)
        this.dataFromApi()
      },
      deep: true
    },
    search: {
      handler () {
        this.dataFromApi()
      }
    }
  },
  methods: {
    ...mapActions('members', {
      findGymMembers: 'find'
    }),
    //    ...mapState('members'),
    navigateToAddMember: function () {
      this.$router.push({ name: 'gym-members-add', params: { gymId: this.gymId } })
    },
    navigateToMember: function (event) {
      //      console.log("click for ", event)
      const memberId = event.currentTarget.dataset['memberId']

      this.$router.push({ name: 'gym-members-view', params: { gymId: this.gymId, memberId: memberId } })
    },
    dataFromApi: function () {
      const self = this
      const { sortBy, descending, page, rowsPerPage } = this.pagination

      this.loading = true
      const query = {
        $limit: rowsPerPage,
        gymId: this.gymId
      }

      if (sortBy) {
        query.$sort = { }
        query.$sort[sortBy] = descending ? -1 : 1
      }

      query.$limit = rowsPerPage
      if (page > 1) {
        query.$skip = rowsPerPage * (page - 1)
      }
      if (this.search != null && this.search.length > 1) {
        query['$or'] = [
          { lowerFirstName: { $like: this.search.toLowerCase() + '%' } },
          { lowerNickname: { $like: this.search.toLowerCase() + '%' } },
          { lowerLastName: { $like: this.search.toLowerCase() + '%' } }
        ]
        //        query['$or'] = [
        //          { lowerFirstName: { $regex: '^' + this.escapeRegExp(this.search.toLowerCase()) } },
        //          { lowerLastName: { $regex: '^' + this.escapeRegExp(this.search.toLowerCase()) } }
        //        ]
      }

      //      console.log(query)
      this.findGymMembers({ query }).then(function (results) {
        //        console.log('found results:  ',results)
        self.totalMembers = results.total
        self.members = results.data
        self.loading = false
      })
    }
  },

  mounted () {
    //    console.log("Looking for members...")
    this.dataFromApi()
  }
}
</script>

<style scoped>
  #app .input-group input {
    margin-bottom: 2rem;
  }

</style>
