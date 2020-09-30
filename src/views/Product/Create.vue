<template>
  <el-dialog title="新增" :visible.sync="visible" width="40%" center :before-close="handleClose">
    <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="80px">
      <el-form-item label="产品类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择产品类型">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布版本" prop="release">
        <el-select v-model="form.release" placeholder="请选择发布版本">
          <el-option
            v-for="item in releaseOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input v-model="form.version" placeholder="请输入版本号"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="文件" prop="file">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="#"
          :on-change="handleFileChange"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="简介" prop="note">
        <el-input
          type="textarea"
          placeholder="请输入简介"
          v-model="form.note"
          maxlength="30"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button @click="submit" type="primary" :disabled="disabled">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { SUCCESS_CODE } from '@/config/constants'
import { productsApi } from '@/config/api'

export default {
  name: 'create',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      typeId: 1,
      releaseId: 1,
      fileList: [],
      disabled: false,
      form: {
        type: 1,
        release: 1,
        name: '',
        version: '',
        note: '',
        file: ''
      },
      typeOptions: [
        {
          value: 1,
          label: '调试工具'
        },
        {
          value: 2,
          label: '测试工具'
        },
        {
          value: 3,
          label: '生产工具'
        },
        {
          value: 4,
          label: 'Android APK'
        }
      ],
      releaseOptions: [
        {
          value: 1,
          label: 'Release'
        },
        {
          value: 2,
          label: 'Debug'
        }
      ],
      rules: {
        type: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'blur'
          }
        ],
        release: [
          {
            required: true,
            message: '请选择发布版本',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        version: [
          {
            required: true,
            message: '请输入版本号',
            trigger: 'blur'
          }
        ],
        file: [
          {
            required: true,
            message: '请上传文件',
            trigger: 'blur'
          }
        ],
        note: [
          {
            required: true,
            message: '请输入简介',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
      this.fileList = []
      this.$refs.form.resetFields()
    },
    handleFileChange (file) {
      let fileSize = file.size / 1024 / 1042 < 500
      if (!fileSize) {
        this.$message({
          message: '上传文件大小不能超过 1GB!',
          type: 'warning'
        })
        return
      }
      let index = file.name.lastIndexOf('.')
      let str = file.name.substring(0, index)
      str = str.split('_')
      this.form.name = str[0]
      this.form.version = str[1]
      this.form.file = file.raw
    },
    handleRemove (file, fileList) {
      this.fileList = fileList
      this.form.file = ''
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.file) {
            return this.$message({
              message: '请先选择文件!',
              type: 'warning',
              duration: '2000'
            })
          }
          let formData = new FormData() // 创建form对象
          formData.append('file', this.form.file)
          formData.append('type', this.form.type)
          formData.append('name', this.form.name)
          formData.append('release', this.form.release)
          formData.append('version', this.form.version)
          formData.append('note', this.form.note)
          this.disabled = true
          this.$axios({
            method: 'POST',
            url: productsApi,
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            } })
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
            .finally(() => {
              this.disabled = false
            })
        }
      })
    }
  }
}
</script>
<style scoped>
::v-deep .el-upload--text {
  background-color: #fff;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-align: center;
  width: 82px;
  height: 35px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
</style>
