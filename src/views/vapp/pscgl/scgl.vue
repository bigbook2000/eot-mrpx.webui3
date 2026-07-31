<template>
    <!-- 生产管理 - 移动端 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="生产管理" :back="false" />
            <!-- 搜索栏 -->
            <div class="div_search_bar">
                <el-date-picker style="flex:1;min-width:0;"
                    v-model="x_query_jhsj"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始"
                    end-placeholder="结束"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    size="default">
                </el-date-picker>
            </div>             
            <div class="div_search_bar">
                <el-button type="primary" @click="onButtonClick_Add_scd">新增</el-button>
                <el-input v-model="x_query_key" placeholder="产品名称/批次" clearable
                    @keyup.enter="onSearch" />
                <el-button type="primary" @click="onSearch">搜索</el-button>
            </div>

            <!-- 列表 -->
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                    <div class="ap_list">
                        <div v-if="x_data_list.length == 0" class="empty">
                            暂无数据
                        </div>
                        <div v-for="item in x_data_list" :key="item.f_sccp_id"
                            class="item" :class="{ 'ap_sel': x_selected_id == item.f_sccp_id }"
                            @click="x_selected_id = item.f_sccp_id">
                            <div class="body">
                                <div class="row">
                                    <span class="value title">{{ item.f_cpmc }}</span>
                                    <div class="div_tag" v-if="item['f_yxbz'] == 0"
                                        style="background:#409eff">进行中</div>
                                    <div class="div_tag" v-else
                                        style="background:#67c23a">已完成</div>
                                </div>
                                <div class="row">
                                    <span class="label">生产员</span>
                                    <span class="value">{{ item.f_scy_id_s }}</span>
                                    <span class="label">计划时间</span>
                                    <span class="value">{{ item.f_jhsj_s }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">批次</span>
                                    <span class="value">{{ item.f_kcbh || '-' }}</span>
                                    <span class="label">单件数量</span>
                                    <span class="value">{{ item.f_bzsl }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">单价</span>
                                    <span class="value">{{ item.f_kcdj_s || '-' }}</span>
                                    <span class="label">完成时间</span>
                                    <span class="value">{{ item.f_wcsj_s }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">规格</span>
                                    <span class="value">{{ item.f_cpgg || '-' }}</span>
                                    <span class="label">尺寸</span>
                                    <span class="value">{{ item.f_cpcc || '-' }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">重量</span>
                                    <span class="value">{{ item.f_cpzl || '-' }}</span>
                                    <span class="label">单位</span>
                                    <span class="value">{{ item.f_cpdw || '-' }}</span>
                                </div>
                                <div class="row">
                                    <el-button class="ap_button" :disabled="item['f_yxbz'] != 0"
                                        @click.stop="onButtonClick_Del_scd(item['f_sccp_id'])">删除</el-button>
                                    <el-button class="ap_button" type="primary" 
                                        @click.stop="onButtonClick_Upd_scd(item['f_sccp_id'])">生产</el-button>
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
                    @current-change="onPageChange"
                    :current-page="x_page_index"
                    :page-size="x_page_row_count"
                    layout="total, prev, pager, next"
                    :total="x_row_total">
                </el-pagination>
            </div>
        </div>
    </div>

    <!-- 生产任务部件对话框 -->
    <scgl_bj ref="v_scgl_bj" @close="onDialogClose_scgl_bj" />

    <!-- 生产计划对话框 -->
    <scd_xx ref="v_scd_xx" @close="onDialogClose_scd_xx" />
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_scgl_scgl" }
</script>

<script lang="ts" setup>
    import { ref, onMounted, onActivated } from "vue"

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import topbar from '@/views/vapp/comm/topbar.vue'

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import scgl_bj from "./scgl_bj.vue"
    import scd_xx from "./scd_xx.vue"

    // 查询条件
    const x_query_key = ref("");
    const x_query_jhsj = ref<[string, string] | null>(null);

    // 列表数据
    const x_data_list = ref<any[]>([]);
    const x_selected_id = ref(0);

    // 分页
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    const v_scgl_bj = ref<InstanceType<typeof scgl_bj>>();
    const v_scd_xx = ref<InstanceType<typeof scd_xx>>();

    onMounted(() => {
        netLoad_sccp_query(-1);
    });

    onActivated(() => {
        netLoad_sccp_query(x_page_index.value - 1);
    });

    /**
     * 搜索
     */
    const onSearch = () => {
        x_page_index.value = 1;
        x_selected_id.value = 0;
        netLoad_sccp_query(-1);
    }

    /**
     * 分页
     */
    const onPageChange = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        x_selected_id.value = 0;
        netLoad_sccp_query(pageIndex - 1);
    }

    /**
     * 查询生产任务列表
     */
    const netLoad_sccp_query = async (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        let kssj = "";
        let jssj = "";
        if (x_query_jhsj.value) {
            kssj = x_query_jhsj.value[0];
            jssj = x_query_jhsj.value[1];
        }

        x_show_loading.value = true;
        let ret = await eocore.proc("p_sccp_query", {
            "v_scy_id": -1,
            "v_cpbm": x_query_key.value,
            "v_cpmc": x_query_key.value,
            "v_kssj": kssj,
            "v_jssj": jssj,
            "v_yxbz": -1,
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
        let list = eocore.check_net_array(ret);
        if (list == undefined) {
            x_show_loading.value = false;
            return;
        }

        // 关联库存批次信息
        const ids = list.filter(x => x["f_kcmx_id"] > 0).map(x => x["f_kcmx_id"]).join(",");
        if (ids.length > 0) {
            ret = await eocore.proc("p_kcmx_ids", {
                "v_kcmx_ids": ids
            });
            let list2 = eocore.check_net_array(ret);
            if (list2 != undefined) {
                eolib.list_merge(list, list2, "f_kcmx_id", "f_kcmx_id");
            }
        }
        x_show_loading.value = false;

        if (list.length > 0 && list[0]["s_total_count"] != undefined) {
            x_row_total.value = eocore.to_int(list[0]["s_total_count"]);
        }

        for (let d of list) {
            formatItem(d);
        }
        x_data_list.value = list;
    }

    /**
     * 数据格式化
     */
    const formatItem = (data: any) => {
        data["f_jhsj_s"] = eolib.datetime_2_short(data["f_jhsj"]);
        data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"]);

        data["f_wcsj_s"] = eolib.datetime_2_short(data["f_wcsj"]);
        if (data["f_wcsj_s"] > "50/01/01 00:00") {
            data["f_wcsj_s"] = "-";
        }

        data["f_kcdj_s"] =
            eolib.fixed_num(eocore.to_float(data["f_kcdj"]), 3);

        TLogic.updateDicUserData(data, ["f_scy_id"]);
    }

    /**
     * 新增任务
     */
    const onButtonClick_Add_scd = () => {
        v_scd_xx.value?.show_dialog({ f_sccp_id: 0 });
    }

    /**
     * 新增任务对话框关闭
     */
    const onDialogClose_scd_xx = (cancel: boolean, data: any, cb: any) => {
        cb(true);
        if (!cancel) {
            netLoad_sccp_query(x_page_index.value - 1);
        }
    }

    /**
     * 删除任务（卡片按钮）
     */
    const onButtonClick_Del_scd = async (sccpId: number) => {
        let det = await eocore.show_confirm("确定要删除该生产任务吗？");
        if (!det) return;

        x_show_loading.value = true;
        let ret = await eocore.proc("p_sccp_del", {
            "v_sccp_id": sccpId
        });
        x_show_loading.value = false;
        eocore.check_net_object(ret);

        netLoad_sccp_query(x_page_index.value - 1);
    }

    /**
     * 生产（卡片按钮）
     */
    const onButtonClick_Upd_scd = (sccpId: number) => {
        const data = x_data_list.value.find(d => d.f_sccp_id == sccpId);
        if (!data) return;
        v_scgl_bj.value?.show_dialog(data);
    }

    /**
     * 生产对话框关闭
     */
    const onDialogClose_scgl_bj = (cancel: boolean, data: any, cb: any) => {
        cb(true);
        if (!cancel) {
            netLoad_sccp_query(x_page_index.value - 1);
        }
    }
</script>

<style lang="scss" scoped>
    .div_search_bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        padding: 0.35rem 0.8rem;
        background: #fff;
        border-bottom: 1px solid var(--eo_color_grey_light3);
    }

    .div_tag {
        font-size: 0.65rem;
        color: #fff;
        padding: 0.05rem 0.4rem;
        border-radius: 0.25rem;
        margin-left: 0.4rem;
        flex-shrink: 0;
    }
</style>
