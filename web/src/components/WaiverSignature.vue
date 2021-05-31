<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container class="lighten-5" ref="fullWaiver">
    <v-row no-gutters>
      {{ waiver.name }}
    </v-row>

    <v-row no-gutters>
      <div v-html="waiver.contents"></div>
    </v-row>
    <v-row>
    <v-checkbox
      id="waiverApprovalCheckbox"
      :rules="[rules.required]"
      v-model="agreeToTerms" label="I agree to the terms above"/>

    </v-row>
    <template v-if="agreeToTerms">
      <div><span>Name: </span><span>{{ this.member.firstName + ' ' + this.member.lastName }}</span></div>
      <template v-if="isMinor">
        <div><span>Parent or Guardian: </span><span>{{ this.guardianContactName }}</span></div>
      </template>
      <div><span>Date: </span><span>{{ this.currentDate() }}</span></div>

      <div style="padding-top: 10px;">
        <template v-if="isMinor">
          Parent or Guardian Signature:
        </template>
        <template v-else>
          Signature:
        </template>
      </div>
      <VueSignaturePad
        :width="'' + windowWidth"
        height="300px"
        ref="signaturePad"
        :customStyle="{ border: 'black 3px solid' }"

      />
      <v-flex xs12 text-right>
        <v-btn
          class="mx-0 font-weight-light"
          color="normal"
          @click="clearSignature">
          Clear Signature
        </v-btn>
      </v-flex>
      <v-row>
        <v-flex xs6 md3>
          <v-btn
            color="success"
            @click="save">
            Save
          </v-btn>
        </v-flex>
      </v-row>
    </template>

  </v-container>
</template>

<script>
  import { EventBus } from '../event-bus'
  import { isNil } from 'lodash'
  import moment from "moment";

  export default {
    name: 'WaiverSignature',
    props: {
      waiver: { type: Object },
      member: { type: Object }
    },
    data () {
      return {
        windowWidth: window.innerWidth,
        agreeToTerms: false,
        rules: {
          required: value => !!value || 'Required.'
        },
      }
    },

    // mounted: function () {
    //   this.$watch('waiver', w => {
    //     console.log('new waiver', w)
    //     this.loadWaiverIntoForm(w)
    //   })
    // },
    computed: {
      isMinor() {
        return !isNil(this.member.dateOfBirth) &&
          moment().diff(this.member.dateOfBirth, 'years') < 18
      },
      guardianContactName() {
        if (!isNil(this.member.guardianContacts) && this.member.guardianContacts.length > 0){
          return this.member.guardianContacts[0].guardianContactName || this.member.guardianContacts[0].name
        } else {
          return ""
        }
      }
    },
    methods: {
      save: async function (event) {
        event.preventDefault()

        if (this.$refs.signaturePad.isEmpty()) {
          EventBus.$emit('user-message', { message: 'Please sign the waiver to continue', type: 'error' })
          return
        }

        EventBus.$emit('loading', { done: false })
        const gymMemberWaiverSignature = {
          memberId: this.member.id,
          gymId: this.waiver.gymId,
          gymWaiverId: this.waiver.id,
          waiverName: this.waiver.name
        }
        gymMemberWaiverSignature.waiverSignature = await this.readWaiverAsPng()

        // This is sad, but needs to be emitted before saving. The issue is that this component is removed from the page
        // when the update goes through....that removes the listener on the parent before the message can be sent
        this.$emit('waiver-signature-save')

        this.$store.dispatch('gym-waiver-member-signatures/create', gymMemberWaiverSignature)
          .then((result) => {
            EventBus.$emit('loading', { done: true })
            console.log('(waiver sig saved) Got result:', result)

            // this.stepperState[nextStep - 2] = true
            // this.e1 = nextStep
          })
          .catch((e) => {
            console.log('** Login catch: ', e)
            EventBus.$emit('user-message', { message: `Error: ${e.message}`, type: 'error' })
            EventBus.$emit('loading', { done: true })
          })
      },
      cancel: function (event) {
        event.preventDefault()
        // this.$emit('gym-waiver-edit-cancel', this.waiver)
      },
      currentDate () { return moment().format('MMMM D, YYYY') },
      readWaiverAsPng: function () {
        const self = this
        return new Promise(async function (resolve) {
          const canvas = await self.$html2canvas(self.$refs.fullWaiver, { type: 'canvas', windowWidth: 1000 })
          canvas.toBlob(resolve)
        })
      },

      async clearSignature () {
        await this.$refs.signaturePad.clearSignature()
      },
      // async showSignatureBox () {
      //   if (!this.agreeToTerms) {
      //   } else {
      //     this.expandSignature = true
      //   }
      // },
    }
  }
</script>

<style scoped>

  h1 {
    padding-left: .5rem;
  }

</style>
