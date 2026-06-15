<template>
    <!-- 供应商管理 - 移动端 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="供应商管理" :back="false" />
            <div class="eo_col_d">
                <!-- 简洁搜索栏 -->
                <div class="div_search_bar">
                    <el-button type="primary" @click="onButtonClick_Add_gys">新建</el-button>
                    <div class="search_input">
                        <el-input v-model="x_query_gysmc" placeholder="供应商名称" clearable
                            @keyup.enter="onSearch" />
                    </div>
                    <el-button type="primary" @click="onSearch">搜索</el-button>
                </div>
            </div>
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                    <!-- 供应商卡片列表 -->
                    <div class="ap_list">
                        <div v-if="x_data_list.length == 0" class="empty">
                            暂无数据
                        </div>
                        <div v-for="item in x_data_list" :key="item.f_gys_id"
                            class="item"
                            :class="{ 'ap_sel': x_selected_id == item.f_gys_id }">
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
                                <div class="detail">
                                    <el-button class="detail_btn" type="primary" plain
                                        @click="onItemClick_gys(item)">详情</el-button>
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
    </div>

    <!-- 供应商编辑对话框 -->
    <vformd ref="v_formd_gys" title="供应商信息" width="800px"
        :form-types="x_form_types_gys" @close="onFormdClose_gys"/>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_cggl_gys" }
</script>

<script lang="ts" setup>

    import { ref, onMounted, onActivated } from "vue"
    import type { cform_options, cfunc_boolean } from "@/inc/eotypes"

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"
    import eodic from "@/inc/eodic"

    import router from "@/router/index"
    import topbar from '@/views/vapp/comm/topbar.vue'
    import vformd from "@/components/app/vformd.vue"

    type t_formd = InstanceType<typeof vformd>;
    const v_formd_gys = ref<t_formd>();

    // 供应商表单配置
    const x_form_types_gys = ref<cform_options[]>([
        { type: "input", name: "f_gysmc", span: 100, label: "名称 *" },
        { type: "dic", name: "f_hzdj", span: 100, label: "等级", dic: "合作等级", all: false, field: "value" },
        { type: "input", name: "f_lxr", span: 100, label: "联系人 *" },
        { type: "input", name: "f_lxdh", span: 100, label: "联系电话 *" },
        { type: "dic", name: "f_jyfs", span: 100, label: "经营方式", dic: "经营方式", all: false, field: "value" },
        { type: "dic", name: "f_gsgm", span: 100, label: "规模", dic: "经营规模", all: false, field: "value" },
        { type: "date", name: "f_kysj", span: 100, label: "开业时间" },
        { type: "dic", name: "f_jyzt", span: 100, label: "状态", dic: "经营状态", all: false, field: "value" },
        { type: "input", name: "f_lxdz", span: 100, label: "地址" },
        { type: "input", name: "f_jyfw", span: 100, label: "经营范围" },
        { type: "input", name: "f_zycp", span: 100, label: "主营产品" },
        { type: "input", name: "f_gswz", span: 100, label: "公司网址" },
        { type: "text2", name: "f_gysbz", span: 100, label: "备注", row: 4 }
    ]);

    // 查询条件
    const x_query_gysmc = ref("");

    // 列表
    const x_data_list = ref<any[]>([]);
    const x_show_loading = ref(false);
    const x_selected_id = ref(0);

    // 分页
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    onMounted(() => {
        netLoad_gys_query(-1);
    })

    onActivated(() => {
        netLoad_gys_query(x_page_index.value - 1)
    })

    const onSearch = () => {
        x_page_index.value = 1;
        netLoad_gys_query(-1);
    }

    const onPageChange = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_gys_query(pageIndex - 1);
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
     * 新建供应商
     */
    const onButtonClick_Add_gys = () => {
        let dts = eolib.date_2_string(new Date());
        let gysData = {
            f_gys_id: 0,
            f_hzdj: 1,
            f_jyfs: 1,
            f_gsgm: 1,
            f_gysmc: "",
            f_kysj: dts,
            f_lxr: "",
            f_lxdh: "",
            f_lxdz: "",
            f_jyfw: "",
            f_zycp: "",
            f_gswz: "",
            f_jyzt: 1,
            f_gysbz: ""
        };
        v_formd_gys.value?.show_dialog(gysData);
    }

    /**
     * 点击供应商卡片 - 编辑
     */
    const onItemClick_gys = (item: any) => {
        x_selected_id.value = item.f_gys_id;
        v_formd_gys.value?.show_dialog(item);
    }

    /**
     * 供应商编辑对话框关闭事件
     */
    const onFormdClose_gys = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true);
            return;
        }

        if (!data["f_gysmc"]) {
            eocore.show_info("请填写供应商名称");
            cb(false);
            return;
        }
        if (!data["f_lxr"]) {
            eocore.show_info("请填写联系人");
            cb(false);
            return;
        }
        if (!data["f_lxdh"]) {
            eocore.show_info("请填写联系电话");
            cb(false);
            return;
        }

        try {
            let ret = await eocore.proc("p_gys_upd", {
                "v_gys_id": data["f_gys_id"],
                "v_hzdj": data["f_hzdj"],
                "v_jyfs": data["f_jyfs"],
                "v_gsgm": data["f_gsgm"],
                "v_gysmc": data["f_gysmc"],
                "v_kysj": data["f_kysj"],
                "v_lxr": data["f_lxr"],
                "v_lxdh": data["f_lxdh"],
                "v_lxdz": data["f_lxdz"],
                "v_jyfw": data["f_jyfw"],
                "v_zycp": data["f_zycp"],
                "v_gswz": data["f_gswz"],
                "v_jyzt": data["f_jyzt"],
                "v_gysbz": data["f_gysbz"]
            });

            let dataNew = eocore.check_net_object(ret);
            if (dataNew == undefined) {
                cb(false);
                return;
            }

            eocore.show_success("保存成功");
            cb(true);

            // 刷新列表
            netLoad_gys_query(x_page_index.value - 1);

        } catch (error) {
            eocore.show_error("保存失败：" + error);
            cb(false);
        }
    }

    const formatItem = (data: any) => {
        data["f_hzdj_s"] = eodic.get_dic_label("合作等级", data["f_hzdj"]);
        data["f_jyfs_s"] = eodic.get_dic_label("经营方式", data["f_jyfs"]);
        data["f_jyzt_s"] = eodic.get_dic_label("经营状态", data["f_jyzt"]);
        if (data["f_kysj"]) {
            data["f_kysj_s"] = eolib.date_2_string(data["f_kysj"]);
        }
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
