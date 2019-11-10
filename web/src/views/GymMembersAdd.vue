<template>
  <v-form ref="form">
    <v-container fill-height fluid grid-list-xl pt-0>
      <v-layout justify-center wrap>
        <v-flex xs12 md8>
          <material-card offset="12">
            <v-stepper v-model="e1">
              <v-stepper-header>
                <v-stepper-step :complete="e1 > 1" step="1"
                                :rules="[() => this.stepperState[0]]"
                                editable>
                  Personal Details
                </v-stepper-step>
                <v-stepper-step :complete="e1 > 2" step="2"
                                :rules="[() => this.stepperState[1]]"
                                >
                  Contact</v-stepper-step>
                <v-stepper-step :complete="e1 > 3" step="3"
                                :rules="[() => this.stepperState[2]]"
                                >
                  Emergency Contact</v-stepper-step>
                <v-stepper-step step="4"
                                :rules="[() => this.stepperState[3]]"
                                @click="validatePreviousSteps(4)"
                                >Waiver</v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <!-------------------------- STEP 1 ------------------------------------------------------------------>
                <v-stepper-content step="1">
                  <v-card class="mb-12" >
                    <v-form ref="formStep1">
                      <v-flex xs12 md12>
                        <v-text-field
                          class="purple-input"
                          label="First Name"
                          :rules="[rules.required]"
                          required
                          autocomplete="off"
                          v-model="member.firstName"/>
                      </v-flex>

                      <v-flex xs12 md12>
                        <v-text-field
                          class="purple-input"
                          label="Nickname (optional)"
                          required
                          autocomplete="off"
                          v-model="member.nickname"/>
                      </v-flex>

                      <v-flex xs12 md12>
                        <v-text-field
                          class="purple-input"
                          label="Last Name"
                          autocomplete="off"
                          :rules="[rules.required]"
                          v-model="member.lastName"/>
                      </v-flex>

                      <v-flex xs12 md12>
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

                      <v-flex xs12 md12 v-if="gym.memberTags.length > 0">
                        <div v-for="tagType in gym.memberTags" v-bind:key="tagType.tag">
                          <v-checkbox v-model="member.tags" :label="tagType.name" :value="tagType.tag"></v-checkbox>
                        </div>
                      </v-flex>

                    </v-form>
                  </v-card>
                  <v-btn
                    color="primary"
                    @click="validateAndStep($refs.formStep1, 2)"
                  >
                    Continue
                  </v-btn>

                </v-stepper-content>

                <!-------------------------- STEP 2 ------------------------------------------------------------------>
                <v-stepper-content step="2">
                  <v-card
                    class="mb-12"
                  >

                    <v-form ref="formStep2">
                      <v-flex xs12 md12>
                        <v-text-field
                          class="purple-input"
                          label="Email"
                          autocomplete="off"
                          :rules="[rules.email]"
                          v-model="member.email"/>
                      </v-flex>

                      <v-flex xs12 md12>
                        <v-text-field
                          class="purple-input"
                          label="Phone number"
                          autocomplete="off"
                          :rules="[rules.phone]"
                          v-model="member.phone"/>
                      </v-flex>
                    </v-form>

                  </v-card>

                  <v-btn
                    color="primary"
                    @click="validateAndStep($refs.formStep2, 3)"
                  >
                    Continue
                  </v-btn>

                  <v-btn text
                         @click="e1 = e1 - 1">Back</v-btn>
                </v-stepper-content>

                <!-------------------------- STEP 3 ------------------------------------------------------------------>
                <v-stepper-content step="3">
                  <v-card
                    class="mb-12"
                  >
                    <v-form ref="formStep3">
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

                    </v-form>
                  </v-card>

                  <v-btn
                    color="primary"
                    @click="validateAndStep($refs.formStep3, 4)"
                  >
                    Continue
                  </v-btn>

                  <v-btn text
                         @click="e1 = e1 - 1">Back</v-btn>
                </v-stepper-content>

                <!-------------------------- STEP 4 ------------------------------------------------------------------>
                <v-stepper-content step="4">
                  <v-card
                    class="mb-12"
                  >
                    <v-form ref="formStep4">

                      <v-flex xs12 md12 ref="fullWaiver">
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
                          id="waiverApprovalCheckbox"
                          @change="clickedAgreeToTerms"
                          :rules="[rules.required]"
                          :disabled="!this.needsToSign"
                          v-model="agreeToTerms" label="I agree to the terms above"/>

                        <template v-if="expandSignature">
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
                          <v-flex xs12 text-xs-right>
                            <v-btn
                              class="mx-0 font-weight-light"
                              color="normal"
                              @click="clearSignature">
                              Clear Signature
                            </v-btn>
                          </v-flex>
                        </template>
                      </v-flex>
                    </v-form>
                  </v-card>

                  <v-btn
                    color="primary"
                    @click="validateAndCreate($refs.formStep4)"
                  >
                    Save
                  </v-btn>

                  <v-btn text
                         @click="e1 = e1 - 1">Back</v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </material-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex'
import { EventBus } from '../event-bus'
import { trim } from 'lodash'
import moment from 'moment'

export default {
  name: 'GymMembersAdd',
  props: ['gymId'],
  data () {
    return {
      windowWidth: window.innerWidth,
      stepperState: [true, true, true, true],
      e1: 0,
      gym: { 'memberTags': [] },
      member: {
        firstName: '',
        lastName: '',

        email: '',
        phone: '',
        tags: []
      },
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
  //  components: {
  //    'mp-member-form': MemberForm
  //  },
  computed: {
  },
  watch: {
    dateOfBirthMenu (val) {
      val && setTimeout(() => (this.$refs.dateOfBirthPicker.activePicker = 'YEAR'))
    }
  },
  mounted: async function () {
    await this.getGym(this.gymId).then(result => { this.gym = result })
  },
  methods: {
    ...mapActions('gyms', {
      getGym: 'get'
    }),

    validatePreviousSteps: function (stepNumber) {
      let forms = [this.$refs.formStep1, this.$refs.formStep2, this.$refs.formStep3]

      let allValid = true
      for (let i = 0; i < stepNumber - 1; i++) {
        let formValid = forms[i].validate()
        allValid = allValid && formValid
        this.stepperState[i] = formValid
      }
      return allValid
    },
    validateAndStep: function (form, nextStep) {
      if (!form.validate()) {
        //          EventBus.$emit('user-message', { message: 'Please correct the errors above', type: 'error' })
        this.stepperState[nextStep - 2] = false
        return
      }
      this.stepperState[nextStep - 2] = true
      this.e1 = nextStep
    },
    // TODO: copied from MemberForm
    validateAndCreate: async function (form) {
      if (!form.validate()) {
        //          EventBus.$emit('user-message', { message: 'Please correct the errors above', type: 'error' })
        return
      }

      EventBus.$emit('loading', { message: 'Saving' })
      if (this.needsToSign) {
        if (this.$refs.signaturePad.isEmpty()) {
          EventBus.$emit('user-message', { message: 'Please sign the waiver to continue', type: 'error' })
          EventBus.$emit('loading', { done: true })
          return
        } else {
          this.member.waiverSignature = await this.readWaiverAsPng()
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

      this.saveMemberAndDisplay(this.member)
    },
    readWaiverAsPng: function () {
      const self = this
      return new Promise(async function (resolve) {
        const canvas = await self.$html2canvas(self.$refs.fullWaiver, { type: 'canvas', windowWidth: 1000 })
        canvas.toBlob(resolve)
      })
    },

    saveMemberAndDisplay: function (event) {
      event.gymId = this.gymId
      console.log('Saving member and redisplaying:', event)
      const waiverSignature = event.waiverSignature
      delete event.waiverSignature
      this.$store.dispatch('members/create', event)
        .then((result) => {
          console.log('Got result:', result)

          EventBus.$emit('loading', { message: 'Uploading waiver' })

          result.waiverSignature = waiverSignature
          console.log('patching', result)
          result.save()
            .then((uploadResult) => {
              console.log('upload result', uploadResult)
              this.$router.push({ name: 'gym-members-view', params: { gymId: this.gymId, memberId: result.id } })
              EventBus.$emit('loading', { done: true })
            })
            .catch((uploadError) => {
              EventBus.$emit('user-message', { message: `Error uploading waiver: ${uploadError.message}. Please resign and save.`, type: 'error' })
              EventBus.$emit('loading', { done: true })
              this.$router.push({ name: 'gym-members-view', params: { gymId: this.gymId, memberId: result.id } })
            })
        })
        .catch((e) => {
          console.log('** Login catch: ', e)
          EventBus.$emit('user-message', { message: `Error adding member: ${e.message}`, type: 'error' })
          EventBus.$emit('loading', { done: true })
        })
    },
    // TODO: copied from MemberForm
    saveDateOfBirth (date) {
      console.log('Saving dateOfBirth: ', date)
      this.member.dateOfBirth = moment(date).format('YYYY-MM-DD')
      this.$refs.dateOfBirthMenu.save(this.formatDateTime(date))
      this.dateOfBirth = this.member.dateOfBirth
      this.evaluateDateOfBirth(date)
    },
    // TODO: copied from MemberForm
    formatDateTime (dateTime) {
      return dateTime + 'T00:00:00'
    },
    // TODO: copied from MemberForm
    evaluateDateOfBirth (date) {
      const age = moment().diff(date, 'years')
      this.isMinor = age < 18
    },
    // TODO: copied from MemberForm
    async clearSignature () {
      await this.$refs.signaturePad.clearSignature()
    },
    // TODO: copied from MemberForm
    clickedAgreeToTerms () {
      if (this.agreeToTerms && !this.$refs.form.validate()) {
        EventBus.$emit('user-message', { message: 'Please finish filling out the form before agreeing', type: 'error' })
        this.$nextTick(function () { this.agreeToTerms = false })
        return
      }
      this.showSignatureBox()
      this.$vuetify.goTo(document.getElementById('waiverApprovalCheckbox'), {})
    },
    // TODO: copied from MemberForm
    async showSignatureBox () {
      if (!this.agreeToTerms) {
      } else {
        this.expandSignature = true
      }
    },
    currentDate () { return moment().format('MMMM D, YYYY') }
  }

}
</script>

<style scoped>

</style>
