<template>
  <Mapbox v-bind:geofire="$store.state.posts" v-bind:sidebar="$store.state.sidebar"></Mapbox>
</template>
<script>
  import Mapbox from '~/components/Mapbox.vue'
  import { firebaseapp } from '~/plugins/firebase'
  var title = 'Kort'
  export default {
    components: {
      Mapbox
    },
    head () {
      return {
        title
      }
    },
    mounted () {
      console.log('mounted map')
      const store = this.$store
      firebaseapp.database().ref('post').on('child_added', function (data) {
        store.commit('posts', data)
      })
    },
    fetch ({ store }) {
      store.commit('title', title)
      return firebaseapp.database().ref('subcategory').once('value').then((data) => {
        const val = data.val()
        for (const key in val) {
          store.commit('subcategories', { key: key, val: val[key] })
        }
      })
      // store.dispatch('getGeofire')
    }
  }
</script>

<style scoped>

</style>
