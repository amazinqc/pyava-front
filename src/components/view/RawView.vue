<template>
    {{ prefix + JSON.stringify(data) }}
</template>
<script setup lang="ts">
defineProps<{ prefix: string, data: any }>()
</script>