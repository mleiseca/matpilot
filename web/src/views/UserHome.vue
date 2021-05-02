<template>

  <v-container fluid grid-list-xl fill-height pt-0 >
    <v-layout wrap>

      <v-flex xs12>
        <user-members-overview />
      </v-flex>

      <v-flex xs12 pb-0>
        <user-administration-card />
      </v-flex>

      <!--<v-flex xs12>-->
      <!--<checkin-list v-bind:scheduled-events="gymScheduledEvents"></checkin-list>-->
      <!--</v-flex>-->

    </v-layout>

  </v-container>
</template>

<script>

export default {
  name: 'UserHome'

}
</script>
