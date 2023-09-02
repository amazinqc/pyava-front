<script lang="ts">
import {
  User,
  Crop,
  EditPen,
  Management,
  Promotion,
  UserFilled,
  CaretBottom,
  SwitchButton
} from '@element-plus/icons-vue'
import PythonEditor from '@/components/PythonEditor.vue'
import { apiCodeTips, apiPyavaCode, apiTestCode } from '@/request/api'
</script>

<script lang="ts" setup>
const code = ref(`\
# loading code from the server...
`)
onMounted(async () => {
  const c = await apiPyavaCode(1)
  code.value = c.code
})

let customed: {}

onMounted(async () => {
  customed = await apiCodeTips()
})

const debug = async () => {
  console.log(await apiTestCode({ code: code.value, name: '' }))
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/article/channel">
          <el-icon><Management /></el-icon>
          <span>功能类型</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>数据模块</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>角色数据</span>
          </template>
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>功能1</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>功能2</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>功能3</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>开发者模式</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>黑马：<strong>大事件自己人大事件</strong></div>
        <el-dropdown replacement="bottom-end">
          <span class="el-dropdown__box">
            <el-avatar src="logo.png"></el-avatar>
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="SwitchButton">
                重置浏览器数据
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <el-card>
          <PythonEditor v-model="code" :callables="customed"></PythonEditor>
          <button @click="debug">测试</button>
        </el-card>
      </el-main>
      <el-footer>后台测试 - 数据修改</el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-main {
  overflow: hidden;
}
.el-card {
  min-height: 100%;
  overflow: hidden;
}

.layout-container {
  height: 100vh;
}
.layout-container .el-aside {
  overflow: hidden;
}
.layout-container .el-aside .el-menu {
  min-height: 100%;
}

.layout-container .el-aside .el-aside__logo {
  height: 120px;
  background: url('logo.png') no-repeat center / 120px auto;
  opacity: 0.5;
}
@keyframes rotate {
  0% {
  }
  25% {
    transform: rotatez(360deg);
  }
  50% {
    transform: rotatez(360deg) rotatey(360deg);
  }
  75% {
    transform: rotatez(360deg) rotatey(360deg) rotatez(360deg);
  }
  100% {
    transform: rotatez(360deg) rotatey(360deg) rotatez(360deg) rotatey(-360deg);
  }
}

.el-aside__logo:hover {
  animation: rotate 4s ease-in-out;
}
.layout-container .el-menu {
  border-right: none;
}
.layout-container .el-header {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.layout-container .el-header .el-dropdown__box {
  display: flex;
  align-items: center;
}
.layout-container .el-header .el-dropdown__box .el-icon {
  color: #999;
  margin-left: 10px;
}
.el-dropdown__box:active:focus {
  outline: none;
}
.layout-container .el-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: 14px;
  color: #666;
}
</style>
