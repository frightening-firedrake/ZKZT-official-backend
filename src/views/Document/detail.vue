<template>
  <div class="app-container">
    <div class="content" v-html="row.documentContent.content" />
  </div>
</template>

<script>
import { GetDocumentDetail } from '@/api/Document'

export default {
  name: 'DocumentDetail',
  data() {
    return {
      id: this.$route.params.id,
      row: {}
    }
  },
  mounted() {
    this.getDocumentDetail()
  },
  methods: {
    getDocumentDetail() {
      GetDocumentDetail(this.id).then((res) => {
        if (res) {
          this.row = res
        }
      })
    }
  }
}
</script>

<style>

</style>
