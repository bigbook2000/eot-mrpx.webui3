<template>
    <!-- 借用记录 - 移动端 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="调拨记录" :back="false" />
            <div class="eo_col_d">
                <!-- 搜索栏 -->
                <div class="div_search_bar">
                    <div class="search_input">
                        <el-input v-model="x_query_kcbh" placeholder="批次号" clearable
                            @keyup.enter="onButtonClick_Load_kcjy" />
                    </div>
                    <el-button @click="x_show_drawer = true">更多</el-button>
                    <el-button type="primary" @click="onButtonClick_Load_kcjy">搜索</el-button>
                </div>
            </div>
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                    <!-- 借用记录列表 -->
                    <div class="ap_list">
                        <div v-if="x_data_list.length == 0" class="empty">
                            暂无数据
                        </div>
                        <div v-for="item in x_data_list" :key="item.f_kcjy_id"
                            class="item"
                            :class="{ 'ap_sel': x_selected_id == item['f_kcjy_id'] }"
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
                                    <span class="label">调拨时间</span>
                                    <span class="value">{{ item['f_jysj_s'] }}</span>
                                    <span class="label">调拨状态</span>
                                    <span class="value">{{ item['f_jyzt_s'] }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">员工</span>
                                    <span class="value">{{ item['f_yg_id_s'] }}</span>
                                    <span class="label">数量</span>
                                    <span class="value">{{ item['f_cpsl'] }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">规格</span>
                                    <span class="value">{{ item['f_cpgg'] || '-' }}</span>
                                    <span class="label">尺寸</span>
                                    <span class="value">{{ item['f_cpcc'] || '-' }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">库管员</span>
                                    <span class="value">{{ item['f_kgy_id_s'] }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">备注</span>
                                    <span class="value">{{ item['f_beizhu'] }}</span>
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
                    @current-change="onPageChange_kcjy"
                    :current-page="x_page_index"
                    :page-size="x_page_row_count"
                    layout="total, prev, pager, next"
                    :total="x_row_total">
                </el-pagination>
            </div>
        </div>

        <!-- 更多查询 Drawer -->
        <el-drawer v-model="x_show_drawer" direction="ttb" size="auto" :with-header="false">
            <div class="drawer_body">
                <div class="eo_form">
                    <div class="cell eo_w100">
                        <div class="label_n">产品名称</div>
                        <div class="input">
                            <el-input v-model="x_query_cpmc" style="width:100%" maxlength="32" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">员工</div>
                        <div class="input">
                            <user_input v-model="x_query_yg_id"
                                :userName="x_query_yg_id_s" :app="true"
                                style="width:100%" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">开始时间</div>
                        <div class="input">
                            <el-date-picker style="width:100%"
                                v-model="x_query_kssj"
                                type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                                placeholder="选择日期" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">结束时间</div>
                        <div class="input">
                            <el-date-picker style="width:100%"
                                v-model="x_query_jssj"
                                type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                                placeholder="选择日期" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">调拨状态</div>
                        <div class="input">
                            <vdic style="width:100%" dic="调拨状态" :all="true" field="value"
                                v-model="x_query_jyzt" />
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="label_n">使用状态</div>
                        <div class="input">
                            <el-select style="width:100%" v-model="x_query_kcbz">
                                <el-option label="未用" :value="1" />
                                <el-option label="已用" :value="-1" />
                                <el-option label="全部" :value="-9" />
                            </el-select>
                        </div>
                    </div>
                    <div class="cell eo_w100">
                        <div class="input">
                            <el-button type="primary" class="eo_w100" @click="onDrawerSearch">搜索</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_kcgl_jygl" }
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
    import vdic from "@/components/vdic.vue"
    import user_input from "@/views/platform/user_input.vue"

    // 数据列表
    const x_data_list = ref<any[]>([]);
    const x_selected_id = ref(0);

    // 查询条件
    const x_query_kcbz = ref(-9);
    const x_query_kcbh = ref("");
    const x_query_kssj = ref("");
    const x_query_jssj = ref("");
    const x_query_jyzt = ref(-1);
    const x_query_yg_id = ref(-1);
    const x_query_yg_id_s = ref("");
    const x_query_cpmc = ref("");

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    // Drawer显隐
    const x_show_drawer = ref(false);

    onMounted(async () => {
        let dt = new Date();
        x_query_jssj.value = eolib.date_end(dt);
        dt.setMonth(dt.getMonth() - 1);
        x_query_kssj.value = eolib.date_start(dt);

        await netLoad_kcjy_query(-1);
    });

    /**
     * 格式化单条数据
     */
    const formatItem_kcjy = (data: any) => {
        data["f_jyzt_s"] = eodic.get_dic_label("调拨状态", data["f_jyzt"]);
        data["f_jysj_s"] = eolib.datetime_2_short(data["f_jysj"]);
        TLogic.updateDicUserData(data, ["f_yg_id", "f_kgy_id"]);
    }

    /**
     * 查询借用记录
     */
    const netLoad_kcjy_query = async (pageIndex: number = -1) => {
        const pageRowCount = x_page_row_count.value;
        const rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        const kssj = eolib.datetime_2_string(x_query_kssj.value);
        const jssj = eolib.datetime_2_string(x_query_jssj.value);

        x_show_loading.value = true;
        let ret = await eocore.proc("p_kcjy_query", {
            "v_kcbz": -9,
            "v_kcbh": x_query_kcbh.value,
            "v_kssj": kssj,
            "v_jssj": jssj,
            "v_jyzt": x_query_jyzt.value,
            "v_jyyg_id": x_query_yg_id.value,
            "v_cpmc": x_query_cpmc.value,
            "v_order_by": " ORDER BY f_kcjy_id DESC",
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

        // 格式化每条数据
        for (let d of list) {
            formatItem_kcjy(d);
        }
        x_data_list.value = list;

        // 清除选择
        x_selected_id.value = 0;
    }

    const onItemClick = (item: any) => {
        x_selected_id.value = item.f_kcjy_id;
    }

    /**
     * 分页点击事件
     */
    const onPageChange_kcjy = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_kcjy_query(pageIndex - 1);
    }

    /**
     * 查找按钮点击
     */
    const onButtonClick_Load_kcjy = () => {
        netLoad_kcjy_query(-1);
    }

    /**
     * Drawer 搜索
     */
    const onDrawerSearch = () => {
        x_show_drawer.value = false;
        netLoad_kcjy_query(-1);
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

    .drawer_body {
        padding: 0.8rem;
    }
</style>
