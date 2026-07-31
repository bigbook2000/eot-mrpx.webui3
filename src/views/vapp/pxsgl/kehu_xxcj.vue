<template>
    <!-- 成交记录 -->
    <div class="eo_col">
        <div class="eo_col_f">
            <div class="eo_scroll_v">
                <div class="ap_list">
                    <div v-if="x_data_list.length == 0" class="empty">
                        暂无成交记录
                    </div>
                    <div v-for="item in x_data_list" :key="item.f_xsdck_id"
                        class="item">
                        <div class="body">
                            <div class="row">
                                <span class="label">产品</span>
                                <span class="value title">{{ item.f_cpmc }}</span>
                            </div>
                            <div class="row">
                                <span class="label">批次</span>
                                <span class="value">{{ item.f_kcbh }}</span>
                            </div>
                            <div class="row">
                                <span class="label">金额</span>
                                <span class="value">{{ item.f_xsje_s }}</span>
                                <span class="label">数量</span>
                                <span class="value">{{ item.f_kcsl }}</span>
                            </div>
                            <div class="row">
                                <span class="label">销售员</span>
                                <span class="value">{{ item.f_xsy_id_s }}</span>
                                <span class="label">时间</span>
                                <span class="value">{{ item.f_cjsj_s }}</span>
                            </div>
                            <div class="row">
                                <span class="label">订单号</span>
                                <span class="value">{{ item.f_xsdh || '-' }}</span>
                            </div>
                            <div class="row">
                                <span class="label">规格</span>
                                <span class="value">{{ item.f_cpgg || '-' }}</span>
                            </div>
                            <div class="row">
                                <span class="label">尺寸</span>
                                <span class="value">{{ item.f_cpcc || '-' }}</span>
                                <span class="label">重量</span>
                                <span class="value">{{ item.f_cpzl || '-' }}</span>
                            </div>
                            <div class="row" v-if="item.f_beizhu">
                                <span class="label">备注</span>
                                <span class="value">{{ item.f_beizhu }}</span>
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
</template>

<script lang="ts" setup>
    import { ref } from "vue"

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"

    import TLogic from "@/logic/TLogic";

    let m_khgl_id = ref(0);

    const x_data_list = ref<any[]>([]);
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    const loadData = async (khglId: number, pageIndex: number = -1) => {
        m_khgl_id.value = khglId;

        if (khglId <= 0) {
            x_data_list.value = [];
            return;
        }

        const pageRowCount = x_page_row_count.value;
        const rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        const ret = await eocore.proc("p_xsdck_query", {
            "v_xsy_id": -1,
            "v_khgl_id": khglId,
            "v_khmc": "",
            "v_xsdh": "",
            "v_cjsj1": "",
            "v_cjsj2": "",
            "v_kcbh": "",
            "v_cpmc": "",
            "v_order_by": " ORDER BY f_xsdck_id DESC",
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
        let list = eocore.check_net_array(ret);
        if (list == undefined) list = [];

        if (rowIndex < 0) {
            x_row_total.value = list.length > 0 ? eocore.to_int(list[0]["s_total_count"]) : 0;
        }

        for (let d of list) {
            formatItem(d);
        }
        x_data_list.value = list;
    };

    const formatItem = (item: any) => {
        item["f_cjsj_s"] = eolib.datetime_2_short(item["f_cjsj"]);
        item["f_xsje_s"] = eolib.fixed_num(item["f_xsdj"] * item["f_kcsl"], 3);
        TLogic.updateDicUserData(item, ["f_xsy_id"]);
    };

    const onPageChange = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        loadData(m_khgl_id.value, pageIndex - 1);
    };

    defineExpose({ loadData });
</script>
