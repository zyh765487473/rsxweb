<template>
  <div>
    <div>
      <el-dropdown style="margin-top: 1%;margin-left: 70%;">
      <el-button type="" style="font-size: 22px;">
        {{name}}<i class="el-icon-arrow-down"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="toSelect()">公共查询</el-dropdown-item>
        <el-dropdown-item @click.native="toLoss()">流失词库</el-dropdown-item>
        <el-dropdown-item @click.native="toMy()">我的词库</el-dropdown-item>
        <el-dropdown-item @click.native="loginout()">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    </div>
    <el-dialog
      title="分配信息"
      :visible.sync="fp"
      width="30%">
      <el-select v-model="value" placeholder="请选择分配人员">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input style="margin-top: 1%; width: 400px;" v-model="flow" placeholder="请输入流量大小"></el-input>
      <div></div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="bz = false">取 消</el-button>
        <el-button type="primary" @click="nameUpdate()">确 认</el-button>
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
        <el-table-column
          fixed=""
          label="操作"
          width="50">
          <template slot-scope="scope">
            <el-button @click="fpcommit(scope.row)" type="text" size="small">分配</el-button>
            <el-button @click="losscommit(scope.row)" type="text" size="small">流拍</el-button>
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
  name: 'General',
  data () {
    return {
      name: '',
      tableData: [],
      dialogVisible: false,
      link: '',
      fp: false,
      flow: '',
      options: [{
        value: '1',
        label: 'XT'
      }, {
        value: '2',
        label: '郑茜'
      }, {
        value: '3',
        label: '大牛'
      }, {
        value: '4',
        label: '罗会贤'
      }, {
        value: '5',
        label: '刘丹'
      }, {
        value: '6',
        label: '余能程'
      }, {
        value: '7',
        label: '林海峰'
      }, {
        value: '8',
        label: '黄玲'
      }, {
        value: '9',
        label: '唐冰倩'
      }, {
        value: '10',
        label: '鄢健'
      }, {
        value: '11',
        label: '洪进财'
      }],
      value: '',
      par: {}
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
    fpcommit (param) {
      this.fp = true
      this.par = param
    },
    losscommit (param) {
      this.$confirm('确定流拍了吗，请谨慎操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let nameId = Cookies.get('nameId')
        let token = Cookies.get('token')
        let md5 = nameId + token + '4f5af48e7ate8whfkjawA*456111' // 与后台的校验
        md5 = CryptoJS.MD5(md5).toString()
        let postData = {
          token: token,
          nameId: nameId,
          id: param.id,
          md5: md5
        }
        axios.post('http://121.37.191.238:8083/lexicon/update/loss/admin', postData)
          .then(response => {
            if (response.data.code !== 1) {
              this.messageInfoErr(response.data.message)
            // this.$router.push({name: 'login'})
            } else {
            // 成功以后页面刷新
            // location.reload()
              this.messageInfo('流拍成功！如需要查询请刷新页面')
            }
          })
          .catch(error => {
            console.error('There was an error!', error)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        })
      })
    },
    nameUpdate () {
      let param = this.par
      let nameId = Cookies.get('nameId')
      let token = Cookies.get('token')
      let md5 = nameId + token + '4f5af48e7ate8whfkjawA*456111' // 与后台的校验
      md5 = CryptoJS.MD5(md5).toString()
      let postData = {
        token: token,
        nameId: nameId,
        id: param.id,
        aNameId: this.value,
        flow: this.flow,
        md5: md5
      }
      axios.post('http://121.37.191.238:8083/lexicon/update/general/admin', postData)
        .then(response => {
          if (response.data.code !== 1) {
            this.messageInfoErr(response.data.message)
            // this.$router.push({name: 'login'})
          } else {
            // 成功以后页面刷新
            // location.reload()
            this.messageInfo('分配成功！如需要查询请刷新页面')
          }
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
      this.fp = false
    },
    toSelect () {
      this.$router.push({name: 'select'})
    },
    toLoss () {
      this.$router.push({name: 'loss'})
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
    }
  },
  mounted () {
    // 进入前
    this.name = Cookies.get('name')
    if (this.name === '' || this.name === undefined || this.name === 'undefined' || this.name !== 'XT') {
      // 跳转到登录页重新登录
      this.$router.push({name: 'login'})
    }
    let nameId = Cookies.get('nameId')
    let token = Cookies.get('token')
    let md5 = nameId + token + '4f5af48e7ate8whfkjawA*456111' // 与后台的校验
    md5 = CryptoJS.MD5(md5).toString()

    axios.get('http://121.37.191.238:8083/lexicon/select/general?nameId=' + nameId + '&token=' + token + '&md5=' + md5)
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
