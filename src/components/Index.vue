<template>

  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/11.jpg"
             alt="">
      </div>
      <div class="title">
        <h1>あいしちえる</h1>
      </div>
      <div class="logout">
        おｈｌ~
        <a @click="logout"
           href="javascript:;">退出</a>
      </div>
    </el-header>

    <el-container>
      <el-aside width="200px">
        <el-menu router
                 unique-opened
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 :default-active="defaultActive">
          <!-- 用户管理 -->
          <el-submenu :index="menu.path"
                      v-for="menu in menuList"
                      :key="menu.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu.authName}}</span>
            </template>
            <el-menu-item :index="item.path"
                          v-for="item in menu.children"
                          :key="item.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ item.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>

      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  async created () {
    const res = await this.$axios.get('menus')
    console.log(res)
    const { meta, data } = res
    if (meta.status === 200) {
      this.menuList = data
    } else {
      this.$message.error(meta.msg)
    }
  },
  methods: {
    logout () {
      this.$confirm('亲亲，确定要退出吗?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('恭喜，退出成功')
        // 清除本地存储的token
        localStorage.removeItem('token')
        // 跳转路由
        this.$router.push('/login')
      }).catch(err => {
        console.log(err)
      })
    }
  },
  computed: {
    defaultActive () {
      return this.$route.path.slice(1).split('-')[0]
    }
  }
}

</script>

<style lang="scss">
.index {
  height: 100%;
  .el-header {
    background-color: #d8d8d8;
    display: flex;
    .logo {
      width: 180px;
      img {
        height: 40px;
        width: 160px;
        margin: 10px;
      }
    }
    .title {
      flex: 1;
      h1 {
        height: 60px;
        line-height: 60px;
        text-align: center;
        color: #545c64;
      }
    }
    .logout {
      width: 180px;
      text-align: right;
      font-weight: 700;
      height: 60px;
      line-height: 60px;
      a {
        color: orange;
      }
    }
  }

  .el-aside {
    background-color: #545c64;
    .el-menu {
      border: none;
    }
  }

  .el-main {
    background-color: #ecf0f1;
  }
}
</style>
