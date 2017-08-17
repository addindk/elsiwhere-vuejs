import Vuex from 'vuex'
import {firebaseapp, providers} from '~/plugins/firebase'

// var firebaseui = require('firebaseui');
// import 'firebase/auth'
// import 'firebase/database'
/*
var config = {
  apiKey: 'AIzaSyCByuBNKnBU64oik_Z0qEKgi_czpEN9aL8',
  authDomain: 'project-1805673855421320284.firebaseapp.com',
  databaseURL: 'https://project-1805673855421320284.firebaseio.com',
  storageBucket: 'project-1805673855421320284.appspot.com',
  messagingSenderId: '95401772779'
}
firebase.initializeApp(config)
*/
// var provider = new firebase.auth().FacebookAuthProvider()
const store = () => new Vuex.Store({
  state: {
    colors: ['red', 'cyan', 'lime', 'deep-purple'],
    showLogin: false,
    popup: {
      id: '',
      show: false,
      title: '',
      description: ''
    },
    progress: 0,
    form: {
      step: 1,
      id: '',
      show: false,
      title: '',
      description: ''
    },
    modal: {
      emailverification: false
    },
    geofire: {},
    categories: {},
    subcategories: {},
    subcategoriesByCategory: {},
    posts: {},
    postsBySubcategory: {},
    loggedin: false,
    sidebar: true,
    title: 'elsiwhere',
    description: '',
    color: '',
    toolbar: 'blue',
    user: {
      photoURL: 'https://www.gravatar.com/avatar/?d=identicon',
      displayName: 'Ikke logget ind'
    },
    post: {
      d: '',
      t: ''
    },
    error: {},
    image: ''
  },
  mutations: {
    step (state, step) {
      state.form.step = step
    },
    progress (state, data) {
      state.progress = data
    },
    popup (state, feature) {
      state.popup.title = feature.properties.t
      state.popup.description = feature.properties.d
      state.popup.id = feature.properties.id
    },
    showpopup (state, show) {
      state.popup.show = show
    },
    showform (state, show) {
      state.form.show = show
    },
    showlogin (state, show) {
      state.showLogin = show
    },
    emailverification (state, show) {
      state.modal.emailverification = show
    },
    toggle (state) {
      state.sidebar = !state.sidebar
    },
    title (state, title) {
      state.title = title
    },
    description (state, data) {
      state.description = data
    },
    color (state, data) {
      state.color = data
    },
    toolbar (state, color) {
      state.toolbar = color
    },
    user (state, user) {
      if (process.BROWSER_BUILD) {
        window.console.log(user)
      }
      if (user) {
        state.user = user
        state.loggedin = true
      } else {
        state.user = {
          photoURL: 'https://www.gravatar.com/avatar/?d=identicon',
          displayName: 'Ikke logget ind'
        }
        state.loggedin = false
      }
    },
    error (state, error) {
      state.error = error
    },
    category (state, res) {
      let data = {}
      data[res.key] = res.val
      state.categories = { ...state.categories, ...data }
    },
    subcategory (state, res) {
      let data = {}
      data[res.key] = res.val
      state.subcategoriesByCategory = { ...state.subcategoriesByCategory, ...data }
      state.subcategories = { ...state.subcategories, ...res.val }
      state.description = res.val.d
    },
    post (state, data) {
      state.post.d = data.d
      state.post.t = data.t
    },
    posts (state, data) {
      const val = data.val()
      if (state.subcategories.hasOwnProperty(val.c)) {
        val.i = state.subcategories[val.c].i + '-15-elsiwhere'
      }
      if (!state.postsBySubcategory.hasOwnProperty(val.c)) {
        state.postsBySubcategory[val.c] = {}
      }
      let post = {}
      post[data.key] = val
      state.postsBySubcategory[val.c] = { ...state.postsBySubcategory[val.c], ...post }
      state.posts = { ...state.posts, ...post }
    },
    categories (state, data) {
      state.categories = data
    },
    subcategories (state, res) {
      let data = {}
      const val = res.val
      data[res.key] = val
      state.subcategoriesByCategory = { ...state.subcategoriesByCategory, ...data }
      state.subcategories = { ...state.subcategories, ...val }
    },
    geofire (state, res) {
      let data = {}
      data[res.key] = res.val()
      state.geofire = { ...state.geofire, ...data }
    },
    image (state, data) {
      state.image = data
    }
  },
  actions: {
    login (context) {
      context.commit('showlogin', true)
    },
    hidelogin (context) {
      context.commit('showlogin', false)
    },
    loginFacebook (context) {
      return firebaseapp.auth().signInWithPopup(providers.facebook)
    },
    loginGoogle (context) {
      return firebaseapp.auth().signInWithPopup(providers.google)
    },
    loginEmail (context) {
      return firebaseapp.auth().signInWithPopup(providers.email)
    },
    logout (context) {
      firebaseapp.auth().signOut().then(function (result) {
        context.commit('user', result)
      }).catch(function (error) {
        context.commit('error', error)
      })
    },
    getCategories (context) {
      return firebaseapp.database().ref('category').once('value').then(function (data) {
        context.commit('categories', data.val())
        if (process.BROWSER_BUILD) {
        }
      }).catch(function (error) {
        context.commit('error', error)
      })
    },
    getGeofire (context) {
      firebaseapp.database().ref('geofire').on('child_added', function (res) {
        context.commit('geofire', res)
      })
    }
  }
})
if (process.BROWSER_BUILD) {
  console.log('browser_build')
  firebaseapp.auth().onAuthStateChanged(function (user) {
    store.commit('user', user)
    if (user && user.emailVerified) {
      if (!user.emailVerified) {
        user.sendEmailVerification()
        store.commit('emailverification', true)
      }
      firebaseapp.database().ref('users')
    } else {

    }
  })
}
export default store
