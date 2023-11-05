<template>
  <div v-if="status === 'success'" class="loader-success" />
  <div v-else-if="status === 'error'" class="loader-error">
    <el-icon color="#F56C6C"><CloseBold /></el-icon>
  </div>
  <div v-else v-loading="status === 'loading'" class="loader-loading" />
</template>

<script setup lang="ts">
import { CloseBold } from '@element-plus/icons-vue'

defineProps<{ status: 'loading' | 'success' | 'error' }>()
</script>

<style>
.loader-error,
.loader-loading,
.loader-success {
  position: relative;
  width: 100%;
  height: 100%;
}

.loader-loading {
  --el-loading-spinner-size: 70%;
}

.loader-error {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
}

.loader-success::before {
  position: absolute;
  content: '';
  top: 50%;
  left: 20%;
  border: 2px solid #95d475;
  border-left-width: 0;
  border-bottom-width: 0;
  transform: scaleX(-1) rotate(135deg);
  transform-origin: left top;
  animation: animation_true 0.3s linear 1 both;
  opacity: 0;
}

@keyframes animation_true {
  0% {
    opacity: 0;
    width: 0%;
    height: 0%;
  }
  33% {
    opacity: 1;
    width: 25%;
    height: 0%;
  }
  100% {
    opacity: 1;
    width: 25%;
    height: 50%;
  }
}
</style>
