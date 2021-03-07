<template>

  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card
          title="Users"
          text="">
          <v-data-table
            :headers="headers"
            :items="userGyms"
            @click:row="navigateToUserGym"
            hide-default-footer>
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
          </v-data-table>

        </material-card>

        <v-btn @click="navigateToAddUserGym" fab color="success">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { get } from 'lodash'

// todo: search?
export default {
  name: 'GymUsers',
  props: ['gymId'],
  data () {
    return {
      headers: [
        {
          sortable: true,
          text: 'Name',
          value: 'user.name'
        },
        {
          sortable: true,
          text: 'Email',
          value: 'user.email'
        },
        {
          sortable: false,
          text: 'Role',
          value: 'role'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('user-gym-role', {
      findUserGymsInStore: 'find'
    }),
    userGyms () {
      return this.findUserGymsInStore({
        query: {
          gymId: parseInt(this.gymId, 10),
          $sort: { createdAt: -1 },
          $limit: 25
        }
      }).data
    }
  },
  methods: {
    get,
    ...mapActions('user-gym-role', {
      findUserGyms: 'find'
    }),
    navigateToAddUserGym: function () {
      this.$router.push({ name: 'gym-users-add', params: { gymId: this.gymId } })
    },
    navigateToUserGym: function () {

    }
  },
  mounted () {
    console.log('Looking for users...')
    this.findUserGyms({
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
