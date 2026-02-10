<template>
    <!-- 借用编辑对话框 -->
    <vdialog ref="v_dialog"
        width="800px" title="占用记录" 
        @open="onDialogOpen"
        @close="onDialogClose">
        <div>
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w280p">
                        <div class="label_n">批次<span style="color:red;">*</span></div>
                        <div class="input">
                            <el-input v-model="x_data_kcmx['f_kcbh']" style="width:100%" disabled>
                            </el-input>
                        </div>
                    </div>
                    <div class="cell eo_w280p">
                        <div class="label_n">产品名称</div>
                        <div class="input">
                            <el-input v-model="x_data_kcmx['f_cpmc']" style="width:100%" disabled>                        
                            </el-input>
                        </div>
                    </div>
                </div> 
            </div>
            <div style="height:300px;">
                <vtable ref="v_table_kcjy" 
                    name="占用记录"
                    id-field="f_kcmx_id"
                    @loading="onTableLoading"
                    :on-item="onTableItem_kcjy">                            
                    <el-table-column prop="f_jyzt_s" label="占用状态" width="90" />
                    <el-table-column prop="f_jysj_s" label="占用时间" width="160" />
                    <el-table-column prop="f_yg_id_s" label="占用员工" width="120" />                    
                    <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                    <el-table-column prop="f_kgy_id_s" label="库管员" width="120" />
                    <el-table-column />
                </vtable>
            </div>
        </div>
    </vdialog>
</template>

<script lang="ts" setup>
    import { ref, reactive } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";
    import eodic from "@/inc/eodic";

    import vdialog from "@/logic/common/vdialog.vue"
    import vdic from "@/logic/common/vdic.vue"
    import vtable from "@/logic/common/vtable.vue"

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import kcjy_xx from "./kcjy_xx.vue"

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    type t_kcjy_xx = InstanceType<typeof kcjy_xx>;
    const v_kcjy_xx = ref<t_kcjy_xx>();  

    type t_table = InstanceType<typeof vtable>;
    const v_table_kcjy = ref<t_table>();

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    const x_data_kcmx: any = reactive({});

    // 用户信息字典
    let m_user_dic: any = {};

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const showDialog = async (kcmxData: any) => {

        // 所有账号信息
        m_user_dic = await TLogic.netLoad_UserDic();

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);

        // 创建一个副本并更新响应式数据
        Object.assign(x_data_kcmx, kcmxData);
    }

    const onDialogOpen = (data: any) => {
        v_table_kcjy.value?.load_list_proc("p_kcjym_list", {
            v_kcmxrk_id: x_data_kcmx["f_kcmxrk_id"]
        })
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

    const onTableLoading = (show: boolean) => {
    }
    const onTableItem_kcjy = (data: any) => {

        // 占用状态
        data["f_jyzt_s"] = eodic.get_dic_label("占用状态", data["f_jyzt"]);

        // 日期格式化
        data["f_jysj_s"] = eolib.datetime_2_short(data["f_jysj"]);

        // 用户转换
        TLogic.updateDicUserData(data, m_user_dic, ["f_yg_id", "f_kgy_id"]);
    }

    const onButtonClick_Upd_kcjy = () => {

        const kcmxData = x_data_kcmx;

        let dt = new Date();
        let dts = eolib.datetime_2_string(dt);

        let jyxxData = {
            f_kcjy_id: 0, // 库存借用ID
            f_kcmxrk_id: kcmxData["f_kcmxrk_id"], // 库存明细ID
            f_kcbh: kcmxData["f_kcbh"], // 库存编号
            f_cpmc: kcmxData["f_cpmc"], // 产品名称
            f_cpdy_id: kcmxData["f_cpdy_id"], // 产品ID
            f_yg_id: 0, // 员工ID
            f_yg_id_s: "", // 员工姓名
            f_kgy_id: TGlobal.userData["f_user_id"], // 库管员ID
            f_kgy_id_s: TGlobal.userData["f_name"], // 库管员姓名
            f_jysj: dts, // 借用时间
            f_jysj_s: dts, // 借用时间
            f_ghsj: "1970-01-01 00:00:00", // 归还时间
            f_ghsj_s: "1970-01-01 00:00:00", // 归还时间
            f_jyzt: 0, // 占用状态
            f_beizhu: "" // 备注
        };

        v_kcjy_xx.value?.showDialog(kcmxData, jyxxData);
    }


    /**
     * 货物占用
     */
    const onDialogClose_kcjy_xx = async (cancel: boolean, data0: any, cb: cfunc_boolean) => {
        if (cancel) { 
            cb(true); return;
        }

        v_table_kcjy.value?.update_data(data0, -1, true, true);

        x_data_kcmx["f_jyzt"] = data0["f_jyzt"];
        x_data_kcmx["f_jyyg_id"] = data0["f_yg_id"];
        x_data_kcmx["f_jyyg_id_s"] = data0["f_yg_id_s"];

        cb(true);
    }

    // 暴露方法给父组件使用
    defineExpose({
        showDialog
    });
</script>

<style lang="scss" scoped>
</style>