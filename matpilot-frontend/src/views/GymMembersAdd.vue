<template>

  <div>
    <h1>Create a new member</h1>
    <mp-member-form
      v-on:member-save="saveMemberAndDisplay"></mp-member-form>
  </div>
</template>

<script>
import MemberForm from '@/components/MemberForm.vue'

export default {
  name: 'GymMembersAdd',
  props: ['gymId'],
  data () {
    return {}
  },
  components: {
    'mp-member-form': MemberForm
  },
  computed: {
  },
  methods: {
    saveMemberAndDisplay: function (event) {
      event.gymId = this.gymId
      console.log('Saving member and redisplaying:', event)
      this.$store.dispatch('members/create', event)
        .then((result) => {
          console.log('Got result:', result)
          this.$router.push({ name: 'gym-members', params: { id: this.gymId } })
        })
    }
  }
}
</script>

<style scoped>

</style>
