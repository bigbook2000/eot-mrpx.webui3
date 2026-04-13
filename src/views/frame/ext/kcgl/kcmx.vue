<template>
    <!-- 库存明细对话框 -->
    <vdialog ref="v_dialog"
        width="800px" title="库存明细"
        @open="onDialogOpen"
        @close="onDialogClose">        
        <el-tabs v-model="x_active_tab"
            type="card"
            class="demo-tabs">
            <el-tab-pane label="库存信息" name="cpxx">
                <div style="padding:10px;height:300px;">
                    <kcmx_xx ref="v_kcmx_xx"/>
                </div>
            </el-tab-pane>
            <el-tab-pane label="调拨历史" name="jygl">
                <div style="padding:10px;height:300px;">
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
    import vdialog from "@/logic/common/vdialog.vue"
    import vdic from "@/logic/common/vdic.vue"

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

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const showDialog = (data: any) => {

        // 先打开对话框
        v_dialog.value?.show_dialog(data);
        // 创建一个副本并更新响应式数据
        Object.assign(x_data_kcmx, data);

        x_active_tab.value = "cpxx";
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

        const data = v_kcmx_xx.value?.getData();

        // 检查必填字段
        if (!eocore.check_id(data, "f_cpdy_id")) {
            eocore.show_info("请选择产品");
            cb(false); return;
        }

        const kcsl = eocore.to_int(data["f_kcsl"]);
        if (kcsl <= 0) {
            eocore.show_info("请输入单件数量");
            cb(false); return;
        }

        let dataNew = x_data_kcmx;
        let dataListNew: any[] = [];
        const isAdd = !eocore.check_id(data, "f_kcmx_id");
        data["_is_add"] = isAdd;

        // 扩展字段，批量添加
        let rksl = eocore.to_int(data["rksl"]);
        if (rksl <= 0) rksl = 1;
        if (rksl > 99) {
            eocore.show_info("单次入库数量不能超过100");
            cb(false); return;
        }

        const dts = eolib.datetime_2_string(new Date(), true);

        if (isAdd) { 

            const kgyId = TGlobal.userData["f_user_id"];

            for (let i=0; i<rksl; i++) {
                
                data["f_kcbh"] = await TLogic.netLoad_RecordString_kcbh(
                    data["f_cpdy_id"], data["f_cpbm"]);
		        dataNew = await TLogic.netLoad_kcmx_upd(
                    0,
                    data["f_cpdy_id"],
                    data["f_kcbh"],
                    data["f_rklb"],
                    data["f_rkid"],
                    dts,
                    "",
                    0,
                    "1970-01-01 00:00:00",
                    data["f_hwck"],
                    dts,
                    data["f_kcdj"],
                    data["f_kcsl"],
                    data["f_kcbz"],
                    kgyId,
                    data["f_jyzt"],
                    data["f_jyyg_id"],
                    data["f_beizhu"]
                );

                dataListNew.push(dataNew);
            }

        } else {

            // 回写数据库
            dataNew = await TLogic.netLoad_kcmx_upd(
                data["f_kcmx_id"],
                data["f_cpdy_id"],
                data["f_kcbh"],
                data["f_rklb"],
                data["f_rkid"],
                data["f_rksj"],
                data["f_cklb"],
                data["f_ckid"],
                data["f_cksj"],
                data["f_hwck"],
                dts,
                data["f_kcdj"],
                data["f_kcsl"],
                data["f_kcbz"],
                data["f_kgy_id"],
                data["f_jyzt"],
                data["f_jyyg_id"],
                data["f_beizhu"]
            );
            if (dataNew == undefined) return;

            dataListNew.push(dataNew);
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