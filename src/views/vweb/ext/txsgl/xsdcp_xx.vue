<template>
    <!-- 销售订单明细编辑对话框 -->
    <vdialog ref="v_dialog"
        width="1000px" title="订单产品"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_form">
            <div class="cell eo_w2">
                <div class="label_n">销售单号</div>
                <div class="input">
                    <el-input v-model="x_data_xsdcp['f_xsdh']" style="width:100%" disabled>
                    </el-input>
                </div>
            </div> 
            <div class="cell eo_w2">
                <div class="label_n">产品名称<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input v-model="x_data_xsdcp['f_cpmc']" style="width:100%"
                        placeholder="请选择产品" :readonly="true">
                        <template #append>
                            <el-button :icon="More" v-show="x_edit_fields['f_cpmc']"
                                @click="onInputOpen_cpdy"/>
                        </template>
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">产品价格</div>
                <div class="input">
                    <el-input v-model="x_data_xsdcp['f_cpjg']" style="width:100%" disabled>
                    </el-input>
                </div>
            </div> 
            <div class="cell eo_w2">
                <div class="label_n">产品编码</div>
                <div class="input">
                    <el-input v-model="x_data_xsdcp['f_cpbm']" style="width:100%"
                        maxlength="50" :disabled="true"></el-input>
                </div>
            </div>
            

            <div class="cell eo_w2">
                <div class="label_n">销售数量</div>
                <div class="input">
                    <el-input-number v-model="x_data_xsdcp['f_xssl']" style="width:100%"
                        :min="0" :max="999999" :precision="2" :step="1" 
                        :disabled="!x_edit_fields['f_xssl']" 
                        @change="onNumberChange_jszj" />
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">销售单价</div>
                <div class="input">
                    <el-input-number v-model="x_data_xsdcp['f_xsdj']" style="width:100%"
                        :min="0" :max="999999" :precision="2" :step="1" 
                        :disabled="!x_edit_fields['f_xsdj']" 
                        @change="onNumberChange_jszj" />
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">销售总价</div>
                <div class="input">
                    <el-input-number v-model="x_data_xsdcp['f_xszj']" style="width:100%"
                        :min="0" :max="999999" :precision="2" :step="1" 
                        :disabled="!x_edit_fields['f_xszj']" 
                        @change="onNumberChange_jsdj" />
                </div>
            </div>            
            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input v-model="x_data_xsdcp['f_beizhu']" style="width:100%"
                        maxlength="100" placeholder="请输入备注" :disabled="!x_edit_fields['f_beizhu']"></el-input>
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
    import vdialog from "@/components/web/vdialog.vue"

    import cpdy_list from "@/views/vweb/ext/tkcgl/cpdy_list.vue"
    import TLogic from "@/logic/TLogic";

    const v_cpdy_list = ref<InstanceType<typeof cpdy_list>>();

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    let x_data_xsdcp: any = reactive({});
    const x_edit_fields = ref<any>({
        "f_cpmc": false,
        "f_xssl": false,
        "f_xsdj": false,
        "f_xszj": false,
        "f_beizhu": false
    });
    /**
     * 显示对话框
     * @param data 数据对象
     * @param fieldArray 可编辑字段
     */
    const showDialog = (data: any, fieldArray: string[]) => {
        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);
        
        x_edit_fields.value = TLogic.checkEditFields(x_edit_fields.value, fieldArray);
        // 创建一个副本并更新响应式数据
        x_data_xsdcp = reactive(Object.assign({}, data));
        console.log(x_data_xsdcp);
    }

    const onDialogOpen = (data: any) => {
        // 计算总价
        onNumberChange_jszj();
    }

    /**
     * 对话框关闭事件
     */
    const onDialogClose = async (cancel: boolean, data0: any, cb: cfunc_boolean) => {

        if (cancel) {
            cb(true); return;
        }

        const data = x_data_xsdcp;

        // 检查必填字段
        if (!eocore.check_id(data, "f_cpdy_id")) {
            eocore.show_info("请选择产品");
            cb(false); return;
        }
        if (data["f_xssl"] <= 0) {
            eocore.show_info("请输入销售数量");
            cb(false); return;
        }

        // 计算总价
        onNumberChange_jszj();

        const isAdd = !eocore.check_id(data, "f_xsdcp_id");
        let ret = await eocore.proc(
            "p_xsdcp_upd", {
                "v_xsdcp_id": data["f_xsdcp_id"],
                "v_cpdy_id": data["f_cpdy_id"],
                "v_xsd_id": data["f_xsd_id"],
                "v_xssl": data["f_xssl"],
                "v_xsdj": data["f_xsdj"],
                "v_xszj": data["f_xszj"],
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

    
    /**
     * 自动计算总价
     */
    const onNumberChange_jszj = () => {

        let cpsl = eocore.to_float(x_data_xsdcp['f_xssl'] || 0);
        let cpdj = eocore.to_float(x_data_xsdcp['f_xsdj'] || 0);
        x_data_xsdcp['f_xszj'] = Number((cpsl * cpdj).toFixed(2));
    }
    /**
     * 自动计算单价
     */
    const onNumberChange_jsdj = () => {

        let cpsl = eocore.to_float(x_data_xsdcp['f_xssl'] || 0);
        let cpzj = eocore.to_float(x_data_xsdcp['f_xszj'] || 0);

        if (cpsl <= 0.0) {
            cpsl = 1.0;
            x_data_xsdcp['f_xssl'] = cpsl;
        }

        x_data_xsdcp['f_xszj'] = Number((cpzj / cpsl).toFixed(2));
    } 

    const onInputOpen_cpdy = () => {
        v_cpdy_list?.value?.show_dialog({});
    }
    const onListSelect_cpdy = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        
        if (cancel) {
            cb(true); return;
        }

        x_data_xsdcp['f_cpdy_id'] = data['f_cpdy_id'];
        x_data_xsdcp['f_cpmc'] = data['f_cpmc'];
        x_data_xsdcp['f_cpbm'] = data['f_cpbm'];
        x_data_xsdcp['f_cpjg'] = data['f_cpjg'];
        x_data_xsdcp['f_xsdj'] = x_data_xsdcp['f_cpjg'];        

        // 自动计算总价
        onNumberChange_jszj();

        cb(true);
    }

    // 暴露方法给父组件
    defineExpose({
        showDialog
    });
</script>

<style lang="scss" scoped>
</style>