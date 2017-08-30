<template>
  <div id="firebaseui-auth-container">
  </div>
</template>
<script>
import { firebaseapp, uiConfig } from '~/plugins/firebase'
require('firebaseui/dist/firebaseui.css')
var ui, firebaseui
export default {
  mounted () {
    const router = this.$router
    const store = this.$store
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
        store.commit('user', { currentUser: currentUser, providerId: credential.providerId })
        router.push(redirectUrl)
        return false
      }
    }
    ui.start('#firebaseui-auth-container', uiConfig)
  },
  beforeDestroy () {
    ui.reset()
  }
}
</script>
