<template>
  <v-container py-0>
    <v-form>
      <v-layout wrap>

        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Email"
            v-model="email"/>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            v-model="password"
            class="purple-input"
            :append-icon="showPassword ? 'mdi-visibility' : 'mdi-visibility_off'"
            :type="showPassword ? 'text' : 'password'"
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

      </v-layout>
    </v-form>

  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginForm',

  data () {
    return {
      email: null,
      password: null,
      showPassword: false
    }
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    login: function () {
      const { authenticate } = this

      console.log('username', this.username)

      authenticate({ strategy: 'local', email: this.email, password: this.password })
        .then((result) => {
          console.log('** Login result: ', result)
          this.$router.push({ name: 'userhome' })
        })
        .catch((e) => {
          console.log('** Login catch: ', e)
          // TODO: error message if login fails
        })
    }
  }
}
</script>
