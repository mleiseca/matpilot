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

        <v-menu
          bottom
          left
          content-class="dropdown-menu"
          offset-y
          transition="slide-y-transition">

              <v-icon
                slot="activator"
                color="tertiary">mdi-account</v-icon>

          <v-card>
            <v-list dense>
              <v-list-tile @click="onLogout">

                Logout
              </v-list-tile>
            </v-list>
          </v-card>
        </v-menu>
      </v-flex>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>

import { mapMutations, mapActions } from 'vuex'
import { EventBus } from '../../event-bus'

export default {
  data: () => ({
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
    ...mapActions('auth', ['logout']),
    ...mapActions('gyms', {
      getGym: 'get'
    }),
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    onClickBtn () {
      this.setDrawer(!this.$store.state.app.drawer)
    },
    onLogout () {
      this.logout().then(() => this.$router.go({ name: 'home' }))
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
    }
  }
}
</script>

<style>
  #core-toolbar a {
    text-decoration: none;
  }
</style>
