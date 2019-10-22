<template>
  <div class="goodsAdd">
    <!-- 步骤条 -->
    <el-steps :active="active"
              finish-status="success">
      <el-step title="步骤 1"
               description="基本信息"></el-step>
      <el-step title="步骤 2"
               description="商品图片"></el-step>
      <el-step title="步骤 3"
               description="商品内容"></el-step>
    </el-steps>

    <!-- tab标签 -->
    <el-tabs tab-position="left"
             @tab-click="handleClick"
             v-model="activeTab">
      <!-- 基本信息 -->
      <el-tab-pane label="基本信息">
        <el-form :model="form"
                 label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"
                      placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"
                      placeholder="请输入商品价格"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"
                      placeholder="请输入商品重量"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"
                      placeholder="请输入商品数量"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader :props="props"
                         v-model="form.goods_cat"
                         :options="options"></el-cascader>
          </el-form-item>
          <el-button style="margin-top: 12px;"
                     @click="next"
                     type="success"
                     plain>下一步</el-button>
        </el-form>
      </el-tab-pane>
      <!-- 商品图片 -->
      <el-tab-pane label="商品图片">
        <el-upload name="file"
                   action="http://localhost:8888/api/private/v1/upload"
                   list-type="picture-card"
                   :headers="headers"
                   multiple
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove"
                   :on-success="handleSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%"
               :src="dialogImageUrl"
               alt="">
        </el-dialog>
        <el-button style="margin-top: 12px;"
                   @click="next"
                   type="success"
                   plain>下一步</el-button>
      </el-tab-pane>
      <!-- 商品内容 -->
      <el-tab-pane label="商品内容">
        <quill-editor v-model="form.goods_introduce"></quill-editor>
        <el-button style="margin-top: 12px;"
                   @click="addGood"
                   type="success"
                   plain>添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeTab: '',
      active: 0,
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        goods_introduce: '',
        pics: []
      },
      props: {
        value: 'cat_id', // 选中的 id 值 （是一个数组）
        label: 'cat_name', // 显示的级联文本
        children: 'children' // 子代展开
      },
      options: [],
      headers: {
        Authorization: localStorage.getItem('token')
      },
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get('categories?type=3')
    if (meta.status === 200) {
      this.options = data
      // console.log(data)
    } else {
      this.$message.error(meta.msg)
    }
  },

  methods: {
    handleClick (tab, event) {
      // console.log(tab, event)
      this.active = +tab.index
    },
    next () {
      this.active++
      this.activeTab = this.active.toString()
      // this.activeTab = this.active + ''
    },
    // 文件上传成功执行的钩子函数
    handleSuccess (response, file, fileList) {
      // console.log(response)
      const { meta, data } = response
      if (meta.status === 200) {
        this.form.pics.push({ pic: data.tmp_path })
      }
    },
    // 文件移除时执行的钩子函数
    handleRemove (file, fileList) {
      // console.log(file)
      const path = file.response.data.tmp_path
      // 从this.form.pics 中将对应的相同的path 删除
      this.form.pics = this.form.pics.filter(item => item.pic !== path)
    },
    // 图片预览
    handlePictureCardPreview (file) {
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    },

    // 添加
    async addGood () {
      if (this.form.goods_name.trim() === '') {
        this.$message.error('请输入商品名称')
        return
      }
      // 发送ajax
      const { meta } = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join(',')
      })
      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
    }

  }
}
</script>

<style lang="scss" scoped>
// 深度作用选择器(了解)
// scoped 不会向子组件内渗透的
.quill-editor {
  background-color: #fff;
  ::v-deep .ql-editor {
    min-height: 300px;
  }
}
</style>

<style lang="scss" scoped>
// 这个里面写只作用于当前组件的样式, 不会渗透的
</style>
