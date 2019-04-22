<template>
  <div id="app">

    <template v-if="user">
      <mdc-top-app-bar title="Title2" event="nav">
        <!--<mdc-top-app-bar-action @click="showHelp" icon="help"></mdc-top-app-bar-action>-->
        <mdc-top-app-bar-action icon="help"></mdc-top-app-bar-action>
      </mdc-top-app-bar>
      <mdc-drawer toggle-on="nav" temporary>
        <div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
          <!--<m-button>Hello</m-button>-->
        </div>
      </mdc-drawer>
    </template>

      <main>

        <div class="main-body">
          <router-view/>
        </div>
      </main>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'appview',
  computed: {
    user () {
      return this.$store.state.auth.user
    }
  },
  methods: {
    ...mapActions('auth', ['authenticate'])

  },
  created () {
    const { authenticate } = this
    authenticate({ strategy: 'local', email: 'me@me.com', password: 'secret' })
  }
}

</script>
<style>

  @import url("https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css");
  @import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500");
  @import url("https://fonts.googleapis.com/icon?family=Material+Icons");

  @import "../node_modules/vue-mdc-adapter/dist/vue-mdc-adapter.min.css";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  display: flex;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

main {
  width: 80%;
  padding-top: 60px;
  margin-left: 10%;
}

.main-body {
  max-width: 80%;
  margin: 32px auto;
  background-color: white;
}
</style>
