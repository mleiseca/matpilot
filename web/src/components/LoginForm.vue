<template>
  <v-form>
    <v-container py-0>
      <v-layout wrap>

        <v-flex
          xs12
          md12
        >
          <v-text-field
            class="purple-input"
            label="Email"
            v-model="email"
          />
        </v-flex>

        <v-flex
          xs12
          md12
        >
          <v-text-field
            class="purple-input"
            label="Password"
            v-model="password"
          />
        </v-flex>

        <v-flex
          xs12
          text-xs-right
        >
          <v-btn
            class="mx-0 font-weight-light"
            color="success"
            @click="login"
          >
            Login
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginForm',

  data () {
    return {
      email: null,
      password: null
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
          // TODO: error message
        })
    }
  }
}
</script>
