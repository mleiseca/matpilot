<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
    pt-0>
    <v-layout justify-center wrap>
      <v-flex xs12 md8>
        <material-card
          title="Login"
          text="">
          <mp-login-form></mp-login-form>

        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue'

export default {
  name: 'login',
  components: {
    'mp-login-form': LoginForm
  },
  methods: {

  }
}
</script>
