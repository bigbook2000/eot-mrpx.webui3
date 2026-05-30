<template>
    <!-- 产品档案 - App端 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="产品定义" />
            <!-- 搜索栏 -->
            <div class="div_search_bar">
                <div class="search_input">
                    <el-input v-model="x_query_cpmc" placeholder="搜索产品名称"
                        clearable @keyup.enter="onSearch" />
                </div>
                <el-button type="primary" @click="onSearch">搜索</el-button>
            </div>
            <!-- 列表 -->
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                    <div class="ap_list">
                        <div v-if="x_data_list.length === 0 && !x_show_loading"
                            class="empty">
                            暂无产品数据
                        </div>
                        <div v-for="item in x_data_list" :key="item.f_cpdy_id"
                            class="item"
                            @click="onItemClick(item)">
                            <div class="body">
                                <div class="row">
                                    <span class="value title">{{ item.f_cpmc }}</span>
                                    <span class="value">{{ item.f_cpbm }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">类别</span>
                                    <span class="value">{{ item.f_dlmc }} / {{ item.f_xlmc }}</span>
                                    <span class="label">库存</span>
                                    <span class="value">{{ item.f_cpsl }}</span>
                                </div>
                                <!-- 第3行：定价 + 库存数量 -->
                                <div class="row">
                                    <span class="label">定价</span>
                                    <span class="value">{{ item.f_cpjg_s }}</span>
                                    <span class="label">成本</span>
                                    <span class="value">{{ item.f_kcdj_s }}</span>
                                </div>
                                <!-- 第4行：单件数量 + 单位 -->
                                <div class="row">
                                    <span class="label">单件</span>
                                    <span class="value">{{ item.f_bzsl }}</span>
                                    <span class="label">单位</span>
                                    <span class="value">{{ item.f_cpdw || '-' }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">尺寸</span>
                                    <span class="value">{{ item.f_cpcc || '-' }}</span>
                                    <span class="label">重量</span>
                                    <span class="value">{{ item.f_cpzl || '-' }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">规格</span>
                                    <span class="value">{{ item.f_cpgg || '-' }}</span>
                                    <span class="label">上架</span>
                                    <span class="value">{{ item.f_cjsj_s || '-' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 分页 -->
            <div class="div_page_bar">
                <el-pagination background 
                    :pager-count="5"
                    @current-change="onPageChange"
                    :current-page="x_page_index"
                    :page-size="x_page_row_count"
                    layout="prev, pager, next"
                    :total="x_row_total">
                </el-pagination>
            </div>
        </div>
    </div>
    <!-- 产品编辑对话框 -->
    <cpdy_xx ref="v_cpdy_xx" @close="onDialogClose_cpdy" />
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_kcgl_cpdy" }
</script>

<script lang="ts" setup>
    import { ref, onMounted } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";

    import topbar from '@/views/app/comm/topbar.vue'
    import cpdy_xx from "./cpdy_xx.vue"
    import TLogic from "@/logic/TLogic";

    // 搜索
    const x_query_cpmc = ref("");

    // 列表
    const x_data_list = ref<any[]>([]);
    const x_show_loading = ref(false);
    const m_cplb_list = ref<any[]>([]);

    const v_cpdy_xx = ref<InstanceType<typeof cpdy_xx>>();

    // 分页
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    const onSearch = () => {
        x_page_index.value = 1;
        netLoad_cpdy_query(-1);
    }

    const onPageChange = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_cpdy_query(pageIndex - 1);
    }

    onMounted(async () => {
        // 加载产品类别树（供编辑对话框使用）
        m_cplb_list.value = await TLogic.netload_Tree_cplb(false);
        await netLoad_cpdy_query(-1);
    });

    const formatItem = (data: any) => {
        data["f_cpjg_s"] = eolib.fixed_num(data["f_cpjg"], 3);

        let cpsl = eocore.to_float(data["f_cpsl"]);
        let cpzj = eocore.to_float(data["f_cpzj"]);
        if (cpsl > 0.0) cpzj = cpzj / cpsl;
        data["f_kcdj_s"] = eolib.fixed_num(cpzj, 3);

        data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"], true);
    }

    const netLoad_cpdy_query = async (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        x_show_loading.value = true;
        let ret = await eocore.proc("p_cpdy_query", {
            "v_cpdl_id": 0,
            "v_cpxl_id": 0,
            "v_cpmc": x_query_cpmc.value,
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
        let list = eocore.check_net_array(ret);
        x_show_loading.value = false;
        if (list == undefined) list = [];

        // 分页总数
        if (list.length > 0 && list[0]["s_total_count"] != undefined) {
            x_row_total.value = eocore.to_int(list[0]["s_total_count"]);
        }

        // 格式化
        for (let d of list) {
            formatItem(d);
        }
        x_data_list.value = list;
    }

    // ==================== 产品编辑 ====================
    const getCode_cpbm = async (data: any): Promise<String> => {
        let cpdlData: any;
        let cpxlData: any;
        for (let d1 of m_cplb_list.value) {
            if (d1["f_cpdl_id"] == data["f_cpdl_id"]) {
                cpdlData = d1;
                for (let d2 of d1.children) {
                    if (d2["f_cpxl_id"] == data["f_cpxl_id"]) {
                        cpxlData = d2;
                        break;
                    }
                }
                break;
            }
        }
        if (cpdlData == undefined || cpxlData == undefined) return "";
        let recordId = await TLogic.netLoad_SeekID("tcpxl", "f_cpxl_id", cpxlData["f_cpxl_id"]);
        return cpdlData["f_dlbm"] + cpxlData["f_xlbm"] + String(recordId).padStart(6, '0');
    }

    const onItemClick = (item: any) => {
        v_cpdy_xx.value?.show_dialog(item, m_cplb_list.value);
    }

    const onDialogClose_cpdy = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) { cb(true); return; }

        // 验证
        if (!data["f_cpmc"]) {
            eocore.show_info("请填写产品名称");
            cb(false); return;
        }
        if (!data["f_cpdl_id"] || !data["f_cpxl_id"]) {
            eocore.show_info("请选择产品大类和小类");
            cb(false); return;
        }

        let isAdd = data["f_cpdy_id"] == 0;
        if (isAdd) {
            data["f_cpbm"] = await getCode_cpbm(data);
        }
        if (!data["f_cpbm"]) {
            eocore.show_info("缺少产品编码");
            cb(false); return;
        }

        // 回写数据库
        let ret = await eocore.proc("p_cpdy_upd", {
            "v_cpdy_id": data["f_cpdy_id"],
            "v_cpxl_id": data["f_cpxl_id"],
            "v_cpbm": data["f_cpbm"],
            "v_cpmc": data["f_cpmc"],
            "v_cpgg": data["f_cpgg"],
            "v_cpcc": data["f_cpcc"],
            "v_cpzl": data["f_cpzl"],
            "v_cpdw": data["f_cpdw"],
            "v_bzsl": data["f_bzsl"],
            "v_cpjg": data["f_cpjg"],
            "v_cpzt": data["f_cpzt"],
            "v_cpms": data["f_cpms"]
        });
        let dataNew = eocore.check_net_object(ret);
        if (dataNew == undefined) { cb(false); return; }

        // 刷新列表
        x_data_list.value = x_data_list.value.map(d =>
            d.f_cpdy_id === dataNew.f_cpdy_id ? { ...d, ...dataNew } : d
        );
        formatItem(dataNew);

        eocore.show_success("保存成功");
        cb(true);
    }
</script>

<style lang="scss" scoped>
    .div_search_bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0.5rem 0.6rem;
        gap: 0.5rem;

        .search_input {
            flex: 1 1 auto;
        }
    }

    .div_page_bar {
        display: flex;
        justify-content: center;
        padding: 0.5rem 0;
    }
        
    /* 停产标签（红色） */
    .div_tag_stop {
        flex: 0 0 auto;
        font-size: 0.7rem;
        color: #fff;
        background: #e74c3c;
        padding: 0.05rem 0.35rem;
        border-radius: 0.25rem;
        margin-right: 0.4rem;
    }
</style>
