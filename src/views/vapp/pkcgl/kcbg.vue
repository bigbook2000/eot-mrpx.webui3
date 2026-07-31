<template>
    <!-- 库存变更 - 移动端 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="库存变更" :back="false" />
            <div class="eo_col_d">
                <!-- 搜索栏 -->
                <div class="div_search_bar">
                    <div class="search_input">
                        <el-input v-model="x_query_kcxx" placeholder="批次号或名称" clearable
                            @keyup.enter="onButtonClick_Load_kcmx" />
                    </div>
                    <el-select v-model="x_query_bglb" placeholder="变更类别" clearable
                        style="width:8rem">
                        <el-option label="-" value=""></el-option>
                        <el-option label="采购入库" value="采购入库"></el-option>
                        <el-option label="生产入库" value="生产入库"></el-option>
                        <el-option label="整理入库" value="整理入库"></el-option>
                        <el-option label="销售出库" value="销售出库"></el-option>
                        <el-option label="生产出库" value="生产出库"></el-option>
                        <el-option label="整理出库" value="整理出库"></el-option>
                    </el-select>
                    <el-button type="primary" @click="onButtonClick_Load_kcmx">搜索</el-button>
                </div>
            </div>
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                    <!-- 库存变更列表 -->
                    <div class="ap_list">
                        <div v-if="x_data_list.length == 0" class="empty">
                            暂无数据
                        </div>
                        <div v-for="item in x_data_list" :key="item.f_kcmx_id"
                            class="item"
                            :class="{ 'ap_sel': x_selected_id == item['f_kcmx_id'] }"
                            @click="onItemClick(item)">
                            <div class="body">
                                <div class="row">
                                    <span class="value title">{{ item['f_kcbh'] }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">名称</span>
                                    <span class="value">{{ item['f_cpmc'] }}</span>
                                </div>                                
                                <div class="row">
                                    <span class="label">{{ item['f_rklb'] || item['f_cklb'] }}</span>
                                    <span class="value">{{ item['f_rksj_s'] || item['f_cksj_s'] }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">关联批次</span>
                                    <span class="value">{{ item['f_kcbh_p'] }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">单价</span>
                                    <span class="value">{{ item['f_kcdj_s'] }}</span>
                                    <span class="label">数量</span>
                                    <span class="value">{{ item['f_kcsl'] }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">调拨</span>
                                    <span class="value">{{ item['f_jyzt_s'] }} - {{ item['f_jyyg_id_s'] }}</span>
                                    <span class="label">仓库</span>
                                    <span class="value">{{ item['f_hwck_s'] }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 分页 -->
            <div class="eo_page_bar">
                <el-pagination
                    background
                    :pager-count="5"
                    @current-change="onPageChange_kcmx"
                    :current-page="x_page_index"
                    :page-size="x_page_row_count"
                    layout="total, prev, pager, next"
                    :total="x_row_total">
                </el-pagination>
            </div>
        </div>

        <!-- 库存明细对话框 -->
        <kcmx_d ref="v_kcmx_d" ok-label="返回" @close="onDialogClose_kcmx_d" />
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_kcgl_kcbg" }
</script>

<script lang="ts" setup>

    import { ref, onMounted } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import eodic from "@/inc/eodic";

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import topbar from '@/views/vapp/comm/topbar.vue'
    import kcmx_d from "./kcmx_d.vue"

    type t_kcmx_d = InstanceType<typeof kcmx_d>;
    const v_kcmx_d = ref<t_kcmx_d>();

    // 数据列表
    const x_data_list = ref<any[]>([]);
    // 当前选中项ID
    const x_selected_id = ref(0);

    // 查询条件
    const x_query_kcxx = ref("");
    const x_query_bglb = ref("");

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    onMounted(async () => {
        // 初始化加载数据
        netLoad_kcmx_query(-1);
    });

    /**
     * 格式化单条数据
     */
    const formatItem_kcmx = (data: any) => {
        data["f_jyzt_s"] = eodic.get_dic_label("调拨状态", data["f_jyzt"]);
        data["f_rksj_s"] = eolib.datetime_2_short(data["f_rksj"], true);
        data["f_cksj_s"] = eolib.datetime_2_short(data["f_cksj"], true);
        data["f_pksj_s"] = eolib.datetime_2_short(data["f_pksj"], true);
        data["f_kcdj_s"] = eolib.fixed_num(data["f_kcdj"], 3);
        data["f_hwck_s"] = eodic.get_dic_label("产品仓库", data["f_hwck"]);
        TLogic.updateDicUserData(data, ["f_jyyg_id"]);
    }

    /**
     * 查询库存变更数据
     */
    const netLoad_kcmx_query = async (pageIndex: number = -1) => {
        const pageRowCount = x_page_row_count.value;
        const rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        x_show_loading.value = true;
        let ret = await eocore.proc("p_kcmx_query", {
            "v_kcbz": -9,
            "v_cpdl_id": 0,
            "v_cpxl_id": 0,
            "v_kcxx": x_query_kcxx.value,
            "v_jyzt": -1,
            "v_rklb": x_query_bglb.value,
            "v_cklb": "",
            "v_rksj1": "",
            "v_rksj2": "",
            "v_cksj1": "",
            "v_cksj2": "",
            "v_order_by": "ORDER BY f_kcmx_id DESC",
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
        let list = eocore.check_net_array(ret);
        x_show_loading.value = false;
        if (list == undefined) list = [];

        // 分页总数
        if (rowIndex < 0) {
            if (list.length > 0) {
                x_row_total.value = eocore.to_int(list[0]["s_total_count"]);
            } else {
                x_row_total.value = 0;
            }
        }

        // 初始化关联批次为空
        list.forEach((item: any) => {
            item["f_kcbh_p"] = "";
        });

        // 查询关联批次
        if (list.length > 0) {
            const kcmxPids = list?.filter((item: any) => item["f_kcmx_pid"] > 0)
                .map((item: any) => item["f_kcmx_pid"]).join(",");
            if (kcmxPids.length > 0) {
                x_show_loading.value = true;
                let ret = await eocore.proc("p_kcmx_ids", {
                    "v_kcmx_ids": kcmxPids,
                });
                x_show_loading.value = false;
                let list2 = eocore.check_net_array(ret);
                if (list2) {
                    list.forEach((item1: any) => {
                        list2!.find((item2: any) => {
                            if (item1["f_kcmx_pid"] == item2["f_kcmx_id"]) {
                                item1["f_kcbh_p"] = item2["f_kcbh"];
                                return true;
                            }
                            return false;
                        });
                    });
                }
            }
        }

        // 格式化每条数据
        for (let d of list) {
            formatItem_kcmx(d);
        }
        x_data_list.value = list;

        // 清除选择
        x_selected_id.value = 0;
    }

    /**
     * 列表项点击 - 弹出库存明细
     */
    const onItemClick = (item: any) => {
        x_selected_id.value = item.f_kcmx_id;
        v_kcmx_d.value?.showDialog(item, true);
    }

    /**
     * 分页点击事件
     */
    const onPageChange_kcmx = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_kcmx_query(pageIndex - 1);
    }

    /**
     * 查找按钮点击
     */
    const onButtonClick_Load_kcmx = () => {
        netLoad_kcmx_query(-1);
    }

    /**
     * 库存明细对话框关闭
     */
    const onDialogClose_kcmx_d = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        cb(true);
    }

</script>

<style lang="scss" scoped>
    .div_search_bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.8rem;
        background: #fff;
        border-bottom: 1px solid var(--eo_color_grey_light3);

        .search_input {
            flex: 1 1 auto;
            width: 0;
        }
    }
</style>
