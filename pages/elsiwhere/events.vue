<template>
  <div class="calender">
    <iframe src="https://calendar.google.com/calendar/embed?showTitle=0&amp;showPrint=0&amp;wkst=2&amp;bgcolor=%23FFFFFF&amp;src=3000elsiwhere%40gmail.com&amp;color=%231B887A&amp;ctz=Europe%2FCopenhagen" style="border-width:0" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>
  </div>
</template>
<script>
var title = 'Kalender'
export default {
  head () {
    return {
      title
    }
  },
  fetch ({ store }) {
    store.commit('title', title)
    store.commit('toolbar', 'indigo')
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
