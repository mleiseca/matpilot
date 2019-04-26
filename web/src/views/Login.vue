<template>
  <div>
    <!--<form v-on:submit.prevent>-->
    <!--<div class="input-group">-->
    <!--<span class="input-group-addon" id="basic-addon1">-->
    <!--<i class="fa fa-user" aria-hidden="true"></i>-->
    <!--</span>-->
    <!--<input type="text" v-model.trim="user.email" class="form-control" placeholder="Email" aria-describedby="basic-addon1" required>-->
    <!--</div>-->
    <!--<div class="input-group">-->
    <!--<span class="input-group-addon" id="basic-addon2">-->
    <!--<i class="fa fa-key" aria-hidden="true"></i>-->
    <!--</span>-->
    <!--<input type="password" v-model.trim="user.password" class="form-control" placeholder="Password" aria-describedby="basic-addon2" required>-->
    <!--</div>-->
    <!--<button @click="authLogin()">Login</button>-->
    <!--&lt;!&ndash;<button @click="authRegister()">Register</button>&ndash;&gt;-->
    <!--&lt;!&ndash;<button @click="authLogout()">Logout</button>&ndash;&gt;-->
    <!--</form>-->

    <form class="login" @submit.prevent="login">
      <h1 class="site-h1">Welcome</h1>
      <label>Email</label>
      <!--<input required v-model="email" type="email" placeholder="Name"/>-->
      <input required v-model="email" placeholder="Your Email"/>
      <label>Password</label>
      <input required v-model="password" type="password" placeholder="What's Your Password?"/>
      <hr/>
      <button type="submit">Sign In</button>
    </form>
    <!--<div>-->
    <!--<strong class="loginFailedMessage"> {{message}} </strong>-->
    <!--</div>-->
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'login',
    data () {
      return {
        email : "",
        password : ""
      }
    },
    methods: {
      ...mapActions('auth', ['authenticate']),
      login: function () {
        const { authenticate } = this

        console.log("username", this.username)

        authenticate({ strategy: 'local', email: this.email, password: this.password })
          .then((result) => {
            console.log("** Login result: ", result)
            this.$router.push({ name: 'userhome'} )
          })
          .catch((e) => {
            console.log("** Login catch: ", e)
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
