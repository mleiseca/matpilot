import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
const { defaultTo } = require('lodash')

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
      let start = now.clone().subtract(2, 'days').toISOString()
      let end = now.clone().add(8, 'days').toISOString()
      start = defaultTo(this.earliestEventDate, start)
      end = defaultTo(this.latestEventDate, end)
      return this.findEventsInStore({
        query: {
          gymId: parseInt(this.gymId, 10),
          // TODO: this is also the date range for scheduled events we are going to be displaying
          $and: [
            { startDateTime: { $gte: start } },
            { startDateTime: { $lte: end } }
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

    await this.loadEventsForTimeRange()
    // console.log('found events: ')
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
    }),
    loadEventsForTimeRange: async function () {
      // console.log('loading EVENTs for time range')
      const now = moment()
      let start = now.clone().subtract(2, 'days').toISOString()
      let end = now.clone().add(8, 'days').toISOString()
      start = defaultTo(this.earliestEventDate, start)
      end = defaultTo(this.latestEventDate, end)

      const eventQuery = {
        gymId: parseInt(this.gymId, 10),
        '$and': [
          { startDateTime: { $gte: start } },
          { startDateTime: { $lte: end } }
        ],
        '$limit': 50
      }
      await this.findEvents({ query: eventQuery })
    }
  }
}
