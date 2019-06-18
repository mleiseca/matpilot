<template>
  <!--<div>-->
  <!--<form @submit.prevent="createAccount">-->
  <!--<h1 class="site-h1">Create account</h1>-->
  <!--<mdc-textfield v-model="form.email" label="Email" fullwidth/>-->

  <!--<mdc-textfield v-model="form.password1" type="password" label="Password" fullwidth/>-->
  <!--<mdc-textfield v-model="form.password2" type="password" label="Password (confirm)" fullwidth/>-->

  <!--<div>-->
  <!--<mdc-button @click="createAccount" raised>Create account</mdc-button>-->
  <!--</div>-->

  <!--</form>-->
  <!--</div>-->

  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex xs12 md8>
        <material-card
          color="green"
          title="Create Account"
          text="">
          <v-container py-0>
            <v-form ref="form">
              <v-layout wrap>

                <v-flex xs12 md12>
                  <v-text-field
                    class="purple-input"
                    label="Email"
                    :rules="[rules.required, rules.email]"
                    v-model="form.email"/>
                </v-flex>

                <v-flex xs12 md12>
                  <v-text-field
                    v-model="form.password1"
                    class="purple-input"
                    :append-icon="showPassword1 ? 'mdi-visibility' : 'mdi-visibility_off'"
                    :type="showPassword1 ? 'text' : 'password'"
                    name="password1"
                    label="Password"
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
                    label="Password (confirm)"
                    :rules="[rules.required, rules.matchPassword1]"
                    @click:append="showPassword2 = !showPassword2"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-btn
                    class="mx-0 font-weight-light"
                    color="success"
                    block
                    @click="createAccount">
                    Create Account
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
import { trim } from 'lodash'
import { EventBus } from './../event-bus.js';

export default {
  name: 'login',
  data () {
    return {
      form: {
        email: '',
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
    createAccount: function () {
      event.preventDefault()

      console.log('validating')
      if (!this.$refs.form.validate()) {
        return
      }

      this.form.password = this.form.password1
      console.log('Saving account:', this.form)
      this.$store.dispatch('users/create', this.form)
        .then((result) => {
          this.$router.push({ name: 'login' })
          EventBus.$emit('user-message', {message: 'Account successfully created!'});
        })
        .catch((e) => {
          EventBus.$emit('user-message', {message: `Error creating account: ${e.message}`, type: 'error'});
        })
    }
  }
}
</script>
