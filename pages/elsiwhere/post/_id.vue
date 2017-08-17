<template>
  <v-container fluid class="pa-0">
    <v-card>
      <v-card-title>
        {{$store.state.post.t}}
      </v-card-title>
      <v-card-media :src="'/post/1024/' + $route.params.id + '.jpg'" height="300px"></v-card-media>
      <v-card-text class="text-xs-left">
        {{$store.state.post.d}}
      </v-card-text>
      <v-card-actions>
        <v-btn light icon class="grey--text text--darken-3" @click.native.stop="$router.push({ name: 'index-map-id', params: { id: $route.params.id }})">
            <v-icon>public</v-icon>
        </v-btn>
        <v-menu bottom origin="top right" transition="v-scale-transition">
          <v-btn class="grey--text text--darken-3" light icon slot="activator">
            <v-icon>share</v-icon>
          </v-btn>
          <v-list>
            <v-subheader>Del side</v-subheader>
            <v-list-tile>
              <i class="fa fa-2x fa-facebook-square" aria-hidden="true"></i>
              <v-list-tile-title class="space">Facebook</v-list-tile-title>
            </v-list-tile>
            <v-list-tile>
              <i class="fa fa-2x fa-twitter-square" aria-hidden="true"></i>
              <v-list-tile-title class="space">Twitter</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-spacer />
        <v-btn flat primary @click.native.stop="show=!show">
          SLET
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
  <!--a class="twitter-timeline" href="https://twitter.com/runetvilum/timelines/838731167645982720">elsiwhere - Curated tweets by runetvilum</a> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
  </v-container-->
</template>
<script>
import { firebaseapp } from '~/plugins/firebase'
export default {
  scrollToTop: true,
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:site', name: 'twitter:site', content: '@elsiwhere' },
        { hid: 'twitter:creator', name: 'twitter:creator', content: '@elsiwhere' },
        { hid: 'twitter:title', name: 'twitter:title', content: this.title },
        { hid: 'twitter:description', name: 'twitter:description', content: this.description },
        { hid: 'twitter:image', name: 'twitter:image', content: this.image }
      ]
    }
  },
  computed: {
    title: {
      get: function () {
        return this.$store.state.post.t
      }
    },
    description: {
      get: function () {
        return this.$store.state.post.d
      }
    },
    image: {
      get: function () {
        return 'https://elsiwhere.dk/post/512/' + this.$route.params.id + '.jpg'
      }
    }
  },
  fetch ({ store, params }) {
    return firebaseapp.database().ref('post').child(params.id).once('value').then((res) => {
      store.commit('post', res.val())
    })
  }
}
</script>
<style lang="stylus">
</style>
