<template>

  <v-container fluid grid-list-xl fill-height>
    <v-layout wrap>
      <v-flex xs12>
        <material-card color="green">
          <div slot="header">
            <div class="title font-weight-light mb-2">Administration</div>
          </div>

          <v-card-text>
            <div class="welcome-text">
              MatPilot helps you keep track of scheduling and attendance at your gym.
            </div>

            <div v-if="userGyms.length == 0">
              To get started,
              <router-link :to="{ name: 'gymsadd'}">
                create a gym
              </router-link>
            </div>
            <div v-if="userGyms.length > 0">
              To get started, select a gym:
            </div>
            <ul class="flex flex-column flex-1 list-unstyled user-list">
              <li v-for="userGym in userGyms" v-bind:key="userGym.id">
                <router-link :to="{ name: '/gym', params: {id: userGym.gymId}}">
                  {{ userGym.gym.name }}
                </router-link>
              </li>
            </ul>

          </v-card-text>
        </material-card>
      </v-flex>

      <!--<v-flex xs12>-->
      <!--<checkin-list v-bind:scheduled-events="gymScheduledEvents"></checkin-list>-->
      <!--</v-flex>-->
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserHome',

  computed: {
    ...mapGetters('user-gym-role', {
      userGyms: 'list'
    })
  },
  methods: {
    ...mapActions('user-gym-role', {
      findUserGyms: 'find'
    })
  },
  mounted () {
    //        createdBy: 1,
    this.findUserGyms({
      query: {
        $sort: { createdAt: -1 },
        $limit: 25
      }
    })
  }
}
</script>

<style scoped>

  .welcome-text {
    margin-bottom: 1rem;
  }

  .welcome-container {
    width: 100%;
    margin-bottom: 3rem;
  }
</style>
