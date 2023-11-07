<template>
  <el-form ref="formRef" :model="forms" class="demo-ruleForm" label-width="120px">
    <el-card shadow="hover">
      <template #header>
        <el-row :gutter="16">
          <el-col :span="12"> {{ tool.name }} </el-col>
          <el-col :span="12">
            <el-space wrap>
              <el-button type="primary" @click="submitForm(formRef)"> 执行 </el-button>
              <el-button v-if="tool.args.length > 0" @click="resetForm(formRef)"> 重置 </el-button>
              <el-button
                v-if="result.status != undefined"
                @click="result.show = !result.show"
                :loading="result.status == 'loading'"
              >
                查看
              </el-button>
            </el-space>
          </el-col>
        </el-row>
      </template>

      <el-space wrap>
        <el-tooltip
          v-for="arg in tool.args.filter((v) => !(v.name in baseData))"
          :key="arg.name"
          :content="arg.desc || arg.name"
        >
          <el-form-item
            :label="arg.name"
            :prop="arg.name"
            :rules="{
              required: arg.default == undefined,
              message: `参数<${arg.desc || arg.name}>不能为空`
            }"
          >
            <el-input v-model="forms[arg.name]" :placeholder="arg.desc" />
          </el-form-item>
        </el-tooltip>
      </el-space>
      <el-divider />
      <div v-show="result.show && result.status != 'loading'">
        {{ (result.status == 'success' ? '结果：' : '异常：') + result.result }}
      </div>
    </el-card>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import api from '@/request/api'
import type { Code, BaseData } from '@/types'

const props = defineProps<{ tool: Code; baseData: BaseData }>()

const params: Record<string, any> = {}

for (const arg of props.tool.args) {
  if (arg.name in props.baseData) {
    continue
  }
  params[arg.name] = arg.default || ''
}

const forms = reactive(params)
const result = reactive<{ status?: 'loading' | 'success' | 'error'; show: boolean; result?: any }>({
  show: false
})

const formRef = ref<FormInstance>()

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  for (const arg of props.tool.args) {
    if (arg.name in props.baseData && !props.baseData[arg.name]) {
      console.log({ ...props.baseData })
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
</script>
