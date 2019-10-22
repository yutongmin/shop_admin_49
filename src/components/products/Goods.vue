<template>
  <div class="goods">
    <!-- 添加按钮 -->
    <el-button class="addBtn"
               type="success"
               plain
               @click="goAdd">添加商品</el-button>

    <!-- 表格 -->
    <el-table :data="goodsList"
              style="width: 100%">
      <el-table-column :index="indexMethod"
                       type="index"></el-table-column>
      <el-table-column prop="goods_name"
                       label="商品名称"></el-table-column>
      <el-table-column label="商品价格"
                       prop="goods_price"></el-table-column>
      <el-table-column label="商品重量"
                       prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot:default="{ row }">
          {{ row.add_time | time }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button plain
                     type="primary"
                     icon="el-icon-edit"
                     size="small"></el-button>
          <el-button plain
                     type="danger"
                     icon="el-icon-delete"
                     size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pagenum"
                   :page-sizes="[5, 10, 15, 20]"
                   :page-size="pagesize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const res = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      console.log(res)
      const { meta, data } = res
      if (meta.status === 200) {
        this.goodsList = data.goods
        this.total = data.total
      }
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagenum = 1
      this.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodsList()
    },
    indexMethod (index) {
      return index + 1 + (this.pagenum - 1) * this.pagesize
    },
    goAdd () {
      this.$router.push('/goods-add')
    }
  }
}
</script>

<style lang="scss">
.goods {
  .addBtn {
    margin-bottom: 10px;
  }
}
</style>
