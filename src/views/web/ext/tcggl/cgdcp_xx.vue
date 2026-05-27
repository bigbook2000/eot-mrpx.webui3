<template>
    <!-- 采购订单明细编辑对话框 -->
    <vdialog ref="v_dialog"
        width="1000px" :title="x_title"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_form">
            <div class="cell eo_w2">
                <div class="label_n">采购单号</div>
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
                <div class="label_n">销售定价</div>
                <div class="input">
                    <el-input v-model="x_data_cgdcp['f_cpjg']" style="width:100%" disabled>
                    </el-input>
                </div>
            </div> 
            
            <div class="cell eo_w2">
                <div class="label_n">库存数量</div>
                <div class="input">
                    <el-input v-model="x_data_cgdcp['f_cpsl_s']" style="width:100%" disabled>
                    </el-input>
                </div>
            </div> 
            <div class="cell eo_w2">
                <div class="label_n">库存成本</div>
                <div class="input">
                    <el-input v-model="x_data_cgdcp['f_cpdj_s']" style="width:100%" disabled>
                    </el-input>
                </div>
            </div> 
            

            <div class="cell eo_w2">
                <div class="label_n">采购件数</div>
                <div class="input">
                    <el-input-number v-model="x_data_cgdcp['f_cgsl']" style="width:100%"
                        :min="0" :max="999999" :precision="0" :step="1" 
                        :disabled="!x_edit_fields['f_cgsl']" 
                        @change="onNumberChange_jszj" />
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">单件数量</div>
                <div class="input">
                    <el-input-number v-model="x_data_cgdcp['f_bzsl']" style="width:100%"
                        :min="0" :max="999999" :precision="3" :step="1" 
                        :disabled="!x_edit_fields['f_bzsl']" 
                        @change="onNumberChange_jszj" />
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">采购单价</div>
                <div class="input">
                    <el-input-number v-model="x_data_cgdcp['f_cgdj']" style="width:100%"
                        :min="0" :max="999999" :precision="3" :step="1" 
                        :disabled="!x_edit_fields['f_cgdj']" 
                        @change="onNumberChange_jszj" />
                </div>
            </div>


            <div class="cell eo_w2">
                <div class="label_n">物流公司</div>
                <div class="input">
                    <el-input v-model="x_data_cgdcp['f_wlgs_id_s']" style="width:100%"
                        placeholder="请选择物流公司" :readonly="true">
                        <template #append>
                            <el-button :icon="More" @click="onInputOpen_wlgs" 
                                v-show="x_edit_fields['f_wlgs_id']"/>
                        </template>
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">采购总价</div>
                <div class="input">
                    <el-input-number v-model="x_data_cgdcp['f_cgzj']" style="width:100%"
                        :min="0" :max="999999" :precision="3" :step="1" 
                        :disabled="!x_edit_fields['f_cgzj']" 
                        @change="onNumberChange_jsdj" />
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">物流单号</div>
                <div class="input">
                    <el-input v-model="x_data_cgdcp['f_wldh']" style="width:100%"
                        :disabled="!x_edit_fields['f_wldh']"
                        maxlength="200" placeholder="物流单号"></el-input>
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
        <wlgs_list ref="v_wlgs_list" @close="onListSelect_wlgs"></wlgs_list>
    </vdialog>
</template>

<script lang="ts" setup>
    import { ref, reactive, computed } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import vdialog from "@/components/web/vdialog.vue"

    import TLogic from "@/logic/TLogic";

    import cpdy_list from "@/views/web/ext/tkcgl/cpdy_list.vue"
    import wlgs_list from "@/views/web/ext/tcwgl/wlgs_list.vue"
    import TGlobal from "@/logic/TGlobal";

    const v_cpdy_list = ref<InstanceType<typeof cpdy_list>>();
    const v_wlgs_list = ref<InstanceType<typeof wlgs_list>>();
    
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
        "f_bzsl": false,
        "f_cgdj": false,
        "f_cgzj": false,
        "f_beizhu": false
    });
    /**
     * 显示对话框
     * @param data 数据对象
     * @param fieldArray 可编辑字段
     * @param dbUpdate 是否进行入库操作
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

        x_data_cgdcp["f_cpsl_s"] = eolib.fixed_num(x_data_cgdcp["f_cpsl"], 3);
        x_data_cgdcp["f_cpdj_s"] = eolib.fixed_num(eolib.divide_num(x_data_cgdcp["f_cpzj"], x_data_cgdcp["f_cpsl"]), 3);

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

        const cgsl = eocore.to_int(data["f_cgsl"]);
        if (cgsl <= 0) {
            eocore.show_info("请输入采购数量");
            return undefined;
        }    
        if (cgsl > 100) {
            eocore.show_info("数量太大，若为散件，请打包入库");
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
                "v_cgsl": cgsl,
                "v_bzsl": data["f_bzsl"],
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

    /**
     * 将采购清单加入到库存明细中
     * @param rkdcpData 采购清单数据
     */
    const netLoad_cgdrk_upd = async (rkdcpData: any): Promise<any> => { 

        // 检查必填字段
        if (!eocore.check_id(rkdcpData, "f_cpdy_id")) {
            eocore.show_info("请选择产品");
            return undefined;
        }

        const cgsl = eocore.to_int(rkdcpData["f_cgsl"]);
        if (cgsl <= 0) {
            eocore.show_info("请输入采购数量");
            return undefined;
        }
        if (cgsl > 100) {
            eocore.show_info("数量太大，若为散件，请打包入库");
            return undefined;
        }

        const cgdId = rkdcpData["f_cgd_id"];
        const cgdcpId = rkdcpData["f_cgdcp_id"];
        // 列出旧的
        let ret = await eocore.proc(
			"p_cgdrk_list", {
				"v_cgd_id": cgdId,
                "v_cgdcp_id": cgdcpId,
		});
        const list = eocore.check_net_array(ret);
        if (list == undefined) return undefined;

        if (list.length > 0) {
            const kcmxIds = list.map((item: any) => item["f_kcmx_id"]).join(",");

            // 先清除        
            ret = await eocore.proc(    
				"p_cgdrk_clear", {
					"v_kcmx_ids": kcmxIds
			});
            const data = eocore.check_net_object(ret);
            if (data == undefined) return undefined;
        }

        // 添加到库存明细
        const kgyId = TGlobal.userData["f_user_id"];
        for (let i=0; i<cgsl; i++) {

            const kcbh = await TLogic.netLoad_RecordString_kcbh(
                rkdcpData["f_cpdy_id"], rkdcpData["f_cpbm"]);
            const dataNew = await TLogic.netLoad_kcmx_upd(
                0,
                0,
                rkdcpData["f_cpdy_id"],
                kcbh,
                "采购入库",
                cgdId, // 关联采购单
                0,
                rkdcpData["f_cgdj"],
                rkdcpData["f_bzsl"], // 单件数量                
                kgyId,
                rkdcpData["f_beizhu"],
                TLogic.kcbzCodes["正常"], // 库存标识，采购单直接入库
            );
            if (dataNew == undefined) return undefined;

            // 添加到采购明细

            ret = await eocore.proc(    
                "p_cgdrk_upd", {
                    "v_cgd_id": cgdId,
                    "v_cgdcp_id": cgdcpId,
                    "v_kcmx_id": dataNew["f_kcmx_id"],
                    "v_kcbh": dataNew["f_kcbh"],                    
                    "v_kgy_id": kgyId,
                    "v_cgdj": rkdcpData["f_cgdj"],
                    "v_beizhu": rkdcpData["f_beizhu"],
                    "v_rkbz": 1,
                });
            const data = eocore.check_net_object(ret);
            if (data == undefined) return undefined;
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

            // 变更入库
            v_dialog.value?.show_loading(true);
            await netLoad_cgdrk_upd(x_data_cgdcp);
            v_dialog.value?.show_loading(false);
            
            emits("close", cancel, undefined, (result: boolean) => {
                cb(result);
            });
        }
    }

    
    /**
     * 自动计算总价，总价=单价*包装数量*件数
     */
    const onNumberChange_jszj = () => {

        const bzsl = eocore.to_float(x_data_cgdcp['f_bzsl']);
        const cpsl = eocore.to_int(x_data_cgdcp['f_cgsl']);
        const cpdj = eocore.to_float(x_data_cgdcp['f_cgdj']);
        x_data_cgdcp['f_cgzj'] = Number((cpsl * bzsl * cpdj).toFixed(2));
    }
    /**
     * 自动计算单价，单价为最小单元的价格，不是整包的价格
     */
    const onNumberChange_jsdj = () => {

        let bzsl = eocore.to_float(x_data_cgdcp['f_bzsl']);
        if (bzsl <= 0.0) {
            bzsl = 1.0;
            x_data_cgdcp['f_bzsl'] = bzsl;
        }
        let cpsl = eocore.to_int(x_data_cgdcp['f_cgsl']) * bzsl;
        if (cpsl <= 0) {
            cpsl = 1;
            x_data_cgdcp['f_cgsl'] = cpsl;
        }

        const cpzj = eocore.to_float(x_data_cgdcp['f_cgzj']);
        x_data_cgdcp['f_cgzj'] = Number((cpzj / (cpsl * bzsl)).toFixed(2));
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
        x_data_cgdcp['f_bzsl'] = data['f_bzsl'];
        x_data_cgdcp['f_kcsl'] = data['f_cpsl'];
        x_data_cgdcp['f_kcdj'] = eolib.divide_num(data['f_cpzj'], data['f_cpsl']);

        x_data_cgdcp['f_cgdj'] = x_data_cgdcp['f_kcdj'];

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

        x_data_cgdcp['f_wlgs_id_s'] = data['f_gsmc'];
        x_data_cgdcp['f_wlgs_id'] = data['f_wlgs_id'];

        cb(true);
    }
    // 暴露方法给父组件
    defineExpose({
        showDialog
    });
</script>

<style lang="scss" scoped>
</style>