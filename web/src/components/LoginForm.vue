<template>
  <v-container py-0>
    <v-form ref="form">
      <v-layout wrap>

        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Email"
            :rules="[rules.required, rules.email]"
            v-model="email"/>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            v-model="password"
            class="purple-input"
            :append-icon="showPassword ? 'mdi-visibility' : 'mdi-visibility_off'"
            :type="showPassword ? 'text' : 'password'"
            :rules="[rules.required]"
            name="password"
            label="Password"
            @click:append="showPassword = !showPassword"
          ></v-text-field>

        </v-flex>

        <v-flex xs12>
          <v-btn
            class="mx-0 font-weight-light"
            color="success"
            block
            @click="login">
            Login
          </v-btn>
        </v-flex>

      <v-flex xs12>
          First time here? <router-link :to="{ name: 'user-create-account'}">Create your account</router-link>
      </v-flex>
        <v-flex xs12>
          Forgot your password? <router-link :to="{ name: 'user-reset-password-request'}">Reset your password</router-link>
        </v-flex>
      </v-layout>
    </v-form>

  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { EventBus } from './../event-bus.js'
import { trim } from 'lodash'

export default {
  name: 'LoginForm',

  data () {
    return {
      email: null,
      password: null,
      showPassword: false,
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          value = trim(value)
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return (value.length === 0) || pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    login: function () {
      const { authenticate } = this

      event.preventDefault()

      console.log('validating')
      if (!this.$refs.form.validate()) {
        return
      }
      console.log('username', this.username)

      authenticate({ strategy: 'local', email: this.email.toLowerCase(), password: this.password })
        .then((result) => {
          console.log('** Login result: ', result)
          this.$router.push({ name: 'userhome' })
        })
        .catch((e) => {
          console.log('** Login catch: ', e)
          EventBus.$emit('user-message', { message: `Error resetting password: ${e.message}`, type: 'error' })
        })
    }
  }
}
</script>
