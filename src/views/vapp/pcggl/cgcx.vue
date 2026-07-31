<template>
    <!-- 采购查询 - 移动端 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="采购查询" :back="false" />
            <div class="eo_col_d">
                <!-- 简洁搜索栏 -->
                <div class="div_search_bar">
                    <el-date-picker style="flex:1;min-width:0;"
                        v-model="x_query_cjsj"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始"
                        end-placeholder="结束"
                        value-format="YYYY-MM-DD"
                        size="default">
                    </el-date-picker>
                </div>
                <div class="div_search_bar">
                    <el-input v-model="x_query_key" placeholder="关键字" clearable
                        @keyup.enter="onSearch" />
                    <el-button type="primary" @click="onSearch">搜索</el-button>
                </div>
                
            </div>
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                    <!-- 采购记录卡片列表 -->
                    <div class="ap_list">
                        <div v-if="x_data_list.length == 0" class="empty">
                            暂无数据
                        </div>
                        <div v-for="item in x_data_list" :key="item.f_kcmx_id" class="item">
                            <div class="body">
                                <div class="row">
                                    <span class="value title">{{ item.f_kcbh }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">产品名称</span>
                                    <span class="value">{{ item.f_cpmc }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">单价</span>
                                    <span class="value">{{ item.f_cgdj_s }}</span>
                                    <span class="label">数量</span>
                                    <span class="value">{{ item.f_bzsl }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">供应商</span>
                                    <span class="value">{{ item.f_gysmc || '-' }}</span>
                                    <span class="label">时间</span>
                                    <span class="value">{{ item.f_cjsj_s }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">采购单号</span>
                                    <span class="value">{{ item.f_cgdh }}</span>
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
export default { name: "app_cggl_cgcx" }
</script>

<script lang="ts" setup>
    import { ref, onMounted, onActivated } from "vue"

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import topbar from '@/views/vapp/comm/topbar.vue'

    // 查询条件
    const x_query_key = ref("");;
    const x_query_cjsj = ref<[string, string] | undefined>(undefined);

    // 列表数据
    const x_data_list = ref<any[]>([]);

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(50);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    onMounted(() => {
        let dt = new Date();
        const jssj = eolib.date_end(dt);
        dt.setMonth(dt.getMonth() - 1);
        const kssj = eolib.date_start(dt);
        x_query_cjsj.value = [kssj, jssj];

        netLoad_cgdrk_query(-1);
    });

    onActivated(() => {
        netLoad_cgdrk_query(x_page_index.value - 1)
    })

    /**
     * 搜索
     */
    const onSearch = () => {
        x_page_index.value = 1;
        netLoad_cgdrk_query(-1);
    }

    /**
     * 分页点击
     */
    const onPageChange = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_cgdrk_query(pageIndex - 1);
    }

    /**
     * 查询采购数据
     */
    const netLoad_cgdrk_query = async (pageIndex: number = -1) => {
        const pageRowCount = x_page_row_count.value;
        const rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        let cjsj1 = eolib.date_start(x_query_cjsj.value?.[0]);
        let cjsj2 = eolib.date_end(x_query_cjsj.value?.[1]);

        x_show_loading.value = true;
        let ret = await eocore.proc("p_cgdrk_query", {
            "v_gys_id": -1,
            "v_gysmc": x_query_key.value,
            "v_cgdh": x_query_key.value,
            "v_cjsj1": cjsj1,
            "v_cjsj2": cjsj2,
            "v_kcbh": x_query_key.value,
            "v_cpmc": x_query_key.value,
            "v_order_by": " ORDER BY f_cgdrk_id DESC",
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

    /**
     * 数据格式化
     */
    const formatItem = (data: any) => {
        data["f_cjsj_s"] = eolib.date_2_string(data["f_cjsj"]);
        data["f_cgdj_s"] =
            eolib.fixed_num(eocore.to_float(data["f_cgdj"]), 3);
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
