<template>
  <v-app>
    <!--<core-footer v-if="$route.name !== 'Maps'" />-->
    <core-filter v-if="user && $route.name !== 'gym-event-self-checkin'"/>
    <core-toolbar v-if="user && $route.name !== 'gym-event-self-checkin'"/>
    <core-drawer v-if="user && $route.name !== 'gym-event-self-checkin'"/>
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
        text
        dark
        @click="closeNotification"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="disconnected"
      bottom
      center
      color="warning"
      :timeout="-1"
    >
      <v-icon>mdi-cloud-off-outline</v-icon>
      Offline
    </v-snackbar>
    <v-dialog
      v-model="loading"
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          {{ loadingMessage }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { EventBus } from './event-bus.js'
import socket from './api/socket'

export default {
  name: 'appview',
  data () {
    return {
      notification: false,
      notificationText: '',
      type: '',
      timeout: 10 * 1000,
      buttonColor: '',
      loading: '',
      loadingMessage: 'Loading',
      disconnected: false,
      intervalTracker: null
    }
  },
  methods: {
    eventBusListener (contents) {
      console.log(`Event bus: ${contents.message}`)
      this.notification = true
      this.notificationText = contents.message
      if (contents.type === 'error') {
        this.type = 'error'
        this.buttonColor = 'error'
      } else if (contents.type === 'warning') {
        this.type = 'warning'
        this.buttonColor = 'warning'
      } else {
        this.type = 'success'
      }
    },
    loadingListener (contents) {
      console.log('Loading bus:', contents)
      if (contents.done) {
        this.loading = false
      } else {
        this.loading = 'loading'
        this.loadingMessage = contents.message || 'Loading'
      }
    },
    closeNotification () {
      this.notification = false
    }
  },
  computed: {
    user () {
      return this.$store.state.auth.user
    }
  },
  mounted () {
    EventBus.$on('user-message', this.eventBusListener)
    EventBus.$on('loading', this.loadingListener)

    let self = this
    this.intervalTracker = setInterval(function () {
      self.disconnected = socket.disconnected
    }, 250)
  },
  beforeDestroy () {
    EventBus.$off('user-message', this.eventBusListener)
    EventBus.$off('loading', this.loadingListener)
    clearInterval(this.intervalTracker)
  }
}

</script>

<style lang="scss">
  @import '@/styles/index.scss';

  /* Remove in 1.2 */
  .v-datatable thead th.column.sortable i {
    vertical-align: unset;
  }

  .dialog.centered-dialog,
  .v-dialog.centered-dialog
  {
    background: #282c2dad;
    box-shadow: none;
    border-radius: 6px;
    width: auto;
    color: whitesmoke;
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
