<template>
    <!-- 拆库编辑对话框 -->
    <vdialog ref="v_dialog"
        width="800px" title="拆库编辑"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_form">
            <div class="cell eo_w2">
                <div class="label_n">批次</div>
                <div class="input">
                    <el-input v-model="x_data_kcmx['f_kcbh']" style="width:100%" 
                        :readonly="true">
                    </el-input>
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">产品名称</div>
                <div class="input">
                    <el-input v-model="x_data_kcmx['f_cpmc']" style="width:100%" 
                        placeholder="请选择产品" readonly>
                        <template #append>
                        </template>
                    </el-input>
                </div>
            </div>
            
            <div class="cell eo_w2">
                <div class="label_n">原有数量</div>
                <div class="input">
                    <el-input-number v-model="x_data_kcmx['f_kcsl']" style="width:100%"
                        :min="0" :max="999999" :step="1" :disabled="true" />
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">分出数量</div>
                <div class="input">
                    <el-input-number v-model="x_data_kcmx['f_kcsl2']" style="width:100%"
                        :min="0" :max="999999" :step="1" />
                </div>
            </div>

            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input v-model="x_data_kcmx['f_beizhu']" style="width:100%"
                        maxlength="200" placeholder="请输入备注"></el-input>
                </div>
            </div>
        </div>
    </vdialog>

</template>

<script lang="ts" setup>

    import { ref, reactive } from "vue"
    import { Search } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import vdialog from "@/logic/common/vdialog.vue"
    import vdic from "@/logic/common/vdic.vue"

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    const x_data_kcmx: any = reactive({});

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const showDialog = (data: any) => {
        // 先打开对话框
        v_dialog.value?.show_dialog(data);

        // 创建一个副本并更新响应式数据
        Object.assign(x_data_kcmx, data);
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

        emits("close", cancel, x_data_kcmx, (result: boolean) => {
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