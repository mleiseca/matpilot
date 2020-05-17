<template>
  <v-fade-transition mode="out-in">
    <v-container wrap fluid class="warning email-unconfirmed-warning" v-if="!userVerified">
      <v-layout row>
        <v-flex xs12 v-if="!emailSending">
          <a @click="resendEmail()">Confirm your email address</a> to access to your member accounts.
        </v-flex>

        <v-flex xs12 v-if="emailSending === 'SENDING'">
          Sending email...
        </v-flex>
        <v-flex xs12 v-if="emailSending === 'SENT'">
          Email sent. Check your email to confirm.
        </v-flex>
        <v-flex xs12 v-if="emailSending === 'ERROR'">
          Error sending you an email. Try again later.
        </v-flex>
      </v-layout>
    </v-container>
  </v-fade-transition>
</template>

<script>
  import client from '../api/feathers-client'

  export default {
    name: 'EmailConfirmationBanner',
    data() {
      return {
        userVerified: true,
        emailSending: false
      }
    },
    mounted: async function() {

    },
    watch: {
      '$store.state.auth.user.isVerified': function() {
        const user = this.$store.state.auth.user
        console.log('user is...', user)
        if (user) {
          this.userVerified = user.isVerified
          this.emailSending = false
        }
      }
    },
    methods: {
      resendEmail: function() {
        console.log("resending email")
        const user = this.$store.state.auth.user
        this.emailSending = 'SENDING'

        client.service('authManagement').create({
          action: 'resendVerifySignup',
          value: {
            email: user.email,
            verifyToken : user.verifyToken,
            verifyShortToken: user.verifyShortToken
          }
        })
          .then((result) => {
            console.log('result:', result)
            this.emailSending = 'SENT'
          })
          .catch((error) => {
            console.log('error:', error)
            this.emailSending = 'ERROR'
          })
      }
    }

  }
</script>

