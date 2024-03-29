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
            autocomplete="off"
            v-model="memberCopy.firstName"/>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Nickname (optional)"
            required
            autocomplete="off"
            v-model="memberCopy.nickname"/>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Last Name"
            autocomplete="off"
            :rules="[rules.required]"
            v-model="memberCopy.lastName"/>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Email"
            autocomplete="off"
            :rules="[rules.email]"
            v-model="memberCopy.email"/>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Phone number"
            autocomplete="off"
            :rules="[rules.phone]"
            v-model="memberCopy.phone"/>
        </v-flex>

        <v-flex xs12 md12>
          <v-menu
            ref="dateOfBirthMenu"
            v-model="dateOfBirthMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dateOfBirth"
                label="Date of Birth"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
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

        <v-flex xs12 md12 v-if="gym && gym.memberTags && gym.memberTags.length > 0">
          <div v-for="tagType in gym.memberTags" v-bind:key="tagType.tag">
            <v-checkbox v-model="memberCopy.tags" :label="tagType.name" :value="tagType.tag"></v-checkbox>
          </div>
        </v-flex>

        <v-flex xs12 md12 v-if="isMinor">
          <v-text-field
            class="purple-input"
            label="Parent or Guardian"
            :rules="[rules.requiredIfMinor]"
            autocomplete="off"
            v-model="guardianContactName"/>
        </v-flex>
        <v-flex xs12 md12 v-if="isMinor">
          <v-text-field
            class="purple-input"
            label="Parent or Guardian Contact Phone"
            :rules="[rules.requiredIfMinor, rules.phone]"
            autocomplete="off"
            v-model="guardianContactPhone"/>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Emergency Contact Name"
            :rules="[]"
            autocomplete="off"
            v-model="emergencyContactName"/>
        </v-flex>
        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Emergency Contact Phone"
            :rules="[rules.phone]"
            autocomplete="off"
            v-model="emergencyContactPhone"/>
        </v-flex>

        <!--<v-flex xs12 md12 v-if="!this.needsToSign">-->
          <!--<a :href="memberCopy.waiverSignedUrl" target="_blank">-->
            <!--View signed waiver-->
          <!--</a>-->
        <!--</v-flex>-->
        <v-flex xs12 md12 ref="fullWaiver" v-if="this.needsToSign">
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
            <div><span>Name: </span><span>{{ this.memberCopy.firstName + ' ' + this.memberCopy.lastName }}</span></div>
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
          </template>
        </v-flex>

        <v-flex xs6 md3>
          <v-btn
            class="font-weight-light"
            @click="cancel">
            Cancel
          </v-btn>
        </v-flex>
        <v-flex xs6 md3>
          <v-btn
            color="success"
            @click="save">
            Save
          </v-btn>
        </v-flex>
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
    member: { type: Object },
    gym: { type: Object }
  },
  data () {
    return {
      windowWidth: window.innerWidth,
      memberCopy: {},
      guardianContactName: '',
      guardianContactPhone: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      dateOfBirth: null,
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
    window.onresize = () => {
      this.windowWidth = window.innerWidth
    }
    this.loadMemberIntoForm(this.member)
    this.$watch('member', m => {
      this.loadMemberIntoForm(m)
    })
  },
  methods: {
    loadMemberIntoForm (m) {
      this.memberCopy = m.clone()
      if (m.emergencyContacts && m.emergencyContacts.length > 0) {
        this.emergencyContactName = m.emergencyContacts[0].name
        this.emergencyContactPhone = m.emergencyContacts[0].phone
      }
      if (m.guardianContacts && m.guardianContacts.length > 0) {
        this.guardianContactName = m.guardianContacts[0].name
        this.guardianContactPhone = m.guardianContacts[0].phone
      }

      if (m.dateOfBirth) {
        this.saveDateOfBirth(m.dateOfBirth)
      }
      this.agreeToTerms = m.waiverSignedDate !== null
      this.needsToSign = m.waiverSignedDate === null
    },

    save: async function (event) {
      event.preventDefault()
      if (!this.$refs.form.validate()) {
        EventBus.$emit('user-message', { message: 'Please correct the errors above', type: 'error' })
        return
      }

      EventBus.$emit('loading', { message: 'Saving' })
      if (this.needsToSign) {
        if (this.$refs.signaturePad.isEmpty()) {
          EventBus.$emit('user-message', { message: 'Please sign the waiver to continue', type: 'error' })
          EventBus.$emit('loading', { done: true })
          return
        } else {
          this.memberCopy.waiverSignature = await this.$html2canvas(this.$refs.fullWaiver, { type: 'dataURL' })
        }
      }

      this.memberCopy.emergencyContacts = [
        {
          name: this.emergencyContactName,
          phone: this.emergencyContactPhone
        }
      ]
      this.memberCopy.guardianContacts = [
        {
          name: this.guardianContactName,
          phone: this.guardianContactPhone
        }
      ]

      console.log('Member saved!', this.memberCopy)
      this.$emit('member-save', this.memberCopy)
    },
    cancel: function (event) {
      event.preventDefault()
      this.$emit('member-edit-cancel', this.member)
    },
    currentDate () { return moment().format('MMMM D, YYYY') },
    evaluateDateOfBirth (date) {
      const age = moment().diff(date, 'years')
      this.isMinor = age < 18
    },
    saveDateOfBirth (date) {
      this.dateOfBirth = moment.utc(date).format('YYYY-MM-DD')
      this.memberCopy.dateOfBirth = this.formatDateTime(this.dateOfBirth)
      this.$refs.dateOfBirthMenu.save(this.memberCopy.dateOfBirth)
      this.evaluateDateOfBirth(date)
    },
    async clearSignature () {
      await this.$refs.signaturePad.clearSignature()
    },
    clickedAgreeToTerms () {
      if (this.agreeToTerms && !this.$refs.form.validate()) {
        EventBus.$emit('user-message', { message: 'Please finish filling out the form before agreeing', type: 'error' })
        this.$nextTick(function () { this.agreeToTerms = false })
        return
      }
      this.showSignatureBox()
    },

    async showSignatureBox () {
      if (!this.agreeToTerms) {
      } else {
        this.expandSignature = true
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

</style>
