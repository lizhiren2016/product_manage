<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">用户登录</div>
      <el-form :model="form" :rules="rules" ref="form" label-width="0px" class="ms-content">
        <el-form-item prop="account">
          <el-input v-model="form.account" placeholder="请输入账号">
            <el-button slot="prepend" icon="el-icon-lx-people" disabled></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="form.password"
            @keyup.enter.native="login"
          >
            <el-button slot="prepend" icon="el-icon-lx-lock" disabled></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="savepwd">
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="6">
              <el-checkbox v-model="form.savepwd">记住密码</el-checkbox>
            </el-col>
            <el-col :span="6">
              <el-link
                type="primary"
                :underline="false"
                target="_self"
                @click="handlForgotPassword"
              >忘记密码</el-link>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="login">登录</el-button>
        </div>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="6">
            <el-link
              type="primary"
              :underline="false"
              href="/register"
              target="_self"
            >注册新用户</el-link>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
import { SUCCESS_CODE } from '@/config/constants'
import { loginApi } from '@/config/api'

export default {
  data: function () {
    return {
      form: {
        savepwd: true,
        account: localStorage.getItem('account'),
        password: localStorage.getItem('password') && Base64.decode(localStorage.getItem('password'))
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮件地址',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handlForgotPassword () {
      this.$message('请联系管理员！')
    },
    login () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$axios
            .post(loginApi, {
              account: this.form.account,
              password: Base64.encode(this.form.password)
            })
            .then(res => {
              const { data, message, code } = res.data
              if (code !== SUCCESS_CODE) {
                return this.$message.error(message)
              }
              if (data) {
                this.$store.commit('LOGIN', data)
                localStorage.setItem('account', this.form.account)
                localStorage.setItem('password', Base64.encode(this.form.password))
                localStorage.setItem('name', data.name)
                this.$router.push('/home')
                this.$message.success(message)
              } else {
                this.$message.error('登陆失败')
              }
            })
            .catch(error => {
              this.$message.error(error.message)
            })
        }
      })
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
  box-shadow: 5px 5px 10px black;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
