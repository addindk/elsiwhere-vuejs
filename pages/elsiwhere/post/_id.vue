<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        {{$store.state.post.t}}
      </v-card-title>
      <v-card-media :src="'/post/1024/' + $route.params.id + '.jpg'" height="300px"></v-card-media>
      <v-card-text class="text-xs-left">
        {{$store.state.post.d}}
      </v-card-text>
      <v-card-text class="primary white--text" v-if="$store.state.post.start && $store.state.post.stop">
        <p>Åbningstider: {{$store.state.post.start}} - {{$store.state.post.stop}}</p>
        <div v-for="day in days" :key="day">
          <v-layout row v-if="$store.state.post.open[day].active">
            <v-flex style="flex-grow: 0">{{day}}</v-flex>
            <v-flex>{{$store.state.post.open[day].start}} - {{$store.state.post.open[day].stop}}</v-flex>
          </v-layout>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn light icon class="grey--text text--darken-3" @click.native.stop="$router.push({ name: 'elsiwhere-map', query: { id: $route.params.id }})">
            <v-icon>public</v-icon>
        </v-btn>
        <v-menu bottom origin="top right" transition="v-scale-transition">
          <v-btn class="grey--text text--darken-3" light icon slot="activator">
            <v-icon>share</v-icon>
          </v-btn>
          <v-list>
            <v-subheader>Del side</v-subheader>
            <v-list-tile @click.stop="fbShare()">
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
        <v-btn flat primary @click.stop="dialogDelete=true" v-show="$store.state.userId === $store.state.post.uid">
          SLET
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dialogDelete" lazy absolute>
      <v-card>
        <v-card-title>
          <div class="headline">Slet oplevelse</div>
        </v-card-title>
        <v-card-text>Vil du slette oplevelsen?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn primary flat @click.native="dialogDelete = false">Nej</v-btn>
          <v-btn primary flat @click.native="deletePost()">Ja</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <!--a class="twitter-timeline" href="https://twitter.com/runetvilum/timelines/838731167645982720">elsiwhere - Curated tweets by runetvilum</a> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
  </v-container-->
</template>
<script>
import Vue from 'vue'
import { firebaseapp } from '~/plugins/firebase'
import axios from '~/plugins/axios'
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
        { hid: 'twitter:image', name: 'twitter:image', content: this.image },
        { property: 'og:url', content: this.url },
        { property: 'og:title', content: this.title },
        { property: 'og:description', content: this.description },
        { property: 'og:image', content: this.image },
        { property: 'og:site_name', content: 'Elsiwhere' },
        { property: 'fb:app_id', content: '1559938820976000' },
        { property: 'og:locale', content: 'da_DK' }
      ]
    }
  },
  data () {
    return {
      dialogDelete: false,
      days: ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag']
    }
  },
  methods: {
    fbShare: function () {
      if (navigator.standalone) {
        const url = 'https://www.facebook.com/dialog/share?app_id=1559938820976000&display=popup&href=https%3A%2F%2Felsiwhere.dk%2Fpost%2F' + this.$route.params.id + '&redirect_uri=https%3A%2F%2Felsiwhere.dk%2Fpost%2F' + this.$route.params.id
        window.open(url, '_self')
      } else {
        Vue.FB.ui({
          method: 'share_open_graph',
          action_type: 'og.likes',
          mobile_iframe: true,
          action_properties: JSON.stringify({
            object: 'https://elsiwhere.dk/post/' + this.$route.params.id
          })
        }, function (response) {
          // Debug response (optional)
        })
      }
    },
    deletePost: function () {
      this.dialogDelete = false
      const data = {
        id: this.$route.params.id
      }
      firebaseapp.auth().currentUser.getToken(/* forceRefresh */ true).then(function (idToken) {
        data.token = idToken
        return axios.post('/api/post/delete/', data)
      })
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
    },
    url: {
      get: function () {
        return 'https://elsiwhere.dk/elsiwhere/post/' + this.$route.params.id
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
<style scoped lang="stylus">
@media only screen and (max-width: 599px)
  .container
    padding: 0px
</style>
