<template>
    <!-- 库存明细对话框 -->
    <vdialog ref="v_dialog"
        width="800px" title="库存明细"
        @open="onDialogOpen"
        @close="onDialogClose">        
        <el-tabs v-model="x_active_tab"
            type="card">
            <el-tab-pane label="库存信息" name="cpxx">
                <div style="padding:10px;height:350px;">
                    <kcmx_xx ref="v_kcmx_xx"/>
                </div>
            </el-tab-pane>
            <el-tab-pane label="调拨历史" name="jygl" v-if="!x_edit_mode">
                <div style="padding:10px;height:350px;">
                    <kcjy_list ref="v_kcjy_list"/>
                </div>
            </el-tab-pane>
        </el-tabs>
    </vdialog>
</template>

<script lang="ts" setup>

    import { ref, reactive } from "vue"
    import { Search } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";
    import vdialog from "@/components/web/vdialog.vue"
    import vdic from "@/components/web/vdic.vue"

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import kcmx_xx from "./kcmx_xx.vue"
    import kcjy_list from "./kcjy_list.vue"

    const v_kcmx_xx = ref<InstanceType<typeof kcmx_xx>>();
    const v_kcjy_list = ref<InstanceType<typeof kcjy_list>>();

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();
    

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    const x_active_tab = ref("cpxx");
    // 表单数据
    const x_data_kcmx: any = reactive({});
    const x_edit_mode = ref(false);


    /**
     * 显示对话框
     * @param data 数据对象
     */
    const showDialog = (data: any, editMode: boolean = true) => {

        // 先打开对话框
        v_dialog.value?.show_dialog(data);
        // 创建一个副本并更新响应式数据
        Object.assign(x_data_kcmx, data);

        x_active_tab.value = "cpxx";
        x_edit_mode.value = editMode;
    }
  
    const onDialogOpen = (data: any) => {

        v_kcmx_xx.value?.loadData(x_data_kcmx);
        v_kcjy_list.value?.loadData(x_data_kcmx);
    }
    
    /**
     * 对话框关闭事件
     */
    const onDialogClose = async (cancel: boolean, data0: any, cb: cfunc_boolean) => {

        if (cancel) {
            cb(true); return;
        }
        if (!x_edit_mode.value) {
            cb(true); return;
        }

        if (v_kcmx_xx.value?.isNoChanged()) {
            cb(true); return;
        }

        const dataListNew = await v_kcmx_xx.value?.updateDataProc();
        if (dataListNew == undefined) {
            cb(false); return;
        }

        emits("close", cancel, dataListNew, (result: boolean) => {
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