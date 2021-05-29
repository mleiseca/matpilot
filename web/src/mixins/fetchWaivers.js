import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    gymId: [String, Number]
  },
  computed: {
    ...mapGetters('gym-waivers', {
      findWaiversInStore: 'find'
    }),
    gymWaivers () {
      // console.log('scheduledEvents for gym', this.gymId)
      return this.findWaiversInStore({
        query: {
          gymId: parseInt(this.gymId, 10)
        }
      }).data
    }
  },
  mounted: async function () {
    await this.findWaivers({
      query: {
        gymId: this.gymId,
        $sort: {
          createdAt: 1
        }
      }
    })
  },
  methods: {
    ...mapActions('gyms', {
      findGyms: 'find'
    }),
    ...mapActions('gym-waivers', {
      findWaivers: 'find'
    })
  }
}
