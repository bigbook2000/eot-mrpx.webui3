<template>
    <!-- 采购入库产品明细编辑对话框 -->
    <vdialog ref="v_dialog"
        width="1000px" title="产品明细"
        @open="onDialogOpen"
        @close="onDialogClose">
        <kcmx_xx ref="v_kcmx_xx" />
    </vdialog>
</template>

<script lang="ts" setup>
    import { ref, reactive } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import vdialog from "@/components/web/vdialog.vue"
    import vdic from "@/components/web/vdic.vue"

    import TLogic from "@/logic/TLogic";

    import kcmx_xx from "@/views/web/ext/tkcgl/kcmx_xx.vue"

    const v_kcmx_xx = ref<InstanceType<typeof kcmx_xx>>();

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    const x_data_kcmx: any = reactive({});
    const x_edit_fields = ref<any>({
        "f_cpmc": false,
        "f_wlgs_id_s": false,
        "f_wldh": false,
        "f_cpsl": false,
        "f_cpdj": false,
        "f_cpzj": false,
        "f_beizhu": false,
    });

    /**
     * 显示对话框
     * @param data 数据对象
     * @param editFields 可编辑字段，如果带*显示所有字段
     */
    const showDialog = (data: any, fieldArray: string[]) => {

        x_edit_fields.value = TLogic.checkEditFields(x_edit_fields.value, fieldArray);

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);

        // 创建一个副本并更新响应式数据
        Object.assign(x_data_kcmx, data);
    }

    const onDialogOpen = (data: any) => {
        v_kcmx_xx.value?.loadData(x_data_kcmx);
    }
    /**
     * 对话框关闭事件
     */
    const onDialogClose = async (cancel: boolean, data0: any, cb: cfunc_boolean) => {

        if (cancel) {
            cb(true); return;
        }

        const data = v_kcmx_xx.value?.getData();
        emits("close", cancel, data, (result: boolean) => {
            cb(result);
        });
    }

    // 暴露方法给父组件使用
    defineExpose({
        showDialog
    });
</script>

<style lang="scss" scoped>
</style>