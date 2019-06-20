<template>
  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex xs12 md8>
        <material-card
          title="Enter your new password"
          text="">
          <v-container py-0>
            <v-form ref="form">
              <v-layout wrap>

                <v-flex xs12 md12>
                  <v-text-field
                    v-model="form.password1"
                    class="purple-input"
                    :append-icon="showPassword1 ? 'mdi-visibility' : 'mdi-visibility_off'"
                    :type="showPassword1 ? 'text' : 'password'"
                    name="password1"
                    label="New Password"
                    :rules="[rules.required, rules.minLength]"
                    @click:append="showPassword1 = !showPassword1"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 md12>
                  <v-text-field
                    v-model="form.password2"
                    class="purple-input"
                    :append-icon="showPassword2 ? 'mdi-visibility' : 'mdi-visibility_off'"
                    :type="showPassword2 ? 'text' : 'password'"
                    name="password2"
                    label="New Password (confirm)"
                    :rules="[rules.matchPassword1]"
                    @click:append="showPassword2 = !showPassword2"
                  ></v-text-field>
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
  name: 'UserResetPassword',
  data () {
    return {
      form: {
        password1: '',
        password2: ''
      },
      showPassword1: false,
      showPassword2: false,
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

      client.service('authManagement').create(
        {
          action: 'resetPwdLong',
          value: {
            token: this.$route.query.token,
            password: this.form.password1
          }
        })
        .then((result) => {
          console.log('Got result:', result)
          this.$router.push({ name: 'login' })
          EventBus.$emit('user-message', { message: 'Password successfully reset' })
        })
        .catch((e) => {
          console.log('** Login catch: ', e)
          EventBus.$emit('user-message', { message: `Error resetting password: ${e.message}`, type: 'error' })
        })
    }
  }
}
</script>
