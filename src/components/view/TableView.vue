<template>
    <el-table :data="list" max-height="500" table-layout="fixed" border>
        <!-- <el-table-column type="index" width="50" /> -->
        <el-table-column v-for="column in columns" :prop="column.name" :label="column.label || column.name"
            :key="column.name" :sortable="column.sortable || false">
            <template #default="scope">
                <span>{{ scope.row[column.name] }}</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
defineProps<{ columns: Record<string, string>[], list: Record<string, any>[] }>()
</script>