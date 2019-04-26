<template>
  <div>
    <form class="login" @submit.prevent="createAccount">
      <h1 class="site-h1">Create your account</h1>
      <label>Email</label>
      <!--<input required v-model="email" type="email" placeholder="Name"/>-->
      <input required v-model="form.email" placeholder="Your Email"/>
      <label>Password</label>
      <input required v-model="form.password1" type="password" placeholder="What's Your Password?"/>
      <label>Password (again)</label>
      <input required v-model="form.password2" type="password" placeholder="What's Your Password?"/>
      <hr/>
      <button type="createAccount">Create account</button>
    </form>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'login',
    data () {
      return {
        form: {
          email: "",
          password1: "",
          password2: ""
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
//            this.$router.push({ name: 'gym-scheduled-events', params: { id: this.gymId } })
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }
  #app input {
    margin-bottom: 1rem;
    display: block;
  }
  #app button {
    padding: .5rem;
    border-radius: .33rem;
    padding: .5rem 2rem;
    font-size: 1.215rem;
    background-color: #0062cc;
    color: white;
  }

  #app form {
    display: block;
    width: 17rem;
    position: relative;
    margin: 0 auto;
  }

  #app form button,
  #app form input {
    width: 100%;
  }


</style>
