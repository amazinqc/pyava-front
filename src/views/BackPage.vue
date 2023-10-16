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

import PythonEditor from '@/components/PythonEditor.vue'
import {
  apiCodeHints,
  apiGetOptions,
  apiGetServers,
  apiShowCode,
  apiTestCode,
  type Choice,
  type Server
} from '@/request/api'
const DEVEL_LIMIT = 7
</script>

<script lang="ts" setup>
// 是角色uid还是客户端id，默认true: uid
const uid_or_cid = ref(false)
const sid = ref<number>()
const uid = ref<number>()
const servers = ref<Server[]>()

;(async () => (servers.value = await apiGetServers()))()

const menus = [
  {
    option: 0,
    name: '通用功能',
    icon: Files,
    choices: shallowRef<Choice[]>(),
    loading: false
  },
  {
    option: 1,
    name: '系统设置',
    icon: Cellphone,
    choices: shallowRef<Choice[]>(),
    loading: false
  },
  {
    option: 2,
    name: '功能管理',
    icon: Management,
    choices: shallowRef<Choice[]>(),
    loading: false
  },
  {
    option: 3,
    name: '数据模块',
    icon: Notebook,
    choices: shallowRef<Choice[]>(),
    loading: false
  }
]
const menuOpen = (index: string, path: string[]) => {
  if (index == '/') {
    return
  }

  const optionId = parseInt(index.substring('/option/'.length))
  const menu = menus[optionId]

  if (menu.choices.value !== undefined || menu.loading) {
    return
  }
  menu.loading = true
  ;(async () => {
    const options = await apiGetOptions(optionId)
    menu.choices.value = options
    menu.loading = false
  })()
}

const call_devel = ref(0)

/* code */
const code = ref('# loading code from the server...')
;(async () => (code.value = (await apiShowCode(1)).code))()

let customed: {}
;(async () => (customed = await apiCodeHints()))()

const debug = async () => {
  console.log(await apiTestCode(code.value, {}, sid.value))
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        text-color="#fff"
        default-active="/"
        unique-opened
        router
        @open="menuOpen"
      >
        <el-menu-item index="/" @click="call_devel++">
          <el-icon>
            <el-avatar src="logo.png" :size="18" shape="square" style="background-color: white" />
          </el-icon>
          <span>后台测试</span>
        </el-menu-item>
        <el-sub-menu :index="`/option/${menu.option}`" v-for="menu in menus" :key="menu.option">
          <template #title>
            <el-icon><component :is="menu.icon" /></el-icon>
            <span>{{ menu.name }}</span>
          </template>
          <el-menu-item
            v-if="menu.choices.value === undefined"
            index=""
            style="background-color: darkgray"
          >
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>拼命加载中...</span>
          </el-menu-item>
          <el-menu-item v-else-if="menu.choices.value.length == 0" index="empty" disabled>
            <el-icon><WarningFilled /></el-icon>
            <span> 没有数据 </span>
          </el-menu-item>
          <el-menu-item
            v-else
            v-for="choice in menu.choices.value"
            :index="`/choice/${choice.type}`"
            :key="choice.type"
            v-loading="menu.choices.value === undefined"
          >
            <el-icon><CaretRight /></el-icon>
            <span>{{ choice.desc }}</span>
          </el-menu-item>
        </el-sub-menu>
        <ElLink href="http://127.0.0.1/admin">
          <el-menu-item
            class="devel-mod"
            index=""
            v-show="call_devel >= DEVEL_LIMIT"
            @click="call_devel = 0"
          >
            <el-icon><EditPen /></el-icon>
            <span>开发者后台</span>
          </el-menu-item>
        </ElLink>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          <label style="margin-left: 2rem">
            <ElButton link @click="uid_or_cid = !uid_or_cid"
              >{{ uid_or_cid ? '角色 UID' : '客户端ID' }}：</ElButton
            >
            <ElInput
              v-model="uid"
              :placeholder="uid_or_cid ? '角色UID' : '终端ID'"
              :clearable="true"
              :maxlength="10"
              :formatter="(v: string) => parseInt(v) || ''"
              style="max-width: 8rem"
            />
          </label>
          <label style="margin-left: 2rem">
            <span>服务器：</span>
            <ElSelect clearable placeholder="选择服务器" v-model="sid">
              <ElOption
                v-for="server in servers"
                :key="server.sid"
                :label="server.name"
                :value="server.sid"
              />
            </ElSelect>
          </label>
        </div>
        <el-dropdown replacement="bottom-end">
          <span class="el-dropdown__box">
            <el-avatar src="logo.png"></el-avatar>
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="SwitchButton"> 重置数据 </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <el-card>
          <!-- <RouterView/> -->
          <PythonEditor v-model="code" :callables="customed"></PythonEditor>
          <ElButton @click="debug" type="primary"> 测试 </ElButton>
        </el-card>
      </el-main>
      <el-footer> 后台测试 - 数据修改 </el-footer>
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
  animation: rotate 8s ease-in-out;
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
