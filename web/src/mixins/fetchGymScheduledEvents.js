import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    gymId: [String, Number]
  },
  computed: {
    ...mapGetters('gyms', {
      getGymInStore: 'get'
    }),
    ...mapGetters('scheduled-events', {
      findScheduledEventsInStore: 'find'
    }),
    gym () {
      console.log('gymID', this.gymId)
      return this.getGymInStore(parseInt(this.gymId))
    },
    gymScheduledEvents () {
      console.log('scheduledEvents for gym', this.gymId)
      return this.findScheduledEventsInStore({
        query: {
          gymId: parseInt(this.gymId, 10)
        }
      }).data
    }
  },
  mounted: async function () {
    console.log('looking up gym...')
    await this.findGyms({
      query: {
        id: this.gymId
      }
    })
    console.log('looking up scheduled events...')
    await this.findScheduledEvents({
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
  }
}
