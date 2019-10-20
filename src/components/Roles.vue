<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button @click="dialogVisible = true"
               type="success"
               class="addBtn"
               plain> 添加角色</el-button>
    <!-- 添加角色模态框 -->
    <el-dialog @close="closeDialog"
               title="添加角色"
               :visible.sync="dialogVisible"
               width="40%">
      <el-form :rules="rules"
               ref="addRoleform"
               :model="addRoleform"
               label-width="80px">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="addRoleform.roleName"
                    placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="addRoleform.roleDesc"
                    placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 表格 -->
    <el-table :data="roleList">
      <!-- 角色列表权限管理 -->
      <el-table-column type="expand">
        <template v-slot:default="{ row }">
          <!-- row 是一天遍历的数据，就是一个角色，row.children是全部的一级权限数组 -->
          <!-- 每一个一级都改先展示出一行 -->
          <!-- {{row}} -->
          <!-- 每个一级展示一行 -->
          <el-row class="l1"
                  v-for="l1 in row.children"
                  :key="l1.id">
            <el-col :span="4">
              <el-tag @close="delRights(row,l1.id)"
                      closable>{{ l1.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 每个二级应该展示一行 -->
              <el-row class="l2"
                      v-for="l2 in l1.children"
                      :key="l2.id">
                <el-col :span="4">
                  <el-tag @close="delRights(row,l2.id)"
                          type="success"
                          closable>{{ l2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>

                <el-col :span="20">
                  <!-- 每个三级直接就是一个el-tag -->
                  <el-tag @close="delRights(row,l3.id)"
                          class="l3"
                          v-for="l3 in l2.children"
                          :key="l3.id"
                          type="warning"
                          closable>{{ l3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称"
                       prop="roleName"></el-table-column>
      <el-table-column label="描述"
                       prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button @click="showEditDialog(row)"
                     icon="el-icon-edit"
                     size="small"
                     plain
                     type="primary"></el-button>
          <el-button @click="delRole(row.id, $event)"
                     icon="el-icon-delete"
                     size="small"
                     plain
                     type="danger"></el-button>
          <el-button icon="el-icon-check"
                     size="small"
                     plain
                     type="success"
                     @click="showAssignDialog(row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑 修改模态对话框 -->
    <el-dialog title="修改角色"
               :visible.sync="editDialogVisible"
               width="40%">
      <el-form :rules="rules"
               ref="editRoleform"
               :model="editRoleform"
               label-width="80px">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="editRoleform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="editRoleform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="assignVisible"
               width="40%">
      <el-tree ref="tree"
               node-key="id"
               default-expand-all
               show-checkbox
               :data="data"
               :props="defaultProps">

      </el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button @click="assignRights"
                   type="primary">分 配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      dialogVisible: false,
      addRoleform: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '角色描述不能为空', trigger: ['blur', 'change'] }
        ]
      },
      editDialogVisible: false,
      editRoleform: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      // 分配权限
      assignVisible: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 准备一个变量, 存储正在操作的角色 id
      roleId: ''
    }
  },
  // created 钩子函数, 获取角色数据
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const res = await this.$axios.get('roles')
      const { meta, data } = res
      // console.log(res)
      if (meta.status === 200) {
        this.roleList = data
        // console.log(this.roleList)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delRights (row, rightsId) {
      const res = await this.$axios.delete(`roles/${row.id}/rights/${rightsId}`)
      console.log(res)
      const { meta, data } = res
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        // 重新渲染 this.getRoleList() 获取到所有角色的信息，并且进行了赋值
        // 只需要更新当前角色的权限信息即可
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 添加角色
    async addRole () {
      try {
        await this.$refs.addRoleform.validate()
        // 看修改还是添加，有id 就是修改，没有id就是添加
        // const { id } = this.addRoleform
        // let res
        // if (id) {
        //   res = await this.$axios.post(`roles/${id}`, this.addRoleform)
        // } else {
        //   res = await this.$axios.post('roles', this.addRoleform)
        // }
        const res = await this.$axios.post('roles', this.addRoleform)
        const { meta } = res
        if (meta.status === 200 || meta.status === 201) {
          this.$message.success(meta.msg)
          this.dialogVisible = false

          this.getRoleList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    //  对话框关闭的时候重置表单内容
    closeDialog () {
      // console.log('对话框关闭了')
      this.$refs.addRoleform.resetFields()
    },
    // 删除角色
    async delRole (id, e) {
      try {
        await this.$confirm('你确定要删除该角色吗', '温馨提示', {
          type: 'warning'
        })
        const res = await this.$axios.delete(`roles/${id}`)
        const { meta } = res
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRoleList()
        }
      } catch (e) {
        this.$message('取消删除')
      }
    },

    // 编辑 数据回显
    showEditDialog (row) {
      this.editDialogVisible = true

      this.editRoleform.id = row.id
      this.editRoleform.roleName = row.roleName
      this.editRoleform.roleDesc = row.roleDesc
    },
    async editRole () {
      try {
        await this.$refs.editRoleform.validate()
        // 看修改还是添加，有id 就是修改，没有id就是添加
        // const { id } = this.editRoleform
        // let res
        // if (id) {
        //   res = await this.$axios.post(`roles/${id}`, this.editRoleform)
        // } else {
        //   res = await this.$axios.post('roles', this.editRoleform)
        // }
        const { id } = this.editRoleform
        const res = await this.$axios.put(`roles/${id}`, this.editRoleform)
        const { meta } = res
        if (meta.status === 200 || meta.status === 201) {
          this.$message.success(meta.msg)
          this.editDialogVisible = false

          this.getRoleList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async showAssignDialog (row) {
      this.roleId = row.id
      this.assignVisible = true

      // 一展示分配对话框，就该发送ajax请求，获取全部的权限列表
      const { data, meta } = await this.$axios.get('rights/tree')
      if (meta.status === 200) {
        // 成功了，将数据存起来
        this.data = data
        console.log(data)

        // 获取到所有的 三级 id 回显
        // this.$refs.tree.setCheckedKeys([101])
        // console.log(row)
        const ids = []
        row.children.forEach(l1 => {
          // 所有的一级权限
          l1.children.forEach(l2 => {
            // 所有的二级权限
            l2.children.forEach(l3 => {
              // 所有的三级权限
              ids.push(l3.id)
            })
          })
        })
        // 通过 key 进行设置
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRights () {
      // console.log(this.$refs.tree.getCheckedKeys()) //全选的
      // console.log(this.$refs.tree.getHalfCheckedKeys())
      const ids = this.$refs.tree.getCheckedKeys()
      const halfIds = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...halfIds].join(',')// 后台需要的是',' 分隔的字符串id列表

      // 发送ajax请求, 需要 roleId 角色id,  rids 权限id
      // roleId => this.roleId
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, rids)
      if (meta.status === 200) {
        // 提示分配成功
        this.$message.success(meta.msg)
        // 关闭对话框
        this.assignVisible = false
        // 重新渲染
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss">
.roles {
  .addBtn {
    margin-bottom: 10px;
  }
  .l1 {
    margin-bottom: 5px;
    border-bottom: 1px dotted #ccc;
  }
  .l2 {
    margin-bottom: 5px;
  }
  .l3 {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>
