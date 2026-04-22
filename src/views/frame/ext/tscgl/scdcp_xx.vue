<template>
    <!-- 生产编辑对话框 -->
    <vdialog ref="v_dialog"
        width="600px" title="生产信息"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_form">
            <div class="cell eo_w100">
                <div class="label_n">产品名称<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input v-model="x_data_scdcp['f_cpmc']" style="width:100%"
                        placeholder="请选择产品" :readonly="true">
                        <template #append>
                        </template>
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">批次</div>
                <div class="input">
                    <el-input v-model="x_data_scdcp['f_kcbh']" style="width:100%"
                        maxlength="50"></el-input>
                </div>
            </div>
            
            <div class="cell eo_w100">
                <div class="label_n">数量</div>
                <div class="input">
                    <el-input v-model="x_data_scdcp['f_kcsl']" style="width:100%">
                    </el-input>
                </div>
            </div>

            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input v-model="x_data_scdcp['f_beizhu']" style="width:100%"
                        maxlength="100" placeholder="请输入备注"></el-input>
                </div>
            </div>
        </div>
    </vdialog>
</template>

<script lang="ts" setup>
    import { ref, reactive, computed } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import vdialog from "@/logic/common/vdialog.vue"

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    let x_data_scdcp: any = reactive({});
    /**
     * 显示对话框
     * @param data 数据对象
     * @param fieldArray 可编辑字段
     */
    const showDialog = (data: any) => {

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);
        
        // 创建一个副本并更新响应式数据
        x_data_scdcp = reactive(Object.assign({}, data));
    }

    const onDialogOpen = (data: any) => {
    }

    /**
     * 对话框关闭事件
     */
    const onDialogClose = async (cancel: boolean, data0: any, cb: cfunc_boolean) => {

        if (cancel) {
            cb(true); return;
        }

            
        emits("close", cancel, x_data_scdcp, (result: boolean) => {
            cb(result);
        });
    }

    
    // 暴露方法给父组件
    defineExpose({
        showDialog
    });
</script>

<style lang="scss" scoped>
</style>