<template>

  <v-container fill-height fluid grid-list-xl ref="memberContainer">
    <v-layout  justify-center wrap>
      <v-flex xs12 md8>
        <material-card
          v-if="editMode"
          :title="title"
          text="">
          <member-form
            v-on:member-save="saveMemberAndDisplay"
            v-on:member-edit-cancel="editCancelled"
            v-bind:member="member"
            v-bind:gym="gym"></member-form>

        </material-card>

        <v-card v-if="!editMode">
          <v-card-text>

            <member-view
              v-on:member-edit-mode="editMode = true"
              v-bind:member="member"
              v-bind:gym="gym"></member-view>


            <div class="pt-10 pb-10">
            <member-waivers v-bind:gym-id="gymId"
                            v-bind:member="member"
                            v-bind:alert-unsigned="true"
                            v-on:gym-waivers-signed="gymWaiversSigned">
            </member-waivers>

            </div>


            <member-rank
              :member="member"
              :gym="gym">
            </member-rank>

            <v-divider></v-divider>

            <member-attendance
              :memberId="memberId"
              :gymId="gymId"
              :member="member">

            </member-attendance>

          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
import { mapActions } from 'vuex'
import { EventBus } from '../event-bus'

export default {
  name: 'GymMembersView',
  props: ['gymId', 'memberId'],
  data () {
    return {
      gym: {},
      member: {},
      title: 'Edit member',
      editMode: false
    }
  },
  computed: {
  },
  mounted: async function () {
    if (!this.gymId || !this.memberId) {
      return
    }

    await this.getGym(this.gymId).then(result => {
      this.gym = result
    })

    await this.getMember(this.memberId).then(result => {
      this.member = result
    })

    this.$scrollTo(this.$refs.memberContainer, 100, {})
  },
  methods: {
    ...mapActions('gyms', {
      getGym: 'get'
    }),
    ...mapActions('members', {
      getMember: 'get'
    }),
    gymWaiversSigned: function() {
      console.log("MEMBER VIEW: gymWaiversSigned")
      this.$scrollTo(this.$refs.memberContainer, 100, {})
    },
    saveMemberAndDisplay: function (event) {
      console.log('Saving member and redisplaying:', event)
      event.save()
        .then((result) => {
          console.log('Got result:', result)
          this.editMode = false

          EventBus.$emit('loading', { done: true })
          EventBus.$emit('user-message', { message: 'Saved' })
        })
        .catch((e) => {
          console.log('** Login catch: ', e)
          EventBus.$emit('loading', { done: true })
          EventBus.$emit('user-message', { message: `Error saving member: ${e.message}`, type: 'error' })
        })
    },
    editCancelled: function (event) {
      this.editMode = false
    }
  }
}
</script>

<style scoped>

</style>
