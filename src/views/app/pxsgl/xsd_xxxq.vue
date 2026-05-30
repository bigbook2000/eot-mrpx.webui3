<template>
    <!-- 订单详情 -->
    <div class="eo_col">

        <div class="eo_col_f">
            <div class="eo_scroll_v">
                <div class="eo_form">
                    <div class="cell eo_w100">
                        <div class="label_n">销售单号</div>
                        <div class="input">
                            <el-input v-model="x_data_xsd['f_xsdh']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">客户</div>
                        <div class="input">
                            <el-input v-model="x_data_xsd['f_khgl_id_s']" style="width:100%"
                                placeholder="请选择客户" :readonly="true">
                                <template #append>
                                    <el-button :icon="More" @click="onOpenKehuList" />
                                </template>
                            </el-input>
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">联系人</div>
                        <div class="input">
                            <el-input v-model="x_data_xsd['f_lxr']" style="width:100%"
                                maxlength="50" placeholder="请输入联系人" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">联系电话</div>
                        <div class="input">
                            <el-input v-model="x_data_xsd['f_lxdh']" style="width:100%"
                                maxlength="20" placeholder="请输入联系电话" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">客户地址</div>
                        <div class="input">
                            <el-input v-model="x_data_xsd['f_lxdz']" style="width:100%"
                                maxlength="200" placeholder="请输入客户地址" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">销售员</div>
                        <div class="input">
                            <el-input v-model="x_data_xsd['f_xsy_id_s']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">付款类别</div>
                        <div class="input">
                            <el-input v-model="x_data_xsd['f_fklb_s']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">总金额</div>
                        <div class="input">
                            <el-input v-model="x_data_xsd['f_xsje_s']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">实收金额</div>
                        <div class="input">
                            <el-input v-model="x_data_xsd['f_ssje_s']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">创建时间</div>
                        <div class="input">
                            <el-input v-model="x_data_xsd['f_cjsj_s']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">流程状态</div>
                        <div class="input">
                            <el-input v-model="x_data_xsd['f_flow_point_id_s']" style="width:100%" disabled />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">备注</div>
                        <div class="input">
                            <el-input v-model="x_data_xsd['f_beizhu']" style="width:100%"
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
    <kehu_list ref="v_kehu_list" @close="onKehuSelect" />
</template>

<script lang="ts" setup>
    import { ref, reactive, watch } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eoflow, { type cflow_point } from "@/inc/eoflow"

    import router from "@/router/index"
    import tflow_button from "@/views/comm/app/tflow_button.vue"
    import kehu_list from "./kehu_list.vue"

    import TGlobal from "@/logic/TGlobal";
    import TLogic from "@/logic/TLogic";

    const props = defineProps<{
        data: any
        xsdId: number
    }>();

    const emit = defineEmits<{
        save: [data: any]
        cancel: []
    }>();

    const v_flow_button = ref<any>();
    const v_kehu_list = ref<InstanceType<typeof kehu_list>>();

    let x_data_xsd = reactive<any>({});
    let m_flow: any = undefined;

    watch(() => props.data, (val) => {
        if (val) Object.assign(x_data_xsd, val);
    }, { immediate: true });

    // ========== 流程初始化（由父组件调用） ==========

    const initFlow = (flow: any) => {
        m_flow = flow;
        v_flow_button.value?.init_flow(flow);
        if (props.xsdId > 0) {
            updateFlowStatus();
        }
    }

    // ========== 流程状态更新 ==========

    const updateFlowStatus = () => {
        if (props.xsdId <= 0) return;
        const xsdData = props.data;
        if (!xsdData) return;
        const yxbz = xsdData["f_yxbz"];
        if (yxbz == 0) return;

        const flowStatus = v_flow_button.value?.update_flow_status(xsdData);
        if (!flowStatus) return;

        // 核准之后无法退回
        v_flow_button.value?.set_flow_back("已核准");

        // 只允许编辑自己
        if (xsdData["f_xsy_id"] == TGlobal.userData["f_user_id"]) {
            v_flow_button.value?.set_flow_edit(["新建"]);
        }
    };

    const netLoad_xsd_upd = async (data: any): Promise<any> => {
        const ret = await eocore.proc("p_xsd_upd", {
            "v_xsd_id": data["f_xsd_id"] ?? 0,
            "v_xsy_id": data["f_xsy_id"] ?? 0,
            "v_xsdh": data["f_xsdh"] ?? "",
            "v_khgl_id": data["f_khgl_id"] ?? 0,
            "v_xsjh_id": data["f_xsjh_id"] ?? 0,
            "v_lxr": data["f_lxr"] ?? "",
            "v_lxdh": data["f_lxdh"] ?? "",
            "v_lxdz": data["f_lxdz"] ?? "",
            "v_fklb": data["f_fklb"] ?? 1,
            "v_xsje": data["f_xsje"] ?? 0,
            "v_ssje": data["f_ssje"] ?? 0,
            "v_fhy_id": data["f_fhy_id"] ?? 0,
            "v_fhsj": data["f_fhsj"] ?? "",
            "v_yxbz": data["f_yxbz"] ?? 1,
            "v_beizhu": data["f_beizhu"] ?? ""
        });
        return eocore.check_net_object(ret);
    };

    // ========== 流程操作事件 ==========

    /**
     * 统计销售订单数据
     */
    const netLoad_xsd_count = async (xsdData: any): Promise<any> => {
        const ret = await eocore.proc("p_xsdcp_count", {
            "v_xsd_id": xsdData["f_xsd_id"]
        });
        const data = eocore.check_net_object(ret);
        if (data == undefined) return undefined;

        if (eocore.to_int(data["f_count"]) <= 0) {
            eocore.show_info("没有订单明细");
            return undefined;
        }

        xsdData["f_xsje"] = eocore.to_float(data["f_xszj"]);
        return await netLoad_xsd_upd(xsdData);
    }

    /**
     * 流程操作：提交订单
     */
    const onButtonClick_Flow_XSTJ = async (point: cflow_point, data0: any) => {
        const dataNew = await netLoad_xsd_count(data0);
        if (dataNew == undefined) return;

        Object.assign(props.data, dataNew);
        Object.assign(x_data_xsd, dataNew);

        v_flow_button.value?.show_flow_dialog(props.data, (data1: any) => {
            updateFlowStatus();
        });
    }

    /**
     * 流程操作：安排生产（核对货物是否齐备）
     */
    const onButtonClick_Flow_XSSC = async (data0: any) => {
        // 核对货物是否齐备
        const ret1 = await eocore.proc("p_xsdcp_list", {
            "v_xsd_id": data0["f_xsd_id"],
        });
        const list1 = eocore.check_net_array(ret1) || [];
        if (eocore.check_empty(list1)) {
            eocore.show_info("无销售产品清单");
            return;
        }

        const ret2 = await eocore.proc("p_xsdck_list", {
            "v_xsd_id": data0["f_xsd_id"],
            "v_xsdcp_id": -1
        });
        const list2 = eocore.check_net_array(ret2) || [];
        if (eocore.check_empty(list2)) {
            eocore.show_info("无库存货物");
            return;
        }

        for (let d1 of list1) {
            let pcount = 0;
            for (let d2 of list2) {
                if (d1["f_cpdy_id"] == d2["f_cpdy_id"]) {
                    pcount += d2["f_kcsl"];
                }
            }
            if (pcount != d1["f_xssl"]) {
                eocore.show_info("货物 " + d1["f_cpmc"] + " 数量不匹配");
                return;
            }
        }

        v_flow_button.value?.show_flow_dialog(data0, (data1: any) => {
            updateFlowStatus();
        });
    }

    /**
     * 流程操作：产品出库
     */
    const onButtonClick_Flow_XSCK = async (data0: any) => {
        // 检查是否标记出库
        const ret = await eocore.proc("p_xsdck_list", {
            "v_xsd_id": data0["f_xsd_id"],
            "v_xsdcp_id": -1
        });
        const list = eocore.check_net_array(ret) || [];
        if (eocore.check_empty(list)) {
            eocore.show_info("无库存货物");
            return;
        }

        for (let d of list) {
            if (!eocore.check_id(d, "f_wlgs_id")) {
                eocore.show_info("物流公司填写不完整");
                return;
            }
            if (eocore.check_empty(d["f_wldh"])) {
                eocore.show_info("物流单号填写不完整");
                return;
            }
        }

        v_flow_button.value?.show_flow_dialog(data0, (data1: any) => {
            updateFlowStatus();
            processFlow_XSCK(data1);
        });
    }

    /**
     * 将货物出库
     */
    const processFlow_XSCK = async (xsdData: any) => {
        const ret = await eocore.proc("p_xsdck_list", {
            "v_xsd_id": xsdData["f_xsd_id"],
            "v_xsdcp_id": 0
        });
        const list = eocore.check_net_array(ret);
        if (list == undefined) return;

        for (let d of list) {
            const dataNew = await TLogic.netLoad_kcmx_upd(
                d["f_kcmx_id"],
                0,
                d["f_cpdy_id"],
                d["f_kcbh"],
                "销售出库",
                d["f_xsd_id"],
                d["f_hwck"],
                d["f_kcdj"],
                d["f_kcsl"],
                TGlobal.userData["f_user_id"],
                d["f_beizhu"],
                TLogic.kcbzCodes["历史"]
            );
            if (dataNew == undefined) return;
        }
    }

    const onFlowNew = () => {
        // 新建已在 xsgl.vue 的"新增"按钮中处理
    }

    const onFlowEdit = () => {
        // 编辑直接使用表单的保存按钮
    }

    const onFlowGet = () => {
        // 查看模式，无需额外操作
    }

    const onFlowCancel = async () => {
        const ok = await eocore.show_confirm("确定要作废该订单吗？");
        if (!ok) return;
        props.data["f_yxbz"] = 0;
        const dataNew = await netLoad_xsd_upd(props.data);
        if (dataNew == undefined) return;
        Object.assign(x_data_xsd, dataNew);
        eocore.show_success("订单已作废");
        emit('cancel');
    }

    const onFlowBack = () => {
        m_flow?.process_back_dialog((cancel: boolean, data: any, cb: any) => {
            if (cancel) { cb(true); return; }
            props.data["f_flow_point_id"] = data["f_flow_point_id"];
            props.data["f_flow_point_id_s"] = data["f_flow_point_id_s"];
            Object.assign(x_data_xsd, props.data);
            updateFlowStatus();
            cb(true);
        });
    }

    const onFlow = async (point: cflow_point) => {

        const pointName = point?.name;
        if (!pointName) return;

        const xsdData = props.data;

        switch (pointName) {
            case "新建":
                onButtonClick_Flow_XSTJ(point, xsdData);
                break;
            case "待审核":
            case "已审核":
                v_flow_button.value?.show_flow_dialog(xsdData, (data1: any) => {
                    Object.assign(x_data_xsd, xsdData);
                    updateFlowStatus();
                });
                break;
            case "已核准":
                onButtonClick_Flow_XSSC(xsdData);
                break;
            case "已生产":
                onButtonClick_Flow_XSCK(xsdData);
                break;
            case "已发货":
            case "已收货":
                v_flow_button.value?.show_flow_dialog(xsdData, (data1: any) => {
                    Object.assign(x_data_xsd, xsdData);
                    updateFlowStatus();
                });
                break;
            case "完成":
                break;
        }
    }

    // ========== 客户选择 ==========

    const onOpenKehuList = () => {
        v_kehu_list.value?.show_dialog({});
    }

    const onKehuSelect = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        const kh = {
            f_khgl_id: data["f_khgl_id"],
            f_khgl_id_s: data["f_khmc"],
            f_lxr: data["f_lxr"] ?? "",
            f_lxdh: data["f_lxfs"] ?? "",
            f_lxdz: data["f_gsdz"] ?? ""
        };
        // 同步到本地表单
        Object.assign(x_data_xsd, kh);
        // 同步到父组件数据（供流程操作等使用）
        Object.assign(props.data, kh);

        cb(true);
    }

    defineExpose({ updateFlowStatus, initFlow })
</script>
