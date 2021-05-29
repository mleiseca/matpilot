<template>
  <material-card offset="12">
  <v-form ref="form">
    <v-container fill-height fluid grid-list-xl pa-0>
      <v-layout justify-center wrap>
        <v-flex xs12 md8>

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
                                >
                  Waivers
                </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <!-------------------------- STEP 1 ------------------------------------------------------------------>
                <v-stepper-content step="1">
<!--                  <v-card class="mb-12" >-->
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

                      <v-flex xs12 md12 v-if="gym.memberTags.length > 0">
                        <div v-for="tagType in gym.memberTags" v-bind:key="tagType.tag">
                          <v-checkbox v-model="member.tags" :label="tagType.name" :value="tagType.tag"></v-checkbox>
                        </div>
                      </v-flex>

                    </v-form>
<!--                  </v-card>-->
                  <v-btn
                    color="primary"
                    @click="validateAndStep($refs.formStep1, 2)"
                  >
                    Continue
                  </v-btn>

                </v-stepper-content>

                <!-------------------------- STEP 2 ------------------------------------------------------------------>
                <v-stepper-content step="2">
<!--                  <v-card-->
<!--                    class="mb-12"-->
<!--                  >-->

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

<!--                  </v-card>-->

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
<!--                  <v-card-->
<!--                    class="mb-12"-->
<!--                  >-->
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
<!--                  </v-card>-->

                  <v-btn
                    color="primary"
                    @click="validateCreateAndStep($refs.formStep3, 4)"
                  >
                    Continue
                  </v-btn>

                  <v-btn text
                         @click="e1 = e1 - 1">Back</v-btn>
                </v-stepper-content>

                <!-------------------------- STEP 4 ------------------------------------------------------------------>
                <v-stepper-content step="4" class="pa-0">
<!--                  <v-card-->
<!--                    class="mb-12"-->
<!--                  >-->
                    <v-form ref="formStep4">

                      <member-waivers v-bind:gym-id="gymId"
                                      v-bind:member="member"
                                      v-on:gym-waivers-signed="gymWaiversSigned">
                      </member-waivers>
                    </v-form>
<!--                  </v-card>-->
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
  </material-card>
</template>

<script>
import { mapActions } from 'vuex'
import { EventBus } from '../event-bus'
import { trim } from 'lodash'
import moment from 'moment'
import MemberWaivers from "../components/MemberWaivers";

export default {
  name: 'GymMembersAdd',
  components: {MemberWaivers},
  props: ['gymId'],
  data () {
    return {
      stepperState: [true, true, true, true],
      e1: 1,
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
        this.stepperState[nextStep - 2] = false
        return
      }
      this.stepperState[nextStep - 2] = true
      this.e1 = nextStep
    },
    validateCreateAndStep: async function (form, nextStep) {
      if (!form.validate()) {
        this.stepperState[nextStep - 2] = false
        return
      }

      EventBus.$emit('loading', { message: 'Saving' })
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

      this.member.gymId = this.gymId
      console.log('Saving member and redisplaying:', this.member)

      this.$store.dispatch('members/create', this.member)
        .then((result) => {
          EventBus.$emit('loading', { done: true })
          console.log('Got result:', result)
          this.member.id = result.id

          this.stepperState[nextStep - 2] = true
          this.e1 = nextStep
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
      this.dateOfBirth = moment.utc(date).format('YYYY-MM-DD')
      this.member.dateOfBirth = this.formatDateTime(this.dateOfBirth)
      this.$refs.dateOfBirthMenu.save(this.member.dateOfBirth)
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
    gymWaiversSigned() {
      this.$router.push({ name: 'gym-members-view', params: { gymId: this.gymId, memberId: this.member.id } })
    }
  }

}
</script>

<style scoped>

</style>
