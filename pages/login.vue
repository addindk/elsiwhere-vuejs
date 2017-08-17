<template>
  <v-app>
    <v-toolbar>
      <v-btn icon="icon" @click.native="$router.go(-1)" light>
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>Login</v-toolbar-title>
    </v-toolbar>
    <main>
      <v-container fluid>
        <FirebaseUI></FirebaseUI>
      </v-container>
    </main>
  </v-app>
</template>
<script>
import FirebaseUI from '~/components/FirebaseUI.vue'
export default {
  components: {
    FirebaseUI
  }
}
</script>
