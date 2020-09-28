<template>
  <el-dialog
    :title="type?'新增':'修改'"
    :visible.sync="visible"
    width="40%"
    center
    :before-close="handleClose"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-position="left" label-width="80px">
      <el-form-item label="工厂号" prop="factoryId">
        <el-input v-model="formData.factoryId" :disabled="!type"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="位置" prop="location">
        <el-input v-model="formData.location"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button @click="submit" type="primary">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { SUCCESS_CODE } from '@/config/constants'
import { factorysApi } from '@/config/api'

export default {
  name: 'create-or-update',
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
    return {
      rules: {
        name: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          }
        ],
        factoryId: [
          {
            required: true,
            message: '工厂号不能为空',
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
          this.$axios
            .post(factorysApi, this.formData)
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
          this.$axios
            .put(factorysApi, this.formData)
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
