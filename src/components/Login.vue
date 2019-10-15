<template>
  <div class="login">
    <el-form :rules="rules"
             status-icon
             ref="form"
             :model="form"
             label-width="80px">
      <img class="logo"
           src="../assets/avatar.jpg"
           alt />
      <el-form-item label="用户名"
                    prop="username">
        <el-input v-model="form.username"
                  placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码"
                    prop="password">
        <el-input v-model="form.password"
                  placeholder="请输入密码"
                  type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="login"
                   class="loginBtn"
                   type="primary">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        // required: true 为必填项
        // message 提示消息
        // trigger: blur 失去焦点触发校验   change 修改时就触发
        // min: 最小长度,  max: 最大长度
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '用户名长度必须是3-12位',
            trigger: ['change', 'blur']
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '密码长度必须是3-12位',
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  methods: {
    // 重置功能
    reset () {
      this.$refs.form.resetFields()
    },
    // 登录功能
    login () {
      this.$refs.form.validate(isValid => {
        // 校验失败
        if (!isValid) return

        // 校验成功,发送ajax请求
        axios
          .post('http://localhost:8888/api/private/v1/login', this.form)
          .then(res => {
            const { meta, data } = res.data
            if (meta.status === 200) {
              localStorage.setItem('token', data.token)
              this.$message({
                type: 'success',
                message: meta.msg,
                duration: 1000
              })
              this.$router.push({ name: 'index' })
            } else {
              this.$message.error(meta.msg)
            }
          })
      })
    }
  }
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    background-color: #fff;
    border-radius: 20px;
    padding: 75px 20px 20px;

    margin: 0 auto;
    margin-top: 200px;
    position: relative;

    .logo {
      position: absolute;
      top: -75px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      border: 5px solid #fff;
    }
    .loginBtn {
      margin-right: 70px;
    }
  }
}
</style>
