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
        <v-layout align-center>
          <v-btn
            v-if="responsive"
            class="default v-btn--simple"
            dark
            icon
            @click.stop="onClickBtn"
          >
            <v-icon>mdi-view-list</v-icon>
          </v-btn>

        <v-breadcrumbs v-if="responsive">
          <v-breadcrumbs-item
            dark
            v-for="item in breadcrumbs"
            :key="item.text"
            :to="item.to"
            :exact="true">
            {{ item.text }}
          </v-breadcrumbs-item>

          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        </v-layout>
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
    window.removeEventListener('resize', this.onResponsiveInverted)
    EventBus.$off('gym-navigation', this.gymNavigationListener)
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
      this.breadcrumbs = []
      let gymId = null
      let gym = null
      if (contents.gymId) {
        gymId = parseInt(contents.gymId, 10)
        gym = await this.getGym(gymId)
        this.breadcrumbs.push({
          to: {
            name: '/gym',
            params: {
              id: gymId
            }
          },
          text: gym.name.substring(0, 25)
        })
      }
      if (gymId && contents.breadcrumb) {
        this.breadcrumbs.push({
          to: {
            name: contents.breadcrumb,
            params: {
              id: gymId
            }
          },
          text: contents.breadcrumbText.substring(0, 25)
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
