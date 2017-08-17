<template>
  <Mapbox :post="post" :geofire="$store.state.posts"></Mapbox>
</template>
<script>
  import Mapbox from '~/components/Mapbox.vue'
  import { firebaseapp } from '~/plugins/firebase'
  export default {
    components: {
      Mapbox
    },
    head () {
      return {
        title: this.title
      }
    },
    data ({ store, params }) {
      store.commit('title', 'Kort')
      store.commit('toolbar', 'indigo')
      if (!store.state.posts.hasOwnProperty(params.id)) {
        return firebaseapp.database().ref('post').child(params.id).once('value').then((res) => {
          const val = res.val()
          store.commit('posts', { key: res.key, val: val })
          console.log('data post', val)
          return { title: 'Kort', post: val }
        })
      }
      return { title: 'Kort', post: store.state.posts[params.id] }
    }
    /*
    ,
    fetch ({ store, params }) {
      console.log('kort')
      if (!store.state.posts.hasOwnProperty(params.id)) {
        return firebaseapp.database().ref('post').child(params.id).once('value').then((res) => {
          store.commit('posts', { key: res.getKey(), val: res.val() })
        })
      }
    }
    */
  }
</script>

<style scoped>

</style>
