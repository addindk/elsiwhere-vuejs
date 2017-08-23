import Vuex from 'vuex'
import {firebaseapp, providers} from '~/plugins/firebase'
import moment from 'moment'
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
let ref

const store = () => new Vuex.Store({
  state: {
    dato: null,
    events: {},
    colors: ['red', 'cyan', 'lime', 'deep-purple'],
    showLogin: false,
    popup: {},
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
    userId: '',
    sidebar: false,
    title: 'elsiwhere',
    description: '',
    color: '',
    toolbar: 'blue',
    providerId: '',
    user: {},
    post: {
      d: '',
      t: ''
    },
    error: {},
    image: ''
  },
  mutations: {
    dato (state, data) {
      let childAdded = function (data) {
        let item = {}
        item[data.key] = data.val()
        state.events = {...state.events, ...item}
      }
      let childRemoved = function (data) {
        if (state.events.hasOwnProperty(data.key)) {
          let newEvents = Object.assign({}, state.events)
          delete newEvents[data.key]
          state.events = newEvents
        }
      }
      state.dato = data
      if (ref) {
        state.events = {}
        ref.off('child_added', childAdded)
        ref.off('child_removed', childAdded)
      }
      let today = moment(data, 'DD-MM-YYYY')
      ref = firebaseapp.database().ref('calendar').child(today.format('YYYY')).child(today.format('MM')).child(today.format('DD'))
      ref.on('child_added', childAdded)
      ref.on('child_removed', childRemoved)
    },
    providerId (state, data) {
      state.providerId = data
    },
    step (state, step) {
      state.form.step = step
    },
    progress (state, data) {
      state.progress = data
    },
    popup (state, feature) {
      if (state.posts.hasOwnProperty(feature.properties.id)) {
        state.popup = {...state.posts[feature.properties.id], ...{ id: feature.properties.id }}
      }
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
    user (state, { currentUser, providerId }) {
      if (currentUser) {
        state.userId = currentUser.uid
        if (providerId) {
          state.providerId = providerId
          for (let i = 0; i < currentUser.providerData; i++) {
            const provider = currentUser.providerData[i]
            if (provider.providerId === providerId) {
              state.user = provider
            }
          }
        } else {
          state.user = currentUser.providerData[0]
        }
      } else {
        state.userId = ''
        state.user = {
          photoURL: 'https://www.gravatar.com/avatar/?d=identicon',
          displayName: 'Ikke logget ind'
        }
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
    removePost (state, data) {
      const post = data.val()
      if (state.posts.hasOwnProperty(data.key)) {
        let newPosts = Object.assign({}, state.posts)
        delete newPosts[data.key]
        state.posts = newPosts
      }
      if (state.postsBySubcategory.hasOwnProperty(post.c) && state.postsBySubcategory[post.c].hasOwnProperty(data.key)) {
        let newPosts = Object.assign({}, state.postsBySubcategory[post.c])
        delete newPosts[data.key]
        state.postsBySubcategory[post.c] = newPosts
      }
    },
    post (state, data) {
      state.post = data
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
}
export default store
