<template>
    <!-- 采购入库货物选择列表 -->
    <vdialog ref="v_dialog"
        width="480px" title="选择采购入库"
        @close="onDialogClose"
        @open="onDialogOpen">
        <div class="eo_col">
            <!-- 简洁搜索栏 -->
            <div class="div_search_bar">
                <el-input v-model="x_query_kcbh" placeholder="产品批次" clearable
                    @keyup.enter="onSearch" />
                <el-input v-model="x_query_cpmc" placeholder="产品名称" clearable
                    @keyup.enter="onSearch" />
                <el-button type="primary" @click="onSearch">搜索</el-button>
            </div>
            
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                    <!-- 入库记录卡片列表 -->
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
                                    <span class="value">{{ item.f_kcsl }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">供应商</span>
                                    <span class="value">{{ item.f_gysmc }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">采购单号</span>
                                    <span class="value">{{ item.f_cgdh }}</span>
                                    <span class="label">时间</span>
                                    <span class="value">{{ item.f_cjsj_s }}</span>
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
    </vdialog>
</template>


<script lang="ts" setup>
    import { ref } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import vdialog from "@/components/app/vdialog.vue"

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    // 定义组件事件
    const emit = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 查询条件
    const x_query_kcbh = ref("");
    const x_query_cpmc = ref("");

    // 列表数据
    const x_data_list = ref<any[]>([]);
    const x_selected_id = ref(0);

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    /**
     * 显示对话框
     */
    const show_dialog = async (data: any) => {
        x_selected_id.value = 0;
        v_dialog.value!.show_dialog(undefined);
    }

    const onDialogOpen = (data: any) => {
        netLoad_cgdrk_query(-1);
    }

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
     * 查询入库数据
     */
    const netLoad_cgdrk_query = async (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        let ret = await eocore.proc("p_cgdrk_query", {
            "v_gys_id": -1,
            "v_gysmc": "",
            "v_cgdh": "",
            "v_cjsj1": "",
            "v_cjsj2": "",
            "v_kcbh": x_query_kcbh.value,
            "v_cpmc": x_query_cpmc.value,
            "v_order_by": " ORDER BY f_cgdrk_id DESC",
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
        let list = eocore.check_net_array(ret);
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

    /**
     * 对话框关闭事件
     */
    const onDialogClose = (cancel: boolean, tag: any, cb: cfunc_boolean) => {
        if (cancel) {
            emit('close', true, {}, cb);
            return;
        }

        // 获取选中的产品
        let selectedData = x_data_list.value.find(
            item => item.f_kcmx_id == x_selected_id.value
        );
        if (selectedData == undefined) {
            eocore.show_info("请选择一条记录");
            cb(false); return;
        }

        emit('close', false, selectedData, cb);
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
    }
</style>
