<template>
  <div>
    <form @submit.prevent="login">
      <h1 class="site-h1">Login</h1>
      <mdc-textfield v-model="email" label="Email" fullwidth/>

      <mdc-textfield v-model="password" type="password" label="Password" fullwidth/>

      <div>
        <mdc-button @click="login" raised>Save</mdc-button>
      </div>

    </form>

  </div>
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
