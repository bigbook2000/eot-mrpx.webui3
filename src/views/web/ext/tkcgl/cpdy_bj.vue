<template>
    <!-- 产品部件编辑对话框 -->
    <vdialog ref="v_dialog"
        width="500px" title="产品部件"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_form">
            <div class="cell eo_w100">
                <div class="label_n">产品编码</div>
                <div class="input">
                    <el-input v-model="x_data_bj['f_cpbm_p']" style="width:100%"
                        maxlength="50" disabled></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">产品名称</div>
                <div class="input">
                    <el-input v-model="x_data_bj['f_cpmc_p']" style="width:100%"
                        maxlength="50" disabled></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">部件编码</div>
                <div class="input">
                    <el-input v-model="x_data_bj['f_cpbm']" style="width:100%"
                        maxlength="50" disabled></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">部件名称<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input v-model="x_data_bj['f_cpmc']" style="width:100%"
                        placeholder="请选择产品" :readonly="true">
                        <template #append>
                            <el-button :icon="More"
                                @click="onInputOpen_cpdy"/>
                        </template>
                    </el-input>
                </div>
            </div>            
            
            <div class="cell eo_w100">
                <div class="label_n">部件数量<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input-number v-model="x_data_bj['f_bjsl']" :precision="2" :min="0" 
                        placeholder="" style="width:100%" />
                </div>
            </div>
        </div>
        <cpdy_list ref="v_cpdy_list" @close="onListSelect_cpdy"></cpdy_list>
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

    import cpdy_list from "@/views/web/ext/tkcgl/cpdy_list.vue"

    const v_cpdy_list = ref<InstanceType<typeof cpdy_list>>();

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    const x_data_bj: any = reactive({});

    /**
     * 显示对话框
     * @param data 数据对象
     * @param editFields 可编辑字段，如果带*显示所有字段
     */
    const showDialog = (data: any, fieldArray: string[]) => {

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);

        // 创建一个副本并更新响应式数据
        Object.assign(x_data_bj, data);
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
        
        const data = x_data_bj;
        if (!eocore.check_id(data, "f_cpdy_pid")) {
            eocore.show_error("无对应的产品工艺");
            cb(false); return;            
        }

        if (!eocore.check_id(data, "f_cpdy_id")) {
            eocore.show_error("请选择产品部件");
            cb(false); return;            
        }

        let ret = await eocore.proc(
            "p_cpbj_upd", {
                "v_cpbj_id": data["f_cpbj_id"],
                "v_cpdy_id": data["f_cpdy_id"],
                "v_cpdy_pid": data["f_cpdy_pid"],
                "v_bjsl": data["f_bjsl"],
                "v_beizhu": data["f_beizhu"],
            });
        let dataNew = eocore.check_net_object(ret);
        if (dataNew == undefined) {
            cb(false); return;
        }

        dataNew["_is_add"] = (data["f_cpbj_id"] == 0);

        emits("close", cancel, dataNew, (result: boolean) => {
            cb(result);
        });
    }

    const onInputOpen_cpdy = () => {
        v_cpdy_list?.value?.show_dialog({});
    }
    const onListSelect_cpdy = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        
        if (cancel) {
            cb(true); return;
        }

        x_data_bj['f_cpdy_id'] = data['f_cpdy_id'];
        x_data_bj['f_cpmc'] = data['f_cpmc'];
        x_data_bj['f_cpbm'] = data['f_cpbm'];

        cb(true);
    }

    // 暴露方法给父组件使用
    defineExpose({
        showDialog
    });
</script>

<style lang="scss" scoped>
</style>