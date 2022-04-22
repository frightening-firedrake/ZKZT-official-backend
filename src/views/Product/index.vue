<template>
  <div class="product">
    <div style="text-align:right;margin:5px 30px 0 0;"><el-button type="primary">新增模块</el-button></div>
    <p style="text-align:center;color:GoldenRod;">简单提示：模块相关功能未实现，排序未实现，目前版本仅限流程增删改</p>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item v-for="(item,index) in list" :key="item.id" :name="index">
        <template slot="title">
          <div class="container">
            <h1 style="margin-right:20px;">模块</h1>
            <!-- <div class="icon"><img style="height:100%;" src="" alt=""></div> -->
            <h1>{{ item.name }}</h1>
            <p>{{ item.label }}</p>
          </div>
          <div class="tbtns">
            <span>编辑</span>
            <span class="del">删除</span>
            <span>下移</span>
            <span>上移</span>
            <span @click.stop="addProcess(item)">新增子流程</span>
          </div>
        </template>
        <div v-for="item2 in item.processes" :key="item2.id" class="collapseBody">
          <div class="container">
            <h1 style="margin-right:20px;">流程</h1>
            <div class="icon"><img style="height:100%;" :src="FastDFSAccessUrl+item2.files[0].url" alt=""></div>
            <h1>{{ item2.name }}</h1>
            <p style="color:DarkSlateBlue ;margin:0 10px;">{{ item2.label }}</p>
            <p class="content">{{ item2.content }}</p>
          </div>
          <div class="tbtns">
            <span @click="updateprocess(item,item2)">编辑</span>
            <!-- <span class="del" @click="handleDelete(item2.id)">删除</span> -->

            <el-popover
              placement="bottom-start"
              width="200"
              trigger="click"
            >
              <p>这是一段内容这是一段内容确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="primary" size="mini" @click="handleDelete(item2.id)">确定</el-button>
              </div>
              <span slot="reference" class="del">删除</span>
            </el-popover>
            <span>下移</span>
            <span>上移</span>
            <!-- <span>查看详情</span> -->
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { GetProduct, DeleteProduct } from '@/api/Product'
import { FastDFSAccessUrl } from '@/utils/global'

export default {
  name: 'Product',
  data() {
    return {
      list: [],
      activeNames: ['1'],
      FastDFSAccessUrl
    }
  },
  mounted() {
    this.getProduct()
  },
  methods: {
    getProduct() {
      GetProduct().then((res) => {
        if (res) {
          this.list = res
        }
      })
    },
    handleDetail(id) {
      this.$router.push({
        path: '/product/detail/' + id
      })
    },
    updateprocess(modular, process) {
      this.$router.push({
        path: '/product/update/', query: { name: modular.name, label: modular.label, id: modular.id, processId: process.id }
      })
    },
    addProcess(modular) {
      this.$router.push({
        path: '/product/create', query: { name: modular.name, label: modular.label, id: modular.id }
      })
    },
    handleDelete(id) {
      DeleteProduct(id).then((res) => {
        console.log(res)
        if (res.status === 200) {
          this.list.forEach((v) => {
            v.processes = v.processes.filter((v2) => {
              return v2.id !== id
            })
          })
        }
      })
    },
    handleChange(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="css" scoped>
.product .el-collapse{
  margin:30px;
}
.product>>>.el-collapse-item__wrap{
  padding-left:60px;
  padding-right:30px;
}
.product>>>.el-collapse-item__header{
  padding-left:30px;
  justify-content: space-between;
  background: rgb(243,243,243);
}
.product>>>.el-collapse-item{
  margin-bottom:10px;
}
.product>>>.el-collapse-item__content{
  padding-bottom:0;
}
.collapseBody{
  display: flex;
  justify-content: space-between;
}
.container{
  display: flex;
  align-items:center;
}
.container h1,.container div,.container p{
  flex: none;
}
.container p.content{
  flex: auto;
}
.tbtns{
  flex: auto;
  line-height: 48px;
  text-align: right;
}
.collapseBody .tbtns{
  flex: none;
  line-height: 70px;
}
.tbtns span{
  cursor: pointer;
  padding:3px;
  margin:8px;
}
.tbtns span.del{
  color:Maroon ;
}
.tbtns span.del:hover{
  color:red ;
}
.tbtns span:hover{
  color:SpringGreen ;
}
</style>
