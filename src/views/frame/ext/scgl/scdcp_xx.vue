<template>
    <!-- 生产编辑对话框 -->
    <vdialog ref="v_dialog"
        width="1000px" :title="x_title"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_form">
            <div class="cell eo_w2">
                <div class="label_n">生产单号</div>
                <div class="input">
                    <el-input v-model="x_data_cgdcp['f_cgdh']" style="width:100%" disabled>
                    </el-input>
                </div>
            </div> 
            <div class="cell eo_w2">
                <div class="label_n">产品名称<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input v-model="x_data_cgdcp['f_cpmc']" style="width:100%"
                        placeholder="请选择产品" :readonly="true">
                        <template #append>
                            <el-button :icon="More" v-show="x_edit_fields['f_cpmc']"
                                @click="onInputOpen_cpdy"/>
                        </template>
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">产品编码</div>
                <div class="input">
                    <el-input v-model="x_data_cgdcp['f_cpbm']" style="width:100%"
                        maxlength="50" :disabled="true"></el-input>
                </div>
            </div>
            
            <div class="cell eo_w2">
                <div class="label_n">生产数量</div>
                <div class="input">
                    <el-input v-model="x_data_cgdcp['f_kcsl']" style="width:100%" disabled>
                    </el-input>
                </div>
            </div>
            

            <div class="cell eo_w2">
                <div class="label_n">计划数量</div>
                <div class="input">
                    <el-input-number v-model="x_data_cgdcp['f_cgsl']" style="width:100%"
                        :min="0" :max="999999" :precision="0" :step="1" 
                        :disabled="!x_edit_fields['f_cgsl']" 
                        @change="onNumberChange_jszj" />
                </div>
            </div>


            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input v-model="x_data_cgdcp['f_beizhu']" style="width:100%"
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
    import vdialog from "@/logic/common/vdialog.vue"

    import TLogic from "@/logic/TLogic";

    import cpdy_list from "@/views/frame/ext/kcgl/cpdy_list.vue"
    import TGlobal from "@/logic/TGlobal";

    const v_cpdy_list = ref<InstanceType<typeof cpdy_list>>();
    
    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    const x_title = ref("产品信息");
    let m_db_update = true;

    const x_show_loading = ref(false);

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    let x_data_cgdcp: any = reactive({});
    const x_edit_fields = ref<any>({
        "f_wlgs_id": false,
        "f_wldh": false,
        "f_cpmc": false,
        "f_cgsl": false,
        "f_cgdj": false,
        "f_cgzj": false,
        "f_beizhu": false
    });
    /**
     * 显示对话框
     * @param data 数据对象
     * @param fieldArray 可编辑字段
     */
    const showDialog = (title: string, data: any, fieldArray: string[], dbUpdate?: boolean) => {

        x_title.value = title;
        m_db_update = dbUpdate !== undefined ? dbUpdate : true;
        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);
        
        x_edit_fields.value = TLogic.checkEditFields(x_edit_fields.value, fieldArray);
        //console.log(x_edit_fields.value);

        // 创建一个副本并更新响应式数据
        x_data_cgdcp = reactive(Object.assign({}, data));
        console.log(x_data_cgdcp);
    }

    const onDialogOpen = (data: any) => {
        // 计算总价
        onNumberChange_jszj();
    }

    const netLoad_cgdcp_upd = async (data: any): Promise<any> => { 

        // 检查必填字段
        if (!eocore.check_id(data, "f_cpdy_id")) {
            eocore.show_info("请选择产品");
            return undefined;
        }
        if (data["f_cgsl"] <= 0) {
            eocore.show_info("请输入采购数量");
            return undefined;
        }        

        // 计算总价
        onNumberChange_jszj();

        const isAdd = !eocore.check_id(data, "f_cgdcp_id");
        let ret = await eocore.proc(
            "p_cgdcp_upd", {
                "v_cgdcp_id": data["f_cgdcp_id"],
                "v_cgd_id": data["f_cgd_id"],
                "v_cpdy_id": data["f_cpdy_id"],                
                "v_wlgs_id": data["f_wlgs_id"],
                "v_wldh": data["f_wldh"],
                "v_cgsl": data["f_cgsl"],
                "v_cgdj": data["f_cgdj"],
                "v_cgzj": data["f_cgzj"],
                "v_beizhu": data["f_beizhu"]
            });
        let dataNew = eocore.check_net_object(ret);
        if (dataNew == undefined) {
            return undefined;
        }

        dataNew["_is_add"] = isAdd;
        return dataNew;
    }

    const netLoad_kcmrk_upd = async (data: any): Promise<any> => { 

        // 检查必填字段
        if (!eocore.check_id(data, "f_cpdy_id")) {
            eocore.show_info("请选择产品");
            return undefined;
        }

        const cgsl = eocore.to_int(data["f_cgsl"]);
        if (cgsl <= 0) {
            eocore.show_info("请输入采购数量");
            return undefined;
        }
        if (cgsl > 100) {
            eocore.show_info("数量太大，若为散件，请打包入库");
            return undefined;
        }

        const rklb = TLogic.codeTypes["采购入库"];
        // 先清除旧的数据
        let ret = await eocore.proc(
            "p_kcmxrk_clear", {
                "v_rklb": rklb,
                "v_rkd_id": data["f_cgd_id"],
                "v_rkcp_id": data["f_cgdcp_id"]
            });
        let dataNew = eocore.check_net_object(ret);
        if (dataNew == undefined) {
            return undefined;
        }

        const kgyId = TGlobal.userData["f_user_id"];
        for (let i=0; i<cgsl; i++) {

            const kcbh = await TLogic.netLoad_RecordString_kcbh(data["f_cpdy_id"], data["f_cpbm"]);
            ret = await eocore.proc(
                "p_kcmxrk_upd", {
                    "v_kcmxrk_id": 0,
                    "v_kcbh": kcbh,
                    "v_kcbz": 0, // 0表示未进入库存，1表示已经进入库存
                    "v_cpdy_id": data["f_cpdy_id"],
                    "v_rklb": rklb,
                    "v_rkd_id": data["f_cgd_id"],
                    "v_rkcp_id": data["f_cgdcp_id"],
                    "v_kgy_id": kgyId,
                    "v_cpsl": 1.0,
                    "v_cpdj": data["f_cgdj"],
                    "v_cpzj": data["f_cgdj"],
                    "v_hwck": 1,
                    "v_beizhu": data["f_beizhu"]
                });
            let dataNew = eocore.check_net_object(ret);
            if (dataNew == undefined) {
                return undefined;
            }
        }

        eocore.show_success("入库成功，请重新刷新清单");
    }

    /**
     * 对话框关闭事件
     */
    const onDialogClose = async (cancel: boolean, data0: any, cb: cfunc_boolean) => {

        if (cancel) {
            cb(true); return;
        }

        let dataNew = x_data_cgdcp;
        // 如果不需要更新数据库，则直接返回
        if (m_db_update) {

            v_dialog.value?.show_loading(true);
            dataNew = await netLoad_cgdcp_upd(x_data_cgdcp);
            v_dialog.value?.show_loading(false);
            if (dataNew == undefined) {
                cb(false); return;
            } 

            emits("close", cancel, dataNew, (result: boolean) => {
                cb(result);
            });

        } else {

            v_dialog.value?.show_loading(true);
            await netLoad_kcmrk_upd(x_data_cgdcp);
            v_dialog.value?.show_loading(false);
            
            emits("close", cancel, undefined, (result: boolean) => {
                cb(result);
            });
        }
    }

    
    /**
     * 自动计算总价
     */
    const onNumberChange_jszj = () => {

        let cpsl = eocore.to_float(x_data_cgdcp['f_cgsl'] || 0);
        let cpdj = eocore.to_float(x_data_cgdcp['f_cgdj'] || 0);
        x_data_cgdcp['f_cgzj'] = Number((cpsl * cpdj).toFixed(2));
    }
    /**
     * 自动计算单价
     */
    const onNumberChange_jsdj = () => {

        let cpsl = eocore.to_float(x_data_cgdcp['f_cgsl'] || 0);
        let cpzj = eocore.to_float(x_data_cgdcp['f_cgzj'] || 0);

        if (cpsl <= 0.0) {
            cpsl = 1.0;
            x_data_cgdcp['f_cgsl'] = cpsl;
        }

        x_data_cgdcp['f_cgzj'] = Number((cpzj / cpsl).toFixed(2));
    } 

    const onInputOpen_cpdy = () => {
        v_cpdy_list?.value?.show_dialog({});
    }
    const onListSelect_cpdy = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        
        if (cancel) {
            cb(true);
            return;
        }

        x_data_cgdcp['f_cpdy_id'] = data['f_cpdy_id'];
        x_data_cgdcp['f_cpmc'] = data['f_cpmc'];
        x_data_cgdcp['f_cpbm'] = data['f_cpbm'];
        x_data_cgdcp['f_cpjg'] = data['f_cpjg'];
        x_data_cgdcp['f_kcsl'] = data['f_kcsl'];
        x_data_cgdcp['f_kcdj'] = eolib.divide_num(data['f_kczj'], data['f_kcsl']);

        x_data_cgdcp['f_cgdj'] = x_data_cgdcp['f_kcdj'];

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