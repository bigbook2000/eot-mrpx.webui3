<template>
    <!-- 借用编辑对话框 -->
    <vdialog ref="v_dialog"
        width="600px" title="调拨变更" 
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_form">
            <!--
            <div class="cell eo_w100">
                <div class="label_n">批次</div>
                <div class="input">
                    <el-input v-model="x_data_jyxx['f_kcbh']" style="width:100%" disabled>
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">产品名称</div>
                <div class="input">
                    <el-input v-model="x_data_jyxx['f_cpmc']" style="width:100%" disabled>                        
                    </el-input>
                </div>
            </div>
            -->
            <div class="cell eo_w2">
                <div class="label_n">调拨员工</div>
                <div class="input">
                    <user_input v-model="x_data_jyxx['f_jyyg_id']" 
                        :userName="x_data_jyxx['f_jyyg_id_s']" 
                        style="width:100%"></user_input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">调拨状态</div>
                <div class="input">
                    <vdic style="width:100%" dic="调拨状态" :all="false" field="value"
                        v-model="x_data_jyxx['f_jyzt']" />
                </div>
            </div>
            
            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input v-model="x_data_jyxx['f_beizhu']" style="width:100%"
                        maxlength="200" placeholder="请输入备注"></el-input>
                </div>
            </div>
        </div>
       
    </vdialog>
</template>

<script lang="ts" setup>
    import { ref, reactive } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import vdialog from "@/logic/common/vdialog.vue"
    import vdic from "@/logic/common/vdic.vue"
    import vtable from "@/logic/common/vtable.vue"

    import TLogic from "@/logic/TLogic";

    import user_input from "@/views/platform/user_input.vue"

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();


    // 表单数据
    const x_data_jyxx: any = ref({
        "f_kcbh": "",
        "f_cpmc": "",
        "f_kcmx_id": 0,
        "f_cpdy_id": 0,
        "f_jyyg_id": 0,
        "f_jyyg_id_s": "",        
        "f_jyzt": 0,
        "f_kgy_id": 0,
        "f_beizhu": ""
    });
    let m_kcmx_list: any[] = [];

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const showDialog = (kcmxList: any[], jyxxData: any) => {

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);

        x_data_jyxx.value = {
            "f_kcbh": "",
            "f_cpmc": "",
            "f_kcmx_id": 0,
            "f_cpdy_id": 0,
            "f_jyyg_id": 0,
            "f_jyyg_id_s": "",
            "f_jyzt": 0,
            "f_kgy_id": 0,
            "f_beizhu": ""
        };

        // 创建一个副本并更新响应式数据
        // if (jyxxData != undefined) {
        //     Object.assign(x_data_jyxx, jyxxData);
        // }

        //console.log(x_data_jyxx);
        m_kcmx_list = kcmxList;
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
        
        const data = x_data_jyxx.value;

        const jyzt = data["f_jyzt"];
        const jyyg_id = data["f_jyyg_id"];

        if (jyzt == 0) {
            data["f_jyyg_id"] = 0;
        } else {
            if (jyyg_id == 0) {
                eocore.show_error("请选择调拨员工");
                cb(false); return;            
            }
        }

        // if (m_data_kcmx["f_jyzt"] == data["f_jyzt"] && m_data_kcmx["f_yg_id"] == data["f_yg_id"]) {
        //         eocore.show_error("未进行任何变更");
        //         cb(false); return;
        // }

        let dataList: any[] = [];

        for (let d of m_kcmx_list) {

            let ret = await eocore.proc(
                "p_kcjy_upd", {
                    "v_kcmx_id": d["f_kcmx_id"],
                    "v_cpdy_id": d["f_cpdy_id"],
                    "v_jyyg_id": data["f_jyyg_id"],
                    "v_jyzt": data["f_jyzt"],
                    "v_kgy_id": data["f_kgy_id"],
                    "v_beizhu": data["f_beizhu"] 
                });
            let dataNew = eocore.check_net_object(ret);
            if (dataNew == undefined) {
                cb(false); return;
            }

            dataList.push(dataNew);
        }

        emits("close", cancel, dataList, (result: boolean) => {
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