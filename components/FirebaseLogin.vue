<template>
    <div>
      <div>
        <v-btn dark default @click.native.stop="$store.dispatch('loginGoogle')">Login med Google</v-btn>
      </div>
      <div>
        <v-btn dark default @click.native.stop="$store.dispatch('loginFacebook')">Login med Facebook</v-btn>
      </div>
      <div>
        <v-btn dark default @click.native.stop="$store.dispatch('loginEmail')">Login med email</v-btn>
      </div>
    </div>
</template>
<script>
export default {
}
</script>
