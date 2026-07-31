<template>
    <!-- 销售退货详情 - 路由页面 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="退货详情" />
            <div class="eo_col_f">
                <el-tabs v-model="x_active_tab" type="card" class="ap_tabs"
                    @tab-click="onTabClick">
                    <el-tab-pane label="退货详情" name="xq">
                        <div class="eo_col">
                            <div class="eo_col_f">
                                <div class="eo_scroll_v">
                                    <div class="eo_form">
                                        <div class="cell eo_w100">
                                            <div class="label_n">货物批次</div>
                                            <div class="input">
                                                <el-input v-model="x_data_xsth['f_kcbh']" style="width:100%"
                                                    placeholder="请选择货物批次" readonly>
                                                    <template #append>
                                                        <el-button :icon="More"
                                                            @click="onInputOpen_kcbh" />
                                                    </template>
                                                </el-input>
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">产品名称</div>
                                            <div class="input">
                                                <el-input v-model="x_data_xsth['f_cpmc']" style="width:100%" disabled />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">数量</div>
                                            <div class="input">
                                                <el-input v-model="x_data_xsth['f_kcsl']" style="width:100%" disabled />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">销售单号</div>
                                            <div class="input">
                                                <el-input v-model="x_data_xsth['f_xsdh']" style="width:100%" disabled />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">客户名称</div>
                                            <div class="input">
                                                <el-input v-model="x_data_xsth['f_khmc']" style="width:100%" disabled />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">销售金额</div>
                                            <div class="input">
                                                <el-input v-model="x_data_xsth['f_xsje_s']" style="width:100%" disabled />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">退货金额</div>
                                            <div class="input">
                                                <el-input-number v-model="x_data_xsth['f_thje']"
                                                    :precision="2" :step="1" :min="0"
                                                    style="width:100%" />
                                            </div>
                                        </div>                                        
                                        <div class="cell eo_w100">
                                            <div class="label_n">物流公司</div>
                                            <div class="input">
                                                <el-input v-model="x_data_xsth['f_wlgs_id_s']" style="width:100%"
                                                    placeholder="请选择物流公司" readonly>
                                                    <template #append>
                                                        <el-button :icon="More"
                                                            @click="onInputOpen_wlgs" />
                                                    </template>
                                                </el-input>
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">物流单号</div>
                                            <div class="input">
                                                <el-input v-model="x_data_xsth['f_wldh']" style="width:100%"
                                                    maxlength="50" placeholder="请输入物流单号" />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">发货人</div>
                                            <div class="input">
                                                <el-input v-model="x_data_xsth['f_fhr']" style="width:100%"
                                                    maxlength="50" placeholder="请输入发货人" />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">发货电话</div>
                                            <div class="input">
                                                <el-input v-model="x_data_xsth['f_fhdh']" style="width:100%"
                                                    maxlength="20" placeholder="请输入发货电话" />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">销售员</div>
                                            <div class="input">
                                                <el-input v-model="x_data_xsth['f_xsy_id_s']" style="width:100%" disabled />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">发货地址</div>
                                            <div class="input">
                                                <el-input v-model="x_data_xsth['f_fhdz']" style="width:100%"
                                                    maxlength="200" placeholder="请输入发货地址" />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">退货原因</div>
                                            <div class="input">
                                                <el-input v-model="x_data_xsth['f_thyy']" style="width:100%"
                                                    type="textarea" :rows="3"
                                                    maxlength="500" placeholder="请输入退货原因" />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">备注</div>
                                            <div class="input">
                                                <el-input v-model="x_data_xsth['f_beizhu']" style="width:100%"
                                                    maxlength="200" placeholder="请输入备注" />
                                            </div>
                                        </div>
                                    </div>
                                    <div style="height:2rem;"></div>
                                </div>
                            </div>
                            <div class="eo_col_sp"></div>
                            <div class="eo_col_d eo_form">
                                <div class="button">
                                    <tflow_button :app="true" ref="v_flow_button"
                                        @on-new="onFlowNew"
                                        @on-back="onFlowBack"
                                        @on-edit="onFlowEdit"
                                        @on-get="onFlowGet"
                                        @on-cancel="onFlowCancel"
                                        @on-flow="onFlow" />
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="流程节点" name="flow">
                        <vflow ref="v_flow" type="销售退货" :app="true" />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <xsdck_list ref="v_xsdck_list" @close="onDialogClose_kcbh" />
        <wlgs_list ref="v_wlgs_list" @close="onDialogClose_wlgs" />
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_xsgl_xsth_xx" }
</script>

<script lang="ts" setup>
    import { ref, reactive, onMounted, nextTick } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";
    import eoflow, { type cflow_point } from "@/inc/eoflow";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"

    import router from "@/router/index"
    import topbar from '@/views/vapp/comm/topbar.vue'

    import vflow from "@/components/app/vflow.vue"
    import tflow_button from "@/views/comm/app/tflow_button.vue"

    import xsdck_list from "@/views/vapp/pxsgl/xsdck_list.vue"
    import wlgs_list from "@/views/vapp/pcggl/wlgs_list.vue"

    import TGlobal from "@/logic/TGlobal";
    import TLogic from "@/logic/TLogic";

    const v_flow = ref<InstanceType<typeof vflow>>();
    const v_flow_button = ref<any>();
    const v_xsdck_list = ref<InstanceType<typeof xsdck_list>>();
    const v_wlgs_list = ref<InstanceType<typeof wlgs_list>>();

    const x_active_tab = ref("xq");
    const x_show_loading = ref(false);

    const x_data_xsth = ref<any>({
        f_xsth_id: 0,
        f_xsdh: "",
        f_xsdck_id: 0,
        f_kcmx_id: 0,
        f_cpdy_id: 0,
        f_cpmc: "",
        f_kcbh: "",
        f_khgl_id: 0,
        f_khmc: "",
        f_xsy_id: TGlobal.userData["f_user_id"],
        f_xsy_id_s: TGlobal.userData["f_name"],
        f_xsje: 0.0,
        f_xsje_s: "",
        f_thje: 0.0,
        f_wlgs_id: 0,
        f_wlgs_id_s: "",
        f_wldh: "",
        f_fhr: "",
        f_fhdh: "",
        f_fhdz: "",
        f_thyy: "",
        f_thbz: 0,
        f_cjsj: "",
        f_beizhu: "",
        f_flow_point_id: 0,
        f_flow_process_id: 0
    });

    onMounted(async () => {
        const xsthId = eocore.to_int(router.currentRoute.value.query.id);

        if (xsthId > 0) {
            await netLoad_xsth_get(xsthId);
        }

        nextTick(() => {
            v_flow_button.value?.init_flow(v_flow.value);
            v_flow.value?.load_List(x_data_xsth.value["f_xsth_id"]);
            updateFlowStatus();
        });
    });

    const netLoad_xsth_get = async (xsthId: number) => {
        x_show_loading.value = true;
        const ret = await eocore.proc("p_xsth_get", { "v_xsth_id": xsthId });
        x_show_loading.value = false;
        const data = eocore.check_net_object(ret);
        if (data == undefined) return;

        data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"]);
        data["f_thje_s"] = eolib.fixed_num(data["f_thje"], 3);
        data["f_xsje_s"] = eolib.fixed_num(data["f_xsje"], 3);
        data["f_wlgs_id_s"] = TLogic.getLabel_wlgs(data["f_wlgs_id"]);
        TLogic.updateDicUserData(data, ["f_xsy_id"]);

        Object.assign(x_data_xsth.value, data);
    }

    // ========== 流程状态更新 ==========
    const updateFlowStatus = () => {
        const data = x_data_xsth.value;

        if (data["f_xsth_id"] <= 0) {
            v_flow_button.value?.set_flow_add();
            return;
        }

        const yxbz = data["f_yxbz"];
        if (yxbz == 0) return;

        const flowStatus = v_flow_button.value?.update_flow_status(data);
        if (!flowStatus) return;

        v_flow_button.value?.set_flow_back("待发货");

        if (data["f_xsy_id"] == TGlobal.userData["f_user_id"]) {
            v_flow_button.value?.set_flow_edit(["新建", "待发货"]);
        }
    };

    // ========== 流程操作 ==========
    const onFlowNew = () => { }

    const onFlowEdit = async () => {
        const data = x_data_xsth.value;

        if (!data["f_xsdck_id"]) {
            eocore.show_info("请选择销售货物");
            return;
        }
        if (!data["f_thyy"]) {
            eocore.show_info("请输入退货原因");
            return;
        }

        const isAdd = !eocore.check_id(data, "f_xsth_id");

        x_show_loading.value = true;
        let ret = await eocore.proc("p_xsth_upd", {
            "v_xsth_id": data["f_xsth_id"],
            "v_xsd_id": data["f_xsd_id"],
            "v_xsdck_id": data["f_xsdck_id"],
            "v_kcmx_id": data["f_kcmx_id"],
            "v_fhr": data["f_fhr"],
            "v_fhdh": data["f_fhdh"],
            "v_fhdz": data["f_fhdz"],
            "v_wlgs_id": data["f_wlgs_id"],
            "v_wldh": data["f_wldh"],
            "v_thje": data["f_thje"],
            "v_thyy": data["f_thyy"],
            "v_beizhu": data["f_beizhu"]
        });
        const dataNew = eocore.check_net_object(ret);
        x_show_loading.value = false;
        if (dataNew == undefined) return;

        if (isAdd) {
            v_flow.value?.clear_list(dataNew["f_xsth_id"]);
            const processData = await v_flow.value?.process_add_data(dataNew["f_xsth_id"], "-");
            if (processData != undefined) {
                dataNew["f_flow_point_id"] = processData["f_flow_point_id"];
                dataNew["f_flow_process_id"] = processData["f_flow_process_id"];
            }
        }

        Object.assign(x_data_xsth.value, dataNew);
        updateFlowStatus();

        eocore.show_success("保存成功");
    }

    const onFlowGet = () => { }

    const onFlowCancel = async () => {
        const dret = await eocore.show_confirm("退货记录是否作废？");
        if (!dret) return;

        const data = x_data_xsth.value;
        data["f_yxbz"] = 0;
        const dataNew = await netLoad_xsth_upd(data);
        if (dataNew == undefined) return;
        Object.assign(x_data_xsth.value, dataNew);
        eocore.show_success("退货已作废");
    }

    const onFlowBack = () => {
        v_flow.value?.process_back_dialog((cancel: boolean, data: any, cb: any) => {
            if (cancel) { cb(true); return; }
            x_data_xsth.value["f_flow_point_id"] = data["f_flow_point_id"];
            updateFlowStatus();
            cb(true);
        });
    }

    const onFlow = async (point: cflow_point) => {
        const pointName = point?.name;
        if (!pointName) return;

        switch (pointName) {
            case "新建":
                onFlowTHTJ();
                break;
            case "待审核":
                v_flow_button.value?.show_flow_dialog(x_data_xsth.value, () => {
                    updateFlowStatus();
                });
                break;
            case "待发货":
                onFlowTHFH();
                break;
            case "已发货":
                onFlowTHRK();
                break;
            case "待退款":
                v_flow_button.value?.show_flow_dialog(x_data_xsth.value, () => {
                    updateFlowStatus();
                });
                break;
            case "完成":
                break;
        }
    }

    const onFlowTHTJ = () => {
        v_flow_button.value?.show_flow_dialog(x_data_xsth.value, () => {
            updateFlowStatus();
        });
    }

    const onFlowTHFH = () => {
        const data = x_data_xsth.value;
        if (!eocore.check_id(data, "f_wlgs_id")) {
            eocore.show_info("请选择物流公司");
            return;
        }
        if (eocore.check_empty(data["f_wldh"])) {
            eocore.show_info("请输入物流单号");
            return;
        }
        v_flow_button.value?.show_flow_dialog(data, () => {
            updateFlowStatus();
        });
    }

    const onFlowTHRK = () => {
        v_flow_button.value?.show_flow_dialog(x_data_xsth.value, async () => {
            updateFlowStatus();
            await processFlow_THRK(x_data_xsth.value);
        });
    }

    const processFlow_THRK = async (xsthData: any) => {
        x_show_loading.value = true;
        const dataNew = await TLogic.netLoad_kcmx_upd(
            xsthData["f_kcmx_id"], 0,
            xsthData["f_cpdy_id"], xsthData["f_kcbh"],
            "销售退货", 0, xsthData["f_hwck"],
            xsthData["f_thje"], xsthData["f_kcsl"],
            TGlobal.userData["f_user_id"],
            xsthData["f_beizhu"],
            TLogic.kcbzCodes["正常"]
        );
        x_show_loading.value = false;
        if (dataNew == undefined) return;

        x_show_loading.value = true;
        const ret = await eocore.proc("p_xsdck_ckbz", {
            "v_xsdck_id": xsthData["f_xsdck_id"],
            "v_ckbz": 2
        });
        x_show_loading.value = false;
        eocore.check_net_object(ret);
    }

    const netLoad_xsth_upd = async (data: any): Promise<any> => {
        const ret = await eocore.proc("p_xsth_upd", {
            "v_xsth_id": data["f_xsth_id"],
            "v_xsd_id": data["f_xsd_id"],
            "v_xsdck_id": data["f_xsdck_id"],
            "v_kcmx_id": data["f_kcmx_id"],
            "v_fhr": data["f_fhr"],
            "v_fhdh": data["f_fhdh"],
            "v_fhdz": data["f_fhdz"],
            "v_wlgs_id": data["f_wlgs_id"],
            "v_wldh": data["f_wldh"],
            "v_thje": data["f_thje"],
            "v_thyy": data["f_thyy"],
            "v_beizhu": data["f_beizhu"]
        });
        return eocore.check_net_object(ret);
    };

    // ========== 货物批次选择 ==========
    const onInputOpen_kcbh = () => {
        v_xsdck_list.value?.show_dialog({});
    }

    const onDialogClose_kcbh = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) { cb(true); return; }

        x_data_xsth.value["f_kcmx_id"] = data["f_kcmx_id"];
        x_data_xsth.value["f_kcbh"] = data["f_kcbh"];
        x_data_xsth.value["f_cpmc"] = data["f_cpmc"];
        x_data_xsth.value["f_kcsl"] = data["f_kcsl"];
        x_data_xsth.value["f_xsd_id"] = data["f_xsd_id"];
        x_data_xsth.value["f_xsdh"] = data["f_xsdh"];
        x_data_xsth.value["f_khgl_id"] = data["f_khgl_id"];
        x_data_xsth.value["f_khmc"] = data["f_khmc"];
        x_data_xsth.value["f_fhr"] = data["f_lxr"];
        x_data_xsth.value["f_fhdh"] = data["f_lxdh"];
        x_data_xsth.value["f_fhdz"] = data["f_lxdz"];
        x_data_xsth.value["f_xsdck_id"] = data["f_xsdck_id"];
        x_data_xsth.value["f_thje"] = data["f_xsdj"] * data["f_kcsl"];
        x_data_xsth.value["f_xsje_s"] = eolib.fixed_num(data["f_thje"], 3);

        TLogic.updateDicUserData(data, ["f_xsy_id"]);

        cb(true);
    }

    // ========== 物流公司选择 ==========
    const onInputOpen_wlgs = () => {
        v_wlgs_list?.value?.show_dialog({});
    }

    const onDialogClose_wlgs = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) { cb(true); return; }
        x_data_xsth.value['f_wlgs_id_s'] = data['f_gsmc'];
        x_data_xsth.value['f_wlgs_id'] = data['f_wlgs_id'];
        cb(true);
    }

    const onTabClick = (tab: any) => {
        switch (tab.paneName) {
            case "flow":
                v_flow.value?.load_List(x_data_xsth.value["f_xsth_id"]);
                break;
        }
    }

</script>

<style lang="scss" scoped>
</style>
