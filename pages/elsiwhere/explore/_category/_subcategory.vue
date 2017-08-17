<template>
  <div>
    <v-card v-show="!show">
      <v-card-media height="300px" :src="'/subcategory/1024/'+$route.params.subcategory+'.jpg'">
        <v-container fill-height fluid>
          <v-layout fill-height>
            <v-flex xs12 align-center justify-center flexbox>
              <span class="header-title">{{$store.state.title}}</span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-media>
      <v-card-title class="description">
        {{$store.state.description}}
        <v-fab-transition>
          <v-btn absolute dark fab top right :class="$store.state.color" @click.stop="show=!show">
            <v-icon>add</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-card-title>
    </v-card>
    <v-card flat v-show="show">
      <v-toolbar dark card :class="$store.state.categories[$route.params.category].c">
        <v-btn icon @click.native="show = false" dark>
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Opret ny oplevelse</v-toolbar-title>
      </v-toolbar>
      <v-stepper v-model="$store.state.form.step" vertical v-if="$store.state.form.show">
        <v-stepper-step step="1" :complete="$store.state.form.step > 1">
          Angiv titel og beskrivelse
          <small>Påkrævet</small>
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-text-field v-model="post.title" name="title" label="Overskrift" required></v-text-field>
          <v-text-field v-model="post.description" multi-line name="description" label="Beskrivelse" required></v-text-field>
          <v-btn primary @click.native="$store.commit('step',2)" :disabled="post.title==='' || post.description===''">Næste</v-btn>
        </v-stepper-content>
        <v-stepper-step step="2" v-bind:complete="$store.state.form.step > 2">
          Tidsperiode
          <small>Valgfrit trin</small>
        </v-stepper-step>
        <v-stepper-content step="2">
          <v-dialog persistent v-model="modalStart" lazy full-width>
            <v-text-field slot="activator" label="Start dato" v-model="post.start" append-icon="event" readonly></v-text-field>
            <v-date-picker v-model="post.start" scrollable locale="da-dk">
              <template scope="{ save, cancel }">
                <v-card-actions>
                  <v-btn flat primary @click.native="cancel()">Fortryd</v-btn>
                  <v-btn flat primary @click.native="save()">Gem</v-btn>
                </v-card-actions>
              </template>
            </v-date-picker>
          </v-dialog>
          <v-dialog persistent v-model="modalStop" lazy full-width>
            <v-text-field slot="activator" label="Slut dato" v-model="post.stop" append-icon="event" readonly></v-text-field>
            <v-date-picker v-model="post.stop" scrollable locale="da-dk">
              <template scope="{ save, cancel }">
                <v-card-actions>
                  <v-btn flat primary @click.native="cancel()">Fortryd</v-btn>
                  <v-btn flat primary @click.native="save()">Gem</v-btn>
                </v-card-actions>
              </template>
            </v-date-picker>
          </v-dialog>
          <v-btn flat primary @click.native="$store.commit('step',1)">Forrige</v-btn>
          <v-btn primary @click.native="$store.commit('step',3)">Næste</v-btn>
        </v-stepper-content>
        <v-stepper-step step="3" v-bind:complete="$store.state.form.step > 3">
          Tilføj et billede
          <small>Påkrævet</small>
        </v-stepper-step>
        <v-stepper-content step="3">
          <v-card flat class="grey lighten-1 mb-2" height="300px" :img="post.image">
          </v-card>
          <v-btn flat primary @click.native.stop="fileselect()">
            Vælg fil
          </v-btn>
          <v-btn flat primary @click.native="$store.commit('step',2)">Forrige</v-btn>
          <v-btn primary @click.native="step()" :disabled="post.image===''">Næste</v-btn>
        </v-stepper-content>
        <v-stepper-step step="4">
          Angiv en placering i kortet
          <small>Påkrævet</small>
        </v-stepper-step>
        <v-stepper-content step="4">
          <div id="mappost"></div>
          <v-btn flat primary @click.native="$store.commit('step',3)">Forrige</v-btn>
          <v-btn primary @click.native="save()">Gem</v-btn>
          <div class="text-xs-center">
            <v-progress-circular v-bind:size="100" v-bind:width="15" v-bind:rotate="-90" v-bind:value="$store.state.progress" class="primary--text">
              {{ $store.state.progress }}
            </v-progress-circular>
          </div>
        </v-stepper-content>
      </v-stepper>
    </v-card>
    <v-container fluid grid-list-md v-show="!show" class="grey lighten-4">
      <v-layout row wrap>
        <v-flex xs12 md6 v-for="(value, key) in $store.state.posts" :key="key" v-if="value.c === $route.params.subcategory">
          <v-card>
            <v-card-title>
              {{value.t}}
            </v-card-title>
            <v-card-media style="cursor: pointer" @click.stop="$router.push({ name: 'elsiwhere-post-id', params: { id: key } })" :src="'/post/512/'+key+'.jpg'" height="300px"></v-card-media>
            <v-card-text>
              <div>{{value.d}}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn light icon class="grey--text text--darken-3" @click.stop="$router.push({ name: 'elsiwhere-map-id', params: { id: key }})">
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
        </v-flex>
      </v-layout>
    </v-container>
    <div style="height: 50px; display:block"></div>
  </div>
  <!--a class="twitter-timeline" href="https://twitter.com/runetvilum/timelines/838731167645982720">elsiwhere - Curated tweets by runetvilum</a> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
    </v-container-->
</template>
<script>
import { firebaseapp } from '~/plugins/firebase'
// import fileDialog from 'file-dialog'
import axios from '~/plugins/axios'
export default {
  scrollToTop: true,
  head () {
    return {
      title: this.title
    }
  },
  data () {
    const store = this.$store
    return {
      title: store.state.title,
      modalStart: false,
      modalStop: false,
      post: {
        title: '',
        description: '',
        image: '',
        start: null,
        stop: null
      },
      fil: null
    }
  },
  computed: {
    show: {
      get: function () {
        console.log('get', this.$store.state.form.show)
        return this.$store.state.form.show
      },
      set: function (show) {
        console.log('set', show)
        this.$store.commit('showform', show)
      }
    }
  },
  methods: {
    save: function () {
      const store = this.$store
      const data = new FormData()
      data.append('title', this.post.title)
      data.append('description', this.post.description)
      data.append('description', this.post.start)
      data.append('description', this.post.stop)
      data.append('image', this.fil)
      const config = {
        onUploadProgress: function (progressEvent) {
          store.commit('progress', Math.round((progressEvent.loaded * 100) / progressEvent.total))
        }
      }
      axios.post('/api/post', data, config).then(function (res) {
        console.log(res.data)
      }).catch(function (err) {
        console.log(err)
      })
    },
    filechanged: function (e) {
      console.log('file', e)
    },
    fileselect: function () {
      const fileDialog = (...args) => {
        const input = document.createElement('input')

        // Set config
        if (typeof args[0] === 'object') {
          if (args[0].multiple === true) input.setAttribute('multiple', '')
          if (args[0].accept !== undefined) input.setAttribute('accept', args[0].accept)
        }
        input.setAttribute('type', 'file')

        // IE10/11 Addition
        input.style.display = 'none'
        input.setAttribute('id', 'hidden-file')
        document.body.appendChild(input)

        // Return promise/callvack
        return new Promise((resolve, reject) => {
          input.addEventListener('change', e => {
            resolve(input.files)
            const lastArg = args[args.length - 1]
            if (typeof lastArg === 'function') lastArg(input.files)

            // IE10/11 Addition
            document.body.removeChild(input)
          })

          // Simluate click event
          const evt = document.createEvent('MouseEvents')
          evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null)
          input.dispatchEvent(evt)
        })
      }

      fileDialog().then(file => {
        this.fil = file[0]
        const fr = new FileReader()
        fr.onload = () => {
          this.post.image = fr.result
        }
        fr.readAsDataURL(this.fil)
      })
    },
    step: function () {
      this.$store.commit('step', 4)
      console.log('mounted')
      const mapboxgl = require('mapbox-gl/dist/mapbox-gl')
      mapboxgl.accessToken = 'pk.eyJ1IjoicnVuZXR2aWx1bSIsImEiOiJkeUg2WVkwIn0.yoMmv3etOc40RXkPsebXSg'
      const tilejson = {
        version: 8,
        // sprite: 'sprite',
        glyphs: 'mapbox://fonts/runetvilum/{fontstack}/{range}.pbf',
        sprite: 'mapbox://sprites/runetvilum/cj02byn7900362sny0ythayp2',
        sources: {
          'ortofoto': {
            type: 'raster',
            tiles: [
              'http://a.kortforsyningen.kms.dk/orto_foraar_webm?login=qgisdk&password=qgisdk&request=GetTile&version=1.0.0&service=WMTS&Layer=orto_foraar&style=default&format=image/jpeg&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}',
              'http://b.kortforsyningen.kms.dk/orto_foraar_webm?login=qgisdk&password=qgisdk&request=GetTile&version=1.0.0&service=WMTS&Layer=orto_foraar&style=default&format=image/jpeg&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}',
              'http://c.kortforsyningen.kms.dk/orto_foraar_webm?login=qgisdk&password=qgisdk&request=GetTile&version=1.0.0&service=WMTS&Layer=orto_foraar&style=default&format=image/jpeg&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}'
            ],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 20,
            attribution: 'FOT ortofoto <a href="http://www.kortforsyningen.dk" target="_blank">@ Geodatastyrelsen</a>'
          }
        },
        layers: [
          {
            id: 'ortofoto',
            type: 'raster',
            source: 'ortofoto',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      }
      const map = new mapboxgl.Map({
        container: 'mappost',
        style: tilejson,
        center: new mapboxgl.LngLat(12, 56),
        zoom: 7,
        pitchWithRotate: false,
        dragRotate: false,
        touchZoomRotate: false,
        attributionControl: false
      })
      const el = document.createElement('div')
      el.className = 'marker'
      const marker = new mapboxgl.Marker(el)
        .setLngLat(new mapboxgl.LngLat(12, 56))
        .addTo(map)
      map.on('move', () => {
        marker.setLngLat(map.getCenter())
      })
      function success (pos) {
        var crd = pos.coords
        map.jumpTo({ zoom: 15, center: new mapboxgl.LngLat(crd.longitude, crd.latitude) })
      }
      window.navigator.geolocation.getCurrentPosition(success)
      /*
      window.navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position)
        map.jumpTo({ center: new mapboxgl.LngLat(position.coords.longitude, position.coords.latitude) })
      }, (err) => {
        console.log(err)
      })
      */
    }
  },
  mounted () {
    const store = this.$store
    const params = this.$route.params
    if (!store.state.categories.hasOwnProperty(params.category)) {
      firebaseapp.database().ref('category').child(params.category).once('value').then((res) => {
        const val = res.val()
        store.commit('color', val.c)
      })
    } else {
      const category = store.state.categories[params.category]
      store.commit('color', category.c)
    }
    console.log('subcategory', params.subcategory)
    firebaseapp.database().ref('post').orderByChild('c').equalTo(params.subcategory).on('child_added', (data) => {
      store.commit('posts', data)
    })
  },
  fetch ({ store, params }) {
    if (!store.state.subcategories.hasOwnProperty(params.subcategory)) {
      return firebaseapp.database().ref('subcategory').child(params.category).child(params.subcategory).once('value').then((res) => {
        const val = res.val()
        console.log(val)
        store.commit('subcategory', { key: res.key, val: val })
        store.commit('title', val.t)
        store.commit('description', val.d)
        store.commit('color', val.c)
      })
    } else {
      const item = store.state.subcategories[params.subcategory]
      store.commit('title', item.t)
      store.commit('description', item.d)
      store.commit('color', item.c)
    }
  }
}
</script>
<style lang="stylus">
.description
  color: #666
  font-size: 18px
  min-height: 100px
  position: relative
.header-title
  color: rgba(255,255,255,1)
  font-size: 80px
  font-weight: 700
  text-shadow: #000 0 0 10px
#mappost
  height: 300px
  width: 100%
.card
  display: flex
  flex-direction: column
.card__text
  flex-grow: 1
.space
  margin-left:10px
.fab
  position: fixed
  right: 10px
  bottom: 10px
  z-index: 4
.map-modal .modal-card
  width: 576px;
@media only screen and (max-width: 576px)
  .header-title
    font-size: 40px
  .map-modal .modal
    position: absolute
    top: 63px
    bottom: 0
    left: 0
    right: 0
    margin: 0
    max-height: 100%
    max-width: 100%
    display: flex
  .modal-card
    flex: 1 0 100%
    display: flex
  .stepper
    flex: 1 0 100%
  .file
    position: absolute
    top: 0
    right: 0
    opacity: 0
    width: 300px
</style>