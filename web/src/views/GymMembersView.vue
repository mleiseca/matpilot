<template>

  <v-container fill-height fluid grid-list-xl>
    <v-layout  justify-center wrap>
      <v-flex xs12 md8>
        <material-card
          color="green"
          title="Edit member"
          text="">
          <member-form
            v-on:member-save="saveMemberAndDisplay"
            v-bind:member="member"></member-form>

        </material-card>
      </v-flex>

    </v-layout>
  </v-container>

</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'GymMembersView',
  props: ['gymId', 'memberId'],
  data () {
    return {
      gym: {},
      member: {}
    }
  },
  computed: {
  },
  mounted: async function () {
    if (!this.gymId || !this.memberId) {
      return
    }

    await this.getGym(this.gymId).then(result => {
      this.gym = result
    })

    await this.getMember(this.memberId).then(result => {
      this.member = result
    })
  },
  methods: {
    ...mapActions('gyms', {
      getGym: 'get'
    }),
    ...mapActions('members', {
      getMember: 'get'
    }),
    saveMemberAndDisplay: function (event) {
      console.log('Saving member and redisplaying:', event)
      //      this.$store.dispatch('members/patch', [event])
      event.save()
        .then((result) => {
          console.log('Got result:', result)
          this.$router.push({ name: 'gym-members', params: { id: this.gymId } })
        })
    },
    enterEditMode: function (event) {
      console.log('Entering edit mode')
      //      event.gymId = this.gymId
      //      console.log('Saving member and redisplaying:', event)
      //      this.$store.dispatch('members/create', event)
      //        .then((result) => {
      //          console.log('Got result:', result)
      //          this.$router.push({ name: 'gym-members', params: { id: this.gymId } })
      //        })
    }
  }
}
</script>

<style scoped>

</style>
