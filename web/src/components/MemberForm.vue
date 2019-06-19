<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-form ref="form">
    <v-container py-0>
      <v-layout wrap>
        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="First Name"
            :rules="[rules.required]"
            required
            v-model="member.firstName"/>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Last Name"
            :rules="[rules.required]"
            v-model="member.lastName"/>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Email"
            :rules="[rules.email]"
            v-model="member.email"/>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Phone number"
            :rules="[rules.phone]"
            v-model="member.phone"/>
        </v-flex>

        <v-flex xs12 sm6 md4>
          <v-menu
            ref="dateOfBirthMenu"
            v-model="dateOfBirthMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dateOfBirth"
                label="Date of Birth"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
                :rules="[rules.required]"
              ></v-text-field>
            </template>
            <v-date-picker
              ref="dateOfBirthPicker"
              v-model="dateOfBirth"
              :max="new Date().toISOString().substr(0, 10)"
              min="1940-01-01"
              @change="saveDateOfBirth"
            ></v-date-picker>
          </v-menu>
        </v-flex>

        <v-flex xs12 md12 v-if="isMinor">
          <v-text-field
            class="purple-input"
            label="Parent or Guardian"
            :rules="[rules.requiredIfMinor]"
            v-model="guardianContactName"/>
        </v-flex>
        <v-flex xs12 md12 v-if="isMinor">
          <v-text-field
            class="purple-input"
            label="Parent or Guardian Contact Phone"
            :rules="[rules.requiredIfMinor, rules.phone]"
            v-model="guardianContactPhone"/>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Emergency Contact Name"
            :rules="[]"
            v-model="emergencyContactName"/>
        </v-flex>
        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Emergency Contact Phone"
            :rules="[rules.phone]"
            v-model="emergencyContactPhone"/>
        </v-flex>

        <v-flex xs12 md12>
          <strong>WAIVER AND RELEASE OF LIABILITY AND AGREEMENT TO PARTICIPATE IN ACTIVITY WITH:</strong><br>
          <strong>FOUNDATIONS BJJ ACADEMY</strong><br>
          <strong>IN THE MARTIAL ART STYLES OF BRAZILIAN JIU JITSU, JUDO, WRESTLING, SUBMISSION GRAPPLING</strong><br>
          <p>1. Acknowledge that I am familiar with the sport of judo/wrestling/submission wrestling/M.M.A and
          understand the rules governing the sport of judo/wrestling/Submission Grappling/M.M.A.</p>
          <p>2. Agree that prior to participating, I will inspect the mats, equipment, facilities, and if I believe anything
          unsafe or beyond my capability, I will immediately advise my coach, supervisor of such conditions and
          refuse to participate.</p>
          <p>3. Acknowledge and fully understand that I will be engaging in a contact sport that might result in
          serious injury, including permanent disability or death, and severe social and economic losses due to not
          only my own actions, inaction’s or negligence, but also to the actions, inaction’s or negligence of others,
          the rules of the sport Judo/wrestling/submission grappling, or conditions of the premises or of any
          equipment used. Further, I acknowledge that there may be other risks not known to me or not
          reasonably foreseeable at this time.</p>
          <p>4. Knowing the risks involved in the sport of Judo/wrestling/submission grappling, I assume all such risks
          and accept personal responsibility for the damages following such injury, permanent disability, or death.</p>
          <p>5. Release, waive, discharge and covenant not to sue the Foundations BJJ Academy, together with their
          affiliated clubs, their respective administrators, directors, agents, coaches and other employees or
          volunteers of the organization, events officials, medical personnel, other participants, their parents,
          guardians, supervisors and conduct the event, all of whom are hereinafter referred to as “releasee”,
          from any and all claims, demands, losses, or damages on account of injury, including permanent
          disability and death and damage to property, caused or alleged to be caused in whole or in part by the
          negligence of the releasee or otherwise to the fullest extent permitted by law.</p>
          <p><strong>I HAVE READ THE ABOVE WARNING, WAIVER AND RELEASE, UNDERSTAND THAT I GIVE UP SUBSTANTIAL
          RIGHTS BY SIGNING IT, AND KNOWING THIS, SIGN VOLUNTARILY. I AGREE TO PARTICIPATE KNOWING
          THE RISK AND CONDITIONS INVOLVED AND DO SO ENTIRELY OF MY OWN FREE WILL. I AFFIRM THAT I
          AM AT LEAST 18 YEARS OF AGE, OR, IF I AM UNDER 18 YEARS OF AGE, I HAVE OBTAINED THE REQUIRED
          CONSENT OF MY PARENT/GUARDIAN AS EVIDENCE BY THEIR SIGNATURE BELOW.</strong></p>

          <v-checkbox
            @change="clickedAgreeToTerms"
            :rules="[rules.required]"
            v-model="agreeToTerms" label="I agree to the terms above"/>

          <template v-if="expandSignature">
          <VueSignaturePad
            width="600px"
            height="300px"
            ref="signaturePad"
            :options="{ onBegin}"
          />
          <v-btn
            class="mx-0 font-weight-light"
            color="normal"
            @click="clearSignature">
            Clear Signature
          </v-btn>
          </template>
        </v-flex>

        <v-flex xs12 text-xs-right>
          <v-btn
            class="mx-0 font-weight-light"
            color="success"
            @click="save">
            Save
          </v-btn>
        </v-flex>

        <div class="outer">
          <div class="inner">
            <canvas ref="canvas" width="600px" height="300px"></canvas>
          </div>
        </div>

      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import { trim } from 'lodash'
import moment from 'moment'
import { EventBus } from './../event-bus.js'

export default {
  name: 'MemberForm',
  props: {
    //    Note: if you provide a vuex member object, the vuex object will be included with the 'member-save' event
    //    If you don't provide a member, you will get back just a data object.
    member: {
      type: Object,
      default: function () {
        return {
          firstName: '',
          lastName: '',

          email: '',
          phone: ''
        }
      }
    }
  },
  data () {
    return {
      loading: false,
      errorMessage: null,
      showErrorMessage: false,
      modalDateOfBirth: false,
      guardianContactName: '',
      guardianContactPhone: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      dateOfBirth: null,
      output: null,
      isMinor: false,
      agreeToTerms: false,
      expandSignature: false,
      dateOfBirthMenu: false,
      needsToSign: true,
      rules: {
        requiredIfMinor: value => !this.isMinor || !!value || 'Required for minors',
        required: value => !!value || 'Required.',
        email: value => {
          value = trim(value)
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return (value.length === 0) || pattern.test(value) || 'Invalid e-mail.'
        },
        phone: value => {
          value = trim(value)
          const pattern = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/
          return (value.length === 0) || pattern.test(value) || 'Invalid phone number.'
        }
      }
    }
  },
  watch: {
    dateOfBirthMenu (val) {
      val && setTimeout(() => (this.$refs.dateOfBirthPicker.activePicker = 'YEAR'))
    }
  },
  mounted: function () {
    this.$watch('member', m => {
      if (m.emergencyContacts) {
        this.emergencyContactName = m.emergencyContacts[0].name
        this.emergencyContactPhone = m.emergencyContacts[0].phone
      }
      if (m.guardianContacts) {
        this.guardianContactName = m.guardianContacts[0].name
        this.guardianContactPhone = m.guardianContacts[0].phone
      }

      this.saveDateOfBirth(m.dateOfBirth)
      this.agreeToTerms = m.waiverSignedDate !== null
      this.needsToSign = m.waiverSignedDate === null
    })
  },
  methods: {
    save: function (event) {
      event.preventDefault()
      if (!this.$refs.form.validate()) {
        EventBus.$emit('user-message', { message: 'Please correct the errors above', type: 'error' })
        return
      }

      if (this.needsToSign) {
        if (!this.hasSigned) {
          EventBus.$emit('user-message', {message: 'Please sign the waiver to continue', type: 'error'})
          return
        } else {
          this.member.waiverSignature = this.$refs.signaturePad.saveSignature().data
        }
      }

      this.member.emergencyContacts = [
        {
          name: this.emergencyContactName,
          phone: this.emergencyContactPhone
        }
      ]
      this.member.guardianContacts = [
        {
          name: this.guardianContactName,
          phone: this.guardianContactPhone
        }
      ]

      if (this.agreeToTerms && this.member.waiverSignedDate === null) {
        this.member.waiverSignedDate = moment()
      }

      console.log('Member saved!', this.member)
      this.$emit('member-save', this.member)
    },
    onBegin() {
      this.hasSigned = true
    },
    evaluateDateOfBirth (date) {
      const age = moment().diff(date, 'years')
      console.log('age: ', age)
      this.isMinor = age < 18
    },
    saveDateOfBirth (date) {
      console.log('Saving dateOfBirth: ', date)
      this.member.dateOfBirth = moment(date).format('YYYY-MM-DD')
      this.$refs.dateOfBirthMenu.save(this.formatDateTime(date))
      this.dateOfBirth =this.member.dateOfBirth
      this.evaluateDateOfBirth(date)
    },
    async clearSignature () {
      await this.$refs.signaturePad.clearSignature()
      await this.$refs.signaturePad.clearCacheImages()

      this.clearTextCanvas()
      this.addSignatureDetails()
    },
    clearTextCanvas () {
      const canvasEl = this.$refs.canvas
      const ctx = canvasEl.getContext('2d')
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
      this.hasSigned = false
    },
    clickedAgreeToTerms () {
      if (this.agreeToTerms && !this.$refs.form.validate()) {
        EventBus.$emit('user-message', { message: 'Please finish filling out the form before agreeing', type: 'error' })
        this.$nextTick(function () { this.agreeToTerms = false })
        return
      }
      this.showSignatureBox()
    },
    async addSignatureDetails () {
      const canvasEl = this.$refs.canvas
      var ctx = canvasEl.getContext('2d')
      ctx.font = '12px'
      let termsText = [
        'I HAVE READ THE ABOVE WARNING, WAIVER AND RELEASE, UNDERSTAND THAT I GIVE UP SUBSTANTIAL ',
        'RIGHTS BY SIGNING IT, AND KNOWING THIS, SIGN VOLUNTARILY. I AGREE TO PARTICIPATE KNOWING ',
        'THE RISK AND CONDITIONS INVOLVED AND DO SO ENTIRELY OF MY OWN FREE WILL. I AFFIRM THAT I AM',
        'AT LEAST 18 YEARS OF AGE, OR, IF I AM UNDER 18 YEARS OF AGE, I HAVE OBTAINED THE REQUIRED ',
        'CONSENT OF MY PARENT/GUARDIAN AS EVIDENCE BY THEIR SIGNATURE BELOW.']
      termsText.forEach((line, i) => ctx.fillText(line, 0, i * 30 + 10))
      ctx.font = '18px'
      const signStartY = 130
      ctx.fillText('Name:', 0, signStartY + 50)
      ctx.fillText(this.member.firstName + ' ' + this.member.lastName, 150, signStartY + 50)

      if (this.isMinor) {
        ctx.fillText('Parent or Guardian:', 0, signStartY + 80)
        ctx.fillText(this.guardianContactName, 150, signStartY + 80)
        ctx.fillText('Parent or Guardian Signature:________________________________________________________________________', 0, signStartY + 130)
        ctx.fillText('Date: ' + moment().format('YYYY-MM-DD'), 0, signStartY + 160)
      } else {
        ctx.fillText('Signature:________________________________________________________________________', 0, signStartY + 100)
        ctx.fillText('Date     : ' + moment().format('YYYY-MM-DD'), 0, signStartY + 130)
      }
      // add option type to get the image version
      // if not provided the promise will return
      // the canvas.
      const options = {
        type: 'dataURL'
      }
      console.log('trying to add image to canvas....')
      this.output = await this.$html2canvas(canvasEl, options)
      this.$refs.signaturePad.addImages(this.$refs.signaturePad.fromDataURL(this.output))
      return true
    },
    async showSignatureBox () {
      if (!this.agreeToTerms) {
        this.clearTextCanvas()
      } else {
        this.expandSignature = true
        await this.addSignatureDetails()
      }
    },
    // TODO: copied from ScheduledEventForm
    formatDateTime (dateTime) {
      return dateTime + 'T00:00:00'
    }

  }
}
</script>

<style scoped>

  h1 {
    padding-left: .5rem;
  }

  .outer {
    overflow: hidden;
    position: relative;
  }
  .inner {
    position: absolute;
    height: 100px;
    width: 100px;
    right: -50px;
    top: 50px;
  }

</style>
