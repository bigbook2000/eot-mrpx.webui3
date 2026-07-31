<template>
    <!-- 采购产品清单 -->
    <div class="eo_col" v-loading="x_show_loading">
        <!-- 工具栏按钮 -->
        <div class="eo_col_d eo_form" v-show="m_edit_mode == 1">
            <div class="button">
                <el-button class="ap_button" type="primary" @click="onAdd_cgdcp">添加产品</el-button>
            </div>
        </div>
        <div class="eo_col_f">
            <div class="eo_scroll_v">
                <div class="ap_list">
                    <div v-if="x_data_list.length == 0" class="empty">
                        暂无产品
                    </div>
                    <div v-for="item in x_data_list" :key="item.f_cgdcp_id"
                        class="item"
                        :class="{ 'ap_sel': x_selected_id == item.f_cgdcp_id }"
                        @click="x_selected_id = item.f_cgdcp_id">
                        <div class="body">
                            <div class="row">
                                <span class="value title">{{ item.f_cpmc }}</span>
                            </div>
                            <div class="row">
                                <span class="label">件数</span>
                                <span class="value">{{ item.f_cgsl }}</span>
                                <span class="label">单价</span>
                                <span class="value">{{ item.f_cgdj_s }}</span>
                            </div>
                            <div class="row">
                                <span class="label">总价</span>
                                <span class="value">{{ item.f_cgzj_s }}</span>
                                <span class="label">库存成本</span>
                                <span class="value">{{ item.f_kcdj_s }}</span>
                            </div>
                            <div class="row" v-if="item.f_wlgs_id_s">
                                <span class="label">物流</span>
                                <span class="value">{{ item.f_wlgs_id_s }}</span>
                            </div>
                            <div class="row" v-if="item.f_wldh">
                                <span class="label">物流单号</span>
                                <span class="value">{{ item.f_wldh }}</span>
                            </div>
                            <div class="row" v-if="item.f_cpbm">
                                <span class="label">编码</span>
                                <span class="value">{{ item.f_cpbm }}</span>
                            </div>
                            <div class="row" v-if="item.f_beizhu">
                                <span class="label">备注</span>
                                <span class="value">{{ item.f_beizhu }}</span>
                            </div>
                            <div class="row" v-if="m_edit_mode == 1 || m_edit_mode == 2">
                                <el-button class="ap_button" @click.stop="onDel_cgdcp(item.f_cgdcp_id)">移除</el-button>
                                <el-button class="ap_button" type="primary" @click.stop="onUpd_cgdcp(item.f_cgdcp_id)">修改</el-button>
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

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"

    import TLogic from "@/logic/TLogic"
    import cgdcp_xx from "./cgdcp_xx.vue"

    const v_cgdcp_xx = ref<InstanceType<typeof cgdcp_xx>>();

    const x_data_list = ref<any[]>([]);
    const x_show_loading = ref(false);
    const x_selected_id = ref(0);

    let m_cgd_id = ref(0);
    let m_cgdh = ref("");
    let m_edit_mode = ref(0);
    let m_field_cp = ref<string[]>([""]);

    const loadList = async (cgdId: number, cgdh: string, editMode: number, fieldArray: string[]) => {
        m_cgd_id.value = cgdId;
        m_cgdh.value = cgdh;
        m_edit_mode.value = editMode;
        m_field_cp.value = fieldArray;
        x_selected_id.value = 0;

        if (cgdId <= 0) {
            x_data_list.value = [];
            return;
        }
        x_show_loading.value = true;
        let ret = await eocore.proc("p_cgdcp_list", {
            "v_cgd_id": cgdId,
        });
        let list = eocore.check_net_array(ret) || [];
        x_show_loading.value = false;

        for (let d of list) {
            d["f_cpjg_s"] = eolib.fixed_num(d["f_cpjg"], 3);
            d["f_cgdj_s"] = eolib.fixed_num(d["f_cgdj"], 3);
            d["f_cgzj_s"] = eolib.fixed_num(d["f_cgdj"] * d["f_cgsl"], 3);
            const kcdj = eolib.divide_num(d["f_kczj"], d["f_cgsl"]);
            d["f_kcdj_s"] = eolib.fixed_num(kcdj, 3);
            d["f_wlgs_id_s"] = TLogic.getLabel_wlgs(d["f_wlgs_id"]);
        }
        x_data_list.value = list;
    }

    const getList = (): any[]|undefined => {
        return x_data_list.value;
    }

    /**
     * 添加产品 - 打开产品编辑对话框
     */
    const onAdd_cgdcp = () => {
        if (m_edit_mode.value != 1) {
            eocore.show_error("产品明细不可编辑");
            return;
        }
        if (m_cgd_id.value <= 0) {
            eocore.show_error("请先保存采购单");
            return;
        }

        let cgdcpData = {
            "f_cgdcp_id": 0,
            "f_cpdy_id": 0,
            "f_cpmc": "",
            "f_cpbm": "",
            "f_cgd_id": m_cgd_id.value,
            "f_cgdh": m_cgdh.value,
            "f_cpjg": 0.0,
            "f_kcsl": 0.0,
            "f_kcdj": 0.0,
            "f_cgsl": 1.0,
            "f_bzsl": 1.0,
            "f_cgdj": 0.0,
            "f_cgzj": 0.0,
            "f_wlgs_id": 0,
            "f_wlgs_id_s": "",
            "f_wldh": "",
            "f_beizhu": "",
        };
        
        v_cgdcp_xx.value?.showDialog("产品信息", cgdcpData, m_field_cp.value, true);
    }

    /**
     * 移除产品
     */
    const onDel_cgdcp = async (cgdcpId?: number) => {
        const id = cgdcpId ?? x_selected_id.value;
        if (id <= 0) {
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
            "v_cgdcp_id": id
        });
        x_show_loading.value = false;
        x_selected_id.value = 0;
        loadList(m_cgd_id.value, m_cgdh.value, m_edit_mode.value, m_field_cp.value);
    }

    /**
     * 修改产品 - 打开产品编辑对话框
     */
    const onUpd_cgdcp = (cgdcpId?: number) => {
        const id = cgdcpId ?? x_selected_id.value;
        if (id <= 0) {
            eocore.show_info("请先选择要修改的产品");
            return;
        }

        let cgdcpData = x_data_list.value.find((d: any) => d.f_cgdcp_id == id);
        if (cgdcpData == undefined) {
            eocore.show_info("未找到产品数据");
            return;
        }

        v_cgdcp_xx.value?.showDialog("产品信息", cgdcpData, m_field_cp.value, true);
    }

    /**
     * 产品编辑对话框关闭回调
     */
    const onDialogClose_cgdcp_xx = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        if (data != undefined) {
            // 刷新列表
            loadList(m_cgd_id.value, m_cgdh.value, m_edit_mode.value, m_field_cp.value);
        }

        cb(true);
    }

    defineExpose({ loadList, getList });
</script>
