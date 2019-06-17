<template>
  <v-form ref="form">
    <v-container fill-height fluid grid-list-xl>
      <v-layout justify-center wrap>
        <v-flex xs12 md8>
          <material-card
            color="green"
            title="Add User"
            text="">
            <v-container py-0>
                <v-layout wrap>

                  <v-flex xs12 md12>
                    <v-text-field
                      class="purple-input"
                      label="Name"
                      :rules="[rules.required]"
                      v-model="form.user.name"/>
                  </v-flex>
                  <v-flex xs12 md12>
                    <v-text-field
                      class="purple-input"
                      label="Email"
                      :rules="[rules.required, rules.email]"
                      v-model="form.user.email"/>
                  </v-flex>
                  <v-flex xs12 md12>
                    <v-radio-group
                      :rules="[rules.required]"
                      v-model="form.role">
                      <v-radio label="Administrator" value="ADMIN"></v-radio>
                      <v-radio label="Staff (limited to taking attendance and managing members)" value="STAFF"></v-radio>
                    </v-radio-group>

                  </v-flex>

                  <v-flex xs12>
                    <v-btn
                      class="mx-0 font-weight-light"
                      color="success"
                      block
                      @click="saveUserAndDisplay">
                      Create Account
                    </v-btn>
                  </v-flex>

                </v-layout>

            </v-container>

          </material-card>
        </v-flex>

        <!--TODO: this might be a helpful help-text display or something-->
        <!--<v-flex-->
        <!--xs12-->
        <!--md4-->
        <!--&gt;-->
        <!--<material-card class="v-card-profile">-->
        <!--<v-avatar-->
        <!--slot="offset"-->
        <!--class="mx-auto d-block"-->
        <!--size="130"-->
        <!--&gt;-->
        <!--<img-->
        <!--src="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg"-->
        <!--&gt;-->
        <!--</v-avatar>-->
        <!--<v-card-text class="text-xs-center">-->
        <!--<h6 class="category text-gray font-weight-thin mb-3">CEO / CO-FOUNDER</h6>-->
        <!--<h4 class="card-title font-weight-light">Alec Thompson</h4>-->
        <!--<p class="card-description font-weight-light">Don't be scared of the truth because we need to restart the human foundation in truth And I love you like Kanye loves Kanye I love Rick Owens’ bed design but the back is...</p>-->
        <!--<v-btn-->
        <!--color="success"-->
        <!--round-->
        <!--class="font-weight-light"-->
        <!--&gt;Follow</v-btn>-->
        <!--</v-card-text>-->
        <!--</material-card>-->
        <!--</v-flex>-->
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>

import { trim } from 'lodash'

export default {
  name: 'GymUsersAdd',
  props: ['gymId'],
  data () {
    return {
      form: {
        role: null,
        user: {
          name: '',
          email: ''
        }
      },
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
  computed: {
  },
  methods: {
    saveUserAndDisplay: function (event) {
      event.preventDefault()

      if (!this.$refs.form.validate()) {
        return
      }
      this.form.gymId = this.gymId
      console.log('Saving user and redisplaying:', this.form)
      this.$store.dispatch('user-gym-role/create', this.form)
        .then((result) => {
          console.log('Got result:', result)
          this.$router.push({ name: 'gym-users', params: { id: this.gymId } })
        })
    }
  }
}
</script>

<style scoped>

</style>
