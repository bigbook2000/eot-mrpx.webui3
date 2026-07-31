<template>
    <!-- 生产物料选择列表 - App端 -->
    <vdialog ref="v_dialog" title="选择物料" okLabel="确定"
        @open="onDialogOpen" @close="onDialogClose">
        <!-- 搜索栏 -->
        <div class="div_search_bar">
            <el-input v-model="x_query_kcbh" placeholder="搜索批次" clearable
                @keyup.enter="onSearch" />
            <el-button type="primary" @click="onSearch">搜索</el-button>
        </div>
        <!-- 列表 -->
        <div class="eo_col_f">
            <div class="eo_scroll_v">
                <div class="ap_list">
                    <div v-if="x_data_list.length === 0" class="empty">
                        暂无数据
                    </div>
                    <div v-for="item in x_data_list" :key="item.f_kcjy_id"
                        class="item"
                        :class="{ 'ap_sel': x_selected_id === item.f_kcjy_id }"
                        @click="x_selected_id = item.f_kcjy_id">
                        <div class="check" @click.stop="onItemCheck(item)">
                            <el-checkbox :model-value="x_selected_id === item.f_kcjy_id" />
                        </div>
                        <div class="body">
                            <div class="row">
                                <span class="value title">{{ item.f_kcbh }}</span>
                                <span v-if="item.f_cpzt == 0" class="div_tag_stop">停产</span>
                            </div>
                            <div class="row">
                                <span class="label">产品名称</span>
                                <span class="value">{{ item.f_cpmc }}</span>
                                <span class="label">数量</span>
                                <span class="value">{{ item.f_kcsl }}</span>
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
                                <span class="label">定价</span>
                                <span class="value">{{ item.f_cpjg_s }}</span>
                                <span class="label">成本</span>
                                <span class="value">{{ item.f_kcdj_s }}</span>
                            </div>
                            <div class="row">
                                <span class="label">库管员</span>
                                <span class="value">{{ item.f_kgy_id_s || '-' }}</span>
                                <span class="label">时间</span>
                                <span class="value">{{ item.f_jysj_s || '-' }}</span>
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
        <div class="eo_page_bar" v-if="x_row_total > x_page_row_count">
            <el-pagination background
                :pager-count="5"
                @current-change="onPageChange"
                :current-page="x_page_index"
                :page-size="x_page_row_count"
                layout="prev, pager, next"
                :total="x_row_total">
            </el-pagination>
        </div>
    </vdialog>
</template>

<script lang="ts" setup>
    import { ref } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import vdialog from "@/components/app/vdialog.vue"

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    const emit = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 查询条件
    const x_query_kcbh = ref("");

    // 传入的产品编码
    let m_kcjy_data = { "f_cpbm": "" };

    // 列表
    const x_data_list = ref<any[]>([]);

    // 分页
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 选中项
    const x_selected_id = ref(0);

    /**
     * 显示对话框
     */
    const show_dialog = async (data: any) => {
        Object.assign(m_kcjy_data, m_kcjy_data, data);
        x_selected_id.value = 0;
        x_query_kcbh.value = "";
        x_data_list.value = [];
        v_dialog.value!.show_dialog(undefined);
    }

    const onDialogOpen = (data: any) => {
        netLoad_kcmx_query(-1);
    }

    /**
     * 对话框关闭
     */
    const onDialogClose = (cancel: boolean, tag: any, cb: cfunc_boolean) => {
        if (cancel) {
            emit('close', true, {}, cb);
            return;
        }

        if (x_selected_id.value === 0) {
            eocore.show_info("请选择一个物料");
            cb(false); return;
        }
        const selected = x_data_list.value.find(d => d.f_kcjy_id === x_selected_id.value);
        if (!selected) {
            eocore.show_info("请选择一个物料");
            cb(false); return;
        }

        emit('close', false, selected, cb);
    }

    const onSearch = () => {
        x_page_index.value = 1;
        netLoad_kcmx_query(-1);
    }

    const onPageChange = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_kcmx_query(pageIndex - 1);
    }

    const onItemCheck = (item: any) => {
        if (x_selected_id.value === item.f_kcjy_id) {
            x_selected_id.value = 0;
        } else {
            x_selected_id.value = item.f_kcjy_id;
        }
    }

    /**
     * 查询物料数据
     */
    const netLoad_kcmx_query = async (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        let ret = await eocore.proc("p_kcjy_query", {
            "v_kcbz": TLogic.kcbzCodes["正常"],
            "v_kcbh": x_query_kcbh.value,
            "v_kssj": "",
            "v_jssj": "",
            "v_jyzt": 1,
            "v_jyyg_id": TGlobal.userData["f_user_id"],
            "v_cpbm": m_kcjy_data["f_cpbm"],
            "v_cpmc": "",
            "v_order_by": " ORDER BY f_kcjy_id DESC",
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

    const formatItem = (data: any) => {
        data["f_cpzt_s"] = "";
        if (data["f_cpzt"] == 0) data["f_cpzt_s"] = "停产";
        else if (data["f_cpzt"] == 1) data["f_cpzt_s"] = "正常";

        data["f_cpjg_s"] = eolib.fixed_num(data["f_cpjg"], 3);
        let kcsl = eocore.to_float(data["f_kcsl"]);
        let kcdj = eocore.to_float(data["f_kczj"]);
        if (kcsl > 0.0) kcdj = kcdj / kcsl;
        data["f_kcdj_s"] = eolib.fixed_num(kcdj, 3);
    }

    defineExpose({ show_dialog });
</script>

<style lang="scss" scoped>
    .div_search_bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0.5rem 0.8rem;
        gap: 0.5rem;
        background: #fff;
        border-bottom: 1px solid var(--eo_color_grey_light3);
    }

    .div_tag_stop {
        font-size: 0.7rem;
        color: #fff;
        background: #e74c3c;
        padding: 0.05rem 0.35rem;
        border-radius: 0.25rem;
        margin-left: 0.4rem;
    }
</style>
