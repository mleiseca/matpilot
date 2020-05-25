import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

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
    ...mapGetters('events', {
      findEventsInStore: 'find'
    }),
    gym () {
      // console.log('gymID', this.gymId)
      return this.getGymInStore(parseInt(this.gymId))
    },
    gymScheduledEvents () {
      // console.log('scheduledEvents for gym', this.gymId)
      return this.findScheduledEventsInStore({
        query: {
          gymId: parseInt(this.gymId, 10)
        }
      }).data
    },
    gymEvents () {
      const now = moment()

      return this.findEventsInStore({
        query: {
          gymId: parseInt(this.gymId, 10),
          // TODO: this is also the date range for scheduled events we are going to be displaying
          $and: [
            { startDateTime: { $gte: now.clone().subtract(2, 'days').toISOString() } },
            { startDateTime: { $lte: now.clone().add(8, 'days').toISOString() } }
          ]
        }
      }).data
    }
  },
  mounted: async function () {
    // console.log('looking up gym...')
    await this.findGyms({
      query: {
        id: this.gymId
      }
    })
    // console.log('looking up scheduled events...')
    await this.findScheduledEvents({
      query: {
        gymId: this.gymId
      }
    })

    const now = moment()
    const eventQuery = {
      gymId: parseInt(this.gymId, 10),
      '$and': [
        // TODO: this is also the date range for scheduled events we are going to be displaying
        { startDateTime: { $gte: now.clone().subtract(1, 'days').toISOString() } },
        { startDateTime: { $lte: now.clone().add(8, 'days').toISOString() } }
      ],
      '$limit': 50
    }
    // eventQuery['$and'] = [
    //     { startDateTime: { $gte: now.clone().subtract(2, 'days').toISOString() } },
    //     { startDateTime: { $lte: now.clone().add(8, 'days').toISOString() } }
    //   ]
    await this.findEvents({ query: eventQuery })
    // console.log('found events: ', e)
  },
  methods: {
    ...mapActions('gyms', {
      findGyms: 'find'
    }),
    ...mapActions('scheduled-events', {
      findScheduledEvents: 'find'
    }),
    ...mapActions('events', {
      findEvents: 'find'
    })
  }
}
