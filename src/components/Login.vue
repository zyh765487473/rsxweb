<template>
  <div style="background-color:bisque; height: 100%;">
    <el-container>
      <el-header><h1 style="margin-top: 5%;">闽侯榕尚兴电子商务有限公司（内部词库系统）</h1></el-header>
      <el-main>
        <div style="margin-top: 10%;"></div>
        <el-input style="margin-top: 1%; width: 200px;" v-model="account" placeholder="请输入账号"></el-input>
        <div></div>
        <el-input style="margin-top: 1%; width: 200px;" placeholder="请输入密码" v-model="password" show-password></el-input>
        <div></div>
        <el-button style="margin-top: 1%; width: 200px;"  type="" plain @click="login" round>登录</el-button>
      </el-main>
      <el-footer style="margin-bottom: 5%;"><h3>如有使用问题，请微信搜索994</h3></el-footer>
      <div style="margin-top: 17%;"></div>
    </el-container>
  </div>
</template>

<script>

import axios from 'axios'
import CryptoJS from 'crypto-js'
import Cookies from 'js-cookie'

export default {
  components: {
    axios,
    CryptoJS,
    Cookies
  },
  name: 'Login',
  data () {
    return {
      account: '',
      password: ''
    }
  },
  methods: {
    login () {
      let md5 = this.account + this.password + '4f5af48e7ate8whfkjawA*456111' // 与后台的校验
      md5 = CryptoJS.MD5(md5).toString()

      axios.get('http://121.37.191.238:8083/account/login?account=' + this.account + '&password=' + this.password + '&md5=' + md5)
        .then(response => {
          if (response.data.code !== 1) {
            this.messageInfoErr(response.data.message)
          } else {
            // 成功以后事件,跳转到查询页面，查询页面有2个，要把token放入cokiee中
            let param = response.data.data
            Cookies.set('account', param.account)
            Cookies.set('token', param.token)
            Cookies.set('name', param.name)
            Cookies.set('nameId', param.nameId)
            this.messageInfo('登录成功！')
            this.$router.push({name: 'user'})
          }
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
    },
    messageInfo (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'info'
      })
    },
    messageInfoErr (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      })
    }
  },
  mounted () {
    // 进入前
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
