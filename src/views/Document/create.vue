<template>
  <div class="app-container">
    <span>产品分类：</span>
    <el-select v-model="currentProductCategory" size="small" placeholder="请选择产品分类" style="width: 150px" @change="currentProductCategoryChange">
      <el-option
        v-for="item in productCategoryList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <span style="margin-left: 15px">主题分类：</span>
    <el-select v-model="currentThemeCategory" size="small" placeholder="请选择主题分类" style="width: 150px" @change="currentThemeCategoryChange">
      <el-option
        v-for="item in themeCategoryList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <div class="titles">资料名称：<el-input v-model="name" size="small" placeholder="请输入资料名称" style="width: 250px" /></div>
    <h3 class="titles">资料缩略图：</h3>
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
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>

</template>

<script>
import { GetAllProductCategory, GetAllThemeCategory, CreateDocument } from '@/api/Document'
import { FastDFSAccessUrl, FastDFSUploadUrl } from '@/utils/global'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'DocumentDetail',
  components: { Tinymce },
  data() {
    return {
      id: this.$route.params.id,
      document: {},
      documentDetail: {},
      productCategoryList: [],
      themeCategoryList: [],
      currentProductCategory: null,
      currentThemeCategory: null,
      name: '',
      thumbnailName: '',
      thumbnailUrl: '',
      thumbnailId: null,

      downloadUrl: '',
      downloadName: '',
      downloadId: null,

      FastDFSAccessUrl,
      FastDFSUploadUrl,
      documentContentId: '',
      content: ``,
      showContent: true,
      errorMsg: {
        documentContentContent: '请输入文章详情',
        documentName: '请输入资料名称',
        detailFileId: '请上传附件',
        thumbnailId: '请上传缩略图',
        productCategoryId: '请选择产品分类',
        themeCategoryId: '请选择主题分类'
      }

    }
  },
  mounted() {
    this.getAllProductCategory()
    this.getAllThemeCategory()
  },
  methods: {
    getAllProductCategory() {
      GetAllProductCategory().then((res) => {
        if (res) {
          this.productCategoryList = res
        }
      })
    },
    getAllThemeCategory() {
      GetAllThemeCategory().then((res) => {
        if (res) {
          this.themeCategoryList = res
        }
      })
    },
    currentProductCategoryChange(val) {
      this.currentProductCategory = val
      // this.getDocument()
    },
    currentThemeCategoryChange(val) {
      this.currentThemeCategory = val
      // this.getDocument()
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
      data.documentContentContent = encodeURIComponent(this.content) // 资料详情
      data.documentName = this.name // 资料名称
      data.detailFileId = this.downloadId // 详情文件ID
      data.thumbnailId = this.thumbnailId // 缩略图ID
      data.productCategoryId = this.currentProductCategory // 产品分类ID
      data.themeCategoryId = this.currentThemeCategory // 主题分类ID
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

      CreateDocument(url).then((res) => {
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
    line-height:1.3;
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
