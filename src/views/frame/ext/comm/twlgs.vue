<script setup lang="ts">

    // 物流公司，直接绑定data

    import { ref, watch, onMounted } from "vue"

    import { More } from '@element-plus/icons-vue'

    import type { cfunc_boolean } from "@/inc/eotypes";
    import eocore from '@/inc/eocore';
    import TGlobal from '@/logic/TGlobal'

    import wlgs_list from "@/views/frame/ext/tcwgl/wlgs_list.vue"

    const v_wlgs_list = ref<InstanceType<typeof wlgs_list>>();

    const props = withDefaults(defineProps<{
        modelValue: number,
        label: string,
        disabled?: boolean,
    }>(), {
        modelValue: 0,
        label: "",
        disabled: false,
    })

    const emits = defineEmits<{
        (e: 'update:modelValue', value: number): void
        (e: 'change', value: any): void
    }>()

    let x_wlgs_id_s = ref("");

    watch(() => props.label, (newVal, oldVal) => {
        //console.log(newVal, oldVal)
        x_wlgs_id_s.value = newVal;
    }, {
        immediate: true,
        deep: true
    });

    onMounted(() => {
    })

    const set_data = (wlgsLabel: string) => {
        x_wlgs_id_s.value = wlgsLabel;
    }

    const onInputOpen_wlgs = () => {
        v_wlgs_list.value?.show_dialog({});
    }
    const onListSelect_wlgs = (cancel: boolean, data: any, cb: cfunc_boolean) => {

        if (cancel) {
            cb(true);
            return;
        }

        x_wlgs_id_s.value = data['f_gsmc'];

        emits("update:modelValue", data['f_wlgs_id']);
        emits("change", { f_wlgs_id: data['f_wlgs_id'], f_wlgs_id_s: x_wlgs_id_s.value });

        cb(true);
    }

    defineExpose({
        set_data
    })

</script>

<template>
    <div style="width:100%;">
        <el-input v-model="x_wlgs_id_s" style="width:100%"
            placeholder="请选择物流公司" :readonly="true">
            <template #append>
                <el-button :icon="More" @click="onInputOpen_wlgs" 
                    v-show="!disabled"/>
            </template>
        </el-input>
        <wlgs_list ref="v_wlgs_list" @close="onListSelect_wlgs"></wlgs_list>
    </div>
</template>

<style>
</style>