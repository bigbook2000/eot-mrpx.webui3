<template>
    <!-- 产品清单 -->
    <div class="eo_col" v-loading="x_show_loading">
        <!-- 工具栏按钮 -->
        <div class="eo_col_d eo_form" v-show="m_edit_mode == 1">
            <div class="button">
                <el-button class="ap_button" type="primary" @click="onButtonAdd_cgdcp">添加产品</el-button>
            </div>
        </div>
        <div class="eo_col_f">
            <div class="eo_scroll_v">
                <div class="ap_list">
                    <div v-if="x_data_list.length == 0" class="empty">
                        暂无产品
                    </div>
                    <div v-for="item in x_data_list" :key="item.f_cgdcp_id" class="item">
                        <div class="body">
                            <div class="row">
                                <span class="value title">{{ item['f_cpmc'] }}</span>
                            </div>
                            <div class="row">
                                <span class="label">件数</span>
                                <span class="value">{{ item['f_cgsl'] }}</span>
                                <span class="label">采购单价</span>
                                <span class="value">{{ item['f_cgdj_s'] }}</span>
                            </div>
                            <div class="row">
                                <span class="label">总价</span>
                                <span class="value">{{ item['f_cgzj_s'] }}</span>
                                <span class="label">成本价</span>
                                <span class="value">{{ item['f_kcdj_s'] }}</span>
                            </div>
                            <div class="row" v-if="item.f_cpbm">
                                <span class="label">编码</span>
                                <span class="value">{{ item['f_cpbm'] }}</span>
                            </div>
                            <div class="row" v-if="item.f_wlgs_id_s">
                                <span class="label">物流</span>
                                <span class="value">{{ item['f_wlgs_id_s'] }}</span>
                            </div>
                            <div class="row" v-if="item.f_wldh">
                                <span class="label">物流单号</span>
                                <span class="value">{{ item['f_wldh'] }}</span>
                            </div>
                            <div class="row" v-if="item.f_beizhu">
                                <span class="label">备注</span>
                                <span class="value">{{ item['f_beizhu'] }}</span>
                            </div>
                            <div class="row">
                                <el-button class="ap_button" v-if="m_edit_mode == 1"
                                    @click.stop="onButtonDel_cgdcp(item['f_cgdcp_id'])">移除</el-button>
                                <el-button class="ap_button" type="primary" v-if="m_edit_mode == 2"
                                    @click.stop="onButtonUpd_cgdcp(item['f_cgdcp_id'])">修改</el-button>
                                <el-button class="ap_button" type="primary" v-if="m_edit_mode == 3"
                                    @click.stop="onButtonUpd_cgdrk(item['f_cgdcp_id'])">入库</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <cgdcp_xx ref="v_cgdcp_xx" @close="onDialogClose_cgdcp_xx" />
    </div>
</template>

<script lang="ts" setup>
    import { ref } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";
    import eoflow, { type cflow_point } from "@/inc/eoflow"

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"

    import TLogic from "@/logic/TLogic";

    import cgdcp_xx from "./cgdcp_xx.vue"

    type t_cgdcp_xx = InstanceType<typeof cgdcp_xx>;
    const v_cgdcp_xx = ref<t_cgdcp_xx>();

    const x_data_list = ref<any[]>([]);
    const x_show_loading = ref(false);

    let m_data_cgd: any = {
        f_cgd_id: 0,
        f_cgdh: "",
    };
    const m_edit_mode = ref(0);
    let m_field_cp: string[] = [];

    const loadList = async (flow: any, cgdData: any) => {

        Object.assign(m_data_cgd, {}, cgdData);

        if (!eocore.check_id(m_data_cgd, "f_cgd_id")) {
            x_data_list.value = [];
            return;
        }
        x_show_loading.value = true;
        let ret = await eocore.proc("p_cgdcp_list", {
            "v_cgd_id": m_data_cgd["f_cgd_id"],
        });
        let list = eocore.check_net_array(ret) || [];
        x_show_loading.value = false;

        for (let d of list) {
            d["f_cgdj_s"] = eolib.fixed_num(d["f_cgdj"], 3);
            d["f_cgzj_s"] = eolib.fixed_num(d["f_cgdj"] * d["f_cgsl"], 3);
            const kcdj = eolib.divide_num(d["f_kczj"], d["f_cgsl"]);
            d["f_kcdj_s"] = eolib.fixed_num(kcdj, 3);
            d["f_wlgs_id_s"] = TLogic.getLabel_wlgs(d["f_wlgs_id"]);
        }
        x_data_list.value = list;

        const point = flow?.get_point_by_id(m_data_cgd["f_flow_point_id"]);
        updateFlowStatus(point?.name);
    }

    /**
     * 根据不同流程控制清单编辑
     */
    const updateFlowStatus = async (pointName: string) => {
        if (!pointName) return;

        m_edit_mode.value = 0;
        m_field_cp = [""];

        switch (pointName) {
            case "新建":
                m_edit_mode.value = 1;
                m_field_cp = ["*"];
                break;
            case "待审核":
            case "已审核":
                m_edit_mode.value = 2;
                m_field_cp = ["f_wlgs_id", "f_wldh"];
                break;
            case "已核准":                
                break;
            case "已发货":
                m_edit_mode.value = 3;
                break;
            case "完成":
                break;
        }
    }

    /**
     * 添加产品
     */
    const onButtonAdd_cgdcp = () => {

        if (m_edit_mode.value != 1) {
            eocore.show_error("产品明细不可编辑");
            return;
        }

        if (m_data_cgd["f_cgd_id"] <= 0) {
            eocore.show_error("请先保存采购单");
            return;
        }

        let cgdcpData = {
            f_cgdcp_id: 0,
            f_cpdy_id: 0,
            f_cpmc: "",
            f_cpbm: "",
            f_cgd_id: m_data_cgd["f_cgd_id"],
            f_cgdh: m_data_cgd["f_cgdh"],
            f_cpjg: 0.0,
            f_cpsl: 0.0,
            f_cpzj: 0.0,
            f_cgsl: 1.0,
            f_bzsl: 1.0,
            f_cgdj: 0.0,
            f_cgzj: 0.0,
            f_wlgs_id: 0,
            f_wlgs_id_s: "",
            f_wldh: "",
            f_beizhu: "",
        };

        v_cgdcp_xx.value?.showDialog("产品信息", cgdcpData, m_field_cp, true);
    }

    /**
     * 移除产品
     */
    const onButtonDel_cgdcp = async (cgdcpId: number) => {

        if (cgdcpId <= 0) {
            eocore.show_info("请先选择要移除的产品");
            return;
        }

        try {
            await eocore.show_confirm("确认移除该产品？");
        } catch {
            return;
        }

        x_show_loading.value = true;
        await eocore.proc("p_cgdcp_del", {
            "v_cgdcp_id": cgdcpId
        });
        x_show_loading.value = false;

        const idx = x_data_list.value.findIndex(d => d.f_cgdcp_id == cgdcpId);
        if (idx >= 0) {
            x_data_list.value.splice(idx, 1);
        }
    }

    /**
     * 修改产品
     */
    const onButtonUpd_cgdcp = (cgdcpId: number) => {
        if (cgdcpId <= 0) {
            eocore.show_info("请先选择要修改的产品");
            return;
        }

        const item = x_data_list.value.find(d => d.f_cgdcp_id == cgdcpId);
        if (!item) {
            eocore.show_info("未找到所选产品");
            return;
        }
        v_cgdcp_xx.value?.showDialog("产品信息", { ...item }, m_field_cp, true);
    }

    /**
     * 入库产品
     */
    const onButtonUpd_cgdrk = (cgdcpId: number) => {
        if (cgdcpId <= 0) {
            eocore.show_info("请先选择要入库的产品");
            return;
        }

        const cgdcpData = x_data_list.value.find(d => d.f_cgdcp_id == cgdcpId);
        if (!cgdcpData) {
            eocore.show_info("未找到所选产品");
            return;
        }

        v_cgdcp_xx.value?.showDialog("产品入库", cgdcpData, [], false);
    }

    /**
     * 产品明细对话框关闭
     */
    const onDialogClose_cgdcp_xx = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        console.log("onDialogClose", data);
        if (data == undefined) return;

        const isAdd = data["_is_add"];
        if (isAdd) {
            x_data_list.value.push(data);
        } else {
            const idx = x_data_list.value.findIndex(d => d.f_cgdcp_id == data.f_cgdcp_id);
            if (idx >= 0) {
                x_data_list.value[idx] = data;
            }
        }

        // 格式化新数据
        data["f_cgdj_s"] = eolib.fixed_num(data["f_cgdj"], 3);
        data["f_cgzj_s"] = eolib.fixed_num(data["f_cgdj"] * data["f_cgsl"], 3);

        cb(true);
    }

    defineExpose({ loadList });
</script>
