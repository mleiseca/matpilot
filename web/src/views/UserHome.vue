<template>

  <div>
    <div class="welcome-container">
      <h2>Welcome to MatPilot!</h2>

      <div class="welcome-text">
        MatPilot helps you keep track of scheduling and attendance at your gym.
      </div>

      <div>To get started, select a gym:
      </div>
      <ul class="flex flex-column flex-1 list-unstyled user-list">
        <li v-for="userGym in userGyms" v-bind:key="userGym.id">
          <router-link :to="{ name: '/gym', params: {id: userGym.gymId}}">
            {{ userGym.gym.name }} {{ userGym.gymId }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
//  import UpcomingEvents from '@/components/events/UpcomingEvents'

export default {
  name: 'UserHome',
  components: {
    //      'mc-upcoming-events': UpcomingEvents,
  },
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
