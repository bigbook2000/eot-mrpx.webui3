<template>
    <!-- 产品选择对话框 - App端 -->
    <el-dialog v-model="x_visible" title="选择产品" fullscreen 
        class="ap_dialog" @open="onDialogOpen">
        <div class="div_dialog">
            <div class="eo_col">
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
                                :class="{ 'ap_sel': x_selected_id === item.f_cpdy_id }"
                                @click="x_selected_id = item.f_cpdy_id">
                                <div class="check" @click.stop="onItemCheck(item)">
                                    <el-checkbox :model-value="x_selected_id === item.f_cpdy_id" />
                                </div>
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
                                    <div class="row">
                                        <span class="label">定价</span>
                                        <span class="value">{{ item.f_cpjg_s }}</span>
                                        <span class="label">成本</span>
                                        <span class="value">{{ item.f_kcdj_s }}</span>
                                    </div>
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
                <div class="div_page_bar" v-if="x_row_total > x_page_row_count">
                    <el-pagination background
                        :pager-count="5"
                        @current-change="onPageChange"
                        :current-page="x_page_index"
                        :page-size="x_page_row_count"
                        layout="prev, pager, next"
                        :total="x_row_total">
                    </el-pagination>
                </div>
                <div class="eo_form">
                    <div class="button">
                        <el-button class="ap_button" type="primary" @click="onConfirm">确定</el-button>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { ref, computed, nextTick } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";

    const emit = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 对话框显隐
    const x_visible = ref(false);

    // 搜索
    const x_query_cpmc = ref("");

    // 列表
    const x_data_list = ref<any[]>([]);
    const x_show_loading = ref(false);

    // 分页
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 选中项
    const x_selected_id = ref(0);

    const onSearch = () => {
        x_page_index.value = 1;
        netLoad_cpdy_query(-1);
    }

    const onPageChange = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_cpdy_query(pageIndex - 1);
    }

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
            "v_cpzt": 1,
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

        for (let d of list) {
            formatItem(d);
        }
        x_data_list.value = list;
    }

    /**
     * 显示对话框
     */
    const show_dialog = (data: any) => {
        x_selected_id.value = 0;
        x_query_cpmc.value = "";
        x_visible.value = true;
    }

    const onDialogOpen = () => {
        netLoad_cpdy_query(-1);
    }

    const onCancel = () => {
        emit('close', true, {}, (result: boolean) => {
            x_visible.value = !result;
        });
    }

    const onConfirm = () => {
        if (x_selected_id.value === 0) {
            eocore.show_info("请选择一个产品");
            return;
        }
        const selected = x_data_list.value.find(d => d.f_cpdy_id === x_selected_id.value);
        if (!selected) {
            eocore.show_info("请选择一个产品");
            return;
        }
        emit('close', false, selected, (result: boolean) => {
            x_visible.value = !result;
        });
    }

    /**
     * 复选框点击（单选切换）
     */
    const onItemCheck = (item: any) => {
        if (x_selected_id.value === item.f_cpdy_id) {
            x_selected_id.value = 0;
        } else {
            x_selected_id.value = item.f_cpdy_id;
        }
    }

    defineExpose({ show_dialog });
</script>

<style lang="scss" scoped>
    .div_dialog {
        height: 100%;
        overflow: hidden;
    }

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
