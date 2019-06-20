<template>
  <v-toolbar
    id="core-toolbar"

    flat
    prominent
    style="background: #eee;"
  >
    <div class="v-toolbar-title">
      <v-toolbar-title
        class="tertiary--text font-weight-light"
      >
        <v-btn
          v-if="responsive"
          class="default v-btn--simple"
          dark
          icon
          @click.stop="onClickBtn"
        >
          <v-icon>mdi-view-list</v-icon>
        </v-btn>

        <span v-for="(item, index) in breadcrumbs" v-bind:key="item.name">
        <router-link :to="{ name: item.name, params: {id: item.gymId }} " >
          <template v-if="index > 0">
            >
          </template>
          {{ item.text }}
        </router-link>
        </span>

      </v-toolbar-title>
    </div>

    <v-spacer />
    <v-toolbar-items>
      <v-flex
        align-center
        layout
        py-2
      >
        <!--<v-text-field-->
          <!--v-if="responsiveInput"-->
          <!--class="mr-4 mt-2 purple-input"-->
          <!--label="Search..."-->
          <!--hide-details-->
          <!--color="purple"-->
        <!--/>-->
        <!--<router-link-->
          <!--v-ripple-->
          <!--class="toolbar-items"-->
          <!--to="/"-->
        <!--&gt;-->
          <!--<v-icon color="tertiary">mdi-view-dashboard</v-icon>-->
        <!--</router-link>-->
        <!--<v-menu-->
          <!--bottom-->
          <!--left-->
          <!--content-class="dropdown-menu"-->
          <!--offset-y-->
          <!--transition="slide-y-transition">-->
          <!--<router-link-->
            <!--v-ripple-->
            <!--slot="activator"-->
            <!--class="toolbar-items"-->
            <!--to="/notifications"-->
          <!--&gt;-->
            <!--<v-badge-->
              <!--color="error"-->
              <!--overlap-->
            <!--&gt;-->
              <!--<template slot="badge">-->
                <!--{{ notifications.length }}-->
              <!--</template>-->
              <!--<v-icon color="tertiary">mdi-bell</v-icon>-->
            <!--</v-badge>-->
          <!--</router-link>-->
          <!--<v-card>-->
            <!--<v-list dense>-->
              <!--<v-list-tile-->
                <!--v-for="notification in notifications"-->
                <!--:key="notification"-->
                <!--@click="onClick"-->
              <!--&gt;-->
                <!--<v-list-tile-title-->
                  <!--v-text="notification"-->
                <!--/>-->
              <!--</v-list-tile>-->
            <!--</v-list>-->
          <!--</v-card>-->
        <!--</v-menu>-->
        <router-link
          v-ripple
          class="toolbar-items"
          to="/user-profile"
        >
          <v-icon color="tertiary">mdi-account</v-icon>
        </router-link>
      </v-flex>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>

import { mapMutations, mapActions } from 'vuex'
import { EventBus } from '../../event-bus'

export default {
  data: () => ({
    notifications: [
      'Mike, John responded to your email',
      'You have 5 new tasks',
      'You\'re now a friend with Andrew',
      'Another Notification',
      'Another One'
    ],
    title: null,
    responsive: false,
    responsiveInput: false,
    breadcrumbs: []
  }),

  watch: {
    '$route' (val) {
      this.title = val.name
    }
  },

  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
    EventBus.$on('gym-navigation', this.gymNavigationListener)
  },
  beforeDestroy () {
    EventBus.$off('gym-navigation', this.gymNavigationListener)
    window.removeEventListener('resize', this.onResponsiveInverted)
  },

  methods: {
    ...mapActions('gyms', {
      getGym: 'get'
    }),
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    onClickBtn () {
      this.setDrawer(!this.$store.state.app.drawer)
    },
    onClick () {
      //
    },
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
        this.responsiveInput = false
      } else {
        this.responsive = false
        this.responsiveInput = true
      }
    },
    async gymNavigationListener (contents) {
      //      { gymId: gymId }
      //      '/gym'

      this.breadcrumbs = []
      let gymId = null
      let gym = null
      if (contents.gymId) {
        gymId = parseInt(contents.gymId, 10)
        gym = await this.getGym(gymId)
        console.log('breadcrumb gym',  gym)
        this.breadcrumbs.push({
          name: '/gym',
          text: gym.name,
          gymId: contents.gymId
        })
      }
      if (gymId && contents.breadcrumb) {
        this.breadcrumbs.push({
          name: contents.breadcrumb,
          text: contents.breadcrumbText,
          gymId: contents.gymId
        })
      }

      console.log("breadcrumbs!!", this.breadcrumbs)
      //      breadcrumb: "gym-members"
      //      gymId: "1"
      //      name: "gym-members-view"

      console.log(contents)
    }
  }
}
</script>

<style>
  #core-toolbar a {
    text-decoration: none;
  }
</style>
