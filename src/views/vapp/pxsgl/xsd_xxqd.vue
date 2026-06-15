<template>
    <!-- 产品清单 -->
    <div class="eo_col" v-loading="x_show_loading">
        <!-- 工具栏按钮 -->
        <div class="eo_col_d eo_form" v-show="m_edit_mode == 1">
            <div class="button">
                <el-button class="ap_button" type="primary" @click="onAdd_xsdcp">添加产品</el-button>
            </div>
        </div>
        <div class="eo_col_f">
            <div class="eo_scroll_v">
                <div class="ap_list">
                    <div v-if="x_data_list.length == 0" class="empty">
                        暂无产品
                    </div>
                    <div v-for="item in x_data_list" :key="item.f_xsdcp_id" class="item">
                        <div class="body">
                            <div class="row">
                                <span class="value title">{{ item['f_cpmc'] }}</span>
                            </div>
                            <div class="row">
                                <span class="label">数量</span>
                                <span class="value">{{ item['f_xssl'] }}</span>
                                <span class="label">单价</span>
                                <span class="value">{{ item['f_xsdj_s'] }}</span>
                            </div>
                            <div class="row">
                                <span class="label">总价</span>
                                <span class="value">{{ item['f_xszj_s'] }}</span>
                                <span class="label">成本价</span>
                                <span class="value">{{ item['f_cpjg_s'] }}</span>
                            </div>
                            <div class="row" v-if="item.f_cpbm">
                                <span class="label">编码</span>
                                <span class="value">{{ item['f_cpbm'] }}</span>
                            </div>
                            <div class="row" v-if="item.f_beizhu">
                                <span class="label">备注</span>
                                <span class="value">{{ item['f_beizhu'] }}</span>
                            </div>
                            <div class="row" v-if="m_edit_mode == 1">
                                <el-button class="ap_button" @click.stop="onDel_xsdcp(item['f_xsdcp_id'])">移除</el-button>
                                <el-button class="ap_button" type="primary" @click.stop="onUpd_xsdcp(item['f_xsdcp_id'])">修改</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <xsdcp_xx ref="v_xsdcp_xx" @close="onDialogClose" />
    </div>
</template>

<script lang="ts" setup>
    import { ref, watch } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";
    import eoflow, { type cflow_type, type cflow_point } from "@/inc/eoflow"

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"

    import xsdcp_xx from "./xsdcp_xx.vue"

    type t_xsdcp_xx = InstanceType<typeof xsdcp_xx>;
    const v_xsdcp_xx = ref<t_xsdcp_xx>();

    const x_data_list = ref<any[]>([]);
    const x_show_loading = ref(false);
    const x_selected_id = ref(0);

    let m_data_xsd: any = {
        f_xsd_id: 0,
        f_xsdh: "",
    };
    let m_edit_mode: number = 0;
    let m_field_array: string[] = [];

    const loadList = async (flow: any, xsdData: any) => {
        
        Object.assign(m_data_xsd, {}, xsdData);

        if (!eocore.check_id(m_data_xsd, "f_xsd_id")) {
            x_data_list.value = [];
            return;
        }
        x_show_loading.value = true;
        let ret = await eocore.proc("p_xsdcp_list", {
            "v_xsd_id": m_data_xsd["f_xsd_id"],
        });
        let list = eocore.check_net_array(ret) || [];
        x_show_loading.value = false;

        for (let d of list) {
            d["f_cpjg_s"] = eolib.fixed_num(d["f_cpjg"], 3);
            d["f_xsdj_s"] = eolib.fixed_num(d["f_xsdj"], 3);
            d["f_xszj_s"] = eolib.fixed_num(d["f_xsdj"] * d["f_xssl"], 3);
        }
        x_data_list.value = list;

        const point = flow?.get_point_by_id(m_data_xsd["f_flow_point_id"]);
        updateFlowStatus(point?.name);
    }

    /**
     * 根据不同流程控制清单编辑
     * @param pointName 
     */
    const updateFlowStatus = async (pointName: string) => {
        if (!pointName) return;

        m_edit_mode = 0;
        m_field_array = [""];
        switch (pointName) {
            case "新建":
                m_edit_mode = 1;
                m_field_array = ["*"];
                break;
            case "待审核":
            case "已审核":
                m_edit_mode = 2;
                m_field_array = ["*"];
                break;
            case "已核准":
                break;
            case "已生产":
                break;
            case "已发货":
            case "已收货":
                break;
            case "完成":
                break;
        }       
    }    

    /**
     * 添加产品
     */
    const onAdd_xsdcp = () => {

        if (m_edit_mode != 1) {
            eocore.show_error("产品明细不可编辑");
            return;
        }

        if (m_data_xsd["f_xsd_id"] <= 0) {
            eocore.show_error("请先保存订单");
            return;
        }

        let xsdcpData = {
            f_xsdcp_id: 0,
            f_cpdy_id: 0,
            f_cpmc: "",
            f_cpbm: "",
            f_xsd_id: m_data_xsd["f_xsd_id"],
            f_xsdh: m_data_xsd["f_xsdh"],
            f_cpjg: 0.0,
            f_xssl: 1.0,
            f_xsdj: 0.0,
            f_beizhu: "",
        };

        v_xsdcp_xx.value?.showDialog(xsdcpData, m_field_array);
    }

    /**
     * 移除产品
     */
    const onDel_xsdcp = async (xsdcpId: number) => {

        if (xsdcpId <= 0) {
            eocore.show_info("请先选择要移除的产品");
            return;
        }

        try {
            await eocore.show_confirm("确认移除该产品？");
        } catch {
            return;
        }

        x_show_loading.value = true;
        await eocore.proc("p_xsdcp_del", {
            "v_xsdcp_id": xsdcpId
        });
        x_show_loading.value = false;

        const idx = x_data_list.value.findIndex(d => d.f_xsdcp_id == xsdcpId);
        if (idx >= 0) {
            x_data_list.value.splice(idx, 1);
        }
    }

    /**
     * 修改产品
     */
    const onUpd_xsdcp = (xsdcpId: number) => {
        if (xsdcpId <= 0) {
            eocore.show_info("请先选择要修改的产品");
            return;
        }

        const item = x_data_list.value.find(d => d.f_xsdcp_id == xsdcpId);
        if (!item) {
            eocore.show_info("未找到所选产品");
            return;
        }
        v_xsdcp_xx.value?.showDialog({ ...item }, m_field_array);
    }

    /**
     * 产品明细对话框关闭
     */
    const onDialogClose = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        console.log("onDialogClose", data);

        const isAdd = data["_is_add"];
        if (isAdd) {
            x_data_list.value.push(data);
        } else {
            const idx = x_data_list.value.findIndex(d => d.f_xsdcp_id == data.f_xsdcp_id);
            if (idx >= 0) {
                x_data_list.value[idx] = data;
            }
        }

        // 格式化新数据
        data["f_cpjg_s"] = eolib.fixed_num(data["f_cpjg"], 3);
        data["f_xsdj_s"] = eolib.fixed_num(data["f_xsdj"], 3);
        data["f_xszj_s"] = eolib.fixed_num(data["f_xsdj"] * data["f_xssl"], 3);

        cb(true);
    }

    defineExpose({ loadList });
</script>
