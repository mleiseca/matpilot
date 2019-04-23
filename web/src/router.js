import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import UserHome from './views/UserHome.vue'
import GymsAdd from './views/GymAdd.vue'
import GymHome from './views/GymHome.vue'
import GymMembers from './views/GymMembers.vue'
import GymMembersAdd from './views/GymMembersAdd.vue'
import GymMembersView from './views/GymMembersView.vue'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/home',
      name: 'userhome',
      component: UserHome,
      meta: { requiresAuth: true }
    },
    {
      path: '/gyms/add',
      name: 'gymsadd',
      component: GymsAdd,
      meta: { requiresAuth: true }
    },
    {
      name: '/gym',
      path: '/gyms/:id',
      component: GymHome,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      name: 'gym-members',
      path: '/gyms/:gymId/members',
      component: GymMembers,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      name: 'gym-members-add',
      path: '/gyms/:gymId/members/add',
      component: GymMembersAdd,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      name: 'gym-members-view',
      path: '/gyms/:gymId/members/:memberId',
      component: GymMembersView,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      name: 'gym-scheduled-events',
      path: '/gyms/:gymId/schedule',
      component: () => import(/* webpackChunkName: "GymScheduledEvent" */ './views/GymScheduledEvents.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      name: 'gym-scheduled-event-add',
      path: '/gyms/:gymId/schedule/add',
      component: () => import(/* webpackChunkName: "GymScheduledEvent" */ './views/GymScheduledEventsAdd.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      name: 'gym-scheduled-event-view',
      path: '/gyms/:gymId/schedule/:scheduledEventId',
      component: () => import(/* webpackChunkName: "GymScheduledEvent" */ './views/GymScheduledEventsView.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})

// isAuthenticatePending
// this.$store.dispatch('load');
// auth/authenticate

// TODO: Is this the best way to do this? We just need to load this on app startup? Maybe in main.js?

router.beforeEach(function (to, from, next) {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log('ROUTER: Checking auth')
    if (store.state.auth.user) {
      // console.log("router: user is logged in")
      next()
      return
    }
    if (!store.state.auth.isAuthenticatePending && !store.state.auth.errorOnAuthenticate) {
      store.dispatch('auth/authenticate').then(result => {
        // console.log("Auth result: ", result)
        next()
      }).catch(_ => {
        // console.log("Auth error: ", err)
        next('/')
      })
      // console.log("router: authorizing")
      return
    }
    next('/')
  } else {
    next()
  }
})

export default router
