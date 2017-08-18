<template>
  <v-container fluid class="map-container">
    <div id='map'></div>
    <v-dialog width="400" v-model="show" class="map-modal">
      <v-card class="map-card">
        <v-card-title>
          <div class="headline">{{$store.state.popup.title}}</div>
        </v-card-title>
        <v-card-media :src="'/post/512/'+$store.state.popup.id+'.jpg'" height="256px"></v-card-media>
        <v-card-text class="fill">
          {{$store.state.popup.description}}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat dark primary @click.native.stop="show=!show">
            Luk
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
let map
export default {
  props: {
    post: {
      type: Object,
      default: function () {
        return { }
      }
    },
    geofire: {
      type: Object,
      default: function () {
        return {}
      }
    },
    sidebar: Boolean
  },
  computed: {
    show: {
      get: function () {
        // console.log('get', this.$store.state.popup.show)
        return this.$store.state.popup.show
      },
      set: function (show) {
        // console.log('set', show)
        this.$store.commit('showpopup', show)
      }
    }
  },
  methods: {
    populatePopup (feature) {
      this.$store.commit('popup', feature)
    },
    showPopup (show) {
      this.$store.commit('showpopup', show)
      // this.show2 = show
      // console.log('show', this.show)
    }
  },
  watch: {
    sidebar: function (data) {
      // console.log('watch sidebar', data)
      if (!data) {
        setTimeout(function () {
          map.resize()
        }, 500)
      }
    },
    geofire: function (data) {
      let source = map.getSource('items')
      if (source) {
        // console.log('watch', data)
        let geojson = {
          'type': 'FeatureCollection',
          'features': []
        }
        Object.keys(data).forEach(function (key) {
          let post = data[key]
          geojson.features.push({
            'type': 'Feature',
            'properties': {
              'id': key,
              'c': post.c,
              't': post.t,
              'd': post.d,
              'i': post.i
            },
            'geometry': {
              'type': 'Point',
              'coordinates': [post.lng, post.lat]
            }
          })
        })
        source.setData(geojson)
      }
    }
  },
  mounted () {
    // console.log('mounted', this.post)
    const mapboxgl = require('mapbox-gl/dist/mapbox-gl')
    const minimap = require('~/plugins/minimap')
    mapboxgl.accessToken = 'pk.eyJ1IjoicnVuZXR2aWx1bSIsImEiOiJkeUg2WVkwIn0.yoMmv3etOc40RXkPsebXSg'
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/runetvilum/cj02byn7900362sny0ythayp2', // 'mapbox://styles/mapbox/streets-v9',
      center: new mapboxgl.LngLat(12, 56),
      zoom: 7
    })
    map.on('click', function (e) {
      e.originalEvent.stopPropagation()
      // e.originalEvent.preventDefault()
      var features = map.queryRenderedFeatures(e.point, { layers: ['unclustered-points'] })
      if (!features.length) {
        return
      }
      var feature = features[0]
      this.populatePopup(feature)
      this.showPopup(true)

      // Populate the popup and set its coordinates
      // based on the feature found.
      /*
      new mapboxgl.Popup({ anchor: 'bottom', closeButton: false })
        .setLngLat(feature.geometry.coordinates)
        .setHTML('<img style="height: 180px;width: 180px" src="https://elsiwhere.dk/assets/post/256/' + feature.properties.id + '.jpg"><h6>' + feature.properties.t + '</h6><p>' + feature.properties.d + '</p>')
        .addTo(map)
      */
    }.bind(this))
    map.on('mousemove', function (e) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['unclustered-points'] })
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : ''
    })
    map.on('styledata', function (e) {
      // console.log('styledata')
      setTimeout(function () {
        map.resize()
      }, 500)
      const source = map.getSource('items')
      // console.log('source', source)
      if (!source) {
        let geojson = {
          'type': 'FeatureCollection',
          'features': []
        }
        const geofire = this.geofire
        Object.keys(geofire).forEach(function (key) {
          let post = geofire[key]
          geojson.features.push({
            'type': 'Feature',
            'properties': {
              'id': key,
              'c': post.c,
              't': post.t,
              'd': post.d,
              'i': post.i
            },
            'geometry': {
              'type': 'Point',
              'coordinates': [post.lng, post.lat]
            }
          })
        })
        map.addSource('items', {
          type: 'geojson',
          data: geojson,
          cluster: true,
          clusterMaxZoom: 16, // Max zoom to cluster points on
          clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        })
        map.addLayer({
          'id': 'unclustered-points',
          'type': 'symbol',
          'source': 'items',
          'layout': {
            'icon-image': '{i}',
            'icon-allow-overlap': true
          }
        })
        const layers = [
          [150, '#f28cb1'],
          [20, '#f1f075'],
          [0, '#51bbd6']
        ]
        layers.forEach(function (layer, i) {
          map.addLayer({
            'id': 'cluster-' + i,
            'type': 'circle',
            'source': 'items',
            'paint': {
              'circle-color': layer[1],
              'circle-radius': 18
            },
            'filter': i === 0 ? ['>=', 'point_count', layer[0]] : ['all', ['>=', 'point_count', layer[0]], ['<', 'point_count', layers[i - 1][0]]]
          })
        })
        // Add a layer for the clusters' count labels
        map.addLayer({
          'id': 'cluster-count',
          'type': 'symbol',
          'source': 'items',
          'layout': {
            'text-field': '{point_count}',
            'text-font': [
              'DIN Offc Pro Medium',
              'Arial Unicode MS Bold'
            ],
            'text-size': 12
          }
        })
      }
      const composite = map.getSource('composite')
      if (composite) {
        const l = map.getLayer('3d-buildings')
        if (!l) {
          map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': {
                'type': 'identity',
                'property': 'height'
              },
              'fill-extrusion-base': {
                'type': 'identity',
                'property': 'min_height'
              },
              'fill-extrusion-opacity': 0.6
            }
          })
        }
      }
    }.bind(this))
    map.addControl(new minimap.LayerSwitcher(), 'bottom-left')
    let nav = new mapboxgl.NavigationControl()
    map.addControl(nav, 'top-left')
    /*
    let scale = new mapboxgl.ScaleControl({position: 'top-left'})
    map.addControl(scale)
    */
    if (this.post.lat && this.post.lng) {
      map.jumpTo({center: [this.post.lng, this.post.lat], zoom: 18})
    }
  }
}
</script>

<style lang="stylus">
.map-container
  padding: 0
#map
  height: calc(100vh - 64px)
  width: 100%
.mapboxgl-ctrl-group > button
  margin-bottom: 0
.map-card
  display: flex
  flex-direction: column
  flex: 1 0 100%
  .card__text
    flex: 1 1 100%

@media only screen and (max-width: 576px)
  .dialog
    margin 0
    width 100% !important
    height 100%
    position: fixed
    overflow-y: auto
    top: 0
    left 0
    &:not(.dialog--fullscreen)
      max-width: 100%
      max-height: 100%
    >
      .card
        min-height 100%
        min-width 100%
        margin 0 !important
        padding 0 !important
/*
  .map-modal .dialog
    position: absolute
    top: 63px
    bottom: 0
    left: 0
    right: 0
    margin: 0
    max-height: 100%
    max-width: 100%
    display: flex
    width: 100% !important
*/
</style>
