<script lang="ts">
import {
  CaretBottom,
  CaretRight,
  Cellphone,
  EditPen,
  Files,
  Loading,
  Management,
  Notebook,
  SwitchButton,
  WarningFilled
} from '@element-plus/icons-vue'

import api from '@/request/api'
import PythonEditor from '@/components/PythonEditor.vue'
import type { Server, CodeChoice, Code, BaseData } from '@/types'
import { numeric } from '@/utils/Utils'
import { ElMessage } from 'element-plus'

const DEVEL_LIMIT = 9
</script>

<script lang="ts" setup>
const baseData = reactive<BaseData>({ _raw: true, uid: '', cid: '', sid: '' })

const servers = ref<Server[]>()

api.getServers().then((data) => (servers.value = data))

const menus = [
  {
    option: 0,
    name: '通用功能',
    icon: Files,
    choices: shallowRef<CodeChoice[]>(),
    loading: false
  },
  {
    option: 1,
    name: '系统设置',
    icon: Cellphone,
    choices: shallowRef<CodeChoice[]>(),
    loading: false
  },
  {
    option: 2,
    name: '功能管理',
    icon: Management,
    choices: shallowRef<CodeChoice[]>(),
    loading: false
  },
  {
    option: 3,
    name: '数据模块',
    icon: Notebook,
    choices: shallowRef<CodeChoice[]>(),
    loading: false
  }
]

const menuOpen = (index: string, path: string[]) => {
  develReset()
  if (index == '/') {
    return
  }
  const matches = index.match(/^\/option\/(\d+)$/)

  if (matches) {
    const optionId = parseInt(matches[1])
    const menu = menus[optionId]
    if (menu.choices.value !== undefined || menu.loading) {
      return
    }
    menu.loading = true
    api.getCodeOptions(optionId).then((data) => {
      menu.choices.value = data
      menu.loading = false
    })
  }
}

/* code编辑器 */
const code = ref('# loading code from the server...')
api.getCodeView(1).then((data) => (code.value = data.code))
let customed: {}
api.getCodeHints().then((data) => (customed = data))
const debug = () => api.codeTest(code.value, baseData).then(console.log)

/* 功能列表 */
let tools = shallowRef<Code[]>()
const selectOption = (index: string, path: string[]) => {
  if (index == '/') {
    tools.value = undefined
    return
  }
  develReset()
  const matches = index.match(/^\/choice\/(\d+)$/)

  if (matches) {
    const codeType = parseInt(matches[1])
    api.getTypeCodes(codeType).then((data) => tools.value = data)
  }
}

/* 后台入口 */
let last = 0
const devel_hold = ref(0)
const develUp = () => {
  let hold = devel_hold.value + 1
  const now = performance.now()
  if (now - last > DEVEL_LIMIT * 256) {
    hold = 1
    last = performance.now()
  }
  if (hold > DEVEL_LIMIT) {
    develReset()
    develUp()
  } else {
    devel_hold.value = hold
  }
}
const develReset = () => (last = devel_hold.value = 0)
const editor = computed(() => devel_hold.value >= DEVEL_LIMIT)

const innerHeight = ref(window.innerHeight)
const resize = () => {
  // - header - margin - padding - footer
  innerHeight.value = window.innerHeight - 80 - 20 * 2 - 20 * 2 - 60
}
window.addEventListener('resize', resize)
resize()

// const loader = ref(false)
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-scrollbar>
        <el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff" default-active="/"
          @open="menuOpen" @select="selectOption" @close="develReset">
          <el-menu-item index="/" @click="develUp">
            <el-icon>
              <el-avatar src="/static/logo.png" :size="18" shape="square" style="background-color: white" />
            </el-icon>
            <span style="user-select: none">后台测试</span>
          </el-menu-item>
          <el-sub-menu :index="`/option/${menu.option}`" v-for="menu in menus" :key="menu.option">
            <template #title>
              <el-icon>
                <component :is="menu.icon" />
              </el-icon>
              <span>{{ menu.name }}</span>
            </template>
            <el-menu-item v-if="menu.choices.value === undefined" index="" style="background-color: darkgray">
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
              <span>拼命加载中...</span>
            </el-menu-item>
            <el-menu-item v-else-if="menu.choices.value.length == 0" index="empty" disabled>
              <el-icon>
                <WarningFilled />
              </el-icon>
              <span> 没有数据 </span>
            </el-menu-item>
            <el-menu-item v-else v-for="choice in menu.choices.value" :index="`/choice/${choice.type}`"
              :key="choice.type">
              <el-icon>
                <CaretRight />
              </el-icon>
              <span>{{ choice.desc }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-link v-if="editor" href="/admin" target="blank">
            <el-menu-item class="devel-mod" index="" @click="develReset">
              <el-icon>
                <EditPen />
              </el-icon>
              <span>开发者后台</span>
            </el-menu-item>
          </el-link>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header>
        <label style="margin-left: 2rem">
          <el-button link @click="baseData._raw = !baseData._raw">
            {{ baseData._raw ? '角色 UID' : '客户端ID' }}：
          </el-button>

          <el-input v-if="baseData._raw" v-model.number="baseData.uid" placeholder="角色UID" :clearable="true"
            :maxlength="10" :formatter="numeric" :parser="numeric" style="max-width: 8rem" />
          <el-input v-else v-model.number="baseData.cid" placeholder="终端ID" :clearable="true" :maxlength="10"
            :formatter="numeric" :parser="numeric" style="max-width: 8rem" />
        </label>
        <label style="margin-left: 2rem">
          <el-text size="large">服务器：</el-text>
          <el-select clearable placeholder="选择服务器" v-model="baseData.sid">
            <el-option v-for="server in servers" :key="server.sid" :label="server.name" :value="server.sid" />
          </el-select>
        </label>
        <el-dropdown replacement="bottom-end">
          <span class="el-dropdown__box">
            <el-avatar src="/static/logo.png"></el-avatar>
            <el-icon>
              <CaretBottom />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="SwitchButton" @click="ElMessage.info('正在开发中...')">
                重置数据
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <el-card shadow="never">
          <!-- <RouterView/> -->
          <el-drawer :model-value="editor" size="50%" :show-close="false">
            <template #header="{ titleId, titleClass }">
              <h4 :id="titleId" :class="titleClass">代码调试工作台</h4>
              <el-link v-if="editor" href="/admin" target="blank" @click="develReset" type="info">
                <el-icon>
                  <EditPen />
                </el-icon>
                <span>开发者后台</span>
              </el-link>
            </template>
            <PythonEditor v-model="code" :callables="customed"></PythonEditor>
            <ElButton @click="debug" type="primary"> 测试 </ElButton>
          </el-drawer>
          <el-scrollbar :height="innerHeight">
            <el-space v-if="tools && tools.length > 0" direction="vertical" alignment="left" size="large"
              style="width: 100%" fill>
              <ToolItem v-for="tool in tools" :key="tool.id" :tool="tool" :base-data="baseData" />
            </el-space>
            <el-empty v-else description="空空如也"> </el-empty>
          </el-scrollbar>

          <!--
          <el-button @click="loader = !loader">点击</el-button>
          <div style="width: 30px; height: 30px; border: 1px solid black">
            <LoadingStatus :status="loader ? 'loading' : 'success'" />
          </div>
          <div style="width: 30px; height: 30px; border: 1px solid black">
            <LoadingStatus :status="loader ? 'loading' : 'error'" />
          </div>
          -->
        </el-card>
      </el-main>
      <el-footer> 后台测试 - 数据修改 Copyright © </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-main {
  overflow: hidden;
}
.el-card {
  min-height: 100%;
  /* overflow: hidden; */
}

.layout-container {
  height: 100vh;
}
.layout-container .el-aside {
  overflow: hidden;
}
.layout-container .el-aside .el-menu {
  min-height: 100%;
  border-right: none;
  height: calc(100vh - 120px);
}
.layout-container .el-aside .el-scrollbar {
  max-height: calc(100vh - 119px);
}

.layout-container .el-aside .el-aside__logo {
  height: 120px;
  background: url('/static/logo.png') no-repeat center / 120px auto;
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
  animation: rotate 8s ease-in-out;
}
.layout-container .el-header {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.layout-container .el-header {
  height: 80px;
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
.devel-mod {
  background-color: rgb(71, 56, 28);
  color: var(--el-color-danger);
  font-weight: bold;
  width: var(--el-aside-width);
}
</style>
