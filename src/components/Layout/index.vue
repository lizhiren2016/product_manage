<template>
  <div class="wrapper">
    <VHeader />
    <VSidebar />
    <div class="content-box" :class="{'content-collapse':collapse}">
      <div class="content">
        <transition name="move" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import VHeader from './Header'
import VSidebar from './Sidebar'
import bus from '../../common/js/bus'

export default {
  name: 'container',
  components: {
    VHeader,
    VSidebar
  },
  data () {
    return {
      collapse: false
    }
  },
  created () {
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  }
}
</script>
