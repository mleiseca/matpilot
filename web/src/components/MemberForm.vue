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
          <v-dialog
            ref="dialogDateOfBirth"
            v-model="modalDateOfBirth"
            :return-value.sync="member.dateOfBirth"
            persistent
            lazy
            full-width
            width="290px">
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dateOfBirth"
                label="Date of Birth"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="dateOfBirth" scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="modalDateOfBirth= false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.dialogDateOfBirth.save(dateOfBirth)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Emergency Contact Name"
            :rules="[rules.required]"
            v-model="emergencyContactName"/>
        </v-flex>
        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Emergency Contact Phone"
            :rules="[rules.required, rules.phone]"
            v-model="emergencyContactPhone"/>
        </v-flex>

        <v-flex xs12 text-xs-right>
          <v-btn
            class="mx-0 font-weight-light"
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
      emergencyContactName: '',
      emergencyContactPhone: '',
      dateOfBirth: null,
      rules: {
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
  mounted: function () {
    this.$watch('member', m => {
      this.emergencyContactName = m.emergencyContacts[0].name
      this.emergencyContactPhone = m.emergencyContacts[0].phone

      this.dateOfBirth = moment(m.dateOfBirth).format('YYYY-MM-DD')
    })
  },
  methods: {
    save: function (event) {
      event.preventDefault()
      if (!this.$refs.form.validate()) {
        return
      }

      this.member.emergencyContacts = [
        {
          name: this.emergencyContactName,
          phone: this.emergencyContactPhone
        }
      ]
      this.member.dateOfBirth = this.formatDateTime(this.dateOfBirth)

      console.log('Member saved!', this.member)
      this.$emit('member-save', this.member)
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
