<template>

  <div>
    <h1>Create a new gym</h1>
    <mp-gym-form
      v-on:gym-save="saveGymAndDisplay"></mp-gym-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import GymForm from '@/components/GymForm.vue'

export default {
  name: 'GymAdd',
  data () {
    return {}
  },
  components: {
    'mp-gym-form': GymForm
  },
  computed: {
  },
  methods: {
    ...mapActions('gyms', {
      findGyms: 'find'
    }),
    saveGymAndDisplay: function (event) {
      console.log('Saving gym and redisplaying:', event)
      this.$store.dispatch('gyms/create', event)
        .then((result) => {
          console.log('Got result:', result)
          this.$router.push({ name: '/gym', params: { id: result.id } })
        })
    }
  }
}
</script>

<style scoped>

</style>
