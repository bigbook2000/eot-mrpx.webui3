<template>
    <!-- 用户选择输入框 -->
    <div style="width:100%">
        <el-input v-model="x_user_id_s" style="width:100%" readonly
            @click="onInputClick_user" 
            clearable
            @clear="">
            <template #append>
                <el-button :icon="Close" @click="onClearInput" />
            </template>
        </el-input>
        <user_list ref="v_user_list" @close="onDialogClose_userlist"/>
    </div>
</template>

<script setup lang="ts">

    import { ref, watch, reactive, onMounted } from "vue"
    import { Close } from '@element-plus/icons-vue'
    import eocore from "@/inc/eocore";

    import type {cfunc_boolean} from "@/inc/eotypes";

    import user_list from "@/views/platform/user_list.vue"
    const v_user_list = ref<InstanceType<typeof user_list>>();

    const props = defineProps<{
        modelValue: number,
        /** 单向输入 */
        userName: string
    }>();

    const emits = defineEmits<{
        (e: 'update:modelValue', value: number|string): void
    }>()

    var x_user_id_s = ref("");

    watch(() => props.userName, (newVal, oldVal) => {

        //console.log(x_dept_id_s);
        x_user_id_s.value = newVal;
    }, {
        immediate: true,
        deep: false
    });

    onMounted(() => {
    });

    const onInputClick_user = (event: FocusEvent) => {
        //console.log(event);
        v_user_list.value!.show_dialog(undefined);
    }

    const onDialogClose_userlist = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        if (eocore.check_id(data, "f_user_id")) {
            // 选择用户信息
            x_user_id_s.value = data["f_name"];
            emits("update:modelValue", data["f_user_id"]);
        }

        cb(true);
    }

    const onClearInput = () => {
        x_user_id_s.value = "";
        emits("update:modelValue", -1);
    }
</script>

<style lang="scss">
</style>