<template>
  <v-app>
    <core-filter v-if="user"/>
    <core-toolbar v-if="user"/>
    <core-drawer v-if="user"/>
    <core-view />
    <v-snackbar
      v-model="notification"
      bottom
      center
      :color="type"
      :timeout="timeout"
    >
      {{ notificationText }}
      <v-btn
        flat
        dark
        @click="closeNotification"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { EventBus } from './event-bus.js';

export default {
  name: 'appview',
  data() {
    return {
      notification: false,
      notificationText: '',
      type: '',
      timeout: 10 * 1000,
      buttonColor: ''
    }
  },
  methods: {
    eventBusListener(contents) {
      console.log(`Event bus: ${contents.message}`)
      this.notification = true
      this.notificationText = contents.message
      if (contents.type === 'error') {
        this.type = 'error'
        this.buttonColor = 'error'
      } else {
        this.type = 'success'
      }
    },
    closeNotification() {
      this.notification = false;
    }
  },
  computed: {
    user () {
      return this.$store.state.auth.user
    }
  },
  mounted() {
    EventBus.$on('user-message', this.eventBusListener);
  },
  beforeDestroy() {
    EventBus.$off('user-message', this.eventBusListener);
  }
}

</script>

<style lang="scss">
  @import '@/styles/index.scss';

  /* Remove in 1.2 */
  .v-datatable thead th.column.sortable i {
    vertical-align: unset;
  }
</style>

<!--<template>-->
  <!--<div id="app">-->

    <!--<template v-if="user">-->
      <!--<mdc-top-app-bar title="Title2" event="nav">-->
        <!--&lt;!&ndash;<mdc-top-app-bar-action @click="showHelp" icon="help"></mdc-top-app-bar-action>&ndash;&gt;-->
        <!--<mdc-top-app-bar-action icon="help"></mdc-top-app-bar-action>-->
      <!--</mdc-top-app-bar>-->
      <!--<mdc-drawer toggle-on="nav" temporary>-->
        <!--<div id="nav">-->
          <!--<router-link to="/">Home</router-link> |-->
          <!--<router-link to="/about">About</router-link>-->
          <!--&lt;!&ndash;<m-button>Hello</m-button>&ndash;&gt;-->
        <!--</div>-->
      <!--</mdc-drawer>-->
    <!--</template>-->

      <!--<main>-->

        <!--<div class="main-body">-->
          <!--<router-view/>-->
        <!--</div>-->
      <!--</main>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
  <!--name: 'appview',-->
  <!--computed: {-->
    <!--user () {-->
      <!--return this.$store.state.auth.user-->
    <!--}-->
  <!--}-->
<!--}-->

<!--</script>-->
<!--<style>-->

<!--</style>-->
