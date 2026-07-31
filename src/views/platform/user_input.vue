<template>
    <!-- 用户选择输入框 -->
    <div style="width:100%">
        <el-input v-model="x_user_id_s" style="width:100%" readonly
            @click="onInputClick_user" 
            clearable
            @clear="">
            <template #append>
                <el-button :icon="Close" @click="onClearInput" v-if="!disabled" />
            </template>
        </el-input>
        <user_list v-if="!props.app" ref="v_user_list" @close="onDialogClose" />
        <user_app v-else ref="v_user_app" @close="onDialogClose" />
    </div>
</template>

<script setup lang="ts">

    import { ref, watch, reactive, onMounted } from "vue"
    import { Close } from '@element-plus/icons-vue'
    import eocore from "@/inc/eocore";

    import type {cfunc_boolean} from "@/inc/eotypes";

    import user_list from "@/views/platform/user_list.vue"
    import user_app from "@/views/platform/user_app.vue"
    const v_user_list = ref<InstanceType<typeof user_list>>();
    const v_user_app = ref<InstanceType<typeof user_app>>();

    const props = withDefaults(defineProps<{
        modelValue: number,
        /** 单向输入 */
        userName: string,
        app?: boolean,
        disabled?: boolean,
    }>(), {
        app: false,
        disabled: false
    });

    const emits = defineEmits<{
        (e: 'update:modelValue', value: number|string): void
    }>()

    var x_user_id_s = ref("");

    watch(() => props.userName, (newVal, oldVal) => {

        //console.log("watch userName", x_user_id_s.value, newVal, oldVal);
        x_user_id_s.value = newVal;
    }, {
        immediate: true,
        deep: true
    });

    watch(() => props.modelValue, (newVal, oldVal) => {
        //console.log("watch modelValue", x_user_id_s.value, newVal, oldVal);
        if (newVal <= 0) {
            x_user_id_s.value = "";
        }
    }, {
        immediate: true,
        deep: true
    });

    onMounted(() => {
        //console.log("onMounted", x_user_id_s.value);
    });

    const onInputClick_user = (event: FocusEvent) => {
        if (props.app) {
            v_user_app.value!.show_dialog(undefined);
        } else {
            v_user_list.value!.show_dialog(undefined);
        }
    }

    const onDialogClose = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        if (eocore.check_id(data, "f_user_id")) {
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