<template>
    <!-- 销售管理 - 移动端 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="销售订单" :back="false" />
            <div class="eo_col_d">
                <!-- 简洁搜索栏 -->
                <div class="div_search_bar">
                    <el-button type="primary" @click="onButtonClick_Add_xsd">新增</el-button>
                    <el-input v-model="x_query_khmc" placeholder="客户名称" clearable
                        @keyup.enter="onSearch" />
                    <el-button type="primary" @click="onSearch">搜索</el-button>
                </div>
            </div>
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                    <!-- 销售单卡片列表 -->
                    <div class="ap_list">
                        <div v-if="x_data_list.length == 0" class="empty">
                            暂无数据
                        </div>
                        <div v-for="item in x_data_list" :key="item.f_xsd_id"
                            class="item"
                            :class="{ 'ap_sel': x_selected_id == item.f_xsd_id }"
                            @click="x_selected_id = item.f_xsd_id">
                            <div class="body">
                                <div class="row">
                                    <span class="value title">{{ item.f_xsdh }}</span>
                                    <span class="div_tag" v-if="item.f_yxbz == 0">作废</span>
                                </div>
                                <div class="row">
                                    <span class="label">客户</span>
                                    <span class="value">{{ item.f_khgl_id_s || '-' }}</span>
                                    <span class="label">销售员</span>
                                    <span class="value">{{ item.f_xsy_id_s }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">总金额</span>
                                    <span class="value">{{ item.f_xsje_s }}</span>
                                    <span class="label">状态</span>
                                    <span class="value">{{ item.f_flow_point_id_s }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">付款</span>
                                    <span class="value">{{ item.f_fklb_s }}</span>
                                    <span class="label">时间</span>
                                    <span class="value">{{ item.f_cjsj_s }}</span>
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
export default { name: "app_xsgl_xsgl" }
</script>

<script lang="ts" setup>

    import { ref, computed, onMounted, onActivated } from "vue"

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"
    import eodic from "@/inc/eodic"
    import eoflow, { type cflow_type } from "@/inc/eoflow"

    import router from "@/router/index"
    import topbar from '@/views/vapp/comm/topbar.vue'

    import TGlobal from "@/logic/TGlobal"
    import TLogic from "@/logic/TLogic"

    // 流程类型：销售出库
    let m_flow_type: cflow_type | undefined = undefined;

    // 查询条件
    const x_query_xsdh = ref("");
    const x_query_khmc = ref("");
    const x_query_xsy_id = ref(-1);
    const x_query_xsy = ref(false);
    const x_query_flow_point_id = ref(-1);

    // 列表
    const x_data_list = ref<any[]>([]);
    const x_show_loading = ref(false);
    const x_selected_id = ref(0);

    // 分页
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    onMounted(() => {

        m_flow_type = eoflow.get_type_by_name("销售出库");

        x_query_xsy.value = TLogic.checkPermit("_xsgl.xsd.ckqb");
        if (x_query_xsy.value) {
            x_query_xsy_id.value = -1;
        } else {
            x_query_xsy_id.value = TGlobal.userData["f_user_id"];
        }

        netLoad_xsd_query(-1);
    })

    onActivated(() => {
        netLoad_xsd_query(x_page_index.value - 1)
    })

    const onSearch = () => {
        x_page_index.value = 1;
        netLoad_xsd_query(-1);
    }

    const onPageChange = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_xsd_query(pageIndex - 1);
    }

    const netLoad_xsd_query = async (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        x_show_loading.value = true;
        let ret = await eocore.proc("p_xsd_query", {
            "v_xsdh": x_query_xsdh.value,
            "v_xsy_id": x_query_xsy_id.value,
            "v_khmc": x_query_khmc.value,
            "v_flow_point_id": x_query_flow_point_id.value,
            "v_yxbz": -1,
            "v_sfje1": -0.01,
            "v_sfje2": -0.01,
            "v_cjsj1": "",
            "v_cjsj2": "",
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
        x_selected_id.value = item.f_xsd_id;
        router.push({ name: 'app_xsgl_xsd_xx', query: { id: item.f_xsd_id } })
    }

    const onButtonClick_Add_xsd = () => {
        router.push({ name: 'app_xsgl_xsd_xx', query: { id: 0 } });
    }

    const formatItem = (data: any) => {

        data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"]);
        data["f_xsje_s"] = eolib.fixed_num(data["f_xsje"], 3);
        data["f_ssje_s"] = eolib.fixed_num(data["f_ssje"], 3);
        data["f_fklb_s"] = eodic.get_dic_label("付款类别", data["f_fklb"]);
        data["f_flow_point_id_s"] = eoflow.get_point_name(m_flow_type, data["f_flow_point_id"]);
        
        TLogic.updateDicUserData(data, ["f_xsy_id"]);
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
