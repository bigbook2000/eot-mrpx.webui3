<template>
    <!-- 生产编辑对话框 -->
    <vdialog ref="v_dialog"
        width="600px" title="生产计划"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_form">
            <div class="cell eo_w100">
                <div class="label_n">产品名称<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input v-model="x_data_scd['f_cpmc']" style="width:100%"
                        placeholder="请选择产品" :readonly="true">
                        <template #append>
                            <el-button :icon="More" @click="onInputOpen_cpdy"/>
                        </template>
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">产品编码</div>
                <div class="input">
                    <el-input v-model="x_data_scd['f_cpbm']" style="width:100%"
                        maxlength="50" :disabled="true"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">计划数量</div>
                <div class="input">
                    <el-input-number v-model="x_data_scd['f_jhsl']" style="width:100%"
                        :min="0" :max="99" :precision="0" :step="1" />
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">计划日期</div>
                <div class="input">
                    <el-date-picker style="width:100%"
                        v-model="x_data_scd['f_jhsj']"
                        type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                        placeholder="选择日期">
                    </el-date-picker>
                </div>
            </div>

            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input v-model="x_data_scd['f_beizhu']" style="width:100%"
                        maxlength="100" placeholder="请输入备注"></el-input>
                </div>
            </div>
        </div>
        <cpdy_list ref="v_cpdy_list" @close="onListSelect_cpdy"></cpdy_list>
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

    import cpdy_list from "@/views/frame/ext/kcgl/cpdy_list.vue"
    import TGlobal from "@/logic/TGlobal";

    const v_cpdy_list = ref<InstanceType<typeof cpdy_list>>();
    
    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    let x_data_scd: any = reactive({

    });

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const showDialog = (data: any) => {

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);

        // 创建一个副本并更新响应式数据
        x_data_scd = reactive(Object.assign({}, data));
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

        const data = x_data_scd;
        
        // 检查必填字段
        if (!eocore.check_id(data, "f_cpdy_id")) {
            eocore.show_info("请选择产品");
            cb(false); return;
        }

        const jhsl = data["f_jhsl"];
        if (jhsl <= 0 || jhsl > 100) {
            eocore.show_info("请输入生产数量[1-99]");
            cb(false); return;
        }        

        let dataList = [];
 
        for (let i = 0; i < jhsl; i++) {

            v_dialog.value?.show_loading(true);
            let ret = await eocore.proc(
                "p_sccp_upd", {
                    "v_sccp_id": data["f_sccp_id"],
                    "v_scy_id": data["f_scy_id"],
                    "v_kcmx_id": 0, // 还未生产货物
                    "v_cpdy_id": data["f_cpdy_id"],                
                    "v_jhsj": data["f_jhsj"],
                    "v_jhsl": data["f_jhsl"],
                    "v_dqsl": data["f_dqsl"],
                    "v_wcsj": data["f_wcsj"],
                    "v_yxdj": data["f_yxdj"],
                    "v_yxbz": data["f_yxbz"],
                    "v_beizhu": data["f_beizhu"]
                });
            let dataNew = eocore.check_net_object(ret);
            v_dialog.value?.show_loading(false);

            if (dataNew == undefined) {
                cb(false); return;
            }
            dataList.push(dataNew);
        }
        
        emits("close", cancel, dataList, (result: boolean) => {
            cb(result);
        });
    }

    const onInputOpen_cpdy = () => {
        v_cpdy_list?.value?.show_dialog({});
    }
    const onListSelect_cpdy = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        
        if (cancel) {
            cb(true);
            return;
        }

        x_data_scd['f_cpdy_id'] = data['f_cpdy_id'];
        x_data_scd['f_cpmc'] = data['f_cpmc'];
        x_data_scd['f_cpbm'] = data['f_cpbm'];

        cb(true);
    }
    // 暴露方法给父组件
    defineExpose({
        showDialog
    });
</script>

<style lang="scss" scoped>
</style>