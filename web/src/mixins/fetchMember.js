import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    memberId: [String, Number]
  },
  computed: {
    ...mapGetters('members', {
      findMembersInStore: 'find'
    }),
    gymWaivers () {
      return this.findMembersInStore({
        query: {
          memberId: parseInt(this.memberId, 10)
        }
      }).data
    }
  },
  mounted: async function () {
    await this.findMembers({
      query: {
        memberId: this.memberId
      }
    })
  },
  methods: {
    ...mapActions('members', {
      findMembers: 'find'
    })
  }
}
