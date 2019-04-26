<template>
  <div>
    ... Loading ...
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
      }
    },
    mounted: function() {
      this.verifyAccount()
    },
    methods: {
      verifyAccount: function () {
        console.log('Verifying account:', this.$route.query.token)
        const obj = {
          action: 'verifySignupLong',
          value: this.$route.query.token
        }
        this.$store.dispatch('authManagement/create', obj)
          .then((result) => {
            console.log('Got result:', result)
            // TODO: maybe display form here along with success message?
            this.$router.push({ name: 'login'})
          })
          .catch((result) => {
            console.log('Got error:', result)
            // TODO: error message
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
