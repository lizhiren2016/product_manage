<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <template>
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.title }}</span>
              </template>
              <template v-for="subItem in item.subs">
                <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                  <template slot="title">
                    <i :class="subItem.icon"></i>
                    <span slot="title">{{ subItem.title }}</span>
                  </template>
                  <el-menu-item
                    v-for="(threeItem, i) in subItem.subs"
                    :key="i"
                    :index="threeItem.index"
                  >{{ threeItem.title }}</el-menu-item>
                </el-submenu>
                <template>
                  <el-menu-item :index="subItem.index" :key="subItem.index">
                    <i :class="subItem.icon"></i>
                    <span slot="title">{{ subItem.title }}</span>
                  </el-menu-item>
                </template>
              </template>
            </el-submenu>
          </template>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../../common/js/bus'

export default {
  data () {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-lx-home',
          index: '/',
          title: '首页'
        },
        {
          icon: 'el-icon-lx-people',
          index: 'users',
          title: '用户管理',
          subs: [
            {
              icon: 'el-icon-lx-sort',
              index: 'users',
              title: '用户列表'
            }
          ]
        },
        {
          icon: 'el-icon-coin',
          index: 'products',
          title: '产品管理',
          subs: [
            {
              icon: 'el-icon-lx-sort',
              index: 'products',
              title: '产品列表'
            }
          ]
        }
      ]
    }
  },
  computed: {
    onRoutes () {
      return this.$route.path.replace('/', '')
    }
  },
  created () {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  }
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
