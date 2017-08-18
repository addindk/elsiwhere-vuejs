<template>
  <div>
    <v-card>
      <v-card-media height="300px" :src="'/category/1024/'+$route.params.category+'.jpg'">
        <v-container fill-height fluid>
          <v-layout fill-height>
            <v-flex xs12 align-center justify-center flexbox>
              <span class="header-title">{{$store.state.title}}</span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-media>
      <v-card-title style="min-height: 100px; position: relative" :class="$store.state.color" class="description">
        {{$store.state.description}}
        <v-fab-transition>
          <v-btn absolute light fab top right @click.stop="show=!show" v-show="showAdd">
            <v-icon>add</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-card-title>
    </v-card>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 md6 xl4 v-for="(value, key) in $store.state.subcategoriesByCategory[$route.params.category]" :key="key">
          <v-card height="100%">          
            <v-card-title>{{value.t}}</v-card-title>
            <v-card-media style="cursor: pointer" @click.stop="$router.push({ name: 'elsiwhere-explore-category-subcategory', params: { category: $route.params.category, subcategory: key } })" :src="'/subcategory/512/'+key+'.jpg'" height="300px"></v-card-media>
            <v-card-text>
              <div>{{value.d}}</div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat ripple class="primary--text" @click.stop="$router.push({ name: 'elsiwhere-explore-category-subcategory', params: { category: $route.params.category, subcategory: key } })">
                SE MERE
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>  
  </div>
</template>
<script>
import { firebaseapp } from '~/plugins/firebase'
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
      showAdd: false,
      title: store.state.title
    }
  },
  mounted () {
    const store = this.$store
    const params = this.$route.params
    if (!store.state.categories.hasOwnProperty(params.category)) {
      firebaseapp.database().ref('category').child(params.category).once('value').then((res) => {
        const val = res.val()
        store.commit('color', val.c)
        store.commit('title', val.t)
        store.commit('description', val.d)
      })
    } else {
      const category = store.state.categories[params.category]
      store.commit('title', category.t)
      store.commit('description', category.d)
      store.commit('color', category.c)
    }
    if (!store.state.subcategoriesByCategory.hasOwnProperty(params.category)) {
      firebaseapp.database().ref('subcategory').child(params.category).once('value').then((res) => {
        store.commit('subcategories', { key: res.key, val: res.val() })
      })
    }
  }
}
</script>
<style scoped lang="stylus">
.description
  color: white
  font-size: 18px
  min-height: 100px
  position: relative
.header-title {
  color: rgba(255,255,255,1)
  font-size: 80px
  font-weight: 700
  text-shadow: #000 0 0 10px
}
.card
  display: flex
  flex-direction: column
.card__text
  flex-grow: 1
.fade
  &-enter-active, &-leave-active, &-leave-to
    transition: 1s ease-out
    position: absolute
    top: 0
    left: 0

  &-enter, &-leave, &-leave-to
    opacity: 0
</style>