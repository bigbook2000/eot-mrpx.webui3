<template>
    <!-- 采购退货详情 - 路由页面 -->
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
                                                <el-input v-model="x_data_cgth['f_kcbh']" style="width:100%"
                                                    placeholder="请选择货物批次" readonly>
                                                    <template #append>
                                                        <el-button :icon="More"
                                                            @click="onInputOpen_cgdrk" />
                                                    </template>
                                                </el-input>
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">产品名称</div>
                                            <div class="input">
                                                <el-input v-model="x_data_cgth['f_cpmc']" style="width:100%" disabled />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">数量</div>
                                            <div class="input">
                                                <el-input v-model="x_data_cgth['f_kcsl']" style="width:100%" disabled />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">采购单号</div>
                                            <div class="input">
                                                <el-input v-model="x_data_cgth['f_cgdh']" style="width:100%" disabled />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">供应商</div>
                                            <div class="input">
                                                <el-input v-model="x_data_cgth['f_gysmc']" style="width:100%" disabled />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">退款金额</div>
                                            <div class="input">
                                                <el-input-number v-model="x_data_cgth['f_thje']"
                                                    :precision="2" :step="1" :min="0"
                                                    style="width:100%" />
                                            </div>
                                        </div>                                        
                                        <div class="cell eo_w100">
                                            <div class="label_n">物流公司</div>
                                            <div class="input">
                                                <el-input v-model="x_data_cgth['f_wlgs_id_s']" style="width:100%"
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
                                                <el-input v-model="x_data_cgth['f_wldh']" style="width:100%"
                                                    maxlength="50" placeholder="请输入物流单号" />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">收货人</div>
                                            <div class="input">
                                                <el-input v-model="x_data_cgth['f_shr']" style="width:100%"
                                                    maxlength="50" placeholder="请输入收货人" />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">收货电话</div>
                                            <div class="input">
                                                <el-input v-model="x_data_cgth['f_shdh']" style="width:100%"
                                                    maxlength="20" placeholder="请输入收货电话" />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">采购员</div>
                                            <div class="input">
                                                <el-input v-model="x_data_cgth['f_cgy_id_s']" style="width:100%" disabled />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">收货地址</div>
                                            <div class="input">
                                                <el-input v-model="x_data_cgth['f_shdz']" style="width:100%"
                                                    maxlength="200" placeholder="请输入收货地址" />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">退货原因</div>
                                            <div class="input">
                                                <el-input v-model="x_data_cgth['f_thyy']" style="width:100%"
                                                    type="textarea" :rows="3"
                                                    maxlength="500" placeholder="请输入退货原因" />
                                            </div>
                                        </div>
                                        <div class="cell eo_w100">
                                            <div class="label_n">备注</div>
                                            <div class="input">
                                                <el-input v-model="x_data_cgth['f_beizhu']" style="width:100%"
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
                        <vflow ref="v_flow" type="采购退货" :app="true" />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <cgdrk_list ref="v_cgdrk_list" @close="onDialogClose_cgdrk" />
        <wlgs_list ref="v_wlgs_list" @close="onDialogClose_wlgs" />
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_cggl_cgth_xx" }
</script>

<script lang="ts" setup>
    import { ref, onMounted, nextTick } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";
    import eoflow, { type cflow_point } from "@/inc/eoflow";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"

    import router from "@/router/index"
    import topbar from '@/views/vapp/comm/topbar.vue'

    import vflow from "@/components/app/vflow.vue"
    import tflow_button from "@/views/comm/app/tflow_button.vue"

    import cgdrk_list from "@/views/vapp/pcggl/cgdrk_list.vue"
    import wlgs_list from "@/views/vapp/pcggl/wlgs_list.vue"

    import TGlobal from "@/logic/TGlobal";
    import TLogic from "@/logic/TLogic";

    const v_flow = ref<InstanceType<typeof vflow>>();
    const v_flow_button = ref<any>();
    const v_cgdrk_list = ref<InstanceType<typeof cgdrk_list>>();
    const v_wlgs_list = ref<InstanceType<typeof wlgs_list>>();

    const x_active_tab = ref("xq");
    const x_show_loading = ref(false);

    const x_data_cgth = ref<any>({
        f_cgth_id: 0,
        f_cgdh: "",
        f_cgdrk_id: 0,
        f_kcmx_id: 0,
        f_cpdy_id: 0,
        f_cpmc: "",
        f_kcbh: "",
        f_gys_id: 0,
        f_gysmc: "",
        f_cgy_id: TGlobal.userData["f_user_id"],
        f_cgy_id_s: TGlobal.userData["f_name"],
        f_cgdj: 0.0,
        f_kcsl: 0,
        f_thje: 0.0,
        f_wlgs_id: 0,
        f_wlgs_id_s: "",
        f_wldh: "",
        f_shr: "",
        f_shdh: "",
        f_shdz: "",
        f_thyy: "",
        f_thbz: 0,
        f_cjsj: "",
        f_beizhu: "",
        f_flow_point_id: 0,
        f_flow_process_id: 0
    });

    onMounted(async () => {
        const cgthId = eocore.to_int(router.currentRoute.value.query.id);

        if (cgthId > 0) {
            await netLoad_cgth_get(cgthId);
        }

        nextTick(() => {
            v_flow_button.value?.init_flow(v_flow.value);
            v_flow.value?.load_List(x_data_cgth.value["f_cgth_id"]);
            updateFlowStatus();
        });
    });

    const netLoad_cgth_get = async (cgthId: number) => {
        x_show_loading.value = true;
        const ret = await eocore.proc("p_cgth_get", { "v_cgth_id": cgthId });
        x_show_loading.value = false;
        const data = eocore.check_net_object(ret);
        if (data == undefined) return;

        data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"]);
        data["f_thje_s"] = eolib.fixed_num(data["f_thje"], 3);
        data["f_wlgs_id_s"] = TLogic.getLabel_wlgs(data["f_wlgs_id"]);
        TLogic.updateDicUserData(data, ["f_cgy_id"]);

        Object.assign(x_data_cgth.value, data);
    }

    // ========== 流程状态更新 ==========
    const updateFlowStatus = () => {
        const data = x_data_cgth.value;

        if (data["f_cgth_id"] <= 0) {
            v_flow_button.value?.set_flow_add();
            return;
        }

        const yxbz = data["f_yxbz"];
        if (yxbz == 0) return;

        const flowStatus = v_flow_button.value?.update_flow_status(data);
        if (!flowStatus) return;

        v_flow_button.value?.set_flow_back("待发货");

        if (data["f_cgy_id"] == TGlobal.userData["f_user_id"]) {
            v_flow_button.value?.set_flow_edit(["新建", "待发货"]);
        }
    };

    // ========== 流程操作 ==========
    const onFlowNew = () => { }

    const onFlowEdit = async () => {
        const data = x_data_cgth.value;

        if (!data["f_cgdrk_id"]) {
            eocore.show_info("请选择采购货物");
            return;
        }
        if (!data["f_thyy"]) {
            eocore.show_info("请输入退货原因");
            return;
        }

        const isAdd = !eocore.check_id(data, "f_cgth_id");

        x_show_loading.value = true;
        let ret = await eocore.proc("p_cgth_upd", {
            "v_cgth_id": data["f_cgth_id"],
            "v_cgd_id": data["f_cgd_id"],
            "v_cgdrk_id": data["f_cgdrk_id"],
            "v_kcmx_id": data["f_kcmx_id"],
            "v_kgy_id": TGlobal.userData["f_user_id"],
            "v_shr": data["f_shr"],
            "v_shdh": data["f_shdh"],
            "v_shdz": data["f_shdz"],
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
            v_flow.value?.clear_list(dataNew["f_cgth_id"]);
            const processData = await v_flow.value?.process_add_data(dataNew["f_cgth_id"], "-");
            if (processData != undefined) {
                dataNew["f_flow_point_id"] = processData["f_flow_point_id"];
                dataNew["f_flow_process_id"] = processData["f_flow_process_id"];
            }
        }

        Object.assign(x_data_cgth.value, dataNew);
        updateFlowStatus();

        eocore.show_success("保存成功");
    }

    const onFlowGet = () => { }

    const onFlowCancel = async () => {
        const dret = await eocore.show_confirm("退货记录是否作废？");
        if (!dret) return;

        const data = x_data_cgth.value;
        data["f_yxbz"] = 0;
        const dataNew = await netLoad_cgth_upd(data);
        if (dataNew == undefined) return;
        Object.assign(x_data_cgth.value, dataNew);
        eocore.show_success("退货已作废");
    }

    const onFlowBack = () => {
        v_flow.value?.process_back_dialog((cancel: boolean, data: any, cb: any) => {
            if (cancel) { cb(true); return; }
            x_data_cgth.value["f_flow_point_id"] = data["f_flow_point_id"];
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
                v_flow_button.value?.show_flow_dialog(x_data_cgth.value, () => {
                    updateFlowStatus();
                });
                break;
            case "待发货":
                onFlowTHCK();
                break;
            case "已发货":
                v_flow_button.value?.show_flow_dialog(x_data_cgth.value, () => {
                    updateFlowStatus();
                });
                break;
            case "待退款":
                v_flow_button.value?.show_flow_dialog(x_data_cgth.value, () => {
                    updateFlowStatus();
                });
                break;
            case "完成":
                break;
        }
    }

    const onFlowTHTJ = () => {
        v_flow_button.value?.show_flow_dialog(x_data_cgth.value, () => {
            updateFlowStatus();
        });
    }

    const onFlowTHCK = () => {
        const data = x_data_cgth.value;
        if (!eocore.check_id(data, "f_wlgs_id")) {
            eocore.show_info("请选择物流公司");
            return;
        }
        if (eocore.check_empty(data["f_wldh"])) {
            eocore.show_info("请输入物流单号");
            return;
        }
        v_flow_button.value?.show_flow_dialog(data, async () => {
            updateFlowStatus();
            await processFlow_THCK(data);
        });
    }

    const processFlow_THCK = async (cgthData: any) => {
        x_show_loading.value = true;
        const dataNew = await TLogic.netLoad_kcmx_upd(
            cgthData["f_kcmx_id"], 0,
            cgthData["f_cpdy_id"], cgthData["f_kcbh"],
            "采购退货", 0, cgthData["f_hwck"],
            cgthData["f_kcdj"], cgthData["f_kcsl"],
            TGlobal.userData["f_user_id"],
            cgthData["f_beizhu"],
            TLogic.kcbzCodes["历史"]
        );
        x_show_loading.value = false;
        if (dataNew == undefined) return;

        x_show_loading.value = true;
        const ret = await eocore.proc("p_cgdrk_rkbz", {
            "v_cgdrk_id": cgthData["f_cgdrk_id"],
            "v_rkbz": 2
        });
        x_show_loading.value = false;
        eocore.check_net_object(ret);
    }

    const netLoad_cgth_upd = async (data: any): Promise<any> => {
        const ret = await eocore.proc("p_cgth_upd", {
            "v_cgth_id": data["f_cgth_id"],
            "v_cgd_id": data["f_cgd_id"],
            "v_cgdrk_id": data["f_cgdrk_id"],
            "v_kcmx_id": data["f_kcmx_id"],
            "v_kgy_id": TGlobal.userData["f_user_id"],
            "v_shr": data["f_shr"],
            "v_shdh": data["f_shdh"],
            "v_shdz": data["f_shdz"],
            "v_wlgs_id": data["f_wlgs_id"],
            "v_wldh": data["f_wldh"],
            "v_thje": data["f_thje"],
            "v_thyy": data["f_thyy"],
            "v_beizhu": data["f_beizhu"]
        });
        return eocore.check_net_object(ret);
    };

    // ========== 货物批次选择 ==========
    const onInputOpen_cgdrk = () => {
        v_cgdrk_list.value?.show_dialog({});
    }

    const onDialogClose_cgdrk = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) { cb(true); return; }

        x_data_cgth.value["f_kcmx_id"] = data["f_kcmx_id"];
        x_data_cgth.value["f_kcbh"] = data["f_kcbh"];
        x_data_cgth.value["f_cpmc"] = data["f_cpmc"];
        x_data_cgth.value["f_kcsl"] = data["f_kcsl"];
        x_data_cgth.value["f_cgd_id"] = data["f_cgd_id"];
        x_data_cgth.value["f_cgdh"] = data["f_cgdh"];
        x_data_cgth.value["f_gys_id"] = data["f_gys_id"];
        x_data_cgth.value["f_gysmc"] = data["f_gysmc"];
        x_data_cgth.value["f_shr"] = data["f_lxr"];
        x_data_cgth.value["f_shdh"] = data["f_lxdh"];
        x_data_cgth.value["f_shdz"] = data["f_lxdz"];
        x_data_cgth.value["f_cgdrk_id"] = data["f_cgdrk_id"];
        x_data_cgth.value["f_thje"] = data["f_cgdj"] * data["f_kcsl"];

        TLogic.updateDicUserData(data, ["f_cgy_id"]);

        cb(true);
    }

    // ========== 物流公司选择 ==========
    const onInputOpen_wlgs = () => {
        v_wlgs_list?.value?.show_dialog({});
    }

    const onDialogClose_wlgs = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) { cb(true); return; }
        x_data_cgth.value['f_wlgs_id_s'] = data['f_gsmc'];
        x_data_cgth.value['f_wlgs_id'] = data['f_wlgs_id'];
        cb(true);
    }

    const onTabClick = (tab: any) => {
        switch (tab.paneName) {
            case "flow":
                v_flow.value?.load_List(x_data_cgth.value["f_cgth_id"]);
                break;
        }
    }

</script>

<style lang="scss" scoped>
</style>
