<template>

  <v-container fluid grid-list-xl fill-height pt-0>
    <v-layout wrap>
      <v-flex xs12 py-0>
        <material-card>
          <div slot="header">
            <div class="title font-weight-light mb-2">Administration</div>
          </div>

          <v-card-text >
            <ul>
              <li><router-link :to="{ name: 'gym-members', params: {gymId: this.gymId}}">
              Members
              </router-link></li>
              <li v-if="isAdminForGym()"><router-link :to="{ name: 'gym-scheduled-events', params: {gymId: this.gymId}}">
              Schedule classes
              </router-link></li>
              <li v-if="isAdminForGym()"><router-link :to="{ name: 'gym-users', params: {gymId: this.gymId}}">
                Administrators/Staff
              </router-link></li>
            </ul>
          </v-card-text>
        </material-card>
      </v-flex>
      <v-flex xs12 py-0>
        <checkin-list v-bind:scheduled-events="gymScheduledEvents"></checkin-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'GymHome',
  props: ['gymId'],
  data () {
    return {
      gym: {}
    }
  },
  computed: {
    ...mapGetters('scheduled-events', {
      gymScheduledEvents: 'list'
    })
  },
  methods: {
    ...mapActions('gyms', {
      getGym: 'get'
    }),
    ...mapActions('scheduled-events', {
      findScheduledEvents: 'find'
    }),
    isAdminForGym () {
      const userGyms = this.$store.state.auth.user.user_gym_roles
      console.log(userGyms)
      if (!userGyms) {
        return false
      }
      for (let i = 0; i < userGyms.length; i++) {
        let userGymRole = userGyms[i]
        console.log(userGymRole)
        if (userGymRole.gymId === parseInt(this.gymId, 10) && (userGymRole.role === 'ADMIN' || userGymRole.role === 'OWNER')) {
          return true
        }
      }
      return false
    }
  },

  mounted: async function () {
    console.log('GymHome for id: ', this.gymId)
    if (!this.gymId) {
      return
    }

    await this.getGym(this.gymId).then(result => { this.gym = result })

    this.findScheduledEvents({
      query: {
        gymId: this.gymId
      }
    })
  }
}
</script>

<style scoped>

</style>
