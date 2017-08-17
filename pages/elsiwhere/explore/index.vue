<template>
  <div>
    <h1 class="text-xs-center">{{$store.state.title}}</h1>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 md6 xl4 v-for="(value, key) in $store.state.categories" :key="key">
          <v-card height="100%">
            <v-toolbar card dark :class="value.c">
              <v-toolbar-title>{{value.t}}</v-toolbar-title>
            </v-toolbar>
            <v-card-media style="cursor: pointer" @click.stop="$router.push({ name: 'elsiwhere-explore-category', params: { category: key } })" :src="'/category/512/'+key+'.jpg'" height="300px"></v-card-media>
            <v-card-text>
              <div>{{value.d}}</div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat ripple class="primary--text" @click.stop="$router.push({ name: 'elsiwhere-explore-category', params: { category: key } })">
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
const title = 'Oplevelser'
export default {
  scrollToTop: true,
  head () {
    return {
      title
    }
  },
  fetch ({ store }) {
    store.commit('title', title)
    if (Object.keys(store.state.categories).length === 0) {
      return firebaseapp.database().ref('category').once('value').then((data) => {
        store.commit('categories', data.val())
      })
    }
  }
}
</script>
<style scoped lang="stylus">
h1
  margin-top: 20px
.card
  display: flex
  flex-direction: column
.card__text
  flex-grow: 1
</style>