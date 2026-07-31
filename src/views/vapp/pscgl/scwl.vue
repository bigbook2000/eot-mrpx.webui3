<template>
    <!-- 生产物料 - 移动端 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="生产物料" :back="false" />
            <!-- 搜索栏 -->
            <div class="div_search_bar">
                <el-input v-model="x_query_key" placeholder="批次/产品名称" clearable
                    @keyup.enter="onSearch" />
                <el-button type="primary" @click="onSearch">搜索</el-button>
            </div>
            <div class="div_search_bar">
                <el-date-picker style="flex:1;min-width:0;"
                    v-model="x_query_date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始"
                    end-placeholder="结束"
                    value-format="YYYY-MM-DD"
                    size="default">
                </el-date-picker>
            </div>
            <!-- 列表 -->
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                    <div class="ap_list">
                        <div v-if="x_data_list.length == 0" class="empty">
                            暂无数据
                        </div>
                        <div v-for="item in x_data_list" :key="item.f_kcjy_id" class="item">
                            <div class="body">
                                <div class="row">
                                    <span class="value title">{{ item.f_kcbh }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">产品名称</span>
                                    <span class="value">{{ item.f_cpmc }}</span>
                                    <span class="label">数量</span>
                                    <span class="value">{{ item.f_kcsl }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">时间</span>
                                    <span class="value">{{ item.f_jysj_s }}</span>
                                    <span class="label">库管员</span>
                                    <span class="value">{{ item.f_kgy_id_s }}</span>
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
                                    <span class="label">备注</span>
                                    <span class="value">{{ item.f_beizhu || '-' }}</span>
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
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_scgl_scwl" }
</script>

<script lang="ts" setup>
    import { ref, onMounted, onActivated } from "vue"

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import topbar from '@/views/vapp/comm/topbar.vue'

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    // 查询条件
    const x_query_key = ref("");
    const x_query_date = ref<[string, string] | null>(null);

    // 列表数据
    const x_data_list = ref<any[]>([]);

    // 分页
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    onMounted(() => {
        netLoad_kcjy_query(-1);
    });

    onActivated(() => {
        netLoad_kcjy_query(x_page_index.value - 1);
    });

    const onSearch = () => {
        x_page_index.value = 1;
        netLoad_kcjy_query(-1);
    }

    const onPageChange = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_kcjy_query(pageIndex - 1);
    }

    /**
     * 查询生产物料
     */
    const netLoad_kcjy_query = async (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        let kssj = "";
        let jssj = "";
        if (x_query_date.value) {
            kssj = x_query_date.value[0];
            jssj = x_query_date.value[1];
        }

        x_show_loading.value = true;
        let ret = await eocore.proc("p_kcjy_query", {
            "v_kcbz": -9,
            "v_kcbh": x_query_key.value,
            "v_kssj": kssj,
            "v_jssj": jssj,
            "v_jyzt": 1,
            "v_jyyg_id": TGlobal.userData["f_user_id"],
            "v_cpbm": "",
            "v_cpmc": x_query_key.value,
            "v_order_by": " ORDER BY f_kcjy_id DESC",
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

    const formatItem = (data: any) => {
        data["f_jysj_s"] = eolib.datetime_2_short(data["f_jysj"]);
        TLogic.updateDicUserData(data, ["f_jyyg_id", "f_kgy_id"]);
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
</style>
