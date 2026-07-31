<template>
    <!-- 库存选择列表 -->
    <vdialog ref="v_dialog"
        title="选择库存"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_col">
            <!-- 查询工具栏 -->
            <div class="eo_col_d">
                <div class="div_search_bar">
                    <div class="search_input">
                        <el-input v-model="x_query_kcxx" placeholder="批次或名称" clearable
                            maxlength="32" :disabled="x_query_fixed" />
                    </div>
                    <el-button type="primary" @click="onButtonClick_Load_kcmx">查找</el-button>
                </div>
                <div class="div_search_bar" style="border:none;">
                    <tcplb v-model="x_query_cplb_d" :cplb-list="x_cplb_list"
                        :disabled="x_query_fixed" />
                </div>
            </div>
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                    <div class="ap_list">
                        <div v-if="x_data_list.length == 0" class="empty">
                            暂无数据
                        </div>
                        <div v-for="item in x_data_list" :key="item.f_kcmx_id"
                            class="item"
                            :class="{ 'ap_sel': x_selected_id == item.f_kcmx_id }"
                            @click="x_selected_id = item.f_kcmx_id">
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
                                    <span class="value">{{ item.f_kcsl_s }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">入库时间</span>
                                    <span class="value">{{ item.f_rksj_s }}</span>
                                </div>
                                <div class="row" v-if="item.f_dlmc">
                                    <span class="label">大类</span>
                                    <span class="value">{{ item.f_dlmc }}</span>
                                    <span class="label">小类</span>
                                    <span class="value">{{ item.f_xlmc }}</span>
                                </div>
                                <div class="row" v-if="item.f_hwck_s">
                                    <span class="label">仓库</span>
                                    <span class="value">{{ item.f_hwck_s }}</span>
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
                    @current-change="onPageChange_kcmx"
                    :current-page="x_page_index"
                    :page-size="x_page_row_count"
                    layout="total, prev, pager, next"
                    :total="x_row_total">
                </el-pagination>
            </div>
        </div>
    </vdialog>
</template>

<script lang="ts" setup>
    import { ref } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import eodic from "@/inc/eodic";

    import tcplb from "@/views/vweb/ext/comm/tcplb.vue"
    import TLogic from "@/logic/TLogic";

    import vdialog from "@/components/app/vdialog.vue"

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    // 定义组件事件
    const emit = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    const x_cplb_list = ref<any[]>([]);
    const x_data_list = ref<any[]>([]);

    // 查询条件
    const x_query_cplb_d = ref([0, 0]);
    const x_query_kcxx = ref("");

    const x_query_fixed = ref(false);

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 当前选中项ID
    const x_selected_id = ref(0);

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const show_dialog = async (data: any) => {
        x_selected_id.value = 0;
        x_data_list.value = [];

        x_query_fixed.value = !eocore.check_empty(data["f_cpbm"]);
        // 初始化查询条件
        x_query_kcxx.value = data["f_cpbm"] || "";

        x_cplb_list.value = await TLogic.netload_Tree_cplb(true);

        v_dialog.value?.show_dialog(undefined);
    }

    const onDialogOpen = (data: any) => {
        netLoad_kcmx_query(-1);
    }

    /**
     * 对话框关闭事件
     */
    const onDialogClose = (cancel: boolean, tag: any, cb: cfunc_boolean) => {
        if (cancel) {
            emit('close', true, {}, cb);
            return;
        }

        // 获取选中的库存
        if (x_selected_id.value <= 0) {
            eocore.show_info("请选择库存");
            cb(false);
            return;
        }

        let selectedData = x_data_list.value.find(d => d.f_kcmx_id == x_selected_id.value);
        if (!selectedData) {
            eocore.show_info("未找到所选库存");
            cb(false);
            return;
        }

        emit('close', false, selectedData, cb);
    }

    /**
     * 格式化单条数据
     */
    const formatItem = (data: any) => {
        // 格式化价格
        data["f_kcdj_s"] = eolib.fixed_num(data["f_kcdj"], 3);
        data["f_kcsl_s"] = eolib.fixed_num(data["f_kcsl"], 3);

        data["f_rksj_s"] = eolib.date_2_string(data["f_rksj"]);

        // 仓库显示
        data["f_hwck_s"] = eodic.get_dic_label("产品仓库", data["f_hwck"]);
    }

    /**
     * 查询库存明细数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_kcmx_query = async (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        v_dialog.value?.show_loading(true);
        let ret = await eocore.proc("p_kcmx_query", {
            "v_kcbz": TLogic.kcbzCodes["正常"],
            "v_cpdl_id": x_query_cplb_d.value[0],
            "v_cpxl_id": x_query_cplb_d.value[1],
            "v_kcxx": x_query_kcxx.value,
            "v_jyzt": -1,
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
        v_dialog.value?.show_loading(false);
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
            formatItem(d);
        }
        x_data_list.value = list;
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_kcmx = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_kcmx_query(pageIndex - 1);
    }

    /**
     * 查找按钮点击
     */
    const onButtonClick_Load_kcmx = () => {
        netLoad_kcmx_query(-1);
    }    

    // 暴露方法给父组件使用
    defineExpose({
        show_dialog
    });
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
</style>
