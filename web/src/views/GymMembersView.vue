<template>

  <div>
    <h1>Edit member</h1>
    <mp-member-form
      v-on:member-save="saveMemberAndDisplay"
      v-bind:member="member"></mp-member-form>
    <!--<div>{{ gym }}</div>-->
    <!--<div>{{ member }}</div>-->
    <!--<div>-->
      <!--<mdc-button @click="save" raised>Save</mdc-button>-->
    <!--</div>-->
    <!--<mdc-fab fixed icon="edit" @click="enterEditMode"></mdc-fab>-->

  </div>
</template>

<script>
import { mapActions } from 'vuex'

import MemberForm from '@/components/MemberForm.vue'

export default {
  name: 'GymMembersView',
  props: ['gymId', 'memberId'],
  data () {
    return {
      gym: {},
      member: {}
    }
  },
  components: {
    'mp-member-form': MemberForm
  },
  computed: {
  },
  mounted: async function () {
    console.log('GymHome for id: ', this.gymId, this.memberId)
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
