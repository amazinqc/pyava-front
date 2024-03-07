<template>
    <TableView v-if="props.list.length > 0" :columns="columns" :list="data" />
    <el-empty v-else />
</template>
<script setup lang="ts">
import TableView from './TableView.vue';
const props = defineProps<{ list: any[] }>()

const columns = shallowRef()
const data = shallowRef()
watch(() => props.list, () => {
    const cs: any[] = []
    const ls: any[] = []
    if (props.list.length > 0) {
        if (typeof props.list[0] === 'object') {
            Object.keys(props.list[0]).forEach((key: string) => cs.push({ name: key, label: key }))
            if (Array.isArray(props.list[0])) {
                props.list.forEach((item: any[]) => {
                    ls.push(Object.entries(item).reduce((acc: any, [key, value]) => {
                        acc[key] = value
                        return acc
                    }, {}))
                })
            } else {
                props.list.forEach((item: any) => ls.push(item))
            }
            columns.value = cs
            data.value = ls
            return
        }
    }
    cs.push({ name: 'i', label: '序号' }, { name: 'v', label: '内容' })
    for (let i = 0; i < props.list.length; i++) {
        ls.push({ i: i + 1, v: props.list[i] })
    }
    columns.value = cs
    data.value = ls
}, { immediate: true })

</script>
