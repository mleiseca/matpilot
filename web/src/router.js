import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
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
      component: () => import(/* webpackChunkName: "allUsers" */ './views/Login.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "allUsers" */ './views/Login.vue')
    },
    {
      path: '/home',
      name: 'userhome',
      component: () => import(/* webpackChunkName: "allUsers" */ './views/UserHome.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/gyms/add',
      name: 'gymsadd',
      component: () => import(/* webpackChunkName: "allUsers" */ './views/GymAdd.vue'),
      meta: { requiresAuth: true }
    },
    {
      name: '/gym',
      path: '/gyms/:gymId',
      component: () => import(/* webpackChunkName: "allUsers" */ './views/GymHome.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      name: 'gym-members',
      path: '/gyms/:gymId/members',
      component: () => import(/* webpackChunkName: "staffUsers" */ './views/GymMembers.vue'),
      props: true,
      meta: { requiresAuth: true, breadcrumb: 'gym-members', breadcrumbText: 'Members' }
    },
    {
      name: 'gym-members-add',
      path: '/gyms/:gymId/members/add',
      component: () => import(/* webpackChunkName: "staffUsers" */ './views/GymMembersAdd.vue'),
      props: true,
      meta: { requiresAuth: true, breadcrumb: 'gym-members', breadcrumbText: 'Members' }
    },
    {
      name: 'gym-members-view',
      path: '/gyms/:gymId/members/:memberId',
      component: () => import(/* webpackChunkName: "staffUsers" */ './views/GymMembersView.vue'),
      props: true,
      meta: { requiresAuth: true, breadcrumb: 'gym-members', breadcrumbText: 'Members' }
    },
    {
      name: 'gym-users',
      path: '/gyms/:gymId/users',
      component: () => import(/* webpackChunkName: "adminUsers" */ './views/GymUsers.vue'),
      props: true,
      meta: { requiresAuth: true, breadcrumb: 'gym-users', breadcrumbText: 'Users' }
    },
    {
      name: 'gym-users-add',
      path: '/gyms/:gymId/users/add',
      component: () => import(/* webpackChunkName: "adminUsers" */ './views/GymUsersAdd.vue'),
      props: true,
      meta: { requiresAuth: true, breadcrumb: 'gym-users', breadcrumbText: 'Users' }
    },
    {
      name: 'gym-scheduled-events',
      path: '/gyms/:gymId/schedule',
      component: () => import(/* webpackChunkName: "GymScheduledEvent" */ './views/GymScheduledEvents.vue'),
      props: true,
      meta: { requiresAuth: true, breadcrumb: 'gym-scheduled-events', breadcrumbText: 'Scheduled Events' }
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
      meta: { requiresAuth: true, breadcrumb: 'gym-scheduled-events', breadcrumbText: 'Scheduled Events' }
    },
    {
      name: 'gym-event-checkin',
      path: '/gyms/:gymId/event/:eventId/checkin',
      component: () => import(/* webpackChunkName: "staffUsers" */ './views/GymEventCheckin.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      name: 'gym-event-self-checkin',
      path: '/gyms/:gymId/event/:eventId/selfcheckin',
      component: () => import(/* webpackChunkName: "staffUsers" */ './views/GymEventCheckin.vue'),
      props: true,
      meta: { requiresAuth: true }
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
    },
    {
      // will match everything - must be last
      path: '*',
      component: () => import(/* webpackChunkName: "NotFound" */ './views/404.vue')
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
