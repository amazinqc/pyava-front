<template>
    {{ (status ? '结果：' : '异常：') + JSON.stringify(result) }}
</template>
<script setup lang="ts">
defineProps<{status?:boolean, result: any}>()
</script>