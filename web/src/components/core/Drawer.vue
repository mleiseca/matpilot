<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    app
    dark
    floating
    persistent
    mobile-breakpoint="991"
    width="260"
  >
    <v-img
      :src="image"
      height="100%"
    >
      <v-layout
        class="fill-height"
        column
      >
        <v-list>
          <v-list-item>
            <v-list-item-avatar
              color="white"
            >
              <v-img
                :src="logo"
                height="34"
                contain
              />
            </v-list-item-avatar>
            <v-list-item-title class="text-h6">
              <router-link :to="{ name: 'userhome'}">
                MatPilot
              </router-link>
            </v-list-item-title>

          </v-list-item>
          <v-divider/>
          <!--<v-list-tile-->
            <!--v-if="responsive"-->
          <!--&gt;-->
            <!--<v-text-field-->
              <!--class="purple-input search-input"-->
              <!--label="Search..."-->
              <!--color="purple"-->
            <!--/>-->
          <!--</v-list-tile>-->
          <v-list-item
            v-for="(link, i) in gymLinks"
            :key="i"
            :to="link.to"
            :active-class="color"
            :exact="true"
            class="v-list-item"
          >
            <v-list-item-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-title
              v-text="link.text"
            />
          </v-list-item>
          <v-list-item
            disabled
            active-class="primary"
            class="v-list-item v-list-item--buy"
            to="/upgrade"
          >
            <!--<v-list-tile-action>-->
              <!--<v-icon>mdi-package-up</v-icon>-->
            <!--</v-list-tile-action>-->
            <!--<v-list-tile-title class="font-weight-light">-->
              <!--Upgrade To PRO-->
            <!--</v-list-tile-title>-->
          </v-list-item>
        </v-list>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { mapMutations, mapState, mapActions } from 'vuex'
import { EventBus } from '../../event-bus'

export default {
  data: () => ({
    logo: require('@/assets/mc-logo.png'),

    gymLinks: [],
    responsive: false
  }),
  computed: {
    ...mapState('app', ['image', 'color']),
    inputValue: {
      get () {
        return this.$store.state.app.drawer
      },
      set (val) {
        this.setDrawer(val)
      }
    },
    items () {
      return this.$t('Layout.View.items')
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
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    ...mapActions('gyms', {
      getGym: 'get'
    }),
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    },
    async gymNavigationListener (contents) {
      this.gymLinks = []
      let gymId = null
      let gym = null
      if (contents.gymId) {
        gymId = parseInt(contents.gymId, 10)
        gym = await this.getGym(gymId)

        this.gymLinks.push({
          to: {
            name: '/gym',
            params: {
              id: gymId
            }
          },
          text: gym.name,
          icon: 'mdi-view-dashboard'
        })

        this.gymLinks.push({
          to: {
            name: 'gym-members',
            params: {
              id: gymId
            }
          },
          text: 'Members',
          icon: 'mdi-human-male-female'
        })

        if (this.isAdminForGym(gymId)) {
          this.gymLinks.push({
            to: {
              name: 'gym-users',
              params: {
                id: gymId
              }
            },
            text: 'Admins/Staff',
            icon: 'mdi-account-star',
            endsSection: true
          })

          this.gymLinks.push({
            to: {
              name: 'gym-scheduled-events',
              params: {
                id: gymId
              }
            },
            text: 'Schedule',
            icon: 'mdi-calendar'
          })
        }
      }
    },
    isAdminForGym (gymId) {
      const userGyms = this.$store.state.auth.user.user_gym_roles
      console.log('user gyms: ', userGyms)
      if (!userGyms) {
        return false
      }
      for (let i = 0; i < userGyms.length; i++) {
        let userGymRole = userGyms[i]
        if (userGymRole.gymId === gymId && (userGymRole.role === 'ADMIN' || userGymRole.role === 'OWNER')) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style lang="scss">
  #app-drawer {
    .v-list-item {
      border-radius: 4px;

      &--buy {
        margin-top: auto;
        margin-bottom: 17px;
      }
    }

    .v-image__image--contain {
      top: 0px;
      height: 100%;
    }

    .search-input {
      margin-bottom: 30px !important;
      padding-left: 15px;
      padding-right: 15px;
    }
  }
</style>
