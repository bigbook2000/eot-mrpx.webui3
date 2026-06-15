<template>
    <!-- 采购入库详情 -->
    <div class="eo_col">

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
                                    <el-button :icon="More" @click="onOpenGysList" />
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
                            <el-input v-model="x_data_cgd['f_fklb_s']" style="width:100%" disabled />
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
    </div>
    <gys_list ref="v_gys_list" @close="onGysSelect" />
</template>

<script lang="ts" setup>
    import { ref, reactive, watch } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eoflow, { type cflow_point } from "@/inc/eoflow"

    import router from "@/router/index"
    import tflow_button from "@/views/comm/app/tflow_button.vue"
    import gys_list from "./gys_list.vue"

    import TGlobal from "@/logic/TGlobal";
    import TLogic from "@/logic/TLogic";

    const props = defineProps<{
        data: any
        cgdId: number
    }>();

    const emit = defineEmits<{
        save: [data: any]
        cancel: []
    }>();

    const v_flow_button = ref<any>();
    const v_gys_list = ref<InstanceType<typeof gys_list>>();

    let x_data_cgd = reactive<any>({});
    let m_flow: any = undefined;

    // ========== 流程初始化（由父组件调用） ==========

    const initFlow = (flow: any) => {
        m_flow = flow;
        v_flow_button.value?.init_flow(flow);
        
        updateFlowStatus();
    }

    // ========== 流程状态更新 ==========

    const updateFlowStatus = () => {

        if (props.cgdId <= 0) return;
        const cgdData = props.data;
        if (!cgdData) return;
        const yxbz = cgdData["f_yxbz"];
        if (yxbz == 0) return;

        const flowStatus = v_flow_button.value?.update_flow_status(cgdData);        
        if (!flowStatus) return;

        // 核准之后无法退回
        v_flow_button.value?.set_flow_back("已核准");
        
        // 只允许编辑自己
        if (cgdData["f_xsy_id"] == TGlobal.userData["f_user_id"]) {
            v_flow_button.value?.set_flow_edit(["新建"]);
        }
    };

    const netLoad_cgd_upd = async (data: any): Promise<any> => {
        const ret = await eocore.proc("p_cgd_upd", {
            "v_cgd_id": data["f_cgd_id"] ?? 0,
            "v_cgdh": data["f_cgdh"] ?? "",
            "v_gys_id": data["f_gys_id"] ?? 0,
            "v_gys_id_s": data["f_gys_id_s"] ?? "",
            "v_cgy_id": data["f_cgy_id"] ?? 0,
            "v_cgy_id_s": data["f_cgy_id_s"] ?? "",
            "v_cgjh_id": data["f_cgjh_id"] ?? 0,
            "v_cgjhdh": data["f_cgjhdh"] ?? "",
            "v_lxr": data["f_lxr"] ?? "",
            "v_lxdh": data["f_lxdh"] ?? "",
            "v_wlgs_id": data["f_wlgs_id"] ?? 0,
            "v_wlgs_id_s": data["f_wlgs_id_s"] ?? "",
            "v_wldh": data["f_wldh"] ?? "",
            "v_shr_id": data["f_shr_id"] ?? 0,
            "v_shr_id_s": data["f_shr_id_s"] ?? "",
            "v_fklb": data["f_fklb"] ?? 1,
            "v_zje": data["f_zje"] ?? 0,
            "v_sfje": data["f_sfje"] ?? 0,
            "v_shsj": data["f_shsj"] ?? "",
            "v_yxbz": data["f_yxbz"] ?? 1,
            "v_beizhu": data["f_beizhu"] ?? ""
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
        const data = eocore.check_net_object(ret);
        if (data == undefined) return undefined;

        if (eocore.to_int(data["f_count"]) <= 0) {
            eocore.show_info("没有采购明细");
            return undefined;
        }

        cgdData["f_zje"] = eocore.to_float(data["f_cgzj"]);
        return await netLoad_cgd_upd(cgdData);
    }

    /**
     * 流程操作：提交采购
     */
    const onButtonClick_Flow_CGTJ = async (point: cflow_point, data0: any) => {
        const dataNew = await netLoad_cgd_count(data0);
        if (dataNew == undefined) return;

        Object.assign(props.data, dataNew);
        Object.assign(x_data_cgd, dataNew);

        v_flow_button.value?.show_flow_dialog(props.data, (data1: any) => {
            updateFlowStatus();
        });
    }

    /**
     * 流程操作：商家发货
     */
    const onButtonClick_Flow_CGFH = (data0: any) => {

        v_flow_button.value?.show_flow_dialog(data0, (data1: any) => {
            updateFlowStatus();
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
        });
    }

    const onFlowNew = () => {
        // 新建已在 cggl.vue 的"新增"按钮中处理
    }

    const onFlowEdit = () => {
        // 编辑直接使用表单的保存按钮
    }

    const onFlowGet = () => {
        // 查看模式，无需额外操作
    }

    const onFlowCancel = async () => {
        const ok = await eocore.show_confirm("确定要作废该入库单吗？");
        if (!ok) return;
        props.data["f_yxbz"] = 0;
        const dataNew = await netLoad_cgd_upd(props.data);
        if (dataNew == undefined) return;
        Object.assign(x_data_cgd, dataNew);
        eocore.show_success("入库单已作废");
        emit('cancel');
    }

    const onFlowBack = () => {
        m_flow?.process_back_dialog((cancel: boolean, data: any, cb: any) => {
            if (cancel) { cb(true); return; }
            props.data["f_flow_point_id"] = data["f_flow_point_id"];
            props.data["f_flow_point_id_s"] = data["f_flow_point_id_s"];
            Object.assign(x_data_cgd, props.data);
            updateFlowStatus();
            cb(true);
        });
    }

    const onFlow = async (point: cflow_point) => {

        const pointName = point?.name;
        if (!pointName) return;

        const cgdData = props.data;

        switch (pointName) {
            case "新建":
                onButtonClick_Flow_CGTJ(point, cgdData);
                break;
            case "待审核":
            case "已审核":
                v_flow_button.value?.show_flow_dialog(cgdData, (data1: any) => {
                    Object.assign(x_data_cgd, cgdData);
                    updateFlowStatus();
                });
                break;
            case "已核准":
                onButtonClick_Flow_CGFH(cgdData);
                break;
            case "已发货":
                onButtonClick_Flow_CGRK(cgdData);
                break;
            case "完成":
                break;
        }
    }

    // ========== 供应商选择 ==========

    const onOpenGysList = () => {
        v_gys_list.value?.show_dialog({});
    }

    const onGysSelect = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        const gys = {
            f_gys_id: data["f_gys_id"],
            f_gys_id_s: data["f_gysmc"],
            f_lxr: data["f_lxr"] ?? "",
            f_lxdh: data["f_lxdh"] ?? ""
        };
        Object.assign(x_data_cgd, gys);
        Object.assign(props.data, gys);

        cb(true);
    }

    defineExpose({ updateFlowStatus, initFlow })
</script>
