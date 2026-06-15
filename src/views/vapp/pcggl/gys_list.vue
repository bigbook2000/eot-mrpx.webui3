<template>
    <!-- 供应商选择对话框 - App端 -->
    <el-dialog v-model="x_visible" title="选择供应商" fullscreen
        class="ap_dialog" @open="onDialogOpen">
        <div class="div_dialog">
            <div class="eo_col">
                <!-- 搜索栏 -->
                <div class="div_search_bar">
                    <div class="search_input">
                        <el-input v-model="x_query_gysmc" placeholder="搜索供应商名称"
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
                                暂无供应商数据
                            </div>
                            <div v-for="item in x_data_list" :key="item.f_gys_id"
                                class="item"
                                :class="{ 'ap_sel': x_selected_id === item.f_gys_id }"
                                @click="x_selected_id = item.f_gys_id">
                                <div class="check" @click.stop="onItemCheck(item)">
                                    <el-checkbox :model-value="x_selected_id === item.f_gys_id" />
                                </div>
                                <div class="body">
                                    <div class="row">
                                        <span class="value title">{{ item.f_gysmc }}</span>
                                    </div>
                                    <div class="row">
                                        <span class="label">联系人</span>
                                        <span class="value">{{ item.f_lxr || '-' }}</span>
                                        <span class="label">电话</span>
                                        <span class="value">{{ item.f_lxdh || '-' }}</span>
                                    </div>
                                    <div class="row">
                                        <span class="label">等级</span>
                                        <span class="value">{{ item.f_hzdj_s }}</span>
                                        <span class="label">经营方式</span>
                                        <span class="value">{{ item.f_jyfs_s }}</span>
                                    </div>
                                    <div class="row">
                                        <span class="label">主营产品</span>
                                        <span class="value">{{ item.f_zycp || '-' }}</span>
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
    import { ref } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";
    import eodic from "@/inc/eodic";

    const emit = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 对话框显隐
    const x_visible = ref(false);

    // 搜索
    const x_query_gysmc = ref("");

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
        netLoad_gys_query(-1);
    }

    const onPageChange = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_gys_query(pageIndex - 1);
    }

    const formatItem = (data: any) => {
        data["f_hzdj_s"] = eodic.get_dic_label("合作等级", data["f_hzdj"]);
        data["f_jyfs_s"] = eodic.get_dic_label("经营方式", data["f_jyfs"]);
        data["f_jyzt_s"] = eodic.get_dic_label("经营状态", data["f_jyzt"]);
    }

    const netLoad_gys_query = async (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        x_show_loading.value = true;
        let ret = await eocore.proc("p_gys_query", {
            "v_hzdj": -1,
            "v_gsgm": -1,
            "v_gysmc": x_query_gysmc.value,
            "v_lxr": "",
            "v_lxdh": "",
            "v_zycp": "",
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
     * 显示对话框
     */
    const show_dialog = (data: any) => {
        x_selected_id.value = 0;
        x_query_gysmc.value = "";
        x_visible.value = true;
    }

    const onDialogOpen = () => {
        netLoad_gys_query(-1);
    }

    const onConfirm = () => {
        if (x_selected_id.value === 0) {
            eocore.show_info("请选择一个供应商");
            return;
        }
        const selected = x_data_list.value.find(d => d.f_gys_id === x_selected_id.value);
        if (!selected) {
            eocore.show_info("请选择一个供应商");
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
        if (x_selected_id.value === item.f_gys_id) {
            x_selected_id.value = 0;
        } else {
            x_selected_id.value = item.f_gys_id;
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
</style>
