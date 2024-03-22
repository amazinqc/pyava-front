<template>
    <el-table :data="list" max-height="500" table-layout="fixed" border>
        <!-- <el-table-column type="index" width="50" /> -->
        <el-table-column v-for="column in columns" :prop="column.name" :label="column.label || column.name"
            :key="column.name" :sortable="column.sortable || false">
            <template #default="scope">
                <el-popover v-if="column.ts || column.ms || false" placement="right" width="auto">
                    <template #reference>
                        <el-tag type="warning">{{ scope.row[column.name] }}</el-tag>
                    </template>
                    <template #default>
                        <el-tag type="danger">{{ formatms(scope.row[column.name] * (column.ts ? 1000 : 1)) }}</el-tag>
                    </template>
                </el-popover>
                <span v-else>{{ scope.row[column.name] }}</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { formatms } from "@/utils/Utils";
defineProps<{ columns: Record<string, string>[], list: Record<string, any>[] }>()
</script>