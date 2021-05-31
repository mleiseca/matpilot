import { mapActions, mapGetters } from 'vuex'
import {isNil} from 'lodash'

export default {
  props: {
    gymId: [String, Number],
    member: {type: Object},
    members: Array
  },
  computed: {
    ...mapGetters('gym-waiver-member-signatures', {
      findMemberWaiversInStore: 'find'
    }),
    memberWaivers () {
      return this.findMemberWaiversInStore({
        query: {
          gymId: parseInt(this.gymId, 10),
          memberId: {
            $in: !isNil(this.member) ? [this.member.id] : this.members.map(x => x.id)
          }
        },
      }).data
    }
  },
  watch: {
    member: async function(m) {
      console.log('got update on gymWaivers -> memberId', m)
      await this.queryForWaivers(this.member.id)
    },
    members: async function(m) {
      console.log('got update on gymWaivers -> members', m)
      await this.queryForWaivers(this.members.map(x => x.id))
    },
  },
  mounted: async function () {
    console.log("loading member waivers for ", this.member)
    if (this.member !== undefined) {
      // TODO can test unauthorized access here
      await this.queryForWaivers(this.member.id)
    } else if (!isNil(this.members)) {
      await this.queryForWaivers(this.members.map(x => x.id))
    }
  },
  methods: {
    ...mapActions('gym-waiver-member-signatures', {
      findMemberWaivers: 'find'
    }),
    queryForWaivers: async function(memberIds) {
      await this.findMemberWaivers({
        query: {
          gymId: this.gymId,
          memberId: memberIds
        }
      })
    }
  }
}
