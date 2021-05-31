import { mapActions, mapGetters } from 'vuex'
import { isNil } from 'lodash'

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
      if (isNil(this.gymId)) {
        return
      }
      return this.findWaiversInStore({
        query: {
          gymId: parseInt(this.gymId, 10),
          $limit: 1000
        }
      }).data
    }
  },
  mounted: async function () {
    if (isNil(this.gymId)) {
      return
    }
    await this.findWaivers({
      query: {
        gymId: this.gymId,
        $sort: {
          createdAt: 1
        },
        $limit: 1000
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
