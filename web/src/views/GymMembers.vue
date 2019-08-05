<template>
  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card
          title="Members"
          text="">
          <v-data-table
            :headers="headers"
            :items="members"
            :mobile-breakpoint="100"
            @click:row="navigateToMember"
          >

          </v-data-table>
        </material-card>

        <v-btn @click="navigateToAddMember" fab
               color="success">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

// todo: search?
export default {
  name: 'GymMembers',
  props: ['gymId'],
  data () {
    return {
      headers: [
        {
          sortable: false,
          text: 'First Name',
          value: 'firstName'
        },
        {
          sortable: false,
          text: 'Last Name',
          value: 'lastName'
        }
      ]
    }
  },
  computed: {
    members () {
      return this.$store.getters['members/list']
    }
  },
  methods: {
    ...mapActions('members', {
      findGymMembers: 'find'
    }),
    navigateToAddMember: function () {
      this.$router.push({ name: 'gym-members-add', params: { gymId: this.gymId } })
    },
    navigateToMember: function (event) {
      this.$router.push({ name: 'gym-members-view', params: { gymId: this.gymId, memberId: event.id } })
    }
  },
  mounted () {
    this.findGymMembers({
      query: {
        $sort: { createdAt: -1 },
        $limit: 50,
        gymId: this.gymId
      }
    })
  }
}
</script>

<style scoped>
  #app .input-group input {
    margin-bottom: 2rem;
  }

</style>
