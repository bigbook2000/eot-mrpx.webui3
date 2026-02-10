<template>
    <!-- 采购入库产品明细编辑对话框 -->
    <vdialog ref="v_dialog"
        width="1000px" title="产品明细"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_form">
            <div class="cell eo_w2">
                <div class="label_n">单号</div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_rkdh']" style="width:100%" disabled>
                    </el-input>
                </div>
            </div>            
            <div class="cell eo_w2">
                <div class="label_n">产品名称<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_cpmc']" style="width:100%"
                        placeholder="请选择产品" :readonly="true">
                        <template #append>
                            <el-button :icon="More" @click="onInputOpen_cpdy"
                                v-show="x_edit_fields['f_cpmc']"/>
                        </template>
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">产品编码</div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_cpbm']" style="width:100%"
                        maxlength="50" disabled></el-input>
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">数量<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input-number v-model="x_data_rkcpmx['f_cpsl']" :precision="2" :min="0" 
                        placeholder="请输入数量" style="width: 100%" 
                        :readonly="!x_edit_fields['f_cpsl']"
                        @change="onNumberChange_jszj" />
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">物流公司</div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_wlgs_id_s']" style="width:100%"
                        placeholder="请选择物流公司" :readonly="true">
                        <template #append>
                            <el-button :icon="More" @click="onInputOpen_wlgs" 
                                v-show="x_edit_fields['f_wlgs_id']"/>
                        </template>
                    </el-input>
                </div>
            </div>            
            <div class="cell eo_w2">
                <div class="label_n">单价<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input-number v-model="x_data_rkcpmx['f_cpdj']" :precision="2" :min="0" 
                        placeholder="请输入单价" style="width: 100%" 
                        :readonly="!x_edit_fields['f_cpdj']"
                        @change="onNumberChange_jszj" />
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">物流单号</div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_wldh']" style="width:100%"
                        :readonly="!x_edit_fields['f_wldh']"
                        maxlength="200" placeholder="物流单号"></el-input>
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">总价</div>
                <div class="input">
                    <el-input-number v-model="x_data_rkcpmx['f_cpzj']" :precision="2" :min="0" 
                        placeholder="请输入总价" style="width: 100%" 
                        :readonly="!x_edit_fields['f_cpzj']"
                        @change="onNumberChange_jsdj" />
                </div>
            </div>

            <div class="cell eo_w4">
                <div class="label_n">仓库</div>
                <div class="input">
                    <vdic style="width:100%" dic="产品仓库" :all="false" field="value"
                        v-model="x_data_rkcpmx['f_hwck']" :disabled="true" />
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">入库时间</div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_rksj_s']" style="width:100%"
                        maxlength="200" disabled></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">入库状态</div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_rkzt_s']" style="width:100%"
                        maxlength="200" disabled></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">库管员</div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_kgy_id_s']" style="width:100%"
                        maxlength="200" disabled></el-input>
                </div>
            </div>
            
            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input v-model="x_data_rkcpmx['f_beizhu']" style="width:100%"
                        maxlength="200" placeholder="请输入备注"
                        :readonly="!x_edit_fields['f_beizhu']"></el-input>
                </div>
            </div>
        </div>
        <cpdy_list ref="v_cpdy_list" @close="onListSelect_cpdy"></cpdy_list>
        <wlgs_list ref="v_wlgs_list" @close="onListSelect_wlgs"></wlgs_list>
    </vdialog>
</template>

<script lang="ts" setup>
    import { ref, reactive } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import vdialog from "@/logic/common/vdialog.vue"
    import vdic from "@/logic/common/vdic.vue"

    import TLogic from "@/logic/TLogic";

    import user_input from "@/views/platform/user_input.vue"
    import cpdy_list from "@/views/frame/ext/kcgl/cpdy_list.vue"
    import wlgs_list from "@/views/frame/ext/cwgl/wlgs_list.vue"

    const v_cpdy_list = ref<InstanceType<typeof cpdy_list>>();
    const v_wlgs_list = ref<InstanceType<typeof wlgs_list>>();

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    const x_data_rkcpmx: any = reactive({});
    const x_edit_fields = ref<any>({
        "f_cpmc": false,
        "f_wlgs_id_s": false,
        "f_wldh": false,
        "f_cpsl": false,
        "f_cpdj": false,
        "f_cpzj": false,
        "f_beizhu": false,
    });

    /**
     * 显示对话框
     * @param data 数据对象
     * @param editFields 可编辑字段，如果带*显示所有字段
     */
    const showDialog = (data: any, fieldArray: string[]) => {

        x_edit_fields.value = TLogic.checkEditFields(x_edit_fields.value, fieldArray);

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);

        // 创建一个副本并更新响应式数据
        Object.assign(x_data_rkcpmx, data);
    }

    /**
     * 自动计算总价
     */
    const onNumberChange_jszj = () => {

        let cpsl = eocore.to_float(x_data_rkcpmx['f_cpsl'] || 0);
        let cpdj = eocore.to_float(x_data_rkcpmx['f_cpdj'] || 0);
        x_data_rkcpmx['f_cpzj'] = Number((cpsl * cpdj).toFixed(2));
    }
    /**
     * 自动计算单价
     */
    const onNumberChange_jsdj = () => {

        let cpsl = eocore.to_float(x_data_rkcpmx['f_cpsl'] || 0);
        let cpzj = eocore.to_float(x_data_rkcpmx['f_cpzj'] || 0);

        if (cpsl <= 0.0) {
            cpsl = 1.0;
            x_data_rkcpmx['f_cpsl'] = cpsl;
        }

        x_data_rkcpmx['f_cpzj'] = Number((cpzj / cpsl).toFixed(2));
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
        const isAdd = !eocore.check_id(data, "f_rkcpmx_id");
        if (!eocore.check_id(data, "f_cpdy_id")) {
            eocore.show_error("请选择产品");
            cb(false); return;            
        }

        if (!eocore.check_id(data, "f_rkd_id")) {
            eocore.show_error("错误的单号");
            cb(false); return;            
        }

        let ret = await eocore.proc(
            "p_rkcpmx_upd", {
                "v_rkcpmx_id": data["f_rkcpmx_id"],
                "v_cpdy_id": data["f_cpdy_id"],
                "v_rklb": data["f_rklb"],
                "v_rkd_id": data["f_rkd_id"],
                "v_kcmx_id": data["f_kcmx_id"],
                "v_kgy_id": data["f_kgy_id"],
                "v_cpsl": data["f_cpsl"],
                "v_cpdj": data["f_cpdj"],
                "v_cpzj": data["f_cpzj"],
                "v_wlgs_id": data["f_wlgs_id"],
                "v_wldh": data["f_wldh"],
                "v_hwck": data["f_hwck"],
                "v_rksj": data["f_rksj"],
                "v_rkzt": data["f_rkzt"],
                "v_beizhu": data["f_beizhu"]
            });
        let dataNew = eocore.check_net_object(ret);
        if (dataNew == undefined) {
            cb(false); return;
        }

        dataNew["_is_add"] = isAdd;

        emits("close", cancel, dataNew, (result: boolean) => {
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

        x_data_rkcpmx['f_cpdy_id'] = data['f_cpdy_id'];
        x_data_rkcpmx['f_cpmc'] = data['f_cpmc'];
        x_data_rkcpmx['f_cpbm'] = data['f_cpbm'];
        x_data_rkcpmx['f_cpdj'] = eocore.to_float(data['f_cpjg']); // 使用产品定义中的价格作为默认单价
        
        // 自动计算总价
        onNumberChange_jszj();

        cb(true);
    }
    const onInputOpen_wlgs = () => {
        v_wlgs_list?.value?.show_dialog({});
    }
    const onListSelect_wlgs = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true);
            return;
        }

        x_data_rkcpmx['f_wlgs_id_s'] = data['f_gsmc'];
        x_data_rkcpmx['f_wlgs_id'] = data['f_wlgs_id'];

        cb(true);
    }

    // 暴露方法给父组件使用
    defineExpose({
        showDialog
    });
</script>

<style lang="scss" scoped>
</style>