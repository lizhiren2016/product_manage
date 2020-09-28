<template>
  <el-dialog
    :title="type?'新增':'修改'"
    :visible.sync="visible"
    width="40%"
    center
    :before-close="handleClose"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-position="left" label-width="80px">
      <el-form-item label="账号" prop="account" required>
        <el-input v-model="formData.account" :disabled="!type"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" required v-if="type">
        <el-input v-model="formData.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name" required>
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="国家" prop="country">
        <country-selector v-model="formData.country" placeholder="请选择国家" width="260"></country-selector>
      </el-form-item>
      <el-form-item label="城市" prop="city">
        <el-input v-model="formData.city"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="formData.address"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button @click="submit" type="primary">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import CountrySelector from 'vue-country-selector'
import 'vue-country-selector/dist/countryselector.css'
import { Base64 } from 'js-base64'
import { MOBILE_REGEX, SUCCESS_CODE } from '@/config/constants'
import { usersApi } from '@/config/api'

export default {
  name: 'create-or-update',
  components: {
    CountrySelector
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 1 // 1：新增 0：修改
    },
    formData: {
      type: Object,
      required: true
    }
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 32) {
        callback(new Error('密码长度必须大于或等于6,小于32'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        account: [
          {
            required: true,
            message: '请输入邮件地址',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮件地址',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            validator: validatePass,
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            pattern: MOBILE_REGEX,
            message: '目前只支持中国大陆的手机号码',
            trigger: 'blur'
          }
        ],
        country: [
          {
            required: true,
            message: '请选择国家',
            trigger: 'blur'
          }
        ],
        city: [
          {
            required: false,
            message: '请输入城市',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
      this.$refs.form.resetFields()
    },
    submit () {
      if (this.type) return this.create()
      this.update()
    },
    // 创建
    create () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formData.password = Base64.encode(this.formData.password)
          this.$axios
            .post(usersApi, this.formData)
            .then(res => {
              this.handleClose()
              const { code, message } = res.data
              if (code !== SUCCESS_CODE) {
                return this.$message.error(message)
              }
              this.$message.success(message)
              this.$emit('refresh')
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        }
      })
    },
    // 修改
    update () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formData.password = Base64.encode(this.formData.checkPass)
          this.$axios
            .put(usersApi, this.formData)
            .then(res => {
              this.handleClose()
              const { code, message } = res.data
              if (code !== SUCCESS_CODE) {
                return this.$message.error(message)
              }
              this.$message.success(message)
              this.$emit('refresh')
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        }
      })
    }
  }
}
</script>
