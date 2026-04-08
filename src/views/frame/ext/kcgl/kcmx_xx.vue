<template>
    <!-- 库存明细编辑对话框 -->
    <vdialog ref="v_dialog"
        width="1000px" title="库存明细"
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
            <div class="cell eo_w4">
                <div class="label_n">仓库</div>
                <div class="input">
                    <vdic style="width:100%" dic="产品仓库" :all="false" field="value"
                        v-model="x_data_kcmx['f_hwck']" />
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">调拨状态</div>
                <div class="input">
                    <vdic style="width:100%" dic="调拨状态" :all="false" field="value"
                        v-model="x_data_kcmx['f_jyzt']" :disabled="true" />
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">产品编码</div>
                <div class="input">
                    <el-input v-model="x_data_kcmx['f_cpbm']" style="width:100%" 
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
                            <el-button @click="onSelectProduct" v-show="!x_edit_upd">
                                <el-icon><Search /></el-icon>
                            </el-button>
                        </template>
                    </el-input>
                </div>
            </div>

            
            <div class="cell eo_w2">
                <div class="label_n">入库时间</div>
                <div class="input">
                    <el-input v-model="x_data_kcmx['f_rksj_s']" style="width:100%" 
                        :disabled="true"></el-input>
                </div>
            </div>

            <div class="cell eo_w4">
                <div class="label_n">包装数量</div>
                <div class="input">
                    <el-input-number v-model="x_data_kcmx['f_kcsl']" style="width:100%"
                        :min="0" :max="999999" :step="1" />
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">成本单价</div>
                <div class="input">
                    <el-input-number v-model="x_data_kcmx['f_kcdj']" style="width:100%"
                        :min="0" :max="999999" :precision="3" :step="1" />
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">出库时间</div>
                <div class="input">
                    <el-input v-model="x_data_kcmx['f_pksj_s']" style="width:100%" 
                        :disabled="true"></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">入库数量<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input-number v-model="x_rksl" style="width:100%"
                        :min="1" :max="99" :precision="0" :step="1" :disabled="x_edit_upd" />
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">库管员</div>
                <div class="input">
                    <el-input v-model="x_data_kcmx['f_kgy_id_s']" style="width:100%" 
                        :disabled="true"></el-input>
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">盘库时间</div>
                <div class="input">
                    <el-input v-model="x_data_kcmx['f_pksj_s']" style="width:100%" 
                        :disabled="true"></el-input>
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
        <template #button>
            <div class="button">
                <el-button type="primary" class="eo_w100" @click="onButtonClick_kcjy">调拨</el-button>
            </div>
        </template>
    </vdialog>
    
    <!-- 产品选择对话框 -->
    <cpdy_list ref="v_cpdy_list" @close="onDialogClose_cpdy_list" />
    <!-- 借用单编辑对话框 -->
    <kcjy_list ref="v_kcjy_list" @close="onDialogClose_kcjy_list"/>

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

    import kcjy_list from "./kcjy_list.vue"
    import cpdy_list from "@/views/frame/ext/kcgl/cpdy_list.vue"

    const v_cpdy_list = ref<InstanceType<typeof cpdy_list>>();

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    type t_kcjy_list = InstanceType<typeof kcjy_list>;
    const v_kcjy_list = ref<t_kcjy_list>();        

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    const x_data_kcmx: any = reactive({});

    // 是否新增
    const x_edit_upd = ref(false);

    const x_rksl = ref(1);

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const showDialog = (data: any) => {
        // 先打开对话框
        v_dialog.value?.show_dialog(data);

        x_edit_upd.value = eocore.check_id(data, "f_kcmx_id");

        // 创建一个副本并更新响应式数据
        Object.assign(x_data_kcmx, data);

        x_rksl.value = 1;
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

        const data = x_data_kcmx;

        // 检查必填字段
        if (!eocore.check_id(data, "f_cpdy_id")) {
            eocore.show_info("请选择产品");
            cb(false); return;
        }

        const kcsl = eocore.to_int(data["f_kcsl"]);
        if (kcsl <= 0) {
            eocore.show_info("请输入包装数量");
            cb(false); return;
        }

        let dataNew = x_data_kcmx;
        let dataListNew: any[] = [];
        const isAdd = !eocore.check_id(data, "f_kcmx_id");
        data["_is_add"] = isAdd;

        let rksl = x_rksl.value;
        if (rksl <= 0) rksl = 1;
        if (rksl > 99) {
            eocore.show_info("单次入库数量不能超过100");
            cb(false); return;
        }

        const dts = eolib.datetime_2_string(new Date(), true);

        let ret;
        if (isAdd) { 

            const kgyId = TGlobal.userData["f_user_id"];
            const rklb = TLogic.codeTypes["盘库整理"];

            for (let i=0; i<rksl; i++) {
                
                data["f_kcmx_id"] = 0;
                data["f_kcbh"] = await TLogic.netLoad_RecordString_kcbh(data["f_cpdy_id"], data["f_cpbm"]);
                data["f_rklb"] = rklb;
                data["f_rksj"] = dts;
                data["f_pksj"] = dts;
                data["f_cklb"] = "";
                data["v_cksj"] = "1970-01-01 00:00:00";
                data["f_kgy_id"] = kgyId;
		        dataNew = await TLogic.netLoad_kcmx_upd(data);

                dataListNew.push(dataNew);
            }

        } else {

            // 回写数据库
            data["f_pksj"] = dts;
            dataNew = await TLogic.netLoad_kcmx_upd(data);
            if (dataNew == undefined) return;

            dataListNew.push(dataNew);
        }

        emits("close", cancel, dataListNew, (result: boolean) => {
            cb(result);
        });
    }

    /**
     * 选择产品
     */
    const onSelectProduct = () => {
        v_cpdy_list.value?.show_dialog({});
    }

    /**
     * 产品选择回调
     */
    const onDialogClose_cpdy_list = (cancel: boolean, data0: any, cb: cfunc_boolean) => {
        
        if (cancel) {
            cb(true); return;
        }

        // 先取实际成本价，如果无则取定价
        let kcdj = eocore.to_float(data0["f_kcdj_s"]);
        if (kcdj <= 0.0) {
            kcdj = data0["f_cpjg"];
        }

        // 散装的产品打包入库，每包固定数量
        let cpsl = eocore.to_float(data0["f_bzsl"]);
        if (cpsl <= 0.0) {
            cpsl = 1.0;
        }

        // 更新产品信息
        x_data_kcmx["f_cpdy_id"] = data0["f_cpdy_id"];
        x_data_kcmx["f_cpmc"] = data0["f_cpmc"];
        x_data_kcmx["f_cpbm"] = data0["f_cpbm"];
        x_data_kcmx["f_kcdj"] = kcdj;
        x_data_kcmx["f_kcsl"] = cpsl;

        cb(true); 
    }

    const onButtonClick_kcjy = () => {        
        v_kcjy_list.value?.showDialog(x_data_kcmx);
    }

    /**
     * 调拨记录
     */
    const onDialogClose_kcjy_list = async (cancel: boolean, data0: any, cb: cfunc_boolean) => {
        if (cancel) { 
            cb(true); return;
        }

        cb(true);
    }    

    // 暴露方法给父组件使用
    defineExpose({
        showDialog
    });
</script>

<style lang="scss" scoped>
</style>