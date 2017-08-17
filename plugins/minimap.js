// Control implemented as ES6 class
const mapboxgl = require('mapbox-gl/dist/mapbox-gl')
const tilejson = {
  version: 8,
  // sprite: 'sprite',
  glyphs: 'mapbox://fonts/runetvilum/{fontstack}/{range}.pbf',
  sprite: 'mapbox://sprites/runetvilum/cj02byn7900362sny0ythayp2',
  sources: {
    'ortofoto': {
      type: 'raster',
      tiles: [
        'https://a.kortforsyningen.kms.dk/orto_foraar_webm?login=qgisdk&password=qgisdk&request=GetTile&version=1.0.0&service=WMTS&Layer=orto_foraar&style=default&format=image/jpeg&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}',
        'https://b.kortforsyningen.kms.dk/orto_foraar_webm?login=qgisdk&password=qgisdk&request=GetTile&version=1.0.0&service=WMTS&Layer=orto_foraar&style=default&format=image/jpeg&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}',
        'https://c.kortforsyningen.kms.dk/orto_foraar_webm?login=qgisdk&password=qgisdk&request=GetTile&version=1.0.0&service=WMTS&Layer=orto_foraar&style=default&format=image/jpeg&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}'
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
class LayerSwitcher {
  update () {
    let zoom = this._map.getZoom()
    zoom = zoom - 2 >= 0 ? zoom - 2 : zoom
    this._minimap.jumpTo({center: this._map.getCenter(), zoom: zoom, bearing: this._map.getBearing(), pitch: this._map.getPitch()})
  }
  onAdd (map) {
    this._map = map
    this._isOrto = true
    this._container = document.createElement('div')
    this._container.className = 'layer-switcher'
    mapboxgl.accessToken = 'pk.eyJ1IjoicnVuZXR2aWx1bSIsImEiOiJkeUg2WVkwIn0.yoMmv3etOc40RXkPsebXSg'
    var ll = new mapboxgl.LngLat(12, 56)
    this._minimap = new mapboxgl.Map({
      container: this._container,
      center: ll,
      zoom: 6,
      maxZoom: 21,
      style: tilejson, // 'mapbox://styles/mapbox/streets-v9',
      interactive: false,
      attributionControl: false
    })
    this._map.on('move', this.update.bind(this)).on('rotate', this.update.bind(this))
    setTimeout(function () {
      this._minimap.resize()
    }.bind(this), 1000)
    this._minimap.on('click', function () {
      if (this._isOrto) {
        this._minimap.setStyle('mapbox://styles/runetvilum/cj02byn7900362sny0ythayp2')
        this._map.setStyle(tilejson)
      } else {
        this._map.setStyle('mapbox://styles/runetvilum/cj02byn7900362sny0ythayp2')
        this._minimap.setStyle(tilejson)
      }
      this._isOrto = !this._isOrto
    }.bind(this))
    return this._container
  }

  onRemove () {
    this._container.parentNode.removeChild(this._container)
    this._map = undefined
  }
}

export { LayerSwitcher }
