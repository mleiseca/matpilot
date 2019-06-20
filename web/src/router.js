import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
// import Home from './views/Home.vue'
import Login from './views/Login.vue'
import UserHome from './views/UserHome.vue'
import GymsAdd from './views/GymAdd.vue'
import GymHome from './views/GymHome.vue'
import GymMembers from './views/GymMembers.vue'
import GymMembersAdd from './views/GymMembersAdd.vue'
import GymMembersView from './views/GymMembersView.vue'
import GymEventCheckin from './views/GymEventCheckin.vue'
import GymUsers from './views/GymUsers.vue'
import GymUsersAdd from './views/GymUsersAdd.vue'
import { get } from 'lodash'
import { EventBus } from './event-bus'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login
    },
    {
      path: '/login',
      name: 'login',
      component: Login
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
      path: '/gyms/:gymId',
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
      meta: { requiresAuth: true, breadcrumb: 'gym-members', breadcrumbText: 'Members' }
    },
    {
      name: 'gym-members-view',
      path: '/gyms/:gymId/members/:memberId',
      component: GymMembersView,
      props: true,
      meta: { requiresAuth: true, breadcrumb: 'gym-members', breadcrumbText: 'Members' }
    },
    {
      name: 'gym-users',
      path: '/gyms/:gymId/users',
      component: GymUsers,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      name: 'gym-users-add',
      path: '/gyms/:gymId/users/add',
      component: GymUsersAdd,
      props: true,
      meta: { requiresAuth: true, breadcrumb: 'gym-users', breadcrumbText: 'Users' }
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
      meta: { requiresAuth: true, breadcrumb: 'gym-scheduled-events', breadcrumbText: 'Scheduled Events' }
    },
    {
      name: 'gym-scheduled-event-view',
      path: '/gyms/:gymId/schedule/:scheduledEventId',
      component: () => import(/* webpackChunkName: "GymScheduledEvent" */ './views/GymScheduledEventsView.vue'),
      props: true,
      meta: { requiresAuth: true, breadcrumb: 'gym-scheduled-events', breadcrumbText: 'Scheduled Events'  }
    },
    {
      name: 'gym-event-checkin',
      path: '/gyms/:gymId/event/:eventId/checkin',
      component: GymEventCheckin,
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
    },
    {
      name: 'user-create-account',
      path: '/create-account',
      component: () => import(/* webpackChunkName: "UserCreateAccount" */ './views/UserCreateAccount.vue')
    },
    {
      name: 'user-verify-account',
      path: '/verify',
      component: () => import(/* webpackChunkName: "UserCreateAccount" */ './views/UserVerifyAccount.vue')
    },
    {
      name: 'user-reset-password',
      path: '/reset',
      component: () => import(/* webpackChunkName: "UserCreateAccount" */ './views/UserResetPassword.vue')
    },
    {
      name: 'user-reset-password-request',
      path: '/reset-request',
      component: () => import(/* webpackChunkName: "UserCreateAccount" */ './views/UserResetPasswordRequest.vue')
    }
  ]
})

// isAuthenticatePending
// this.$store.dispatch('load');
// auth/authenticate

// TODO: Is this the best way to do this? We just need to load this on app startup? Maybe in main.js?

router.afterEach(function (to) {
  console.log(to)
  const gymId = get(to, 'params.gymId')
  const breadcrumb = get(to, 'meta.breadcrumb')
  const breadcrumbText = get(to, 'meta.breadcrumbText')
  EventBus.$emit('gym-navigation', { gymId: gymId, breadcrumb: breadcrumb, name: to.name, breadcrumbText: breadcrumbText })
})

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
        next('login')
      })
      // console.log("router: authorizing")
      return
    }
    next('login')
  } else {
    next()
  }
})

export default router
