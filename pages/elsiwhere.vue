<template>
  <v-app id="elsiwhere">
    <v-navigation-drawer
      right
      persistent 
      light 
      enable-resize-watcher
      height="100%"
      v-model="$store.state.sidebar" >
      <v-card class="profile-content">
          <img class="profile-image" :src="$store.state.user.photoURL"/>
          <h6 class="profile-title">{{$store.state.user.displayName}}</h6>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat dark v-show="$store.state.userId!==''" @click.stop="$store.dispatch('logout')">LOGOUT</v-btn>
            <v-btn flat dark v-show="$store.state.userId===''" @click.stop="login()">LOGIN</v-btn>
          </v-card-actions>
        </v-card>
        <v-list>
          <v-list-tile to="/" nuxt ripple>
            <!--v-list-tile-avatar>
                  <v-btn floating small dark class="blue">
                    <v-icon>home</v-icon>
                  </v-btn>
                </v-list-tile-avatar-->
            <v-list-tile-content>
              <v-list-tile-title class="grey--text text--darken-3">Forside</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/elsiwhere/explore" nuxt ripple>
            <!--v-list-tile-avatar>
                  <v-btn floating small class="indigo">
                    <v-icon>search</v-icon>
                  </v-btn>
                </v-list-tile-avatar-->
            <v-list-tile-content>
              <v-list-tile-title class="grey--text text--darken-3">Oplevelser</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click.stop="events()" ripple>
            <!--v-list-tile-avatar>
                  <v-btn floating small dark class="pink">
                    <v-icon>event</v-icon>
                  </v-btn>
                </v-list-tile-avatar-->
            <v-list-tile-content>
              <v-list-tile-title class="grey--text text--darken-3">Events</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/elsiwhere/map" nuxt ripple>
            <!--v-list-tile-avatar>
                  <v-btn floating small dark class="teal">
                    <v-icon>public</v-icon>
                  </v-btn>
                </v-list-tile-avatar-->
            <v-list-tile-content>
              <v-list-tile-title class="grey--text text--darken-3">Kort</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/elsiwhere/about" nuxt ripple>
            <v-list-tile-content>
              <v-list-tile-title class="grey--text text--darken-3">Om Elsiwhere</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      
    </v-navigation-drawer>
    <v-toolbar fixed dark class="indigo">
      
      <v-btn dark icon @click.stop="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <!--v-toolbar-logo><img height="63px" src="~assets/img/logo.png" /></v-toolbar-logo-->
      <v-toolbar-title class="pacifico" style="cursor: pointer" @click="$router.push({name:'index'})">Elsiwhere</v-toolbar-title>
      <!--v-toolbar-title>{{$store.state.title}}</v-toolbar-title-->
      <!--v-toolbar-items-->
      <v-spacer/>
  
      <v-toolbar-items class="hidden-md-and-down">
        <v-btn flat nuxt ripple to="/elsiwhere/explore">Oplevelser</v-btn>
        <v-btn flat ripple @click.stop="events()">Events</v-btn>
        <v-btn flat nuxt ripple to="/elsiwhere/map">Kort</v-btn>        
      </v-toolbar-items>
      <v-toolbar-side-icon @click.stop="$store.commit('toggle')" />
    </v-toolbar>
    <main>
        <nuxt-child/>
    </main>
    <v-dialog v-model="$store.state.modal.emailverification">
      <v-card>
        <v-toolbar dark class="red darken-1">
          <v-toolbar-title>
            Email verifikation
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <p>Du skal bekræfte din email før du kan logge ind.</p>
          <p>Der er sendt en email til dig, med et link til bekræfelse af email adresse.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat v-on:click.native="$store.commit('emailverification', false)" class="primary--text">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>        
  </v-app>
</template>
<script>
// import FirebaseUI from '~components/FirebaseUI.vue'
// import FirebaseLogin from '~components/FirebaseLogin.vue'
import { firebaseapp } from '~/plugins/firebase'
import moment from 'moment'
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
  methods: {
    login: function () {
      const router = this.$router
      const route = this.$route
      router.push({ name: 'login', query: { signInSuccessUrl: route.path } })
    },
    events: function () {
      this.$store.commit('dato', moment().format('DD-MM-YYYY'))
      this.$router.push({ name: 'elsiwhere-events-id', params: { id: this.$store.state.dato } })
    }
  },
  mounted () {
    const store = this.$store
    firebaseapp.auth().onAuthStateChanged(function (user) {
      store.commit('user', { currentUser: user })
      if (user && user.emailVerified) {
        if (!user.emailVerified) {
          user.sendEmailVerification()
          store.commit('emailverification', true)
        }
        // firebaseapp.database().ref('users')
      } else {

      }
    })
  },
  fetch ({ store, route }) {
    store.commit('title', 'Forside')
    if (Object.keys(store.state.categories).length === 0) {
      return firebaseapp.database().ref('category').once('value').then((data) => {
        console.log('categories done')
        store.commit('categories', data.val())
      })
    }
  }
}
</script>
<style scoped lang="stylus">
.profile-content
  background: linear-gradient(to bottom right, #666, #000)
  padding: 10px

.profile-image
  height: 80px;
  width: 80px;
  display: block
  border-radius:50%
  margin-left: auto
  margin-right: auto
  border: 4px solid rgba(255,255,255,0.4)
  box-shadow: 0px 0px 142px -37px rgba(0,0,0,0.75)

.profile-title
  color: #fff
  text-align: center
  margin: 10px
  word-wrap: break-word

.space
  margin-left:10px

.padding
  margin-top: 64px

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
.fade
  &-enter-active, &-leave-active, &-leave-to
    transition: 1s ease-out
    position: absolute
    top: 0
    left: 0

  &-enter, &-leave, &-leave-to
    opacity: 0
</style>
