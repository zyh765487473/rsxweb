<template>
  <div>
    <div>
      <el-dropdown style="margin-top: 1%;margin-left: 70%;">
      <el-button type="" style="font-size: 22px;">
        {{name}}<i class="el-icon-arrow-down"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="toMy()">我的词库</el-dropdown-item>
        <el-dropdown-item v-if="gen" @click.native="toGeneral()">公共词库</el-dropdown-item>
        <el-dropdown-item @click.native="loginout()">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    </div>
    <div style="margin-left: 10%; margin-right: 10%; margin-top: 10%;">
      <el-input style="width: 200px; margin-bottom: 1%; margin-left: 60%;margin-right: 1%;" v-model="selectBrandName" placeholder="请输入品牌名"></el-input>
      <el-button @click="select()" type="info" round>搜索</el-button>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          fixed
          prop="createTime"
          label="日期"
          width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="组名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="brandName"
          label="品牌"
          width="120">
        </el-table-column>
        <el-table-column
          prop="completeWord"
          label="完整词"
          width="120">
        </el-table-column>
        <el-table-column
          prop="independentStation"
          label="独立站"
          width="120">
        </el-table-column>
        <el-table-column
          prop="flow"
          label="流量"
          width="120">
        </el-table-column>
        <el-table-column
          prop="registrationStatus"
          label="注册状态"
          width="120">
        </el-table-column>
        <el-table-column
          prop="validity"
          label="有效期"
          width="120">
        </el-table-column>
        <el-table-column
          prop="state"
          label="上架状态"
          width="120">
        </el-table-column>
        <el-table-column
          prop="country"
          label="国家"
          width="120">
        </el-table-column>
        <el-table-column
          prop="link"
          label="上架链接"
          width="120">
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="备注"
          width="200">
        </el-table-column>
      </el-table>
    </div>
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
  name: 'Select',
  data () {
    return {
      name: '',
      tableData: [],
      selectBrandName: '',
      gen: false // 是否显示公共词库
    }
  },
  methods: {
    loginout () {
      let account = Cookies.get('account')
      console.log(account)
      if (undefined === account || account === 'undefined' || account === '') {
        // 跳转到登录页并提示登录过期
        this.messageInfoErr('登录过期，请重新登录')
        this.$router.push({name: 'login'})
        return
      }
      let md5 = account + '4f5af48e7ate8whfkjawA*456111' // 与后台的校验
      md5 = CryptoJS.MD5(md5).toString()

      axios.get('http://121.37.191.238:8083/account/outlogin?account=' + account + '&md5=' + md5)
        .then(response => {
          if (response.data.code !== 1) {
            // this.messageInfoErr(response.data.message)
          } else {
            // 成功以后事件,跳转到查询页面，查询页面有2个
            Cookies.remove('account')
            Cookies.remove('token')
            Cookies.remove('name')
            Cookies.remove('nameId')
            this.messageInfo('退出成功')
            this.$router.push({name: 'login'})
          }
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
    },
    select () {
      this.name = Cookies.get('name')
      let nameId = Cookies.get('nameId')
      let token = Cookies.get('token')
      let md5 = this.selectBrandName + token + '4f5af48e7ate8whfkjawA*456111' // 与后台的校验
      md5 = CryptoJS.MD5(md5).toString()

      axios.get('http://121.37.191.238:8083/lexicon/select/brandName?nameId=' + nameId + '&brandName=' + this.selectBrandName + '&token=' + token + '&md5=' + md5)
        .then(response => {
          if (response.data.code !== 1) {
            this.messageInfoErr(response.data.message)
          } else {
            // 成功以后渲染
            let param = response.data.data
            this.tableData = param
          }
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
    },
    toMy () {
      this.$router.push({name: 'user'})
    },
    messageInfoErr (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      })
    },
    messageInfo (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      })
    },
    toGeneral () {
      this.$router.push({name: 'general'})
    }
  },
  mounted () {
    this.name = Cookies.get('name')
    if (this.name === '' || this.name === undefined || this.name === 'undefined') {
      // 跳转到登录页重新登录
      this.$router.push({name: 'login'})
    }
    if (this.name === 'XT') {
      this.gen = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
