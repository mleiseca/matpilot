<template>
  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex xs12 md8>
        <material-card
          title="Reset your password"
          text="">
          <v-container py-0>
            <v-form ref="form">
              <v-layout wrap>

                <v-flex xs12 md12>
                  <v-text-field
                    class="purple-input"
                    label="Email"
                    :rules="[rules.required]"
                    v-model="form.email"/>
                </v-flex>

                <v-flex xs12>
                  <v-btn
                    class="mx-0 font-weight-light"
                    color="success"
                    block
                    @click="resetPassword">
                    Reset password
                  </v-btn>
                </v-flex>

              </v-layout>
            </v-form>

          </v-container>

        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import client from '../api/feathers-client'
import { EventBus } from './../event-bus.js'
import { trim } from 'lodash'

export default {
  name: 'UserResetPasswordRequest',
  data () {
    return {
      form: {
        email: ''
      },
      showPassword: false,
      rules: {
        required: value => !!value || 'Required.',
        minLength: value => value.length > 7 || 'Password too short',
        matchPassword1: value => value === this.form.password1 || 'Passwords do not match',
        email: value => {
          value = trim(value)
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return (value.length === 0) || pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  methods: {
    resetPassword: function () {
      event.preventDefault()

      console.log('validating')
      if (!this.$refs.form.validate()) {
        return
      }
      let contents = {
        action: 'sendResetPwd',
        value: { 'email': this.form.email.toLowerCase() } // {email}, {token: verifyToken}
      }
      console.log('resetting password', contents)
      client.service('authManagement').create(contents)
        .then(() => {
          EventBus.$emit('user-message', { message: `Password reset email sent!` })
        })
        .catch((e) => {
          EventBus.$emit('user-message', { message: `Error resetting password: ${e.message}`, type: 'error' })
        })
    }
  }
}
</script>
