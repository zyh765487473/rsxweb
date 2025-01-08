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
        <el-dropdown-item v-if="gen" @click.native="toGeneral()">公共词库</el-dropdown-item>
        <el-dropdown-item @click.native="loginout()">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    </div>
    <el-dialog
      title="添加新词"
      :visible.sync="dialogVisible"
      width="30%">
      <h2>请及时自查清楚后再添加，一切数据以系统上传时间为准</h2>
      <el-radio-group v-model="country">
        <el-radio-button label="美国"></el-radio-button>
        <el-radio-button label="英国"></el-radio-button>
      </el-radio-group>
      <div></div>
      <el-input style="margin-top: 1%; width: 300px;" v-model="brandName" placeholder="请输入品牌词"></el-input>
      <div></div>
      <el-input style="margin-top: 1%; width: 300px;" v-model="completeWord" placeholder="请输入完整词"></el-input>
      <div></div>
      <el-input style="margin-top: 1%; width: 300px;" v-model="independentStation" placeholder="请输入独立站"></el-input>
      <div></div>
      <el-input style="margin-top: 1%; width: 300px;" v-model="flow" placeholder="请输入流量大小（当天词的流量排行）"></el-input>
      <div></div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit()">添 加</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加上架链接"
      :visible.sync="lj"
      width="30%">
      <el-input style="margin-top: 1%; width: 300px;" v-model="link" placeholder="请输入链接"></el-input>
      <div></div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="lj = false">取 消</el-button>
        <el-button type="primary" @click="stateUpdate()">确 认</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加备注信息"
      :visible.sync="bz"
      width="30%">
      <el-input style="margin-top: 1%; width: 400px;" v-model="remarks" placeholder="请输入备注信息"></el-input>
      <div></div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="bz = false">取 消</el-button>
        <el-button type="primary" @click="remarksUpdate()">确 认</el-button>
      </span>
    </el-dialog>

    <div style="margin-left: 10%; margin-right: 10%; margin-top: 10%;">
      <el-button @click="dialogVisible = true" style="width: 80px; margin-bottom: 1%; margin-left: -5%" type="danger" round>添加新词</el-button>
      <el-button @click="selectByState(1)" style="width: 80px; margin-bottom: 1%;" type="success" round>已上架</el-button>
      <el-button @click="selectByState(0)" style="width: 80px; margin-bottom: 1%;" type="warning" round>未上架</el-button>
      <el-input style="width: 200px; margin-bottom: 1%; margin-left: 60%;margin-right: 1%;" v-model="selectBrandName" placeholder="请输入品牌名"></el-input>
      <el-button type="info" @click="select()" round>搜索</el-button>
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
          width="220">
          <template slot-scope="scope">
            <el-button @click="sjcommit(scope.row)" type="text" size="small">上架主图</el-button>
            <el-button @click="sjwccommit(scope.row)" type="text" size="small">上架完成</el-button>
            <el-button @click="registrationUpdate(scope.row)" type="text" size="small">注册</el-button>
            <el-button @click="bzcommit(scope.row)" type="text" size="small">备注</el-button>
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
  name: 'User',
  data () {
    return {
      name: '',
      brandName: '',
      completeWord: '',
      independentStation: '',
      flow: '',
      tableData: [],
      dialogVisible: false,
      selectBrandName: '',
      country: '美国',
      link: '',
      lj: false,
      par: {}, // 临时变量
      remarks: '', // 备注信息
      bz: false,
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
    sjcommit (param) {
      // 打开窗口
      this.lj = true
      this.par = param
    },
    bzcommit (param) {
      this.bz = true
      this.par = param
    },
    toGeneral () {
      this.$router.push({name: 'general'})
    },
    stateUpdate () {
      let param = this.par
      let nameId = Cookies.get('nameId')
      let token = Cookies.get('token')
      let type = '0'
      let md5 = token + nameId + type + '4f5af48e7ate8whfkjawA*456111' // 与后台的校验
      md5 = CryptoJS.MD5(md5).toString()
      let postData = {
        token: token,
        nameId: nameId,
        id: param.id,
        link: this.link,
        type: type,
        md5: md5
      }
      this.updateStatusIn(postData)
      this.lj = false
    },
    registrationUpdate (param) {
      this.$confirm('确定注册了吗，请谨慎操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let nameId = Cookies.get('nameId')
        let token = Cookies.get('token')
        let type = '1'
        let md5 = token + nameId + type + '4f5af48e7ate8whfkjawA*456111' // 与后台的校验
        md5 = CryptoJS.MD5(md5).toString()
        let postData = {
          token: token,
          nameId: nameId,
          id: param.id,
          type: type,
          md5: md5
        }
        this.updateStatusIn(postData)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        })
      })
    },
    sjwccommit (param) {
      this.$confirm('确定上架完成了吗，请谨慎操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let nameId = Cookies.get('nameId')
        let token = Cookies.get('token')
        let type = '3'
        let md5 = token + nameId + type + '4f5af48e7ate8whfkjawA*456111' // 与后台的校验
        md5 = CryptoJS.MD5(md5).toString()
        let postData = {
          token: token,
          nameId: nameId,
          id: param.id,
          type: type,
          md5: md5
        }
        this.updateStatusIn(postData)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        })
      })
    },
    remarksUpdate () {
      let param = this.par
      let nameId = Cookies.get('nameId')
      let token = Cookies.get('token')
      let type = '2'
      let md5 = token + nameId + type + '4f5af48e7ate8whfkjawA*456111' // 与后台的校验
      md5 = CryptoJS.MD5(md5).toString()
      let postData = {
        token: token,
        nameId: nameId,
        id: param.id,
        remarks: this.remarks,
        type: type,
        md5: md5
      }
      this.updateStatusIn(postData)
      this.bz = false
    },
    select () {
      this.name = Cookies.get('name')
      let nameId = Cookies.get('nameId')
      let token = Cookies.get('token')
      let md5 = nameId + token + '4f5af48e7ate8whfkjawA*456111' // 与后台的校验
      md5 = CryptoJS.MD5(md5).toString()

      axios.get('http://121.37.191.238:8083/lexicon/select/nameId/brandName?nameId=' + nameId + '&brandName=' + this.selectBrandName + '&token=' + token + '&md5=' + md5)
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
    selectByState (state) {
      this.name = Cookies.get('name')
      let nameId = Cookies.get('nameId')
      let token = Cookies.get('token')
      let md5 = nameId + token + '4f5af48e7ate8whfkjawA*456111' // 与后台的校验
      md5 = CryptoJS.MD5(md5).toString()

      axios.get('http://121.37.191.238:8083/lexicon/select/nameId/state?nameId=' + nameId + '&state=' + state + '&token=' + token + '&md5=' + md5)
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
    toSelect () {
      this.$router.push({name: 'select'})
    },
    toLoss () {
      this.$router.push({name: 'loss'})
    },
    commit () {
      let nameId = Cookies.get('nameId')
      let token = Cookies.get('token')
      let md5 = this.brandName + nameId + this.flow + '4f5af48e7ate8whfkjawA*456111' // 与后台的校验
      md5 = CryptoJS.MD5(md5).toString()
      // 参数校验
      if (!this.validate()) {
        return
      }
      let postData = {
        token: token,
        nameId: nameId,
        brandName: this.brandName,
        completeWord: this.completeWord,
        independentStation: this.independentStation,
        flow: this.flow,
        md5: md5,
        country: this.country
      }

      axios.post('http://121.37.191.238:8083/lexicon/add', postData)
        .then(response => {
          if (response.data.code !== 1) {
            this.messageInfoErr(response.data.message)
            // this.$router.push({name: 'login'})
          } else {
            // 成功以后页面刷新
            // location.reload()
            this.messageInfo('添加成功！如需要查询请刷新页面')
          }
        })
        .catch(error => {
          console.error('There was an error!', error)
          this.messageInfoErr('请求错误，请检查')
        })
      this.dialogVisible = false
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
    updateStatusIn (postData) {
      axios.post('http://121.37.191.238:8083/lexicon/update', postData)
        .then(response => {
          if (response.data.code !== 1) {
            this.messageInfoErr(response.data.message)
            // this.$router.push({name: 'login'})
          } else {
            // 成功以后页面刷新
            // location.reload()
            this.messageInfo('更新成功！如需要查询请刷新页面')
          }
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
    },
    validate () {
      // 品牌校验
      if (this.brandName === '') {
        this.messageInfo('品牌名不能为空')
        return false
      }
      // 完整词校验
      if (this.completeWord === '') {
        this.messageInfo('完整词不能为空')
        return false
      }
      // 独立站校验
      if (this.independentStation === '') {
        this.messageInfo('独立站不能为空')
        return false
      }
      // 流量
      if (this.flow === '') {
        this.messageInfo('流量大小不能为空')
        return false
      }
      return true
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

    axios.get('http://121.37.191.238:8083/lexicon/select/nameId?nameId=' + nameId + '&token=' + token + '&md5=' + md5)
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
