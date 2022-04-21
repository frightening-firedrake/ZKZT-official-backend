<template>
  <div class="app-container">
    <span style="margin-left: 15px">产品分类：</span>
    <el-select v-model="args.pcId" size="small" placeholder="请选择产品分类" clearable style="width: 150px" @change="currentProductCategoryChange">
      <el-option
        v-for="item in productCategoryList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <span style="margin-left: 15px">主题分类：</span>
    <el-select v-model="args.tcId" size="small" placeholder="请选择主题分类" clearable style="width: 150px" @change="currentThemeCategoryChange">
      <el-option
        v-for="item in themeCategoryList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <el-button size="small" icon="el-icon-plus" type="primary" style="float: right;margin-right: 35px" @click="handleCreate">新增</el-button>
    <div class="list">
      <div v-for="item,index in list" :key="index">
        <div class="card">
          <div><img :src="FastDFSAccessUrl + item.files[0].url" :alt="item.files[0].name.split('.')[0]" class="image"></div>
          <span class="footer">
            <span class="title">{{ item.name }}</span>
            <span class="btn">
              <el-button size="mini" icon="el-icon-view" @click="handleDetail(item.id)">查看</el-button>
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleUpdate(item.id)">编辑</el-button>
            </span>
          </span>
        </div>
      </div>
    </div>
    <div class="pagination">
      <el-pagination
        :current-page.sync="args.page"
        :page-size="args.size"
        layout="total, prev, pager, next"
        :total="total"
        background
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { GetDocument, GetAllProductCategory, GetAllThemeCategory } from '@/api/Document'
import { FastDFSAccessUrl } from '@/utils/global'

export default {
  name: 'Document',
  data() {
    return {
      args: {
        page: 1,
        size: 15,
        keyword: '',
        pcId: null,
        tcId: null
      },
      list: [],
      total: 0,
      productCategoryList: [],
      themeCategoryList: [],
      FastDFSAccessUrl
    }
  },
  mounted() {
    this.getDocument()
    this.getAllProductCategory()
    this.getAllThemeCategory()
  },
  methods: {
    getDocument() {
      const { page, size, keyword, pcId, tcId } = this.args
      var args = 'page=' + page + '&size=' + size
      if (keyword !== '') {
        args += '&keyword=' + keyword
      }
      if (pcId) {
        args += '&pcId=' + pcId
      }
      if (tcId) {
        args += '&tcId=' + tcId + '&'
      }
      args += '&'
      GetDocument(args).then((res) => {
        if (res) {
          this.list = res.data
          this.total = res.total
        }
      })
    },
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
      var args = this.args
      args.pcId = val
      this.args = args
      this.getDocument()
    },
    currentThemeCategoryChange(val) {
      var args = this.args
      args.tcId = val
      this.args = args
      this.getDocument()
    },
    handleCurrentChange(val) {
      var args = this.args
      args.page = val
      this.args = args
      this.getDocument()
    },
    handleDetail(id) {
      this.$router.push({
        path: '/document/detail/' + id
      })
    },
    handleUpdate(id) {
      this.$router.push({
        path: '/document/update/' + id
      })
    },
    handleCreate() {
      this.$router.push({
        path: '/document/create'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;

  .card {
    margin: 10px 15px;

    .image {
      width: 300px;
      height: 187px;
    }

    .footer {
      display: flex;
      flex-direction: row;
      line-height: 32px;

      .btn {
        margin-left: auto;
      }
    }
  }

  .card:hover,.card:active {
    box-shadow: 0 0 10px #999;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
