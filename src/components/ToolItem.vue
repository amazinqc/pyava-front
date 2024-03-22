<template>
  <el-form ref="formRef" :model="forms" label-width="120px">
    <el-card shadow="hover">
      <template #header>
        <el-row :gutter="16">
          <el-col :span="12"> {{ tool.name }} </el-col>
          <el-col :span="12">
            <el-space wrap>
              <el-button type="primary" @click="submitForm(formRef)" :disabled="result.status === 'loading'">
                执行
              </el-button>
              <el-button @click="result.show = !result.show" :loading="result.status === 'loading'"
                :disabled="result.status === undefined" :type="showButtonColorType()">
                {{ result.show ? '隐藏' : '查看' }}
                <template #icon>
                  <Warning v-if="result.status === 'error'" />
                  <CircleCheck v-else-if="result.status === 'success'" />
                  <Setting v-else />
                </template>
              </el-button>
              <el-button v-if="tool.args.length > 0" @click="resetForm(formRef)"> 重置 </el-button>
            </el-space>
          </el-col>
        </el-row>
      </template>

      <el-space wrap>
        <el-tooltip v-for="arg in tool.args.filter((v) => !(v.name in baseData))" :key="arg.name"
          :content="arg.desc || arg.name">
          <el-form-item :label="arg.name" :prop="arg.name" :rules="{
            required: arg.default == undefined,
            message: `参数<${arg.desc || arg.name}>不能为空`
          }">
            <el-input v-if="arg.type === 'int'" v-model.number="forms[arg.name]" :parser="numeric" :formatter="numeric"
              :placeholder="arg.desc" />
            <el-switch v-else-if="arg.type === 'bool'" v-model="forms[arg.name]"
              inline-prompt
              :active-icon="Select"
              :inactive-icon="CloseBold"
              style="--el-switch-on-color:#13ce66;--el-switch-off-color:#ff4949"
            />
            <el-input v-else v-model="forms[arg.name]" :placeholder="arg.desc" />
          </el-form-item>
        </el-tooltip>
      </el-space>
      <ViewBoard v-if="result.status !== undefined" :board="result" />
    </el-card>
  </el-form>
</template>

<script lang="ts" setup>
import api from '@/request/api'
import type { BaseData, Code, Viewboard } from '@/types'
import { numeric } from '@/utils/Utils'
import { Select, CircleCheck, CloseBold, Setting, Warning } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'

const ViewBoard = defineAsyncComponent(() => import('@/components/view/ViewBoard.vue'))

const props = defineProps<{ tool: Code; baseData: BaseData }>()

const params: Record<string, any> = {}

for (const arg of props.tool.args) {
  if (arg.name in props.baseData) {
    continue
  }
  params[arg.name] = arg.default || ''
}

const forms = reactive(params)
const result = reactive<Viewboard>({
  show: false
})

const formRef = ref<FormInstance>()

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  for (const arg of props.tool.args) {
    // 属于共用数据，但该共用数据不真
    if (arg.name in props.baseData && !props.baseData[arg.name]) {
      ElMessage.warning('请填写' + arg.name + '信息')
      return
    }
  }
  await formEl.validate((valid) => {
    if (valid) {
      result.status = 'loading'
      api
        .runCode(props.tool.id, props.baseData, { ...forms, ...props.baseData })
        .then((r) => {
          result.result = r
          result.status = 'success'
        })
        .catch((r) => {
          result.result = r
          result.status = 'error'
        })
    } else {
      console.log('error submit!')
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  result.show = false
  delete result.result
  delete result.status
}

function showButtonColorType() {
  if (result.show) {
    return 'info'
  }
  switch (result.status) {
    case 'success':
      return 'success'
    case 'error':
      return 'warning'
    default:
      return 'default'
  }
}
</script>
