<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-form ref="form">

    <v-container class="pa-0 lighten-5">
      <v-stepper v-model="currentWaiver" vertical>
          <template v-for="(waiver, index) in gymWaivers">
            <v-stepper-step
              :key="`${index + 1}-step`"
              :complete="currentWaiver > index + 1"
              :step="index + 1 "
              class="always_display"
            >
              {{ waiver.name }}
            </v-stepper-step>

          <v-stepper-content
            pa-0
            :key="`${index + 1}-content`"
            :step="index + 1"
          >
            <waiver-signature v-bind:waiver="waiver" v-bind:member="member"
                              v-on:waiver-signature-save="waiverSaved"/>

<!--            <v-btn-->
<!--              color="primary"-->
<!--              @click="nextStep(n)"-->
<!--            >-->
<!--              Continue-->
<!--            </v-btn>-->

<!--            <v-btn text>-->
<!--              Cancel-->
<!--            </v-btn>-->
          </v-stepper-content>
          </template>

      </v-stepper>
    </v-container>
<!--      <v-row no-gutters>-->

<!--      </v-row>-->


<!--        <v-text-field-->
<!--          class="purple-input"-->
<!--          label="Name"-->
<!--          :rules="[rules.required]"-->
<!--          required-->
<!--          autocomplete="off"-->
<!--          v-model="waiverCopy.name"/>-->
<!--      </v-row>-->

<!--      <v-row no-gutters>-->
<!--        <tiptap-vuetify-->
<!--          v-model="waiverCopy.contents"-->
<!--          :extensions="extensions"-->
<!--        />-->
<!--      </v-row>-->

<!--      <v-row>-->
<!--        <v-flex xs6 md3>-->
<!--          <v-btn-->
<!--            color="success"-->
<!--            @click="save">-->
<!--            Save-->
<!--          </v-btn>-->
<!--        </v-flex>-->
<!--      </v-row>-->
  </v-form>
</template>

<script>
  // import { EventBus } from './../event-bus.js'

  import { isNil } from 'lodash'
  import fetchWaivers from "../mixins/fetchWaivers";
  import WaiverSignature from "./WaiverSignature";

  export default {
    name: 'MemberWaivers',
    components: {WaiverSignature},
    mixins: [fetchWaivers],
    props: {
      member: { type: Object },
      gymId: [String, Number]
    },
    data () {
      return {
        currentWaiver: 0
      }
    },

    mounted: function () {
      const w = this.gymWaivers
      console.log('at mount time, gymwaivers is', w)
      if (!isNil(w) && w.length > 0) {
        this.$nextTick(function () { this.currentWaiver = 1 })
      }
    },
    watch: {
      member: function(m) {
        console.log('got update on gymWaivers -> member', m)
      },
      gymWaivers: function(){
        console.log('got update on gymWaivers')
        this.$nextTick(function () { this.currentWaiver = 1 })
      }
    },
    methods: {
      waiverSaved: function(waiverSignature) {
        console.log("Waiver saved", waiverSignature)
        if (this.currentWaiver === this.gymWaivers.length) {
          this.$emit('gym-waivers-signed')
        } else {
          this.currentWaiver = this.currentWaiver + 1
        }
      }
    }
  }
</script>

<style>

  .always_display > .v-stepper__label{
    display: block !important;
  }



  h1 {
    padding-left: .5rem;
  }

</style>
