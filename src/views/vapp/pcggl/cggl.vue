<template>
    <!-- 采购入库管理 - 移动端 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="采购入库" :back="false" />
            <div class="eo_col_d">
                <!-- 简洁搜索栏 -->
                <div class="div_search_bar">
                    <el-button type="primary" @click="onButtonClick_Add_cgd">新增</el-button>
                    <el-input v-model="x_query_gysmc" placeholder="供应商名称" clearable
                        @keyup.enter="onSearch" />
                    <el-button type="primary" @click="onSearch">搜索</el-button>
                </div>
            </div>
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                    <!-- 采购入库卡片列表 -->
                    <div class="ap_list">
                        <div v-if="x_data_list.length == 0" class="empty">
                            暂无数据
                        </div>
                        <div v-for="item in x_data_list" :key="item.f_cgd_id"
                            class="item"
                            :class="{ 'ap_sel': x_selected_id == item.f_cgd_id }"
                            @click="x_selected_id = item.f_cgd_id">
                            <div class="body">
                                <div class="row">
                                    <span class="value title">{{ item.f_cgdh }}</span>
                                    <span class="div_tag" v-if="item.f_yxbz == 0">作废</span>
                                </div>
                                <div class="row">
                                    <span class="label">供应商</span>
                                    <span class="value">{{ item.f_gys_id_s || '-' }}</span>
                                    <span class="label">采购员</span>
                                    <span class="value">{{ item.f_cgy_id_s }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">总金额</span>
                                    <span class="value">{{ item.f_zje_s }}</span>
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
export default { name: "app_cggl_cggl" }
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

    // 流程类型：采购入库
    let m_flow_type: cflow_type | undefined = undefined;

    // 查询条件
    const x_query_cgdh = ref("");
    const x_query_gysmc = ref("");
    const x_query_cgy_id = ref(-1);

    // 列表
    const x_data_list = ref<any[]>([]);
    const x_show_loading = ref(false);
    const x_selected_id = ref(0);

    // 分页
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    onMounted(() => {

        m_flow_type = eoflow.get_type_by_name("采购入库");

        x_query_cgy_id.value = TGlobal.userData["f_user_id"];

        netLoad_cgd_query(-1);
    })

    onActivated(() => {
        netLoad_cgd_query(x_page_index.value - 1)
    })

    const onSearch = () => {
        x_page_index.value = 1;
        netLoad_cgd_query(-1);
    }

    const onPageChange = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_cgd_query(pageIndex - 1);
    }

    const netLoad_cgd_query = async (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        x_show_loading.value = true;
        let ret = await eocore.proc("p_cgd_query", {
            "v_cgdh": x_query_cgdh.value,
            "v_cgy_id": x_query_cgy_id.value,
            "v_shr_id": -1,
            "v_gysmc": x_query_gysmc.value,
            "v_lxr": "",
            "v_lxdh": "",
            "v_wlgs_id": -1,
            "v_wldh": "",
            "v_yxbz": -1,
            "v_sfje1": -0.01,
            "v_sfje2": -0.01,
            "v_cjsj1": "",
            "v_cjsj2": "",
            "v_shsj1": "",
            "v_shsj2": "",
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
        x_selected_id.value = item.f_cgd_id;
        router.push({ name: 'app_cggl_cgd_xx', query: { id: item.f_cgd_id } });
    }

    const onButtonClick_Add_cgd = () => {
        const cgdData = {
            "f_cgd_id": 0,
            "f_cgdh": "",
            "f_gys_id": 0,
            "f_gys_id_s": "",
            "f_cgy_id": TGlobal.userData["f_user_id"],
            "f_cgy_id_s": TGlobal.userData["f_name"],
            "f_cgjh_id": 0,
            "f_cgjhdh": "",
            "f_lxr": "",
            "f_lxdh": "",
            "f_wlgs_id": 0,
            "f_wlgs_id_s": "",
            "f_wldh": "",
            "f_shr_id": 0,
            "f_shr_id_s": "",
            "f_fklb": 1,
            "f_zje": 0.0,
            "f_sfje": 0.0,
            "f_cjsj": "",
            "f_shsj": "1970-01-01 00:00:00",
            "f_yxbz": 1,
            "f_flow_point_id": 0,
            "f_flow_process_id": 0,
            "f_beizhu": ""
        };
        router.push({ name: 'app_cggl_cgd_xx', state: { cgdData } })
    }

    const getFlowPointName = (pointId: number): string => {
        if (!m_flow_type) {
            m_flow_type = eoflow.get_type_by_name("采购入库");
        }
        if (!m_flow_type) return "";
        for (let d of m_flow_type.points) {
            if (d.flow_point_id == pointId) return d.name;
        }
        return "";
    }

    const formatItem = (data: any) => {
        data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"]);
        data["f_zje_s"] = eolib.fixed_num(data["f_zje"], 3);
        data["f_sfje_s"] = eolib.fixed_num(data["f_sfje"], 3);
        data["f_fklb_s"] = eodic.get_dic_label("付款类别", data["f_fklb"]);
        data["f_flow_point_id_s"] = getFlowPointName(data["f_flow_point_id"]);
        TLogic.updateDicUserData(data, ["f_cgy_id", "f_shr_id"]);
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