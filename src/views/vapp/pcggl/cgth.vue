<template>
    <!-- 采购退货 - 移动端 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="采购退货" :back="false" />
            <div class="eo_col_d">
                <!-- 简洁搜索栏 -->
                <div class="div_search_bar">
                    <el-button type="primary" @click="onButtonClick_Add_cgth">新增</el-button>
                    <el-input v-model="x_query_gysmc" placeholder="供应商名称" clearable
                        @keyup.enter="onSearch" />
                    <el-button type="primary" @click="onSearch">搜索</el-button>
                </div>
            </div>
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                    <!-- 退货单卡片列表 -->
                    <div class="ap_list">
                        <div v-if="x_data_list.length == 0" class="empty">
                            暂无数据
                        </div>
                        <div v-for="item in x_data_list" :key="item.f_cgth_id"
                            class="item"
                            :class="{ 'ap_sel': x_selected_id == item.f_cgth_id }"
                            @click="x_selected_id = item.f_cgth_id">
                            <div class="body">
                                <div class="row">
                                    <span class="value title">{{ item.f_kcbh }}</span>
                                    <span class="div_tag" v-if="item.f_yxbz == 0">作废</span>
                                </div>
                                <div class="row">
                                    <span class="label">供应商</span>
                                    <span class="value">{{ item.f_gysmc || '-' }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">产品</span>
                                    <span class="value">{{ item.f_cpmc }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">数量</span>
                                    <span class="value">{{ item.f_kcsl }}</span>
                                    <span class="label">退款金额</span>
                                    <span class="value">{{ item.f_thje_s }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">状态</span>
                                    <span class="value">{{ item.f_flow_point_id_s }}</span>
                                    <span class="label">时间</span>
                                    <span class="value">{{ item.f_cjsj_s }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">采购员</span>
                                    <span class="value">{{ item.f_cgy_id_s }}</span>
                                </div>
                            </div>
                            <div class="detail">
                                <el-button class="detail_btn" type="primary" plain
                                 @click="onItemDetailClick(item)">详情</el-button>
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
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_cggl_cgth" }
</script>

<script lang="ts" setup>

    import { ref, onMounted, onActivated } from "vue"

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"
    import eoflow, { type cflow_type } from "@/inc/eoflow"

    import router from "@/router/index"
    import topbar from '@/views/vapp/comm/topbar.vue'

    import TLogic from "@/logic/TLogic"

    // 流程类型：采购退货
    let m_flow_type: cflow_type | undefined = undefined;

    // 查询条件
    const x_query_gysmc = ref("");

    // 列表
    const x_data_list = ref<any[]>([]);
    const x_show_loading = ref(false);
    const x_selected_id = ref(0);

    // 分页
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    onMounted(() => {
        m_flow_type = eoflow.get_type_by_name("采购退货");
        netLoad_cgth_query(-1);
    })

    onActivated(() => {
        netLoad_cgth_query(x_page_index.value - 1)
    })

    const onSearch = () => {
        x_page_index.value = 1;
        netLoad_cgth_query(-1);
    }

    const onPageChange = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_cgth_query(pageIndex - 1);
    }

    const netLoad_cgth_query = async (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        x_show_loading.value = true;
        let ret = await eocore.proc("p_cgth_query", {
            "v_gysmc": x_query_gysmc.value,
            "v_cjsj1": "",
            "v_cjsj2": "",
            "v_kcbh": "",
            "v_cpmc": "",
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
        let list = eocore.check_net_array(ret);
        x_show_loading.value = false;
        if (list == undefined) list = [];

        if (list.length > 0 && list[0]["s_total_count"] != undefined) {
            x_row_total.value = eocore.to_int(list[0]["s_total_count"]);
        }

        for (let d of list) {
            formatItem(d);
        }
        x_data_list.value = list;
    }

    const onItemDetailClick = (item: any) => {
        x_selected_id.value = item.f_cgth_id;
        router.push({ name: 'app_cggl_cgth_xx', query: { id: item.f_cgth_id } })
    }

    const onButtonClick_Add_cgth = () => {
        router.push({ name: 'app_cggl_cgth_xx', query: { id: 0 } });
    }

    const formatItem = (data: any) => {
        data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"]);
        data["f_thje_s"] = eolib.fixed_num(data["f_thje"], 3);
        data["f_flow_point_id_s"] = eoflow.get_point_name(m_flow_type, data["f_flow_point_id"]);

        TLogic.updateDicUserData(data, ["f_cgy_id"]);
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
    }

    .div_tag {
        flex: 0 0 auto;
        font-size: 0.7rem;
        color: #fff;
        background: #e74c3c;
        padding: 0.05rem 0.35rem;
        border-radius: 0.25rem;
        margin-left: 0.4rem;
    }

    .detail_btn {
        width: 4rem;
        height: 1.8rem;
        font-size: 0.9rem;
    }
</style>
