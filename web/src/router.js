import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import { get } from 'lodash'
import { EventBus } from './event-bus'

Vue.use(Router)

const STAFF = ['STAFF', 'ADMIN', 'OWNER']
const ADMIN = ['ADMIN', 'OWNER']
// const OWNER = ['OWNER']

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
      meta: { requiresGymRole: STAFF }
    },
    {
      name: 'gym-reports',
      path: '/gyms/:gymId/reports',
      component: () => import(/* webpackChunkName: "adminUsers" */ './views/GymReports.vue'),
      props: true,
      meta: { requiresGymRole: ADMIN, breadcrumb: 'gym-reports', breadcrumbText: 'Reports' }
    },
    {
      name: 'gym-reports-member',
      path: '/gyms/:gymId/reports/member',
      component: () => import(/* webpackChunkName: "adminUsers" */ './views/GymReportMember.vue'),
      props: true,
      meta: { requiresGymRole: ADMIN, breadcrumb: 'gym-reports', breadcrumbText: 'Reports' }
    },
    {
      name: 'gym-reports-schedule',
      path: '/gyms/:gymId/reports/schedule',
      component: () => import(/* webpackChunkName: "adminUsers" */ './views/GymReportSchedule.vue'),
      props: true,
      meta: { requiresGymRole: ADMIN, breadcrumb: 'gym-reports', breadcrumbText: 'Reports' }
    },
    {
      name: 'gym-members',
      path: '/gyms/:gymId/members',
      component: () => import(/* webpackChunkName: "staffUsers" */ './views/GymMembers.vue'),
      props: true,
      meta: { requiresGymRole: STAFF, breadcrumb: 'gym-members', breadcrumbText: 'Members' }
    },
    {
      name: 'gym-members-add',
      path: '/gyms/:gymId/members/add',
      component: () => import(/* webpackChunkName: "staffUsers" */ './views/GymMembersAdd.vue'),
      props: true,
      meta: { requiresGymRole: STAFF, breadcrumb: 'gym-members', breadcrumbText: 'Members' }
    },
    {
      name: 'gym-members-view',
      path: '/gyms/:gymId/members/:memberId',
      component: () => import(/* webpackChunkName: "staffUsers" */ './views/GymMembersView.vue'),
      props: true,
      meta: { requiresGymRole: STAFF, breadcrumb: 'gym-members', breadcrumbText: 'Members' }
    },
    {
      name: 'gym-users',
      path: '/gyms/:gymId/users',
      component: () => import(/* webpackChunkName: "adminUsers" */ './views/GymUsers.vue'),
      props: true,
      meta: { requiresGymRole: STAFF, breadcrumb: 'gym-users', breadcrumbText: 'Users' }
    },
    {
      name: 'gym-users-add',
      path: '/gyms/:gymId/users/add',
      component: () => import(/* webpackChunkName: "adminUsers" */ './views/GymUsersAdd.vue'),
      props: true,
      meta: { requiresGymRole: STAFF, breadcrumb: 'gym-users', breadcrumbText: 'Users' }
    },
    {
      name: 'gym-scheduled-events',
      path: '/gyms/:gymId/schedule',
      component: () => import(/* webpackChunkName: "GymScheduledEvent" */ './views/GymScheduledEvents.vue'),
      props: true,
      meta: { requiresGymRole: STAFF, breadcrumb: 'gym-scheduled-events', breadcrumbText: 'Scheduled Events' }
    },
    {
      name: 'gym-scheduled-event-add',
      path: '/gyms/:gymId/schedule/add',
      component: () => import(/* webpackChunkName: "GymScheduledEvent" */ './views/GymScheduledEventsAdd.vue'),
      props: true,
      meta: { requiresGymRole: ADMIN, breadcrumb: 'gym-scheduled-events', breadcrumbText: 'Scheduled Events' }
    },
    {
      name: 'gym-scheduled-event-view',
      path: '/gyms/:gymId/schedule/:scheduledEventId',
      component: () => import(/* webpackChunkName: "GymScheduledEvent" */ './views/GymScheduledEventsView.vue'),
      props: true,
      meta: { requiresGymRole: STAFF, breadcrumb: 'gym-scheduled-events', breadcrumbText: 'Scheduled Events' }
    },
    {
      name: 'gym-event-checkin',
      path: '/gyms/:gymId/event/:eventId/checkin',
      component: () => import(/* webpackChunkName: "staffUsers" */ './views/GymEventCheckin.vue'),
      props: true,
      meta: { requiresGymRole: STAFF }
    },
    {
      name: 'gym-event-self-checkin',
      path: '/gyms/:gymId/event/:eventId/selfcheckin',
      component: () => import(/* webpackChunkName: "staffUsers" */ './views/GymEventCheckin.vue'),
      props: true,
      meta: { requiresGymRole: STAFF }
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
  // console.log(to)
  const gymId = get(to, 'params.gymId')
  const breadcrumb = get(to, 'meta.breadcrumb')
  const breadcrumbText = get(to, 'meta.breadcrumbText')
  EventBus.$emit('gym-navigation', { gymId: gymId, breadcrumb: breadcrumb, name: to.name, breadcrumbText: breadcrumbText })
})

router.beforeEach(function (to, from, next) {
  if (to.matched.some(record => record.meta.requiresAuth) || to.matched.some(record => record.meta.requiresGymRole)) {
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
        // console.log("Auth error: ")
        next('login')
      })
      // console.log("router: authorizing")
      return
    }
    // console.log("redirect to login")
    next('login')
  } else {
    next()
  }
})

router.beforeEach(function (to, from, next) {
  if (to.matched.some(record => record.meta.requiresGymRole)) {
    const roles = to.meta.requiresGymRole
    const gymId = to.params.gymId
    // console.log("CHecking roles for ", gymId, store.state.auth.user.user_gym_roles, roles)
    if (store.state.auth.user && store.state.auth.user.user_gym_roles && gymId) {
      const userGyms = store.state.auth.user.user_gym_roles
      for (let i = 0; i < userGyms.length; i++) {
        let userGymRole = userGyms[i]
        // console.log("Checking", userGymRole.role, userGymRole.gymId)
        if ((String(userGymRole.gymId) === String(gymId)) && roles.includes(userGymRole.role)) {

          next()
          return
        }
      }
      EventBus.$emit('user-message', { message: `Permission denied`, type: 'error' })
      // console.log("NO MATCHING ROLES")
      next()
    }
    // console.log("ERROROROROR no user?",store.state.auth.user, store.state.auth.user.user_gym_roles)
    next('/login')
  } else {
    next()
  }
})

export default router
