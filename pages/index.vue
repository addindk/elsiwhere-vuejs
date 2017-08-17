<template>
  <v-app id="elsiwhere">
    <v-container fluid class="pa-0">
      <div class="orange head">
        <img class="logo" src="~assets/img/logo.png" />
        <h2>Velkommen til Elsiwhere</h2>
      </div>
      <v-container>
        <p>Du ser, at vejret er godt, og tænker: I dag er det tid til en udflugt i det fri. Du vil have børnene eller vennerne med. Men du ved ikke helt, hvor I skal hen - bare at det er i nærheden af Helsingør…</p>
        <p>Så husker du det… der var en app, der kunne vise vej til spændende steder og oplevelser i det fri i Helsingør Kommune - Elsiwhere! Du så på Facebook, at én af dine venner havde været i skoven og havde haft en dejlig dag - men hvor var det nu, og hvordan kommer du derud? Det kan Elsiwhere hjælpe med…</p>
        <p>Du vælger, hvad du vil, og får vist de forskellige muligheder enten på en liste eller direkte på kortet, så du kan se, hvor tæt på, de er - klik på ikonet, din telefon kan finde vej, og det meste er gratis, så der er ikke meget at betænke sig på - det kan hurtigt blive en sjovere dag i det fri!</p>
        <div class="actions">
          <v-btn dark ripple class="primary" @click.native.stop="$router.push({ name: 'elsiwhere-explore' })">
            Udforsk
          </v-btn>
        </div>
      </v-container>
      <v-carousel>
        <v-carousel-item v-for="(value, key) in $store.state.categories" :key="key" v-bind:src="'/category/1024/'+key+'.jpg'">
          <nuxt-link class="carousel-title" :to="{ name: 'elsiwhere-explore-category', params: { category: key } }">{{value.t}}</nuxt-link>
        </v-carousel-item>
      </v-carousel>
    </v-container>        
  </v-app>
</template>
<script>
// import FirebaseUI from '~components/FirebaseUI.vue'
// import FirebaseLogin from '~components/FirebaseLogin.vue'
import { firebaseapp } from '~/plugins/firebase'
export default {
  /*
  components: {
    FirebaseUI,
    FirebaseLogin
  },
  */
  head () {
    return {
      title: this.title
    }
  },
  data () {
    return {
      title: this.$store.state.title,
      drawer: false
    }
  },
  fetch ({ store, route }) {
    store.commit('title', 'Elsiwhere')
    if (Object.keys(store.state.categories).length === 0) {
      return firebaseapp.database().ref('category').once('value').then((data) => {
        store.commit('categories', data.val())
      })
    }
  }
}
</script>
<style scoped lang="stylus">
.carousel-title
  color: rgba(255,255,255,1)
  font-size: 80px
  font-weight: 700
  text-shadow: #000 0 0 10px
  text-decoration: none
  flex: 1 1 100%
  text-align: center
.actions
  display: flex
  justify-content: flex-end
  margin-bottom: 20px
.head
  padding: 20px
  margin-bottom: 20px
h2
  text-align: center
  color: #fff
  font-family: 'Pacifico'
.pacifico
  font-family: 'Pacifico'
  font-size: 25px
.logo
  width: 150px
  display: block
  margin: 0 auto 10px auto
  border: 4px solid rgba(255,255,255,0.4)
  border-radius:50%
</style>
