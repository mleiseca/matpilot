<template>

  <v-container fluid grid-list-xl fill-height>
    <v-layout wrap>
      <v-flex xs12>
        <material-card color="green">
          <div slot="header">
            <div class="title font-weight-light mb-2">Administration</div>
          </div>

          <v-card-text>
            <ul>
            <li><router-link :to="{ name: 'gym-members', params: {gymId: id}}">
            Members
            </router-link></li>
            <li><router-link :to="{ name: 'gym-scheduled-events', params: {gymId: id}}">
            Schedule classes
            </router-link></li>
            </ul>
          </v-card-text>
        </material-card>
      </v-flex>
        <!--<material-stats-card-->
          <!--color="green"-->
          <!--icon="mdi-store"-->
          <!--title="Revenue"-->
          <!--value="$34,245"-->
          <!--sub-icon="mdi-calendar"-->
          <!--sub-text="Last 24 Hours"-->
          <!--v-on:click="alert('foo')"-->
        <!--/>-->
      <!--</v-flex>-->
      <!--<v-flex-->
        <!--sm6-->
        <!--xs12-->
        <!--md6-->
        <!--lg3-->
      <!--&gt;-->
        <!--<material-stats-card-->
          <!--color="green"-->
          <!--icon="mdi-store"-->
          <!--title="Schedule events"-->
          <!--value="$34,245"-->
          <!--sub-icon="mdi-calendar"-->
          <!--sub-text="Last 24 Hours"-->
        <!--/>-->
      <v-flex xs12>
        <checkin-list v-bind:scheduled-events="gymScheduledEvents"></checkin-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'GymHome',
  props: ['id'],
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
    })
  },

  //  methods: {

  //  },
  //  mounted () {
  //    //        createdBy: 1,
  //    this.findUserGyms({
  //      query: {
  //        $sort: { createdAt: -1 },
  //        $limit: 25
  //      }
  //    })
  //  }

  mounted: async function () {
    console.log('GymHome for id: ', this.id)
    if (!this.id) {
      return
    }

    await this.getGym(this.id).then(result => { this.gym = result })

    this.findScheduledEvents({
      query: {
        gymId: this.id
      }
    })
  }
}
</script>

<style scoped>

</style>
