<template>
    <!-- 采购产品明细入库对话框 -->
    <vdialog ref="v_dialog"
        width="1000px" title="产品入库"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_form">
            <div class="cell eo_w2">
                <div class="label_n">单号</div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_rkdh']" style="width:100%" :readonly="true">
                    </el-input>
                </div>
            </div>            
            <div class="cell eo_w2">
                <div class="label_n">产品名称<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_cpmc']" style="width:100%" :readonly="true">
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">产品编码</div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_cpbm']" style="width:100%" :readonly="true">                        
                    </el-input>
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">数量<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input-number v-model="x_data_rkcpmx['f_cpsl']" :precision="2" :min="0" 
                        placeholder="" style="width: 100%" 
                        :readonly="true" />
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">物流公司</div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_wlgs_id_s']" style="width:100%"
                        placeholder="" :readonly="true">
                    </el-input>
                </div>
            </div>            
            <div class="cell eo_w2">
                <div class="label_n">单价<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input-number v-model="x_data_rkcpmx['f_cpdj']" :precision="2" :min="0" 
                        placeholder="" style="width: 100%" 
                        :readonly="true"/>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">物流单号</div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_wldh']" style="width:100%"
                        :readonly="true" placeholder=""></el-input>
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">总价</div>
                <div class="input">
                    <el-input-number v-model="x_data_rkcpmx['f_cpzj']" :precision="2" :min="0" 
                        placeholder="" style="width: 100%" 
                        :readonly="true" />
                </div>
            </div>

            <div class="cell eo_w4">
                <div class="label_n">仓库</div>
                <div class="input">
                    <vdic style="width:100%" dic="产品仓库" :all="false" field="value"
                        v-model="x_data_rkcpmx['f_hwck']" />
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">入库时间</div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_rksj_s']" style="width:100%"
                        maxlength="200" :readonly="true"></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">入库状态</div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_rkzt_s']" style="width:100%"
                        maxlength="200" :readonly="true"></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">库管员</div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_kgy_id_s']" style="width:100%"
                        maxlength="200" :readonly="true"></el-input>
                </div>
            </div>
            
            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_beizhu']" style="width:100%"
                        maxlength="200" placeholder="请输入备注"
                        :readonly="true"></el-input>
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
import eodic from "@/inc/eodic";
import TLogic from "@/logic/TLogic";
import TGlobal from "@/logic/TGlobal";

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    const x_data_rkcpmx: any = reactive({});

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const showDialog = (data: any) => {

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);

        // 创建一个副本并更新响应式数据
        Object.assign(x_data_rkcpmx, data);
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

        const data = x_data_rkcpmx;
        const kgyId = TGlobal.userData["f_user_id"]; // 当前操作员

        let kcbh = await TLogic.netLoad_RecordString(
            "库存明细",
            TLogic.codeTypes["库存明细"],
            "yyMMdd", 
            5);
        const cpbm = data["f_cpbm"];
        kcbh = kcbh + cpbm.substring(cpbm.length - 7);

        // 入库
        let ret = await eocore.proc("p_kcmx_upd", {
            "v_kcbh": kcbh, // 库存编号
            "v_rkcpmx_id": data["f_rkcpmx_id"],
            "v_cpdy_id": data["f_cpdy_id"],
            "v_jyzt": 0,
            "v_hwck": data["f_hwck"],
            "v_cpdj": data["f_cpdj"],
            "v_cpsl": data["f_cpsl"],
            "v_yxbz": 1,
            "v_kgy_id": kgyId,
            "v_beizhu": data["f_beizhu"],
            "v_bgy_id": TGlobal.userData["f_user_id"],
            "v_bglb": TLogic.codeTypes["采购入库"]
        });
        let rkmxData = eocore.check_net_object(ret);
        if (rkmxData == undefined) {
            cb(false); return;
        }

        // 更新产品信息
        ret = await eocore.proc(
            "p_rkcpmx_upd", {
                "v_rkcpmx_id": data["f_rkcpmx_id"],
                "v_cpdy_id": data["f_cpdy_id"],
                "v_rklb": data["f_rklb"],
                "v_rkd_id": data["f_rkd_id"],
                "v_kcmx_id": rkmxData["f_kcmx_id"],
                "v_kgy_id": kgyId, // 当前操作员
                "v_cpsl": data["f_cpsl"],
                "v_cpdj": data["f_cpdj"],
                "v_cpzj": data["f_cpzj"],
                "v_wlgs_id": data["f_wlgs_id"],
                "v_wldh": data["f_wldh"],
                "v_hwck": data["f_hwck"],
                "v_rksj": rkmxData["f_rksj"],
                "v_rkzt": 1,
                "v_beizhu": data["f_beizhu"]
            });
        let dataNew = eocore.check_net_object(ret);
        if (dataNew == undefined) {
            cb(false); return;
        }        
        dataNew["_is_add"] = false;

        emits("close", cancel, dataNew, (result: boolean) => {
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