// import Vue from 'vue'
// import Vuetify from 'vuetify'
// import theme from './theme'
// import 'vuetify/dist/vuetify.min.css'
// import '@mdi/font/css/materialdesignicons.css'
//
// Vue.use(Vuetify, {
//   iconfont: 'mdi',
//   theme
// })

// import Vue from 'vue'
// import Vuetify from 'vuetify/lib'
// // import 'vuetify/dist/vuetify.min.css'
// // import '@mdi/font/css/materialdesignicons.css'
//
// Vue.use(Vuetify)
//
// export default new Vuetify({
//   icons: {
//     iconfont: 'mdi'
//   },
//   theme: {
//   }
// })

import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    themes: {
      light:
        {
          primary: '#394AC4',
          secondary: '#394AC4',
          tertiary: '#495057',
          accent: '#82B1FF',
          error: '#f53528',
          info: '#00d3ee',
          success: '#5cb860',
          warning: '#ffa21a'
        }
    }
  }
})
