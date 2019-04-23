<template>

  <div>
    <h1>Here's your gym</h1>
    <div>{{ gym }} </div>

    <div>To get started, select a gym:

      <ul>
        <li><router-link :to="{ name: 'gym-members', params: {gymId: id}}">
          Add Members
        </router-link></li>
        <li><router-link :to="{ name: 'gym-scheduled-event-add', params: {gymId: id}}">
          Schedule classes
        </router-link></li>
      </ul>
    </div>
  </div>
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
