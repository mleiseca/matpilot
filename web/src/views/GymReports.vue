<template>
  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card
          title="Reports"
          text="">

          <v-container class="grey lighten-5">
            <v-row no-gutters>
              <router-link :to="{ name: 'gym-reports-member'}">Members Report</router-link>
              <router-link :to="{ name: 'gym-reports-schedule'}">Schedule Report</router-link>
            </v-row>
          </v-container>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'GymReports',
    props: ['gymId'],
    data () {
      return {}
    }
  }
</script>

<style scoped>

</style>
