<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      upload
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        :action="action"
        list-type="picture-card"
      >
        <div slot="file" slot-scope="{file}">
          <img v-if="file.raw.type.indexOf('image')>-1" class="el-upload-list__item-thumbnail" :src="file.url" alt="">
          <video v-if="file.raw.type.indexOf('video')>-1" class="el-upload-list__item-thumbnail" :src="file.url" />
          <p v-if="file.raw.type.indexOf('image')<0&&file.raw.type.indexOf('video')<0" class="el-upload-list__item-thumbnail">
            <i class="el-icon-document" />
            {{ file.name }}
          </p>
          <span v-if="file.raw.type.indexOf('image')>-1||file.raw.type.indexOf('video')>-1" class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in" />
            </span>
            <!-- <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
            >
            <i class="el-icon-download" />
          </span>-->
            <!-- v-if="!disabled" -->
            <span
              v-if="file.raw.type.indexOf('image')>-1||file.raw.type.indexOf('video')>-1"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <i class="el-icon-delete" />
            </span>
          </span></div>
        <el-button slot="default" size="small" type="primary">
          点击 上传
        </el-button>
      </el-upload>

      <el-dialog :visible.sync="dialogVisible2" :append-to-body="true">
        <!-- <img width="100%" :src="dialogImageUrl" alt=""> -->
        <img v-if="PreviewType.indexOf('image')>-1" width="100%" :src="dialogImageUrl" alt="">
        <video v-if="PreviewType.indexOf('video')>-1" width="100%" :src="dialogImageUrl" controls />
      </el-dialog>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确定
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import { FastDFSAccessUrl, FastDFSUploadUrl } from '@/utils/global'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      action: FastDFSUploadUrl + 'common/file/upload?remark=detail',
      dialogVisible: false,
      listObj: {},
      fileList: [],
      dialogImageUrl: '',
      PreviewType: '',
      dialogVisible2: false,
      disabled: false
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('请等待文件上传完成!')
        return
      }
      console.log(arr)
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      console.log(response, file)
      const uid = file.uid
      const type = file.raw.type
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          // this.listObj[objKeyArr[i]].url = response.files.file
          this.listObj[objKeyArr[i]].url = FastDFSAccessUrl + response.object.url
          this.listObj[objKeyArr[i]].type = type
          this.listObj[objKeyArr[i]].hasSuccess = true
          console.log(objKeyArr)
          console.log(this.listObj)
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.PreviewType = file.raw.type
      this.dialogVisible2 = true
    },
    handleDownload(file) {
      console.log(file)
    },
    beforeUpload(file) {
      console.log(file)
      var type = file.type
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      if (type.indexOf('image') > -1) {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.src = _URL.createObjectURL(file)
          img.onload = function() {
            _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
          }
          resolve(true)
        })
      } else if (type.indexOf('video') > -1) {
        return new Promise((resolve, reject) => {
          // const video = new VIDEO()
          const video = document.createElement('VIDEO')
          video.src = _URL.createObjectURL(file)
          // video.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
          // }
          resolve(true)
        })
      } else {
        _self.listObj[fileName] = { hasSuccess: false, uid: file.uid }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
</style>
