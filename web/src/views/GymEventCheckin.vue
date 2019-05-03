<template>

  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card
          color="green"
          title="Check In for TODO CLASS NAME"
          text="">
          <!--<v-data-table-->
            <!--:headers="headers"-->
            <!--:items="members"-->
            <!--hide-actions>-->
            <!--&lt;!&ndash; TODO: this pagination or search needs to work &ndash;&gt;-->
            <!--&lt;!&ndash;:pagination.sync="pagination"&ndash;&gt;-->
            <!--&lt;!&ndash;:rows-per-page-items="pagination.rowsPerPageItems"&ndash;&gt;-->
            <!--&lt;!&ndash;:total-items="pagination.totalItems"&ndash;&gt;-->
            <!--<template-->
              <!--slot="headerCell"-->
              <!--slot-scope="{ header }">-->
              <!--<span-->
                <!--class="subheading font-weight-light text-success text&#45;&#45;darken-3"-->
                <!--v-text="header.text"-->
              <!--/>-->
            <!--</template>-->
            <!--<template-->
              <!--slot="items"-->
              <!--slot-scope="{ item }">-->
              <!--<tr @click="navigateToMember"-->
                  <!--:data-member-id="item.id">-->
                <!--<td>{{ item.firstName }}</td>-->
                <!--<td>{{ item.lastName  }}</td>-->
              <!--</tr>-->
              <!--&lt;!&ndash;<td>{{ item.city }}</td>&ndash;&gt;-->
              <!--&lt;!&ndash;<td class="text-xs-right">{{ item.salary }}</td>&ndash;&gt;-->
            <!--</template>-->
          <!--</v-data-table>-->

          here's the checkin
        </material-card>

        <!--<v-btn @click="navigateToAddMember" fab-->
               <!--color="green">-->
          <!--<v-icon>mdi-plus</v-icon>-->
        <!--</v-btn>-->
      </v-flex>
    </v-layout>
  </v-container>

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
import { mapActions } from 'vuex'

// todo: search?
export default {
  name: 'GymMembers',
  props: ['gymId', 'eventId'],
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
  //  computed: {
  //    ...mapGetters('members', {
  //      members: 'list'
  //    })
  //  },
  //  watch: {
  //    pagination: {
  //      handler () {
  //        this.loading = true
  //        this.$store.dispatch('queryItems')
  //          .then(result => {
  //            this.loading = false
  //          })
  //      },
  //      deep: true
  //    }
  //  },
  computed: {
    //    //    pagination: {
    //    //      get: function () {
    //    //        return this.$store.state.members.pagination
    //    //      },
    //    set: function (value) {
    //      //        this.$store.commit('setPagination', value)
    //      //      }
    //    },
    members () {
      return this.$store.getters['members/list']
    }
  },
  methods: {
    ...mapActions('members', {
      findGymMembers: 'find'
    }),
    //    ...mapState('members'),
    navigateToAddMember: function () {
      this.$router.push({ name: 'gym-members-add', params: { gymId: this.gymId } })
    },
    navigateToMember: function (event) {
      //      console.log("click for ", event)
      const memberId = event.currentTarget.dataset['memberId']

      this.$router.push({ name: 'gym-members-view', params: { gymId: this.gymId, memberId: memberId } })
    }
  },
  mounted () {
    //    console.log("Looking for members...")
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
