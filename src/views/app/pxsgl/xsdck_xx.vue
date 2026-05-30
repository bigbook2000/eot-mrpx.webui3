<template>
    <!-- 销售出库产品明细编辑对话框 -->
    <vdialog ref="v_dialog"
        width="1000px" title="出库货物"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_form">
            <div class="cell eo_w2">
                <div class="label_n">单号</div>
                <div class="input">
                    <el-input v-model="x_data_xsdck['f_xsdh']" style="width:100%" disabled>
                    </el-input>
                </div>
            </div>            
            <div class="cell eo_w2">
                <div class="label_n">批次<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input v-model="x_data_xsdck['f_kcbh']" style="width:100%"
                        placeholder="请选择库存" :readonly="true">
                        <template #append>
                            <el-button :icon="More" @click="onInputOpen_kcmx"
                                v-show="x_edit_fields['f_kcbh'] && !x_edit_upd" />
                        </template>
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">产品编码</div>
                <div class="input">
                    <el-input v-model="x_data_xsdck['f_cpbm']" style="width:100%"
                        maxlength="50" disabled></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">产品名称</div>
                <div class="input">
                    <el-input v-model="x_data_xsdck['f_cpmc']" style="width:100%"
                        maxlength="50" disabled></el-input>
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">物流公司</div>
                <div class="input">
                    <el-input v-model="x_data_xsdck['f_wlgs_id_s']" style="width:100%"
                        placeholder="请选择物流公司" :readonly="true">
                        <template #append>
                            <el-button :icon="More" @click="onInputOpen_wlgs" 
                                v-show="x_edit_fields['f_wlgs_id']"/>
                        </template>
                    </el-input>
                </div>
            </div>            
            
            <div class="cell eo_w2">
                <div class="label_n">销售单价<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input-number v-model="x_data_xsdck['f_ckdj']" :precision="2" :min="0" 
                        placeholder="" style="width: 100%" 
                        :disabled="true" />
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">物流单号</div>
                <div class="input">
                    <el-input v-model="x_data_xsdck['f_wldh']" style="width:100%"
                        :readonly="!x_edit_fields['f_wldh']"
                        maxlength="200" placeholder="物流单号"></el-input>
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">单件数量</div>
                <div class="input">
                    <el-input-number v-model="x_data_xsdck['f_kcsl']" :precision="3" :min="0" 
                        placeholder="" style="width: 100%" 
                        :disabled="true" />
                </div>
            </div>

            <div class="cell eo_w4">
                <div class="label_n">仓库</div>
                <div class="input">
                    <vdic style="width:100%" dic="产品仓库" :all="false" field="value"
                        v-model="x_data_xsdck['f_hwck']" :disabled="true" />
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">出库时间</div>
                <div class="input">
                    <el-input v-model="x_data_xsdck['f_rksj_s']" style="width:100%"
                        maxlength="200" disabled></el-input>
                </div>
            </div>
           <div class="cell eo_w2">
                <div class="label_n">库存单价<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input-number v-model="x_data_xsdck['f_kcdj']" :precision="2" :min="0" 
                        placeholder="" style="width: 100%" 
                        :disabled="true" />
                </div>
            </div>            
            <div class="cell eo_w4">
                <div class="label_n">出库状态</div>
                <div class="input">
                    <el-input v-model="x_data_xsdck['f_rkzt_s']" style="width:100%"
                        maxlength="200" disabled></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">库管员</div>
                <div class="input">
                    <el-input v-model="x_data_xsdck['f_kgy_id_s']" style="width:100%"
                        maxlength="200" disabled></el-input>
                </div>
            </div>
            
 
            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input v-model="x_data_xsdck['f_beizhu']" style="width:100%"
                        maxlength="200" placeholder="请输入备注"
                        :readonly="!x_edit_fields['f_beizhu']"></el-input>
                </div>
            </div>
        </div>
        <kczl_list ref="v_kczl_list" @close="onListSelect_kczl"></kczl_list>
        <wlgs_list ref="v_wlgs_list" @close="onListSelect_wlgs"></wlgs_list>
    </vdialog>
</template>

<script lang="ts" setup>
    import { ref, reactive } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import vdialog from "@/components/web/vdialog.vue"
    import vdic from "@/components/vdic.vue"

    import TLogic from "@/logic/TLogic";

    import user_input from "@/views/platform/user_input.vue"
    import kczl_list from "@/views/web/ext/tkcgl/kczl_list.vue"
    import wlgs_list from "@/views/web/ext/tcwgl/wlgs_list.vue"

    const v_kczl_list = ref<InstanceType<typeof kczl_list>>();
    const v_wlgs_list = ref<InstanceType<typeof wlgs_list>>();

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    const x_data_xsdck: any = reactive({});
    const x_edit_fields = ref<any>({
        "f_kcbh": false,
        "f_cpmc": false,
        "f_wlgs_id": false,
        "f_wldh": false,
        "f_cpsl": false,
        "f_cpdj": false,
        "f_cpzj": false,
        "f_beizhu": false,
    });

    const x_edit_upd = ref(false);

    /**
     * 显示对话框
     * @param data 数据对象
     * @param editFields 可编辑字段，如果带*显示所有字段
     */
    const showDialog = (data: any, fieldArray: string[]) => {

        x_edit_fields.value = TLogic.checkEditFields(x_edit_fields.value, fieldArray);
        console.log(fieldArray, x_edit_fields.value);
        x_edit_upd.value = eocore.check_id(data, "f_kcmx_id");

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);

        // 创建一个副本并更新响应式数据
        Object.assign(x_data_xsdck, data);
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
        
        const data = x_data_xsdck;
        const isAdd = data["f_kcmx_id"] == 0;
        if (!eocore.check_id(data, "f_kcmx_id")) {
            eocore.show_info("请选择库存");
            cb(false); return;            
        }

        if (!eocore.check_id(data, "f_xsdcp_id")) {
            eocore.show_info("错误的产品清单");
            cb(false); return;            
        }

        let ret = await eocore.proc(
            "p_xsdck_upd", {
                "v_xsd_id": data["f_xsd_id"],
                "v_xsdck_id": data["f_xsdck_id"],
                "v_xsdcp_id": data["f_xsdcp_id"],
                "v_kcmx_id": data["f_kcmx_id"], 
                "v_wlgs_id": data["f_wlgs_id"],
                "v_wldh": data["f_wldh"],
                "v_kgy_id": data["f_kgy_id"],
                "v_ckbz": data["f_ckbz"],
                "v_xsdj": data["f_xsdj"],
                "v_beizhu": data["f_beizhu"]
            });
        let dataNew = eocore.check_net_object(ret);
        if (dataNew == undefined) {
            cb(false); return;
        }

        // 更改标识为冻结
        ret = await eocore.proc("p_kcmx_kcbz", {
            "v_kcmx_ids": "" + data["f_kcmx_id"],
            "v_cpdy_ids": "" + data["f_cpdy_id"],
            "v_kcbz": TLogic.kcbzCodes["临时"]
        });
        if (eocore.check_net_object(ret) == undefined) return;

        dataNew["_is_add"] = isAdd;

        emits("close", cancel, dataNew, (result: boolean) => {
            cb(result);
        });
    }

    const onInputOpen_kcmx = () => {
        v_kczl_list?.value?.show_dialog(x_data_xsdck);
    }
    const onListSelect_kczl = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        
        if (cancel) {
            cb(true); return;
        }

        if (data["f_kcbz"] != TLogic.kcbzCodes["正常"]) {
            eocore.show_error("库存货物暂时无法处理");
            cb(false); return;
        }

        x_data_xsdck['f_kcmx_id'] = data['f_kcmx_id'];
        x_data_xsdck['f_kcbh'] = data['f_kcbh'];
        x_data_xsdck['f_kcdj'] = data['f_kcdj'];
        x_data_xsdck['f_kcsl'] = data['f_kcsl'];
        
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

        x_data_xsdck['f_wlgs_id_s'] = data['f_gsmc'];
        x_data_xsdck['f_wlgs_id'] = data['f_wlgs_id'];

        cb(true);
    }

    // 暴露方法给父组件使用
    defineExpose({
        showDialog
    });
</script>

<style lang="scss" scoped>
</style>