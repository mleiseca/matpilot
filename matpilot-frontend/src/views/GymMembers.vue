<template>

  <div>
    <h1>Members</h1>
    <mdc-list bordered interactive>
      <mdc-list-item v-for="member in members"
                     v-bind:key="member.id"
                     @click="navigateToMember"
                     :data-member-id="member.id">{{ member.firstName }} {{ member.lastName }}</mdc-list-item>
    </mdc-list>

    <mdc-fab fixed icon="add" @click="navigateToAddMember"></mdc-fab>

  </div>
  <!--<b-container fluid>-->
    <!--<b-row>-->
      <!--<b-col class="my-1">-->
        <!--<h1 class="site-h1">Members</h1>-->
        <!--&lt;!&ndash;TODO add search box&ndash;&gt;-->
        <!--<b-input-group>-->

          <!--<b-form-input v-model="filter" placeholder="Looking For Somebody?" />-->
          <!--&lt;!&ndash;<b-input-group-append>&ndash;&gt;-->
          <!--&lt;!&ndash;<b-button :disabled="!filter" @click="filter = ''" size="sm">Clear</b-button>&ndash;&gt;-->
          <!--&lt;!&ndash;</b-input-group-append>&ndash;&gt;-->
        <!--</b-input-group>-->

      <!--</b-col>-->
      <!--<b-col class="my-1">-->
        <!--<div class="float-right">-->
          <!--<b-button to="/member/add" class="mr-1">+ Add Member</b-button>-->
        <!--</div>-->
      <!--</b-col>-->
    <!--</b-row>-->

    <!--<b-table striped hover :items="memberProvider" :fields="fields" :per-page="50">-->
      <!--<template slot="actions" slot-scope="row">-->
        <!--&lt;!&ndash; We use @click.stop here to prevent a 'row-clicked' event from also happening &ndash;&gt;-->
        <!--<b-button :to="{ name: 'member-edit', params: {id: row.item.id} }" size="sm" class="mr-1">-->
          <!--Edit-->
        <!--</b-button>-->
      <!--</template>-->
    <!--</b-table>-->

  <!--</b-container>-->
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

// todo: search?
export default {
  name: 'GymMembers',
  props: ['gymId'],
  data () {
    return {}
  },
  computed: {
    ...mapGetters('members', {
      members: 'list'
    })
  },
  methods: {
    ...mapActions('members', {
      findGymMembers: 'find'
    }),
    navigateToAddMember: function () {
      this.$router.push({ name: 'gym-members-add', params: { gymId: this.gymId } })
    },
    navigateToMember: function (event) {
      const memberId = event.target.dataset['memberId']

      this.$router.push({ name: 'gym-members-view', params: { gymId: this.gymId, memberId: memberId } })
    }
  },
  mounted () {
    this.findGymMembers({
      query: {
        $sort: { createdAt: -1 },
        $limit: 25,
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
