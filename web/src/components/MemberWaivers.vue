<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">

  <v-container class="pa-0 lighten-5" ref="waiversContainer">
    <v-stepper  outlined flat elevation-0 v-model="currentWaiver" vertical >
        <template v-for="(waiverAndSignature, index) in waiverAndSignatures">
          <v-stepper-step
            v-on:click="maybeOpenSignedDoc(index)"
            :key="`${index + 1}-step`"
            :complete="currentWaiver > index + 1 || (waiverAndSignature.signature !== undefined)"
            :step="index + 1 "
            class="always_display"
            editable
            edit-icon="$complete"
            :rules="[() => waiverAndSignature.signature !== undefined]"
          >
            {{ waiverAndSignature.waiver.name }}
          </v-stepper-step>

        <v-stepper-content
          pa-0
          :key="`${index + 1}-content`"
          :step="index + 1"
        >
            <waiver-signature v-if="waiverAndSignature.signature === undefined"
                              v-bind:waiver="waiverAndSignature.waiver"
                              v-bind:member="member"
                              v-on:waiver-signature-save="waiverSaved"/>
        </v-stepper-content>
        </template>

    </v-stepper>
  </v-container>
</template>

<script>
// import { EventBus } from './../event-bus.js'

import { isNil } from 'lodash'
import fetchWaivers from '../mixins/fetchWaivers'
import fetchMemberWaivers from '../mixins/fetchMemberWaivers'
import WaiverSignature from './WaiverSignature'

export default {
  name: 'MemberWaivers',
  components: { WaiverSignature },
  mixins: [fetchWaivers, fetchMemberWaivers],
  props: {
    member: { type: Object },
    gymId: [String, Number],
    alertUnsigned: { type: Boolean }
  },
  data () {
    return {
      currentWaiver: 0,
      waiverAndSignatures: []
    }
  },

  mounted: function () {
    const w = this.gymWaivers
    console.log('at mount time, gymwaivers is', w)
    if (!this.alertUnsigned && !isNil(w) && w.length > 0) {
      this.$nextTick(function () { this.currentWaiver = 1 })
    }
  },
  watch: {
    memberId: function (m) {
      console.log('got update on gymWaivers -> memberId', m)
    },
    gymWaivers: function (x) {
      console.log('got update on gymWaivers', x)
      if (!this.alertUnsigned) {
        this.$nextTick(function () {
          this.currentWaiver = 1
        })
      }
      this.updateMemberWaiverStatus()
    },
    memberWaivers: function (x) {
      console.log('got update on memberWaivers', x)
      this.updateMemberWaiverStatus()
    }
  },
  methods: {
    maybeOpenSignedDoc (index) {
      const waiverAndSig = this.waiverAndSignatures[index]
      if (waiverAndSig.signature !== undefined && waiverAndSig.signature.waiverSignedUrl !== undefined) {
        window.open(waiverAndSig.signature.waiverSignedUrl, '_blank')
      }
    },
    updateMemberWaiverStatus () {
      console.log('updating member waiver status')
      const existSigsByWaiverId = new Map()
      for (const memberSignture of this.memberWaivers) {
        existSigsByWaiverId.set(memberSignture.gymWaiverId, memberSignture)
      }
      this.waiverAndSignatures = []
      for (const waiver of this.gymWaivers) {
        this.waiverAndSignatures.push({
          waiver: waiver,
          signature: existSigsByWaiverId.get(waiver.id)
        })
      }
      console.log('this.waiverAndSignatures', this.waiverAndSignatures)
    },

    waiverSaved: function (waiverSignature) {
      console.log('(MemberWaivers) Waiver saved', waiverSignature, this.currentWaiver, this.gymWaivers.length)
      if (this.currentWaiver === this.gymWaivers.length) {
        this.$emit('gym-waivers-signed')
      } else {
        this.currentWaiver = this.currentWaiver + 1
      }
      this.$scrollTo(this.$refs.waiversContainer, 100, {})
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
