<template>
  <div>
    <div>
      <el-dropdown style="margin-top: 1%;margin-left: 70%;">
      <el-button type="" style="font-size: 22px;">
        {{name}}<i class="el-icon-arrow-down"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="toMy()">我的词库</el-dropdown-item>
        <el-dropdown-item @click.native="toSelect()">公共查询</el-dropdown-item>
        <el-dropdown-item v-if="gen" @click.native="toGeneral()">公共词库</el-dropdown-item>
        <el-dropdown-item @click.native="loginout()">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    </div>
    <el-dialog
      title="申请词"
      :visible.sync="sq"
      width="30%">
      <el-input style="margin-top: 1%; width: 300px;" v-model="flow" placeholder="请输入流量大小（当天词的流量排行）"></el-input>
      <div></div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="sq = false">取 消</el-button>
        <el-button type="primary" @click="commit()">确 认</el-button>
      </span>
    </el-dialog>

    <div style="margin-left: 10%; margin-right: 10%; margin-top: 10%;">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          fixed
          prop="createTime"
          label="日期"
          width="150">
        </el-table-column>
        <el-table-column
          prop="brandName"
          label="品牌"
          width="150">
        </el-table-column>
        <el-table-column
          prop="completeWord"
          label="完整词"
          width="200">
        </el-table-column>
        <el-table-column
          prop="independentStation"
          label="独立站"
          width="200">
        </el-table-column>
        <el-table-column
          prop="country"
          label="国家"
          width="120">
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="备注"
          width="300">
        </el-table-column>
        <el-table-column
          fixed=""
          label="操作"
          width="75">
          <template slot-scope="scope">
            <el-button @click="sqcommit(scope.row)" type="text" size="small">申请该词</el-button>
          </template>
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
  name: 'Loss',
  data () {
    return {
      name: '',
      flow: '',
      tableData: [],
      par: {}, // 临时变量
      sq: false,
      gen: false // 是否显示公共词库
    }
  },
  methods: {
    loginout () {
      let account = Cookies.get('account')
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
            this.messageInfoErr(response.data.message)
            this.$router.push({name: 'login'})
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
    look () {
      console.log()
    },
    sqcommit (param) {
      this.sq = true
      this.par = param
    },
    commit () {
      // 申请做这个词
      if (this.flow === '') {
        this.messageInfo('流量大小不能为空')
        return
      }
      let nameId = Cookies.get('nameId')
      let token = Cookies.get('token')
      let md5 = nameId + token + '4f5af48e7ate8whfkjawA*456111' // 与后台的校验
      md5 = CryptoJS.MD5(md5).toString()
      let postData = {
        token: token,
        nameId: nameId,
        id: this.par.id,
        flow: this.flow,
        md5: md5
      }
      axios.post('http://121.37.191.238:8083/lexicon/loss/apply', postData)
        .then(response => {
          if (response.data.code !== 1) {
            this.messageInfoErr(response.data.message)
          // this.$router.push({name: 'login'})
          } else {
          // 成功以后页面刷新
          // location.reload()
            this.messageInfo('申请成功！如需要查询请到我的词库中查看')
          }
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
      this.sq = false
    },
    toGeneral () {
      this.$router.push({name: 'general'})
    },
    toSelect () {
      this.$router.push({name: 'select'})
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
    toMy () {
      this.$router.push({name: 'user'})
    }
  },
  mounted () {
    // 进入前
    this.name = Cookies.get('name')
    if (this.name === '' || this.name === undefined || this.name === 'undefined') {
      // 跳转到登录页重新登录
      this.$router.push({name: 'login'})
    }
    let nameId = Cookies.get('nameId')
    let token = Cookies.get('token')
    let md5 = nameId + token + '4f5af48e7ate8whfkjawA*456111' // 与后台的校验
    md5 = CryptoJS.MD5(md5).toString()

    if (this.name === 'XT') {
      this.gen = true
    }

    axios.get('http://121.37.191.238:8083/lexicon/select/loss?nameId=' + nameId + '&token=' + token + '&md5=' + md5)
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
