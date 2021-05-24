<template>
  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card>
          <template slot="header">
            <v-layout align-center justify-space-between fill-height>

              <v-flex>
                <h4 class="text-h6 font-weight-light mb-2">
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
            :options.sync="options"
            :server-items-length="totalMembers"
            :loading="loading"
            :footer-props="{itemsPerPageOptions:rowsPerPageItems }"
            @click:row="navigateToMember"
          >
            <template
              slot="headerCell"
              slot-scope="{ header }">
              <span
                class="subheading font-weight-light text--darken-3"
                v-text="header.text"
              />
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
      rowsPerPageItems: [5, 10, 25, 50],
      options: {
        itemsPerPage: 5
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
    options: {
      handler () {
        //        console.log('pagination updated: ', this.pagination)
        this.dataFromApi()
      },
      deep: true
    },
    search: {
      handler () {
        this.options.page = 1
        this.dataFromApi()
      }
    }
  },
  methods: {
    ...mapActions('members', {
      findGymMembers: 'find'
    }),
    navigateToAddMember: function () {
      this.$router.push({ name: 'gym-members-add', params: { gymId: this.gymId } })
    },
    navigateToMember: function (member) {
      this.$router.push({ name: 'gym-members-view', params: { gymId: this.gymId, memberId: member.id } })
    },
    dataFromApi: function () {
      const self = this
      const { sortBy, sortDesc, page, itemsPerPage } = this.options

      this.loading = true
      const query = {
        $limit: itemsPerPage,
        gymId: this.gymId
      }

      if (sortBy.length > 0) {
        query.$sort = { }
        // TODO: We could add each field here...
        const isDesc = sortDesc.length === 0 ? false : sortDesc[0]
        query.$sort[sortBy[0]] = isDesc ? -1 : 1
      }

      if (page > 1) {
        const isDescSkip = sortDesc.length === 0 ? false : sortDesc[0]

        query.$skip = (isDescSkip ? -1 : 1) * (page - 1) * itemsPerPage
      }
      if (this.search != null && this.search.length > 1) {
        query['$or'] = [
          { lowerFirstName: { $like: this.search.toLowerCase() + '%' } },
          { lowerNickname: { $like: this.search.toLowerCase() + '%' } },
          { lowerLastName: { $like: this.search.toLowerCase() + '%' } }
        ]
      }

      return this.findGymMembers({ query }).then(function (results) {
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
