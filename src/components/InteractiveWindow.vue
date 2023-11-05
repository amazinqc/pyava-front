<template>
  <el-form ref="formRef" :model="forms" class="demo-ruleForm" label-width="120px">
    <el-card shadow="hover">
      <template #header>
        <el-row :gutter="16">
          <el-col :span="12"> {{ name }} </el-col>
          <el-col :span="12">
            <el-space wrap>
              <el-button type="primary" @click="submitForm(formRef)"> 执行 </el-button>
              <el-button v-if="args.length > 0" @click="resetForm(formRef)"> 重置 </el-button>
            </el-space>
          </el-col>
        </el-row>
      </template>

      <el-space wrap>
        <el-tooltip v-for="arg in args" :key="arg.name" :content="arg.desc || arg.name">
          <el-form-item
            :label="arg.name"
            :prop="arg.name"
            :rules="{
              required: true,
              message: `参数<${arg.desc || arg.name}>不能为空`
            }"
          >
            <el-input v-model="forms[arg.name]" :placeholder="arg.desc" />
          </el-form-item>
        </el-tooltip>
      </el-space>
      <el-divider/>
      {{ "结果：" + result }}
    </el-card>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

interface ArgType {
  readonly name: string
  readonly type?: string
  readonly desc?: string
  readonly default?: string
}

const props = defineProps<{ name: string; args: ArgType[]; result?: any }>()

const params: Record<string, any> = {}

for (const arg of props.args) {
  params[arg.name] = arg.default || ''
}

const forms = reactive(params)

const formRef = ref<FormInstance>()

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
  console.log({ ...forms })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
