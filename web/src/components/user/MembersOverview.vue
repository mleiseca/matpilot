<template>
  <v-container fluid grid-list-xl fill-height pa-0>
    <v-layout wrap>
      <v-flex xs12>
        <user-gym-overview-card v-for="gym in membersByGym" v-bind:gymId="gym.gymId"/>
      </v-flex>
    </v-layout>
  </v-container>

</template>


<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'UserMembersOverviewCard',
    data (){
      return {
        membersByGym: []
      }
    },
    //    computed: {
    //      ...mapGetters('user-gym-role', {
    //        findUserGymsInStore: 'find'
    //      }),
    //      userGyms () {
    //        return this.findUserGymsInStore({
    //          query: {
    //            userId: this.$store.state.auth.user.id,
    //            $sort: { createdAt: -1 },
    //            $limit: 25
    //          }
    //        }).data
    //      }
    //    },
    methods: {
//      ...mapActions('user-gym-role', {
//        findUserGyms: 'find'
//      })

    },
    watch: {
      '$store.state.auth.user.membersByGym': function() {
        const user = this.$store.state.auth.user
//        if (user) {
//          console.log('members for user: ', user.members)
//          this.userVerified = user.isVerified
//          this.emailSending = false
//        }
      }
    },
    mounted () {
      this.membersByGym = this.$store.state.auth.user.membersByGym
//      //        createdBy: 1,
//      this.findUserGyms({
//        query: {
//          userId: this.$store.state.auth.user.id,
//          $sort: { createdAt: -1 },
//          $limit: 25
//        }
//      })
    }
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

