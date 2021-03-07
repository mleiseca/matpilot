<template>

  <material-card >
    <div slot="header">
      <div class="text-h6 font-weight-light mb-2">Administration</div>
    </div>

    <v-card-text>
      <div class="welcome-text">
        MatPilot helps you keep track of scheduling and attendance at your gym.
      </div>

      <div v-if="userGyms.length === 0">
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
          <router-link :to="{ name: '/gym', params: {gymId: userGym.gymId}}">
            {{ userGym.gym.name }}
          </router-link>
        </li>
      </ul>

      <div v-if="userGyms.length > 0">
        <router-link :to="{ name: 'gymsadd'}">
          create a new gym
        </router-link>
      </div>
    </v-card-text>
  </material-card>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserAdministration',

  computed: {
    ...mapGetters('user-gym-role', {
      findUserGymsInStore: 'find'
    }),
    userGyms () {
      return this.findUserGymsInStore({
        query: {
          userId: this.$store.state.auth.user.id,
          $sort: { createdAt: -1 },
          $limit: 25
        }
      }).data
    }
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
        userId: this.$store.state.auth.user.id,
        $sort: { createdAt: -1 },
        $limit: 25
      }
    })
  }
}
</script>
