<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card
          title="Members"
          text="">
          <v-data-table
            :headers="headers"
            :items="members"
            hide-actions>
            <!-- TODO: this pagination or search needs to work -->
            <!--:pagination.sync="pagination"-->
            <!--:rows-per-page-items="pagination.rowsPerPageItems"-->
            <!--:total-items="pagination.totalItems"-->
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
      headers: [
        {
          sortable: false,
          text: 'First Name',
          value: 'firstName'
        },
        {
          sortable: false,
          text: 'Last Name',
          value: 'lastName'
        }
      ]
    }
  },
  //  computed: {
  //    ...mapGetters('members', {
  //      members: 'list'
  //    })
  //  },
  //  watch: {
  //    pagination: {
  //      handler () {
  //        this.loading = true
  //        this.$store.dispatch('queryItems')
  //          .then(result => {
  //            this.loading = false
  //          })
  //      },
  //      deep: true
  //    }
  //  },
  computed: {
  //    //    pagination: {
  //    //      get: function () {
  //    //        return this.$store.state.members.pagination
  //    //      },
  //    set: function (value) {
  //      //        this.$store.commit('setPagination', value)
  //      //      }
  //    },
    members () {
      return this.$store.getters['members/list']
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
    }
  },
  mounted () {
    //    console.log("Looking for members...")
    this.findGymMembers({
      query: {
        $sort: { createdAt: -1 },
        $limit: 50,
        gymId: this.gymId
      }
    })
  }
}
</script>

<style scoped>
  #app .input-group input {
    margin-bottom: 2rem;
  }

</style>
