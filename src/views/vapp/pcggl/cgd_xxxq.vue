<template>
    <!-- 采购入库详情 -->
    <div class="eo_col" v-loading="x_show_loading">

        <div class="eo_col_f">
            <div class="eo_scroll_v">
                <div class="eo_form">
                    <div class="cell eo_w100">
                        <div class="label_n">入库单号</div>
                        <div class="input">
                            <el-input v-model="x_data_cgd['f_cgdh']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">供应商</div>
                        <div class="input">
                            <el-input v-model="x_data_cgd['f_gys_id_s']" style="width:100%"
                                placeholder="请选择供应商" :readonly="true">
                                <template #append>
                                    <el-button :icon="More" @click="onButtonClick_gys_list" />
                                </template>
                            </el-input>
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">联系人</div>
                        <div class="input">
                            <el-input v-model="x_data_cgd['f_lxr']" style="width:100%"
                                maxlength="50" placeholder="请输入联系人" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">联系电话</div>
                        <div class="input">
                            <el-input v-model="x_data_cgd['f_lxdh']" style="width:100%"
                                maxlength="20" placeholder="请输入联系电话" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">付款类别</div>
                        <div class="input">
                            <vdic v-model="x_data_cgd['f_fklb']" dic="付款类别" :all="false" field="value" style="width:100%" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">采购员</div>
                        <div class="input">
                            <el-input v-model="x_data_cgd['f_cgy_id_s']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">总金额</div>
                        <div class="input">
                            <el-input v-model="x_data_cgd['f_zje_s']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">实付金额</div>
                        <div class="input">
                            <el-input v-model="x_data_cgd['f_sfje_s']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">创建时间</div>
                        <div class="input">
                            <el-input v-model="x_data_cgd['f_cjsj_s']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">流程状态</div>
                        <div class="input">
                            <el-input v-model="x_data_cgd['f_flow_point_id_s']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">备注</div>
                        <div class="input">
                            <el-input v-model="x_data_cgd['f_beizhu']" style="width:100%"
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
        <gys_list ref="v_gys_list" @close="onDialogClose_gys_list" />
    </div>
    
</template>

<script lang="ts" setup>
    import { ref } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"
    import eoflow, { type cflow_point } from "@/inc/eoflow"

    import vdic from "@/components/vdic.vue"

    import router from "@/router/index"
    import tflow_button from "@/views/comm/app/tflow_button.vue"
    import gys_list from "./gys_list.vue"

    import TGlobal from "@/logic/TGlobal";
    import TLogic from "@/logic/TLogic";

    const emit = defineEmits<{
        update: [data: any]
    }>();

    const x_show_loading = ref(false);

    const v_flow_button = ref<any>();
    const v_gys_list = ref<InstanceType<typeof gys_list>>();

    let x_data_cgd = ref<any>({
        f_cgd_id: 0
    });
    let m_flow: any = undefined;

    // ========== 加载数据 ==========
    const loadData = async (flow: any, cgdData: any) => {
        m_flow = flow;

        // 初始化流程按钮
        v_flow_button.value?.init_flow(flow);

        Object.assign(x_data_cgd.value, {}, cgdData);
        updateFlowStatus();
    }

    // ========== 流程状态更新 ==========
    const updateFlowStatus = () => {

        const data = x_data_cgd.value;

        // 初始状态可编辑
        if (data["f_cgd_id"] <= 0) {
            v_flow_button.value?.set_flow_add();
            return;
        }

        // 是否有效
        const yxbz = data["f_yxbz"];
        if (yxbz == 0) return;

        // 先设置当前流程按钮状态
        const flowStatus = v_flow_button.value?.update_flow_status(data);
        if (!flowStatus) return;

        // 核准之后无法退回
        v_flow_button.value?.set_flow_back("已核准");

        // 只允许编辑自己
        if (data["f_cgy_id"] == TGlobal.userData["f_user_id"]) {
            v_flow_button.value?.set_flow_edit(["新建"]);
        }
    };

    const netLoad_cgd_upd = async (data: any): Promise<any> => {
        const ret = await eocore.proc("p_cgd_upd", {
            "v_cgd_id": data["f_cgd_id"],
            "v_cgdh": data["f_cgdh"],
            "v_gys_id": data["f_gys_id"],
            "v_gys_id_s": data["f_gys_id_s"],
            "v_cgy_id": data["f_cgy_id"],
            "v_cgy_id_s": data["f_cgy_id_s"],
            "v_cgjh_id": data["f_cgjh_id"],
            "v_cgjhdh": data["f_cgjhdh"],
            "v_lxr": data["f_lxr"],
            "v_lxdh": data["f_lxdh"],
            "v_wlgs_id": data["f_wlgs_id"],
            "v_wlgs_id_s": data["f_wlgs_id_s"],
            "v_wldh": data["f_wldh"],
            "v_shr_id": data["f_shr_id"],
            "v_shr_id_s": data["f_shr_id_s"],
            "v_fklb": data["f_fklb"],
            "v_zje": data["f_zje"],
            "v_sfje": data["f_sfje"],
            "v_shsj": data["f_shsj"],
            "v_yxbz": data["f_yxbz"],
            "v_beizhu": data["f_beizhu"]
        });
        return eocore.check_net_object(ret);
    };

    // ========== 流程操作事件 ==========

    /**
     * 统计采购入库数据
     */
    const netLoad_cgd_count = async (cgdData: any): Promise<any> => {
        const ret = await eocore.proc("p_cgdcp_count", {
            "v_cgd_id": cgdData["f_cgd_id"]
        });
        const countData = eocore.check_net_object(ret);
        if (countData == undefined) return undefined;

        if (eocore.to_int(countData["f_count"]) <= 0) {
            eocore.show_info("没有采购明细");
            return undefined;
        }

        cgdData["f_zje"] = eocore.to_float(countData["f_cgzj"]);
        return await netLoad_cgd_upd(cgdData);
    }

    /**
     * 流程操作：提交采购
     */
    const onButtonClick_Flow_CGTJ = async (point: cflow_point, data0: any) => {
        const dataNew = await netLoad_cgd_count(data0);
        if (dataNew == undefined) return;

        Object.assign(x_data_cgd.value, dataNew);

        v_flow_button.value?.show_flow_dialog(x_data_cgd.value, (data1: any) => {
            updateFlowStatus();
            emit('update', x_data_cgd.value);
        });
    }

    /**
     * 流程操作：商家发货
     */
    const onButtonClick_Flow_CGFH = (data0: any) => {

        v_flow_button.value?.show_flow_dialog(data0, (data1: any) => {
            updateFlowStatus();
            emit('update', x_data_cgd.value);
        });
    }

    /**
     * 流程操作：收货入库
     */
    const onButtonClick_Flow_CGRK = async (data0: any) => {
        const cgdId = data0["f_cgd_id"];
        // 检查是否标记入库
        let ret = await eocore.proc("p_cgdcp_list", {
            "v_cgd_id": cgdId,
        });
        const list1 = eocore.check_net_array(ret) || [];
        if (eocore.check_empty(list1)) {
            eocore.show_info("无产品清单");
            return;
        }

        ret = await eocore.proc("p_cgdrk_list", {
            "v_cgd_id": cgdId,
            "v_cgdcp_id": 0
        });
        const list2 = eocore.check_net_array(ret) || [];
        if (eocore.check_empty(list2)) {
            eocore.show_info("无入库产品");
            return;
        }

        let bf;
        for (let d1 of list1) {
            bf = false;
            for (let d2 of list2) {
                if (d1["f_cgdcp_id"] == d2["f_cgdcp_id"]) {
                    bf = true;
                    break;
                }
            }
            if (!bf) {
                eocore.show_info("产品未标记入库");
                return;
            }
        }

        v_flow_button.value?.show_flow_dialog(data0, (data1: any) => {
            updateFlowStatus();
            emit('update', x_data_cgd.value);
        });
    }

    const onFlowNew = () => {
        // 新建已在 cggl.vue 的"新增"按钮中处理
    }

    const onFlowEdit = async () => {

        const data = x_data_cgd.value;

        if (!eocore.check_id(data, "f_gys_id")) {
            eocore.show_info("请选择供应商");
            return;
        }

        const isAdd = !eocore.check_id(data, "f_cgd_id");

        if (isAdd) {
            // 新增：生成采购入库单号
            const cgdh = await TLogic.netLoad_RecordString("采购入库单号", "CG", "yyMMdd", 6);
            if (eocore.check_empty(cgdh)) {
                eocore.show_info("生成入库单号失败");
                return;
            }
            data["f_cgdh"] = cgdh;
        } else {
            // 编辑：检查流程状态
            const flowType = eoflow.get_type_by_name("采购入库");
            if (flowType) {
                const firstPoint = flowType.points[0];
                if (firstPoint && data["f_flow_point_id"] != firstPoint.flow_point_id) {
                    eocore.show_info("入库单已提交，无法修改");
                    return;
                }
            }
        }

        x_show_loading.value = true;
        const dataNew = await netLoad_cgd_upd(data);
        x_show_loading.value = false;
        if (dataNew == undefined) return;

        if (isAdd) {
            // 新增：创建流程节点
            m_flow?.clear_list(dataNew["f_cgd_id"]);
            const processData = await m_flow?.process_add_data(dataNew["f_cgd_id"], "-");
            if (processData != undefined) {
                dataNew["f_flow_point_id"] = processData["f_flow_point_id"];
                dataNew["f_flow_process_id"] = processData["f_flow_process_id"];
            }
        }

        Object.assign(x_data_cgd.value, dataNew);
        updateFlowStatus();

        eocore.show_success("保存成功");

        emit('update', dataNew);
    }

    const onFlowGet = () => {
        // 查看模式，无需额外操作
    }

    const onFlowCancel = async () => {

        const dret = await eocore.show_confirm("确定要作废该入库单吗？");
        if (!dret) return;

        const data = x_data_cgd.value;
        data["f_yxbz"] = 0;
        const dataNew = await netLoad_cgd_upd(data);
        if (dataNew == undefined) return;
        Object.assign(x_data_cgd.value, dataNew);

        eocore.show_success("入库单已作废");

        emit('update', dataNew);
    }

    const onFlowBack = () => {

        m_flow?.process_back_dialog((cancel: boolean, data: any, cb: any) => {

            if (cancel) {
                cb(true); return;
            }
            x_data_cgd.value["f_flow_point_id"] = data["f_flow_point_id"];
            x_data_cgd.value["f_flow_point_id_s"] = data["f_flow_point_id_s"];

            updateFlowStatus();

            cb(true);
        });
    }

    const onFlow = async (point: cflow_point) => {

        const pointName = point?.name;
        if (!pointName) return;

        switch (pointName) {
            case "新建":
                onButtonClick_Flow_CGTJ(point, x_data_cgd.value);
                break;
            case "待审核":
            case "已审核":
                v_flow_button.value?.show_flow_dialog(x_data_cgd.value, (data1: any) => {
                    updateFlowStatus();
                    emit('update', x_data_cgd.value);
                });
                break;
            case "已核准":
                onButtonClick_Flow_CGFH(x_data_cgd.value);
                break;
            case "已发货":
                onButtonClick_Flow_CGRK(x_data_cgd.value);
                break;
            case "完成":
                break;
        }
    }

    // ========== 供应商选择 ==========
    const onButtonClick_gys_list = () => {
        v_gys_list.value?.show_dialog({});
    }

    const onDialogClose_gys_list = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        x_data_cgd.value["f_gys_id"] = data["f_gys_id"];
        x_data_cgd.value["f_gys_id_s"] = data["f_gysmc"];
        x_data_cgd.value["f_lxr"] = data["f_lxr"] ?? "";
        x_data_cgd.value["f_lxdh"] = data["f_lxdh"] ?? "";

        cb(true);
    }

    defineExpose({
        loadData,
        updateFlowStatus
    })
</script>

