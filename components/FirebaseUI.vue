<template>
  <div id="firebaseui-auth-container">
  </div>
</template>
<script>
import { firebaseapp, uiConfig } from '~/plugins/firebase'
require('firebaseui/dist/firebaseui.css')
var ui, firebaseui
export default {
  props: {
    reset: Boolean
  },
  watch: {
    reset: function (data) {
      console.log('reset', data)
      if (data) {
        // ui.reset()
        // ui.start('#firebaseui-auth-container', uiConfig)
      }
    }
  },
  mounted () {
    const router = this.$router
    const store = this.$store
    console.log('mounted')
    if (!firebaseui) {
      firebaseui = require('firebaseui')
      // Initialize the FirebaseUI Widget using Firebase.
      ui = new firebaseui.auth.AuthUI(firebaseapp.auth())
    }
    uiConfig.callbacks = {
      signInSuccess: function (currentUser, credential, redirectUrl) {
        // Do something.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        console.log(currentUser, credential, redirectUrl)
        store.commit('user', { currentUser: currentUser, providerId: credential.providerId })
        router.push(redirectUrl)
        return false
      }
    }
    ui.start('#firebaseui-auth-container', uiConfig)
  },
  beforeDestroy () {
    console.log('beforeDestroy')
    ui.reset()
  }
}
</script>
