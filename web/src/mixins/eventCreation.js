export default {
  methods: {
    // eventDetails:
    //   {startDateTime (Moment): startDateTime
    //     endDateTime (Moment): endDateTime,
    //     scheduledEvent: se,
    //     id: 'se-' + se.id + '-' + startDateTime
    //   }
    createEvent: function (scheduledEvent, eventDetails) {
      const event = {
        scheduledEventId: scheduledEvent.id,
        gymId: scheduledEvent.gymId,
        title: scheduledEvent.title,
        description: scheduledEvent.description,
        timezone: scheduledEvent.timezone,
        startDateTime: eventDetails.startDateTime.toISOString(),
        endDateTime: eventDetails.endDateTime.toISOString()
      }
      console.log('with event', event, 'startdatetime', eventDetails.startDateTime.inspect())
      return this.$store.dispatch('events/create', event)
    }
  }
}
