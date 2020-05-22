<template>
  <v-fade-transition mode="out-in">
    <template v-if="gym === undefined">
      <v-card-text>
        <v-progress-circular :indeterminate="true"/>
      </v-card-text>
    </template>

    <material-card v-if="gym !== undefined">
      <template >
        <div slot="header">
          <div class="title font-weight-light mb-2">{{ gym.name }}</div>
        </div>

        <v-card-text>
          <div class="welcome-text">
            <user-gym-event-registration v-bind:scheduled-events="gymScheduledEvents"></user-gym-event-registration>
          </div>
        </v-card-text>
      </template>
    </material-card>
  </v-fade-transition>

</template>


<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'UserGymOverviewCard',
    props: {
      gymId: [String, Number]
    },
    data (){
      return {
        membersByGym: []
      }
    },
    computed: {
      ...mapGetters('gyms', {
        getGymInStore: 'get'
      }),
      ...mapGetters('scheduled-events', {
        findScheduledEventsInStore: 'find'
      }),
      gym () {
        console.log("gymIDDD", this.gymId)
        return this.getGymInStore(parseInt(this.gymId))
      },
      gymScheduledEvents () {
        return this.findScheduledEventsInStore({
          query: {
            gymId: parseInt(this.gymId, 10)
          }
        }).data
      }
    },
    mounted: async function () {
      await this.findGyms({
        query: {
          id: this.gymId
        }
      })
      this.findScheduledEvents({
        query: {
          gymId: this.gymId
        }
      })
    },
    methods: {
      ...mapActions('gyms', {
        findGyms: 'find'
      }),
      ...mapActions('scheduled-events', {
        findScheduledEvents: 'find'
      })
    },
  }
</script>



<!--export default {-->
<!--name: 'EmailConfirmationBanner',-->
<!--data() {-->
<!--return {-->
<!--userVerified: true,-->
<!--emailSending: false-->
<!--}-->
<!--},-->
<!--mounted: async function() {-->

<!--},-->
<!--watch: {-->
<!--'$store.state.auth.user.isVerified': function() {-->
<!--const user = this.$store.state.auth.user-->
<!--if (user) {-->
<!--this.userVerified = user.isVerified-->
<!--this.emailSending = false-->
<!--}-->
<!--}-->
<!--},-->
<!--methods: {-->
<!--resendEmail: function() {-->
<!--console.log("resending email")-->
<!--const user = this.$store.state.auth.user-->
<!--this.emailSending = 'SENDING'-->

<!--client.service('authManagement').create({-->
<!--action: 'resendVerifySignup',-->
<!--value: {-->
<!--email: user.email,-->
<!--verifyToken : user.verifyToken,-->
<!--verifyShortToken: user.verifyShortToken-->
<!--}-->
<!--})-->
<!--.then((result) => {-->
<!--console.log('result:', result)-->
<!--this.emailSending = 'SENT'-->
<!--})-->
<!--.catch((error) => {-->
<!--console.log('error:', error)-->
<!--this.emailSending = 'ERROR'-->
<!--})-->
<!--}-->
<!--}-->

