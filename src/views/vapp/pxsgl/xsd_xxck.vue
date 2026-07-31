<template>
    <!-- 出库明细 -->
    <div class="eo_col" v-loading="x_show_loading">
        <!-- 工具栏按钮 -->
        <div class="eo_col_d eo_form" v-show="m_edit_mode == 3">
            <div class="button">
                <el-button class="ap_button" type="primary" @click="onButtonAdd_xsdck">货物出库</el-button>
            </div>
        </div>
        <div class="eo_col_f">
            <div class="eo_scroll_v">
                <div class="ap_list">
                    <div v-if="x_data_list.length == 0" class="empty">
                        暂无出库记录
                    </div>
                    <div v-for="item in x_data_list" :key="item.f_xsdck_id" class="item">
                        <div class="body">
                            <div class="row">
                                <span class="value title">{{ item.f_cpmc }}</span>
                                <span class="div_tag" v-if="item.f_ckbz == 2">退货</span>
                            </div>
                            <div class="row">
                                <span class="label">批次</span>
                                <span class="value">{{ item.f_kcbh }}</span>
                                <span class="label">仓库</span>
                                <span class="value">{{ item.f_hwck_s }}</span>
                            </div>
                            <div class="row">
                                <span class="label">单价</span>
                                <span class="value">{{ item.f_kcdj_s }}</span>
                                <span class="label">数量</span>
                                <span class="value">{{ item.f_kcsl }}</span>
                            </div>
                            <div class="row">
                                <span class="label">物流</span>
                                <span class="value">{{ item.f_wlgs_id_s }}</span>
                            </div>
                            <div class="row">
                                <span class="label">单号</span>
                                <span class="value">{{ item.f_wldh }}</span>
                            </div>
                            <div class="row">
                                <span class="label">出库时间</span>
                                <span class="value">{{ item.f_cksj_s }}</span>
                            </div>
                            <div class="row">
                                <span class="label">备注</span>
                                <span class="value">{{ item.f_beizhu }}</span>
                            </div>
                            <div class="row">
                                <el-button class="ap_button" v-if="m_edit_mode==3"
                                    @click.stop="onButtonDel_xsdck(item['f_xsdck_id'])">移除</el-button>
                                <el-button class="ap_button" type="primary" v-if="m_edit_mode==4"
                                    @click.stop="onButtonUpd_xsdck(item['f_xsdck_id'])">修改</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <xsdck_xx ref="v_xsdck_xx" @close="onDialogClose_xsdck_xx" />
    </div>
</template>

<script lang="ts" setup>
    import { ref, watch } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";
    import eoflow, { type cflow_type, type cflow_point } from "@/inc/eoflow"

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"
    import eodic from "@/inc/eodic"

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import xsdck_xx from "./xsdck_xx.vue"

    const x_data_list = ref<any[]>([]);
    const x_show_loading = ref(false);

    type t_xsdck_xx = InstanceType<typeof xsdck_xx>;
    const v_xsdck_xx = ref<t_xsdck_xx>();

    let m_data_xsd: any = {
        f_xsd_id: 0,
        f_xsdh: "",
    };
    let m_edit_mode = ref(0);
    let m_field_ck: string[] = [];

    const loadList = async (flow: any, xsdData: any) => {

        Object.assign(m_data_xsd, {}, xsdData);

        await TLogic.netLoad_Wlgs_list();

        await netLoad_xsdck_list();

        const point = flow?.get_point_by_id(m_data_xsd["f_flow_point_id"]);
        updateFlowStatus(point?.name);
    }

    const netLoad_xsdck_list = async () => {

        const xsdId = eocore.to_int(m_data_xsd["f_xsd_id"]);
        if (xsdId <= 0) {
            x_data_list.value = [];
            return;
        }

        x_show_loading.value = true;
        let ret = await eocore.proc("p_xsdck_list", {
            "v_xsd_id": xsdId,
            "v_xsdcp_id": -1
        });
        let list = eocore.check_net_array(ret) || [];
        x_show_loading.value = false;

        for (let d of list) {
            if (d["f_cksj"]) {
                d["f_cksj_s"] = eolib.datetime_2_short(d["f_cksj"], true);
            }
            d["f_kcdj_s"] = eolib.fixed_num(d["f_kcdj"], 3);
            d["f_hwck_s"] = eodic.get_dic_label("产品仓库", d["f_hwck"]);
            d["f_wlgs_id_s"] = TLogic.getLabel_wlgs(d["f_wlgs_id"]);
            TLogic.updateDicUserData(d, ["f_kgy_id"]);
        }
        x_data_list.value = list;
    }

    /**
     * 根据不同流程控制清单编辑
     * @param pointName 
     */
    const updateFlowStatus = async (pointName: string) => {
        if (!pointName) return;

        m_edit_mode.value = 0;
        m_field_ck = [""];

        switch (pointName) {
            case "新建":
                break;
            case "待审核":
            case "已审核":
                break;
            case "已核准":
                m_edit_mode.value = 3;
                m_field_ck = ["*"];
                break;
            case "已生产":
                m_edit_mode.value = 4;
                m_field_ck = ["f_wlgs_id","f_wldh"];
                break;
            case "已发货":
            case "已收货":
                break;
            case "完成":
                break;
        }
    }

    const onButtonAdd_xsdck = () => {

        let xsdckData = {
            f_xsdck_id: 0,
            f_xsd_id: m_data_xsd["f_xsd_id"],
            f_xsdcp_id: 0,
            f_cpdy_id: 0, // 产品定义ID
            f_cpmc: "", // 产品名称
            f_cpbm: "", // 产品编码
            f_xsdh: m_data_xsd["f_xsdh"],
            f_kcbh: "",
            f_kcmx_id: 0, // 库存明细ID
            f_kgy_id: TGlobal.userData["f_user_id"], // 库管员ID
            f_kgy_id_s: TGlobal.userData["f_name"], // 库管员姓名
            f_cksl: 0.0,// 数量
            f_ckdj: 0.0, // 出库单价 
            f_wlgs_id: 0, // 物流公司
            f_wlgs_id_s: "", // 物流公司名称
            f_wldh: "", // 物流单号
            f_hwck: 0,
            f_ckbz: 0, // 出库标识
            f_xsdj: 0.0, // 同步单价
            f_beizhu: "", // 备注
        };
        
        v_xsdck_xx.value?.showDialog(xsdckData, m_field_ck);
    }

    const onButtonDel_xsdck = async (xsdckId: number) => {

        if (xsdckId <= 0) {
            eocore.show_info("请先选择要移除的出库记录");
            return;
        }

        const item = x_data_list.value.find(d => d.f_xsdck_id == xsdckId);
        if (!item) {
            eocore.show_info("未找到所选出库记录");
            return;
        }

        try {
            await eocore.show_confirm("确认移除该出库记录？");
        } catch {
            return;
        }

        x_show_loading.value = true;

        // 恢复库存标识为正常
        if (eocore.check_id(item, "f_kcmx_id")) {
            await eocore.proc("p_kcmx_kcbz", {
                "v_kcmx_ids": "" + item["f_kcmx_id"],
                "v_cpdy_ids": "" + item["f_cpdy_id"],
                "v_kcbz": TLogic.kcbzCodes["正常"]
            });
        }

        // 删除出库记录
        await eocore.proc("p_xsdck_del", {
            "v_xsdck_id": xsdckId
        });

        x_show_loading.value = false;

        const idx = x_data_list.value.findIndex(d => d.f_xsdck_id == xsdckId);
        if (idx >= 0) {
            x_data_list.value.splice(idx, 1);
        }
    }

    const onButtonUpd_xsdck = (xsdckId: number) => {

        if (xsdckId <= 0) {
            eocore.show_info("请先选择要修改的出库记录");
            return;
        }

        const item = x_data_list.value.find(d => d.f_xsdck_id == xsdckId);
        if (!item) {
            eocore.show_info("未找到所选出库记录");
            return;
        }
        v_xsdck_xx.value?.showDialog({ ...item }, m_field_ck);
    }

    const onDialogClose_xsdck_xx = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
                
        if (cancel) {
            cb(true); return;
        }

        await netLoad_xsdck_list();

        eocore.show_success("产品出库成功");

        cb(true);
    }

    defineExpose({ loadList });
</script>
