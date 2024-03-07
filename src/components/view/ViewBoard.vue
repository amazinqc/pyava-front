<template>
  <Transition name="viewboard" @enter="onStart">
    <div v-show="board.show && board.status != 'loading'">
      <el-divider />

      <component :is="component" v-bind="bind" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import ListView from '@/components/view/ListView.vue';
import RawView from '@/components/view/RawView.vue';
import TableView from '@/components/view/TableView.vue';
import type { Viewboard } from '@/types';
import { getCurrentInstance } from 'vue';

const props = defineProps<{ board: Viewboard }>()

const instance = getCurrentInstance()
function onStart() {  // 展开动画
  const el = instance?.vnode.el as HTMLElement
  if (el) {
    el.style.setProperty('--viewboard-height', `${el.scrollHeight}px`)
  }
}
const component = shallowRef()
const bind = shallowRef()
watch(() => props.board.result, () => {

  const result = props.board.result
  if (result) {
    if (result.meta) {
      const data = result[result.meta.field]
      component.value = TableView
      bind.value = {
        columns: result.meta.columns,
        list: result.meta.mapped ? mapToList(data, result.meta.columns) : data,
      }
      return
    } else if (Array.isArray(result) && result.length > 0) {
      component.value = ListView
      bind.value = { list: result }
      return
    }
  }
  component.value = RawView
  bind.value = {
    prefix: props.board.status === 'success' ? '结果：' : '错误：',
    data: result,
  }
}, { immediate: true })

const mapToList = (m: Record<string, any>, columns: Record<string, string>[]) => {
  const list = []
  for (let key in m) {
    list.push({ [columns[0].name]: key, [columns[1].name]: m[key] })
  }
  return list
}

</script>

<style scoped>
.viewboard-enter-from,
.viewboard-leave-to {
  max-height: 0;
}

.viewboard-enter-active,
.viewboard-leave-active {
  overflow: hidden;
  transition: max-height 200ms ease;
}

.viewboard-enter-to,
.viewboard-leave-from {
  /* 默认值100px */
  --viewboard-height: 100px;
  max-height: var(--viewboard-height);
}
</style>
