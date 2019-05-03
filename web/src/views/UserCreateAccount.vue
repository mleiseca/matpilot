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
            <v-form>
              <v-layout wrap>

                <v-flex xs12 md12>
                  <v-text-field
                    class="purple-input"
                    label="Email"
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
      showPassword2: false
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
          this.$router.push({ name: 'login' })
        })
        .catch((e) => {
          console.log('** Login catch: ', e)
          // TODO: error message if login fails
        })
    }
  }
}
</script>
