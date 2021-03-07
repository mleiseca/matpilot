<template>
  <v-fade-transition mode="out-in">
    <material-card>
      <template >
        <div slot="header">
          <div class="text-h6 font-weight-light mb-2" v-if="gym !== undefined">{{ gym.name }}</div>
        </div>
        <v-card-text >
          <v-progress-circular :indeterminate="true" v-if="gymScheduledEvents.length === 0"/>
            <user-gym-event-registration
              v-bind:scheduled-events="gymScheduledEvents"
              v-bind:existing-events="gymEvents"
              v-bind:members="members"
              v-bind:gymId="gymId" />
        </v-card-text>
      </template>
    </material-card>
  </v-fade-transition>
</template>

<script>
import fetchGymScheduledEvents from '../../mixins/fetchGymScheduledEvents'

export default {
  name: 'UserGymOverviewCard',
  mixins: [fetchGymScheduledEvents],
  props: {
    gymId: [String, Number],
    members: Array,
    registrationRecords: Array
  }
}
</script>

<style>
  /*.v-card__text {*/
    /*display: inline-block;*/
    /*width: 100%;*/
    /*!*padding: 0px;*!*/
    /*padding-left: 10px !important;*/
    /*padding-right: 10px !important;*/
    /*padding-top: 10px !important;*/
  /*}*/
</style>
