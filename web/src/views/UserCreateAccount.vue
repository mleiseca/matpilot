<template>
  <div>

    <form @submit.prevent="createAccount">
      <h1 class="site-h1">Create account</h1>
      <mdc-textfield v-model="form.email" label="Email" fullwidth/>

      <mdc-textfield v-model="form.password1" type="password" label="Password" fullwidth/>
      <mdc-textfield v-model="form.password2" type="password" label="Password (confirm)" fullwidth/>

      <div>
        <mdc-button @click="createAccount" raised>Create account</mdc-button>
      </div>

    </form>
  </div>
</template>

<script>

export default {
  name: 'login',
  data () {
    return {
      form: {
        email: '',
        password1: '',
        password2: ''
      }
    }
  },
  methods: {
    createAccount: function () {
      if (this.form.password1 !== this.form.password2) {
        // TODO: display error. Validation?
      }
      this.form.password = this.form.password1
      console.log('Saving account:', this.form)
      this.$store.dispatch('users/create', this.form)
        .then((result) => {
          console.log('Got result:', result)
          //  this.$router.push({ name: 'gym-scheduled-events', params: { id: this.gymId } })
        })
    }
  }
}
</script>
