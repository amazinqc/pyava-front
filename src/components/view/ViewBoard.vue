<template>
  <Transition name="viewboard" @enter="onStart">
    <div v-if="board.show && board.status != 'loading'">
      <el-divider />
      <RawView :status="board.status === 'success'" :result="board.result" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import RawView from '@/components/view/RawView.vue'
import type { Viewboard } from '@/types'

defineProps<{ board: Viewboard }>()

const instance = getCurrentInstance()
function onStart() {
  const el = instance?.vnode.el as HTMLElement
  if (el) {
    el.style.setProperty('--viewboard-height', `${el.scrollHeight}px`)
  }
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
