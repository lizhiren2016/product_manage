<template>
  <div class="table">
    <div class="container">
      <span class="title">注册新用户</span>
      <template>
        <el-form ref="form" :rules="rules" :model="form" label-width="100px" readonly>
          <el-form-item label="账号" prop="account">
            <el-input
              v-model="form.account"
              type="email"
              size="mini"
              style="width: 200px;"
              placeholder="请输入邮件地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="form.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              type="password"
              placeholder="请再次请输入密码"
              v-model="form.checkPass"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="form.name"
              size="mini"
              placeholder="请输入姓名"
              style="width: 200px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="国家" prop="country">
            <country-selector v-model="form.country" placeholder="请选择国家" width="260"></country-selector>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入电话"
              size="mini"
              style="width: 200px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="城市" prop="city">
            <el-input v-model="form.city" placeholder="请输入城市" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入详细地址" size="mini"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :loading="loading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </template>
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
import CountrySelector from 'vue-country-selector'
import 'vue-country-selector/dist/countryselector.css'
import { MOBILE_REGEX, SUCCESS_CODE } from '@/config/constants'
import { registerApi } from '@/config/api'

export default {
  name: 'register',
  components: {
    CountrySelector
  },
  mounted () {},
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 32) {
        callback(new Error('密码长度必须大于或等于6,小于32'))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次请输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      registerState: 0,
      errMsg: '',
      errCode: 0,
      loading: false,
      form: {
        account: '',
        password: '',
        name: '',
        phone: '',
        country: '',
        city: '',
        address: '',
        checkPass: ''
      },
      rules: {
        account: [
          {
            required: true, // 是否必填
            message: '请输入邮件地址', // 错误提示信息
            trigger: 'blur' // 检验方式（blur为鼠标点击其他地方，）
          },
          {
            type: 'email', // 要检验的类型（number，email，date等）
            message: '请输入正确的邮件地址',
            trigger: ['blur', 'change']
          }
        ],
        password: [{ validator: validatePass, trigger: 'blur', required: true }],
        checkPass: [
          { validator: validatePass2, trigger: 'blur', required: true }
        ],
        phone: [
          {
            pattern: MOBILE_REGEX, // 可以写正则表达式
            message: '目前只支持中国大陆的手机号码',
            trigger: 'blur'
          }
        ],
        country: [
          {
            required: true, // 是否必填
            message: '请选择国家', // 错误提示信息
            trigger: 'blur' // 检验方式（blur为鼠标点击其他地方，）
          }
        ]
      }
    }
  },
  methods: {
    resetForm (form) {
      this.$refs.form.resetFields()
    },
    // 保存编辑
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.password = Base64.encode(this.form.checkPass)
          this.loading = true
          this.$axios
            .post(registerApi, this.form)
            .then(res => {
              const { message, code } = res.data
              if (code !== SUCCESS_CODE) {
                return this.$message.error(message)
              }
              this.$message.success('注册成功,等待管理员激活。')
              this.$router.push('/login')
            })
            .catch(err => {
              this.$message.error('注册失败：', err.message)
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}
.el-row {
  margin-bottom: 20px;
}
.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  font-size: 14px;
  position: absolute;
  top: 10%;
  left: 25%;
  width: 30%;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
  box-shadow: 3px 3px 10px rgb(51, 50, 50);
}
.mr10 {
  margin-right: 10px;
}
.title {
  font-size:25px;
  text-align:center;
  display:block;position:
  relative;
  top:50%;
  margin-bottom: 20px;
}
</style>
