<template>
    <!-- 多角色输入 -->
    <el-select v-model="x_role_data"
        multiple
        placeholder="请选择角色"
        style="width:100%"
        @change="onSelectChange_role">
        <el-option
            v-for="item in x_role_list"
            :key="item['f_role_id']"
            :label="item['f_name']"
            :value="item['f_role_id']" />
    </el-select>
</template>

<script setup lang="ts">

    import { ref, reactive, nextTick, onMounted, watch } from "vue"

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";

     const props = withDefaults(defineProps<{
        modelValue: string
        multiple?: boolean
    }>(), {
        modelValue: "",
        multiple: true
    })

    const emits = defineEmits<{
        (e: 'update:modelValue', value: string): void
        (e: 'change', value: string): void
    }>()

    const x_role_list = ref<any[]>([])
    const x_role_data = ref<any[]>([])

    let m_role_str: string = "";

    watch(() => props.modelValue, (newVal, oldVal) => {

        //console.log("watch", newVal, oldVal) 
        if (newVal != undefined) {
            m_role_str = newVal;
        } else {
            m_role_str = "";
        }

        let roleList: number[] = m_role_str.split(",").map((item: string) => {
            let d = eocore.to_int(item);
            if (d > 0) return d;
            return NaN;
        }).filter((item: number) => !isNaN(item));
        x_role_data.value = roleList;

    }, {
        immediate: true,
        deep: false
    });
    onMounted(async () => {
        let ret: any = await eocore.post("/framework/role/list", [{}]);
        let list = eocore.check_net_array(ret);
        if (list != undefined) x_role_list.value = list;

        let roleList = x_role_data.value;
        //console.log("onMounted", x_role_list.value, roleList);
        x_role_data.value = [...roleList]; // Deep copy
    });

    const onSelectChange_role = (value: any) => {
        //console.log("onSelectChange_role", value);

        let roleIds = value.join(",");

        emits('update:modelValue', roleIds);
        emits('change', roleIds);
    }

    defineExpose({
    })

</script>

<style lang="scss">
</style>