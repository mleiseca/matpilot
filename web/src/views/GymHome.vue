<template>

  <v-container
    fluid
    grid-list-xl
    fill-height>
    <v-layout
      wrap
    >
      <v-flex
        xs12>
        <material-card
          color="green">
          <div
            slot="header"
          >
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
      <v-flex
        xs12>
        <material-card
          color="green">
          <div
            slot="header"
          >
            <div class="title font-weight-light mb-2">Upcoming events</div>
            <!--<div class="category">-->
              <!--Handcrafted by us with-->
              <!--<v-icon-->
                <!--size="17"-->
              <!--&gt;-->
                <!--mdi-heart-->
              <!--</v-icon>-->
            <!--</div>-->
          </div>

          <v-card-text>
            <!--<v-layout-->
              <!--row-->
              <!--wrap>-->
              <!--<v-flex-->
                <!--md6-->
                <!--sm12>-->
                <!--<h2 class="title font-weight-light mb-3">Notifications Style</h2>-->

                <!--<material-notification-->
                  <!--class="mb-3"-->
                  <!--color="info"-->
                <!--&gt;-->
                  <!--This is a plain notification-->
                <!--</material-notification>-->
                <!--<material-notification-->
                  <!--class="mb-3"-->
                  <!--color="info"-->
                  <!--dismissible-->
                <!--&gt;-->
                  <!--This is a notification with close button.-->
                <!--</material-notification>-->
                <!--<material-notification-->
                  <!--class="mb-3"-->
                  <!--color="info"-->
                  <!--dismissible-->
                  <!--icon="mdi-bell-plus"-->
                <!--&gt;-->

                  <!--This is a notification with close button and icon.-->
                <!--</material-notification>-->
                <!--<material-notification-->
                  <!--class="mb-3"-->
                  <!--color="info"-->
                  <!--dismissible-->
                  <!--icon="mdi-bell-plus"-->
                <!--&gt;-->

                  <!--This is a notification with close button and icon and have many lines. You can see that the icon and the close button are always vertically aligned. This is a beautiful notification. So you don't have to worry about the style.-->
                <!--</material-notification>-->
              <!--</v-flex>-->

              <!--<v-flex-->
                <!--md6-->
                <!--sm12>-->
                <!--<h2 class="title font-weight-light">Notifcation States</h2>-->

                <!--<material-notification-->
                  <!--class="mb-3"-->
                  <!--color="info"-->
                  <!--dismissible-->
                <!--&gt;-->
                  <!--<strong>INFO</strong> - This is a regular notification made with `color="info"`-->
                <!--</material-notification>-->

                <!--<material-notification-->
                  <!--class="mb-3"-->
                  <!--color="success"-->
                  <!--dismissible-->
                <!--&gt;-->
                  <!--<strong>SUCCESS</strong> - This is a regular notification made with `color="success"`-->
                <!--</material-notification>-->

                <!--<material-notification-->
                  <!--class="mb-3"-->
                  <!--color="warning"-->
                  <!--dismissible-->
                <!--&gt;-->
                  <!--<strong>WARNING</strong> - This is a regular notification made with `color="warning"`-->
                <!--</material-notification>-->

                <!--<material-notification-->
                  <!--class="mb-3"-->
                  <!--color="error"-->
                  <!--dismissible-->
                <!--&gt;-->
                  <!--<strong>DANGER</strong> - This is a regular notification made with `color="error"`-->
                <!--</material-notification>-->

                <!--<material-notification-->
                  <!--class="mb-3"-->
                  <!--color="purple"-->
                  <!--dismissible-->
                <!--&gt;-->
                  <!--<strong>PRIMARY</strong> - This is a regular notification made with `color="purple"`-->
                <!--</material-notification>-->
              <!--</v-flex>-->
            <!--</v-layout>-->

          </v-card-text>
        </material-card>
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
  components: {
  },
  computed: {
  },
  methods: {
    ...mapActions('gyms', {
      getGym: 'get'
    }),
    ...mapGetters('gyms', {
      gyms: 'list'
    })
  },
  mounted: async function () {
    console.log('GymHome for id: ', this.id)
    if (!this.id) {
      return
    }

    await this.getGym(this.id).then(result => { this.gym = result })

    //      this.loading = true
    //      this.$nextTick(function () {
    //        // eslint-disable-next-line
    //        console.log("Loading with id: ", this.id);
    //        this.$http.get('/api/gyms/' +store.getters['user/gymId']+'/members/' + this.id)
    //          .then((data) => {
    //            this.form = data.data
    //          })
    //          .finally(() => {
    //            this.loading = false
    //          })
    //
    //      })
  }
}
</script>

<style scoped>

</style>
