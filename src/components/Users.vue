<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入搜索关键字"
              v-model="query"
              class="input-with-select">
      <el-button @click="searchUser"
                 slot="append"
                 icon="el-icon-search"></el-button>
    </el-input>
    <el-button class="addBtn"
               plain
               type="success"
               @click="dialogVisible =true">添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="userList"
              border
              style="width: 100%">
      <el-table-column prop="username"
                       label="姓名"
                       width="180">
      </el-table-column>
      <el-table-column prop="email"
                       label="邮箱"
                       width="180">
      </el-table-column>
      <el-table-column prop="mobile"
                       label="电话">
      </el-table-column>

      <el-table-column label="用户状态">
        <template v-slot:default="obj">
          <el-switch @change="changeState(obj.row)"
                     v-model="obj.row.mg_state"
                     active-color="#13ce66"
                     inactive-color="#ff4949">

          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template v-slot:default="obj">
          <el-button plain
                     size="small"
                     type="primary"
                     icon="el-icon-edit"
                     @click="showEditDialog(obj.row)"></el-button>
          <el-button @click="delUser(obj.row.id)"
                     plain
                     size="small"
                     type="danger"
                     icon="el-icon-delete"></el-button>
          <el-button plain
                     size="small"
                     type="success"
                     icon="el-icon-check"
                     @click="showAssignDialog(obj.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pagenum"
                   :page-sizes="[2, 4, 6, 8, 10]"
                   :page-size="pagesize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total"></el-pagination>
    <!-- 添加表单 -->
    <el-dialog @close="closeDialog"
               title="添加用户"
               :visible.sync="dialogVisible"
               width="40%">

      <el-form ref="form"
               :rules="rules"
               :model="form"
               label-width="80px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input placeholder="请输入用户名"
                    v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input type="password"
                    placeholder="请输入密码"
                    v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input placeholder="请输入邮箱"
                    v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input placeholder="请输入手机号"
                    v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改的对话框 编辑表单 -->
    <el-dialog title="修改用户"
               :visible.sync="editVisible"
               width="40%">

      <el-form status-icon
               ref="editForm"
               :rules="rules"
               :model="editForm"
               label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{ editForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input placeholder="请输入邮箱"
                    v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input placeholder="请输入手机"
                    v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button @click="editUser"
                   type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="assignVisible"
               width="40%">

      <el-form ref="assignForm"
               :model="assignForm"
               label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{ assignForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="assignForm.rid"
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.id"
                       :label="item.roleName"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button @click="assignRole"
                   type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      userList: [],
      total: 0,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: '' },
      dialogVisible: false,
      editVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 添加表单的校验功能
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '用户名长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '密码长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      },
      assignVisible: false,
      assignForm: {
        username: '', // 用户回显的名字
        id: '', // 用户id 操作的是哪个用户
        rid: '' // 角色id，选择的角色的id
      },
      options: []
    }
  },
  methods: {
    // 渲染=========
    async getUserList () {
      try {
        const res = await this.$axios.get('users', {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        const { meta, data } = res
        if (meta.status === 200) {
          this.userList = data.users
          // 配置总条数
          this.total = data.total

          // console.log(this.userList)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }

      // this.$axios.get('users', {
      //   params: {
      //     query: this.query,
      //     pagenum: this.pagenum,
      //     pagesize: this.pagesize
      //   },
      //   headers: {
      //     Authorization: localStorage.getItem('token')
      //   }
      // }).then(res => {
      //   // console.log(res)
      //   const { meta, data } = res
      //   if (meta.status === 200) {
      //     this.userList = data.users
      //     // 配置总条数
      //     this.total = data.total

      //     // console.log(this.userList)
      //   } else {
      //     this.$message.error(meta.msg)
      //   }
      // })
    },

    // 修改每页的条数========
    handleSizeChange (val) {
      // console.log("每页${val}条")
      this.pagesize = val
      // 将当前页更新成第一页
      this.pagenum = 1
      // 重新渲染
      this.getUserList()
    },
    // 当前页面变化时触发
    handleCurrentChange (val) {
      // val 用户选择当前页
      this.pagenum = val
      // 重新渲染
      this.getUserList()
    },

    // 删除功能
    // 1 注册点击事件
    // 2 弹出一个 $confirm确认框 then  catch
    // 3 点击确认发送ajax请求
    // 4 判断是否成功  注意: 如果当前页本身只有一条了, 还进行了删除操作, 应该当前页pagenum  -1
    async delUser (id) {
      try {
        await this.$confirm('亲亲，确认要删除吗?', '温馨提示', {
          type: 'warning'
        })
        const res = await this.$axios.delete(`users/${id}`)
        const { meta } = res
        if (meta.status === 200) {
          // 删除成功
          this.$message.success('删除成功')
          // 如果当前页只有一条, 删除了仅有的一条后, 当前页-1
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          // 重新渲染
          this.getUserList()
        } else {
          // 删除失败
          this.$message.error(meta(meta.msg))
        }
      } catch (e) {
        console.log(e)
        this.$message('取消成功')
      }

      // this.$confirm('亲亲，确认要删除吗?', '温馨提示', {
      //   type: 'warning'
      // }).then(() => {
      //   // 点的是确认, 发送ajax请求
      //   this.$axios.delete(`users/${id}`
      //     // , {
      //     //   // 设置请求头
      //     //   headers: {
      //     //     Authorization: localStorage.getItem('token')
      //     //   }
      //     // }
      //   ).then(res => {
      //     const { meta } = res
      //     if (meta.status === 200) {
      //       // 删除成功
      //       this.$message.success('删除成功')
      //       // 如果当前页只有一条, 删除了仅有的一条后, 当前页-1
      //       if (this.userList.length === 1 && this.pagenum > 1) {
      //         this.pagenum--
      //       }
      //       // 重新渲染
      //       this.getUserList()
      //     } else {
      //       // 删除失败
      //       this.$message.error(meta(meta.msg))
      //     }
      //   }).catch(() => {
      //     // 取消
      //     this.$message('取消成功')
      //   })
      // })
    },

    // 搜索功能=======
    // 根据搜索关键字，搜索数据展示
    searchUser () {
      // 搜索后，需要将当前页改为第一页
      this.pagenum = 1
      this.getUserList()
    },

    // 修改用户状态
    async changeState (row) {
      const res = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
      const { meta } = res
      if (meta.status === 200) {
        this.$message.success('修改成功')
      } else {
        this.$message.error(meta.msg)
      }

      //  this.$axios.put(`users/${row.id}/state/${row.mg_state}`).then(res => {
      //   const { meta } = res
      //   if (meta.status === 200) {
      //     this.$message.success('修改成功')
      //   } else {
      //     this.$message.error(meta.msg)
      //   }
      // })
    },

    // 添加功能
    async addUser () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          // 关闭模态框
          this.dialogVisible = false
          // 重新渲染第一页
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.pagenum = 1

          // 重新渲染
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      // console.log('对话框关闭了')
      this.$refs.form.resetFields()
    },

    // 修改功能
    // 数据回显
    showEditDialog (row) {
      this.editVisible = true
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    async editUser () {
      try {
        await this.$refs.editForm.validate()
        const { id, email, mobile } = this.editForm
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        if (meta.status === 200) {
          this.$message.success(meta.msg)

          this.editVisible = false
          this.getUserList()
        } else {

        }
      } catch (e) {
        console.log(e)
      }
    },

    // 分配角色
    async showAssignDialog (row) {
      this.assignVisible = true
      console.log(row)
      // 回显数据
      this.assignForm.id = row.id
      this.assignForm.username = row.username
      // 原有的角色也要回显
      // this.assignForm.rid = row.rid //但是row 中没有直接的rid

      // 根据id发送ajax请求，拿到rid，进行回显
      const resUser = await this.$axios.get(`users/${row.id}`)
      console.log(resUser)
      if (resUser.meta.status === 200) {
        const rid = resUser.data.rid
        this.assignForm.rid = rid !== -1 ? rid : ''
      }

      // 一展示对话框，就该发送ajax请求，获取玩不的角色列表，用于让用户选择
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.options = data
        console.log(this.options)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 点击分配按钮 发送ajax请求 分配角色
    async assignRole () {
      const { id, rid } = this.assignForm
      if (rid === '') {
        this.$message.error('请选择角色')
        return
      }
      // 发送ajax 进行角色配
      const { meta } = await this.$axios.put(`users/${id}/role`, { rid })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.assignVisible = false
        this.getUserList()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss">
.el-breadcrumb {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}
.users {
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addBtn {
    margin: 0 20px;
  }
}
</style>
