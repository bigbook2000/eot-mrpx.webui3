<template>
    <!-- 库存整理 - 移动端 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="库存整理" :back="false" />
            <div class="eo_col_d">
                <!-- 简洁搜索栏 -->
                <div class="div_search_bar">
                    <el-button type="primary" @click="onButtonClick_Add_kcmx">新增</el-button>
                    <el-badge :value="x_checked_ids.size" :hidden="x_checked_ids.size === 0">
                        <el-button @click="x_show_select = true">选择</el-button>
                    </el-badge>
                    <div class="search_input">
                        <el-input v-model="x_query_kcxx" placeholder="批次号或名称" clearable 
                            @keyup.enter="onSimpleSearch" />
                    </div>
                    <el-button type="primary" @click="onSimpleSearch">搜索</el-button>
                </div>
            </div>
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                    <!-- 库存明细列表 -->
                    <div class="ap_list">
                        <div v-if="x_data_list.length == 0" class="empty">
                            暂无数据
                        </div>
                        <div v-for="item in x_data_list" :key="item.f_kcmx_id"
                            class="item"
                            :class="{ 'ap_sel': x_selected_id == item.f_kcmx_id }">
                            <div class="check" @click.stop="onItemCheck(item)">
                                <el-checkbox :model-value="x_checked_ids.has(item.f_kcmx_id)" />
                            </div>
                            <div class="body">
                                <div class="row">
                                    <span class="label">批次</span>
                                    <span class="value title">{{ item.f_kcbh }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">名称</span>
                                    <span class="value">{{ item.f_cpmc }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">单价</span>
                                    <span class="value">{{ item.f_kcdj_s }}</span>
                                    <span class="label">数量</span>
                                    <span class="value">{{ item.f_kcsl }}</span>
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
                                <div class="row">
                                    <span class="label">调拨</span>
                                    <span class="value">{{ item.f_jyzt_s }}</span>
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
                    @current-change="onPageChange_kcmx"
                    :current-page="x_page_index"
                    :page-size="x_page_row_count"
                    layout="total, prev, pager, next"
                    :total="x_row_total">
                </el-pagination>
            </div>
        </div>

        <!-- 更多查询 Drawer -->
        <el-drawer v-model="x_show_drawer" direction="ttb" size="auto" :with-header="false">
            <kczl_q :cplb-list="x_cplb_list" :init-batch="x_query_kcxx" @search="onDrawerSearch" />
        </el-drawer>
        <!-- 已选择列表 -->
        <kczl_select v-model="x_show_select" :list="x_checked_list" @detail="onItemDetailClick" />
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_kcgl_kczl" }
</script>

<script lang="ts" setup>

    import { ref, computed, onMounted } from "vue"
    import { useRouter } from "vue-router"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import eodic from "@/inc/eodic";

    import topbar from '@/views/app/comm/topbar.vue'
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import kczl_q from "./kczl_q.vue"
    import kczl_select from "./kczl_select.vue"

    const router = useRouter();

    // 数据列表
    const x_data_list = ref<any[]>([]);
    // 当前选中项ID
    const x_selected_id = ref(0);
    // 勾选项ID集合（多选用于调拨、并库）
    const x_checked_ids = ref(new Set<number>());

    // 产品类别列表
    const x_cplb_list = ref<any[]>([]);

    // 查询条件
    const x_query_cplb = ref([0, 0]);
    const x_query_kcxx = ref("");
    const x_query_jyzt = ref(-1);

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    // Drawer显隐
    const x_show_drawer = ref(false);

    // 已选择列表弹窗
    const x_show_select = ref(false);
    const x_checked_list = computed(() => {
        return x_data_list.value.filter(d => x_checked_ids.value.has(d.f_kcmx_id));
    });

    onMounted(async () => {
        // 加载产品类别列表
        x_cplb_list.value = await TLogic.netload_Tree_cplb(true);
        // 初始化加载数据
        netLoad_kcmx_query(-1);
    });

    /**
     * 格式化单条数据
     */
    const formatItem = (data: any) => {
        data["f_jyzt_s"] = eodic.get_dic_label("调拨状态", data["f_jyzt"]);
        data["f_rksj_s"] = eolib.datetime_2_short(data["f_rksj"], true);
        data["f_pksj_s"] = eolib.datetime_2_short(data["f_pksj"], true);
        data["f_kcdj_s"] = eolib.fixed_num(data["f_kcdj"], 3);
        data["f_hwck_s"] = eodic.get_dic_label("产品仓库", data["f_hwck"]);
        TLogic.updateDicUserData(data, ["f_jyyg_id"]);
    }

    /**
     * 查询库存明细数据
     */
    const netLoad_kcmx_query = async (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        x_show_loading.value = true;
        let ret = await eocore.proc("p_kcmx_query", {
            "v_kcbz": TLogic.kcbzCodes["正常"],
            "v_cpdl_id": x_query_cplb.value[0],
            "v_cpxl_id": x_query_cplb.value[1],
            "v_kcxx": x_query_kcxx.value,
            "v_jyzt": x_query_jyzt.value,
            "v_rklb": "",
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

        // 分页总数，只有当rowIndex<0才返回总数
        if (rowIndex < 0) {
            if (list.length > 0) {
                x_row_total.value = eocore.to_int(list[0]["s_total_count"]);
            } else {
                x_row_total.value = 0;
            }
        }

        // 格式化每条数据
        for (let d of list) {
            formatItem(d);
        }
        x_data_list.value = list;

        // 清除选择
        x_selected_id.value = 0;
        x_checked_ids.value = new Set();
    }

    /**
     * 列表项点击 - 导航到库存明细页
     */
    const onItemDetailClick = (item: any) => {
        x_selected_id.value = item.f_kcmx_id;
        router.push({
            name: 'app_kcgl_kcmx',
            state: { kcmxData: JSON.parse(JSON.stringify(item)) }
        });
    }

    /**
     * 复选框点击
     */
    const onItemCheck = (item: any) => {
        const id = item.f_kcmx_id;
        const newSet = new Set(x_checked_ids.value);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        x_checked_ids.value = newSet;
    }

    /**
     * 获取勾选的数据列表
     */
    const getCheckedList = (): any[] => {
        return x_data_list.value.filter(d => x_checked_ids.value.has(d.f_kcmx_id));
    }

    /**
     * 获取选中的单条数据（优先勾选的第一条，否则选中的那条）
     */
    const getSelectedItem = (needConfirm: boolean): any | undefined => {
        const checked = getCheckedList();
        if (checked.length > 0) return checked[0];
        if (x_selected_id.value > 0) {
            return x_data_list.value.find(d => d.f_kcmx_id == x_selected_id.value);
        }
        if (needConfirm) {
            eocore.show_info("请先选择库存项");
        }
        return undefined;
    }

    /**
     * 分页点击事件
     */
    const onPageChange_kcmx = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_kcmx_query(pageIndex - 1);
    }

    /**
     * 简洁搜索（仅批次）
     */
    const onSimpleSearch = () => {
        // 简洁搜索仅按批次查询，重置其他条件
        x_query_kcxx.value = "";
        x_query_cplb.value = [0, 0];
        x_query_jyzt.value = -1;
        netLoad_kcmx_query(-1);
    }

    /**
     * Drawer组合查询搜索
     */
    const onDrawerSearch = (params: { cplb: number[], kcxx: string, jyzt: number }) => {
        x_query_cplb.value = params.cplb;
        x_query_kcxx.value = params.kcxx;
        x_query_jyzt.value = params.jyzt;
        x_show_drawer.value = false;
        netLoad_kcmx_query(-1);
    }

    /**
     * 添加库存明细
     */
    const onButtonClick_Add_kcmx = async () => {
        let kcmxData: any = {
            "f_kcmx_id": 0,
            "f_cpdy_id": 0,
            "f_kcbh": "",
            "f_rklb": "整理入库",
            "f_rkid": 0,
            "f_rksj": "1970-01-01 00:00:00",
            "f_rksj_s": "",
            "f_cklb": "",
            "f_ckid": 0,
            "f_cksj": "1970-01-01 00:00:00",
            "f_cksj_s": "",
            "f_cpmc": "",
            "f_cpbm": "",
            "f_jyzt": 0,
            "f_jyyg_id": 0,
            "f_hwck": 0,
            "f_kcsl": 1.0,
            "f_kcsl_s": "1.0",
            "f_kcdj": 0.0,
            "f_kcdj_s": "0.00",
            "f_pksj": "1970-01-01 00:00:00",
            "f_pksj_s": "",
            "f_kgy_id": TGlobal.userData["f_user_id"],
            "f_kgy_id_s": TGlobal.userData["f_name"],
            "f_beizhu": "",
            "f_kcbz": TLogic.kcbzCodes["正常"],
        };
        kcmxData["rksl"] = 1;
        router.push({
            name: 'app_kcgl_kcmx',
            state: { kcmxData: JSON.parse(JSON.stringify(kcmxData)) }
        });
    }

    /**
     * 出库（移除）
     */
    const onButtonClick_Del_kcmx = async () => {
        const kcmxData = getSelectedItem(true);
        if (kcmxData == undefined) return;
        let ret = await eocore.show_confirm(
            "是否移除库存货物 " + kcmxData["f_kcbh"] + "？一旦操作将造成不可预知的错误");
        if (!ret) return;

        x_show_loading.value = true;
        const dataNew = await TLogic.netLoad_kcmx_upd(
            kcmxData["f_kcmx_id"],
            0,
            kcmxData["f_cpdy_id"],
            kcmxData["f_kcbh"],
            "整理出库",
            0,
            kcmxData["f_hwck"],
            kcmxData["f_kcdj"],
            kcmxData["f_kcsl"],
            TGlobal.userData["f_user_id"],
            kcmxData["f_beizhu"],
            TLogic.kcbzCodes["历史"]
        );
        x_show_loading.value = false;
        if (dataNew == undefined) return;

        // 从列表中移除
        const idx = x_data_list.value.findIndex(d => d.f_kcmx_id == kcmxData.f_kcmx_id);
        if (idx >= 0) x_data_list.value.splice(idx, 1);
        x_selected_id.value = 0;
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

    /* 标签（主色调） */
    .div_tag {
        flex: 0 0 auto;
        font-size: 0.9rem;
        color: #fff;
        background: var(--eo_color_main);
        padding: 0.1rem 0.4rem;
        border-radius: 0.3rem;
        margin-left: 0.5rem;
    }

    .detail_btn {
        width: 4rem;
        height: 1.8rem;
        font-size: 0.9rem;
    }
</style>