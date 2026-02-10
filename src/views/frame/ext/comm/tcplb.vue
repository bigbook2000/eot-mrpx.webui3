<script setup lang="ts">

    // 产品大类小类二级选择框

    import { ref, watch, onMounted } from "vue"

    import eocore from '@/inc/eocore';
    import TGlobal from '@/logic/TGlobal'

    const props = withDefaults(defineProps<{
        modelValue: number[],        
        cplbList: any[],
        disabled?: boolean,
    }>(), {
        modelValue: () => [0, 0],        
        cplbList: () => [],
        disabled: false,
    })

    const emits = defineEmits<{
        (e: 'update:modelValue', value: number[]): void
        (e: 'change', value: number[]): void
    }>()

    const x_cpdl_id = ref(0);
    const x_cpxl_id = ref(0);
    
    const x_cpdl_list = ref<any[]>([]);
    const x_cpxl_list = ref<any[]>([]);

    watch(() => props.cplbList, (newVal, oldVal) => {
        //console.log(newVal, oldVal)
        let listNew: any = [];        
        listNew.push(...newVal);
        x_cpdl_list.value = listNew;
        x_cpxl_list.value = [];

        if (newVal.length > 0) {
            x_cpxl_list.value = newVal[0].children || [];
        }
    }, {
        immediate: true,
        deep: true
    });

    onMounted(() => {
    })

    const updateList = (list: any[]) => {
        let listNew: any = [];        
        listNew.push(...list);
        x_cpdl_list.value = listNew;
        x_cpxl_list.value = [];

        if (list.length > 0) {
            x_cpxl_list.value = list[0].children || [];
        }
    }

    const onSelectChange_cpdl = async (value: any) => {

        let listNew: any = [];
        for (let d1 of x_cpdl_list.value) {
            if (d1["value"] == value) {
                for (let d2 of d1.children) {
                    listNew.push(d2);
                }
                break;
            }
        }
        x_cpxl_list.value = listNew;

        x_cpdl_id.value = value;
        x_cpxl_id.value = 0;

        let ret = [x_cpdl_id.value, x_cpxl_id.value];
        emits("update:modelValue", ret);
        // 触发一个事件
        emits("change", ret);
    }
    const onSelectChange_cpxl = async (value: any) => {
        x_cpxl_id.value = value;

        let ret = [x_cpdl_id.value, x_cpxl_id.value];
        emits("update:modelValue", ret);
        // 触发一个事件
        emits("change", ret);
    }

    defineExpose({
        updateList
    })    

</script>

<template>
    <div class="tcplb_select">
        <div class="tcplb_input">
            <el-select v-model="x_cpdl_id"
                @change="onSelectChange_cpdl" 
                placeholder="请选择" style="width:100%" 
                :disabled="disabled">
                <el-option v-for="item in x_cpdl_list"
                    :key="item['value']"
                    :label="item['label']"
                    :value="item['value']">
                </el-option>
            </el-select>
        </div>
        <div class="tcplb_input">
            <el-select v-model="x_cpxl_id" 
                @change="onSelectChange_cpxl" 
                placeholder="请选择" style="width:100%" 
                :disabled="disabled">
                <el-option v-for="item in x_cpxl_list"
                    :key="item['value']"
                    :label="item['label']"
                    :value="item['value']">
                </el-option>
            </el-select>
        </div>
    </div>  
</template>

<style>
.tcplb_select {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    width: 100%;

    .tcplb_input {
        width: 50%;
        box-sizing: border-box;
    }
}
</style>