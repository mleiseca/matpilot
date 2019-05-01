<template>

  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex xs12 md8>
        <material-card
          color="green"
          title="Create a new member"
          text="">
          <mp-member-form
            v-on:member-save="saveMemberAndDisplay"></mp-member-form>

        </material-card>
      </v-flex>
      <!--TODO: this might be a helpful help-text display or something-->
      <!--<v-flex-->
      <!--xs12-->
      <!--md4-->
      <!--&gt;-->
      <!--<material-card class="v-card-profile">-->
      <!--<v-avatar-->
      <!--slot="offset"-->
      <!--class="mx-auto d-block"-->
      <!--size="130"-->
      <!--&gt;-->
      <!--<img-->
      <!--src="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg"-->
      <!--&gt;-->
      <!--</v-avatar>-->
      <!--<v-card-text class="text-xs-center">-->
      <!--<h6 class="category text-gray font-weight-thin mb-3">CEO / CO-FOUNDER</h6>-->
      <!--<h4 class="card-title font-weight-light">Alec Thompson</h4>-->
      <!--<p class="card-description font-weight-light">Don't be scared of the truth because we need to restart the human foundation in truth And I love you like Kanye loves Kanye I love Rick Owens’ bed design but the back is...</p>-->
      <!--<v-btn-->
      <!--color="success"-->
      <!--round-->
      <!--class="font-weight-light"-->
      <!--&gt;Follow</v-btn>-->
      <!--</v-card-text>-->
      <!--</material-card>-->
      <!--</v-flex>-->
    </v-layout>
  </v-container>
</template>

<script>
import MemberForm from '@/components/MemberForm.vue'

export default {
  name: 'GymMembersAdd',
  props: ['gymId'],
  data () {
    return {}
  },
  components: {
    'mp-member-form': MemberForm
  },
  computed: {
  },
  methods: {
    saveMemberAndDisplay: function (event) {
      event.gymId = this.gymId
      console.log('Saving member and redisplaying:', event)
      this.$store.dispatch('members/create', event)
        .then((result) => {
          console.log('Got result:', result)
          this.$router.push({ name: 'gym-members', params: { id: this.gymId } })
        })
    }
  }
}
</script>

<style scoped>

</style>
