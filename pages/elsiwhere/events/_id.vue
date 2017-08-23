<template>
  <!--div class="calender">
    <iframe src="https://calendar.google.com/calendar/embed?showTitle=0&amp;showPrint=0&amp;wkst=2&amp;bgcolor=%23FFFFFF&amp;src=3000elsiwhere%40gmail.com&amp;color=%231B887A&amp;ctz=Europe%2FCopenhagen" style="border-width:0" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>
  </div-->
  <v-container fluid class="pa-0">
    <v-card flat>
      <div class="text-xs-center">
        <v-btn flat fab @click="previous">
          <v-icon>chevron_left</v-icon>
        </v-btn>
        <span class="title">{{ $store.state.dato }}</span>
        <v-btn flat fab @click="next">
          <v-icon>chevron_right</v-icon>
        </v-btn>

      </div>
      <v-list two-line>
        <div v-for="item in items" v-bind:key="item.key">
          <v-divider inset></v-divider>
          <v-list-tile avatar nuxt :to="'/elsiwhere/post/' + item.key">
            <v-list-tile-avatar>
              <img v-bind:src="'/post/256/' + item.key + '.jpg'"></v-list-tile-avatar>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.val.t }}</v-list-tile-title>
              <v-list-tile-sub-title>Åben kl. {{ item.val.o }} - {{ item.val.c }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon class="grey--text text--lighten-1">chevron_right</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </div>
      </v-list>
    </v-card>
    <h6 class="text-xs-center" v-if="$store.state.events.length === 0">Ingen events denne dag</h6>
  </v-container>
</template>
<script>
import moment from 'moment'
var title = 'Kalender'
export default {
  head () {
    return {
      title
    }
  },
  computed: {
    items: function () {
      let items = []
      Object.keys(this.$store.state.events).forEach((key) => {
        items.push({ key: key, val: this.$store.state.events[key] })
      })
      return items.sort((a, b) => {
        if (moment(a.val.o, 'HH:MM') < moment(b.val.o, 'HH:MM')) {
          return 1
        }
        return -1
      })
    }
  },
  methods: {
    previous: function () {
      let today = moment(this.$store.state.dato, 'DD-MM-YYYY').subtract(1, 'd')
      this.$store.commit('dato', today.format('DD-MM-YYYY'))
      this.$router.push({ name: 'elsiwhere-events-id', params: { id: this.$store.state.dato } })
    },
    next: function () {
      let today = moment(this.$store.state.dato, 'DD-MM-YYYY').add(1, 'd')
      this.$store.commit('dato', today.format('DD-MM-YYYY'))
      this.$router.push({ name: 'elsiwhere-events-id', params: { id: this.$store.state.dato } })
    }
  },
  mounted () {
    console.log('mounted')
    let today = moment(this.$route.params.id, 'DD-MM-YYYY')
    this.$store.commit('dato', today.format('DD-MM-YYYY'))
  }
}
</script>

<style scoped>
.calender {
  position: absolute;
  top: 63px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
