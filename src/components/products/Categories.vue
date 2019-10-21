<template>
  <div class="categories">
    <!-- 添加分类按钮 -->
    <el-button @click="showDialog"
               class="add"
               plain
               type="success">
      添加分类
    </el-button>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="dialogVisible"
               width="40%"
               @close="closeDialog">

      <el-form status-icon
               ref="form"
               :rules="rules"
               :model="form"
               label-width="80px">
        <el-form-item label="分类名称"
                      prop="cat_name">
          <el-input v-model="form.cat_name"
                    placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父级名称"
                      prop="cat_pid">
          <el-cascader v-model="form.cat_pid"
                       :options="options"
                       clearable
                       :props="props"></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="addCategory"
                   type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 表格 -->
    <el-table element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              v-loading="loading"
              :data="cateList"
              row-key="cat_id"
              style="width: 100%">
      <el-table-column prop="cat_name"
                       label="分类名称">
      </el-table-column>
      <el-table-column label="是否有效">
        <template v-slot="row">
          {{ row.cat_deleted ? "否" : "是" }}
        </template>
      </el-table-column>
      <el-table-column prop="cat_level"
                       label="排序">
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="primary"
                     plain
                     icon="el-icon-edit"
                     size="small"></el-button>
          <el-button type="danger"
                     plain
                     icon="el-icon-delete"
                     size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pagenum"
                   background
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
      cateList: [],
      loading: true,
      pagenum: 1,
      pagesize: 5,
      total: 0,
      dialogVisible: false,
      form: {
        // 级联选择器选中时，选中了两级，将选择的一级和二级的id都拿到，拿到的是一个数组
        cat_pid: [], // 父级的id
        cat_name: '', // 分类的名称
        cat_level: '' // 需要添加的分类的级别
      },
      rules: {
        cat_name: [{
          required: true, message: '分类名称不能为空', trigger: ['blur', 'change']
        }]
      },
      options: [],
      props: {
        value: 'cat_id', // 选中时，用于提交的分类id
        label: 'cat_name', // 展示的分类名字
        children: 'children', // 指定子代的标识
        checkStrictly: true
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      this.loading = true
      const res = await this.$axios.get('categories', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          type: 3
        }
      })
      // console.log(res)
      const { meta, data } = res
      // console.log(data)
      if (meta.status === 200) {
        // this.$message.success(meta.msg)
        this.cateList = data.result
        this.total = data.total
        // console.log(this.cateList)
      } else {
        this.$message.error(meta.msg)
      }
      this.loading = false
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getCateList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCateList()
    },
    async showDialog () {
      this.dialogVisible = true
      // 发送请求，获取二级分类的数据
      const res = await this.$axios.get('categories?type=2')
      // console.log(res)
      const { meta, data } = res
      if (meta.status === 200) {
        this.options = data
        // console.log(this.options)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async addCategory () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('categories', {
          cat_name: this.form.cat_name,
          cat_level: this.form.cat_pid.length,
          // cat_pid 表示只要父 id 即可,  从cat_pid数组里面取最后一项
          // 如果没有父级 id, 给默认值 0
          cat_pid: this.form.cat_pid[this.form.cat_pid.length - 1] || 0
        })
        // console.log(meta)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.dialogVisible = false
          this.getCateList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss">
.categories {
  .add {
    margin-bottom: 10px;
  }
}
</style>
