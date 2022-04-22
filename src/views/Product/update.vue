<template>
  <div class="app-container">
    <h1>{{ modular.name }}<small>{{ modular.label }}</small></h1>

    <div>
      <span>修改模块名称：</span>
      <el-select v-model="newModuleId" size="small" placeholder="请选择模块名称" style="width: 150px">
        <el-option
          v-for="item in modularList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="titles">流程名称：<el-input v-model="name" size="small" placeholder="请输入产品名称" style="width: 250px" /></div>
    <div class="titles">流程标签：<el-input v-model="processLabel" size="small" placeholder="请输入产品名称" style="width: 250px" /></div>
    <!-- <h3 class="titles">产品缩略图：</h3>
    <div class="thumbnail">
      <div><img :src="FastDFSAccessUrl + thumbnailUrl" :alt="thumbnailName" class="image"></div>
      <div class="btn">
        <el-upload
          :action="FastDFSUploadUrl + 'common/file/upload?remark=thumbnail'"
          :show-file-list="false"
          :multiple="false"
          :limit="1"
          :before-upload="beforeUpload"
          :on-success="onSuccess"
          :on-error="onError"
        >
          <el-button size="small" type="primary">重新上传缩略图</el-button>
        </el-upload>
      </div>
    </div> -->
    <div>
      <h3>流程内容</h3>
      <textarea v-model="processContent" cols="30" rows="10" />
    </div>
    <h3 class="titles">附件信息：提示上传前直接编辑好文件名称</h3>
    <div class="thumbnail">
      <div>
        <p v-text="downloadName" />
        <a :href="FastDFSUploadUrl+'common/file/download?url=' +downloadUrl" :download="downloadName" v-text="'下载链接'+downloadUrl" />
      </div>
      <div class="btn">
        <el-upload
          :action="FastDFSUploadUrl + 'common/file/upload?remark=download'"
          :show-file-list="false"
          :multiple="false"
          :limit="1"
          :before-upload="beforeUpload"
          :on-success="onSuccess2"
          :on-error="onError"
        >
          <el-button size="small" type="primary">重新上传附件</el-button>
        </el-upload>
      </div>
    </div>
    <h3 class="titles">文章详情与编辑</h3>
    <div>
      <div>
        <tinymce v-model="content" :height="300" />
      </div>
      <p class="titles">以下为网站宽度830px预览效果</p>
      <el-switch
        v-model="showContent"
        style="display: inline-block"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="显示预览"
        inactive-text="关闭预览"
      />
      <div v-show="showContent" style="width:830px;margin:15px auto;border:1px solid rgba(0,0,0,0.3);" v-html="content" />
      <div class="btnsWrap">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="cancel">返回</el-button>
      </div>
    </div>
  </div>

</template>

<script>
import { UpdateProduct, GetProduct, GetProductDetail } from '@/api/Product'
import { FastDFSAccessUrl, FastDFSUploadUrl } from '@/utils/global'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'ProductDetail',
  components: { Tinymce },
  data() {
    return {
      id: this.$route.query.id,
      modular: {
        label: this.$route.query.label,
        name: this.$route.query.name
      },
      newModuleId: this.$route.query.id - 0,
      modularList: [],
      process: {

      },
      processId: this.$route.query.processId,
      name: '',
      processLabel: '可定制',
      processContent: '',
      // thumbnailName: '',
      // thumbnailUrl: '',
      // thumbnailId: null,

      downloadUrl: '',
      downloadName: '',
      downloadId: null,
      oldDetailFileId: '',

      FastDFSAccessUrl,
      FastDFSUploadUrl,
      productContentId: '',
      content: ``,
      showContent: true
      // errorMsg: {
      //   detailFileId: '请上传附件',
      //   processContent: '请输入流程内容',
      //   processContentContent: '请输入流程文章详情',
      //   processName: '请输入流程名称',
      //   processLabel: '请输入流程标签'
      //   // thumbnailId: '请上传缩略图',
      // }

    }
  },
  mounted() {
    console.log(this.$route.query)// label name id
    this.getProductDetail()
    this.getProduct()
  },
  methods: {
    getProductDetail() {
      var id = this.processId
      GetProductDetail(id).then((res) => {
        if (res) {
          this.process = res// content label name id files[0].id files[0].url
          this.name = res.name
          this.processLabel = res.label
          this.processContent = res.content
          this.content = res.processContent.content
          this.processContentId = res.processContent.id
          this.oldDetailFileId = res.files[0].id
          this.downloadName = res.files[0].name
          this.downloadUrl = res.files[0].url
        }
      })
    },
    getProduct() {
      GetProduct().then((res) => {
        if (res) {
          this.modularList = res
        }
      })
    },
    beforeUpload(file) {
      console.log('---beforeUpload---', file)
    },
    onSuccess(response, file, fileList) {
      console.log('---onSuccess---', response, file, fileList)
      this.thumbnailId = response.object.id
      this.thumbnailName = response.object.name
      this.thumbnailUrl = response.object.url
    },
    onSuccess2(response, file, fileList) {
      console.log('---onSuccess---', response, file, fileList)
      this.downloadId = response.object.id
      this.downloadName = response.object.name
      this.downloadUrl = response.object.url
    },
    onError(err, file, fileList) {
      console.log('---onError---', err, file, fileList)
    },
    cancel() {
      this.$router.back()
    },
    onSubmit() {
      var data = {}
      data.newDetailFileId = this.downloadId || this.oldDetailFileId// 详情文件ID
      data.newModuleId = this.newModuleId
      data.oldDetailFileId = this.oldDetailFileId
      data.oldModuleId = this.id// 模块ID
      data.processContent = this.processContent // 流程内容
      data.processContentContent = encodeURIComponent(this.content) // 流程内容详情
      data.processContentId = this.processContentId
      data.processId = this.processId
      data.processLabel = this.processLabel // 流程标签
      data.processName = this.name // 流程名称

      // data.thumbnailId = this.thumbnailId // 缩略图ID
      var url = ''
      for (const key in data) {
        if (!data[key]) {
          this.$message.error(this.errorMsg[key])
          return
        } else {
          url += key + '=' + data[key] + '&'
        }
      }
      console.log('---', url)

      UpdateProduct(url).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="css" scoped>
.thumbnail {
  display: flex;
  flex-direction: row;

}
  .image {
    width: 300px;
    height: 187px;
  }

  .btn {
    display: flex;
    align-items: flex-end;
  }
  .btnsWrap{
    position: fixed;
    right: 10px;
    top:50px;
    text-align: center;
    margin:15px auto;
  }
  .titles{
    margin-top:15px;
    margin-bottom:15px;
  }
  .ContentWrap{
    line-height:23px;
    font-size:14px;
  }
    .ContentWrap>>>ol,.ContentWrap>>>ul{
      padding-left:40px;
      margin:14px 0;
    }
    .ContentWrap>>>p,.ContentWrap>>>h1,.ContentWrap>>>h2,.ContentWrap>>>h3,.ContentWrap>>>h4,.ContentWrap>>>h5,.ContentWrap>>>h6{
      margin:1em 0;
    }
    .ContentWrap>>>a{
      color:rgb(0, 0, 238);
      text-decoration: underline;
      margin:1em 0;
    }
    .ContentWrap>>>td, .ContentWrap>>>th {
    font-family: Verdana,Arial,Helvetica,sans-serif;
    font-size: 14px;
    }
    .ContentWrap>>>img,.ContentWrap>>>video{
      max-width: 100%;
    }
</style>
