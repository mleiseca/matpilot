<template>
  <v-container fluid grid-list-xl fill-height pa-0>
    <v-layout wrap>
      <v-flex xs12>
        <user-gym-overview-card v-for="gym in membersByGym"
                                v-bind:key="gym.gymId"
                                v-bind:gymId="gym.gymId"
                                v-bind:members="gym.members"/>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
export default {
  name: 'UserMembersOverviewCard',
  data () {
    return {
      membersByGym: [],
      memberIds: [],
      gymIds: []
    }
  },
  methods: {
    extractIds: function (membersByGym) {
      // console.log('members is ', membersByGym)
      const memberIds = []
      const gymIds = []
      membersByGym.forEach(gym => {
        gymIds.push(parseInt(gym.gymId, 10))
        gym.members.forEach(member => {
          memberIds.push(parseInt(member.id, 10))
        })
      })
      this.memberIds = memberIds
      this.gymIds = gymIds
    }
  },
  watch: {
    '$store.state.auth.user.membersByGym': function () {
      // TODO
      //      const user = this.$store.state.auth.user
      //        if (user) {
      //          console.log('members for user: ', user.members)
      //          this.userVerified = user.isVerified
      //          this.emailSending = false
      //        }
    }
  },
  mounted: async function () {
    this.membersByGym = this.$store.state.auth.user.membersByGym
    this.extractIds(this.membersByGym)
  }
}
</script>
