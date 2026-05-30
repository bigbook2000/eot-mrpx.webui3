<template>
    <!-- 客户管理 - 移动端 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="客户管理" :back="false" />
            <div class="eo_col_d">
                <!-- 简洁搜索栏 -->
                <div class="div_search_bar">
                    <el-button type="primary" @click="onButtonClick_Add_kh">新建</el-button>
                    <div class="search_input">
                        <el-input v-model="x_query_khmc" placeholder="客户名称或联系方式" clearable
                            @keyup.enter="onSimpleSearch" />
                    </div>
                    <el-button type="primary" @click="onSimpleSearch">搜索</el-button>
                </div>
            </div>
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                    <!-- 客户卡片列表 -->
                    <div class="ap_list">
                        <div v-if="x_data_list.length == 0" class="empty">
                            暂无数据
                        </div>
                        <div v-for="item in x_data_list" :key="item.f_khgl_id"
                            class="item"
                            :class="{ 'ap_sel': x_selected_id == item.f_khgl_id }">
                            <div class="body">
                                <div class="row">
                                    <span class="label">名称</span>
                                    <span class="value title">{{ item.f_khmc }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">联系人</span>
                                    <span class="value">{{ item.f_lxr || '-' }}</span>
                                    <span class="label">电话</span>
                                    <span class="value">{{ item.f_lxfs || '-' }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">状态</span>
                                    <span class="value">{{ item.f_jyzt_s }}</span>
                                    <span class="label">意向</span>
                                    <span class="value">{{ item.f_qzyx_s }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">等级</span>
                                    <span class="value">{{ item.f_hzdj_s }}</span>
                                    <span class="label">类别</span>
                                    <span class="value">{{ item.f_khlb_s }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">来源</span>
                                    <span class="value">{{ item.f_khly_s }}</span>
                                    <span class="label">规模</span>
                                    <span class="value">{{ item.f_gsgm_s }}</span>
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
                    @current-change="onPageChange_khgl"
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
export default { name: "app_xsgl_khgl" }
</script>

<script lang="ts" setup>

    import { ref, onMounted, onActivated } from "vue"

    import eocore from "@/inc/eocore"

    import router from "@/router/index"
    import topbar from '@/views/app/comm/topbar.vue'

    import TLogic from "@/logic/TLogic"
    import TGlobal from "@/logic/TGlobal"

    import { useKhglCommon } from "./khgl_"

    const x_query_xsy = ref(false);

    // 使用公共逻辑（isGh=false 表示客户管理）
    const {
        x_query_xsy_id,
        x_query_xsy_id_s,
        x_query_khmc,
        x_query_lxxx,
        x_page_index,
        x_page_row_count,
        x_row_total,
        x_show_loading,
        x_data_list,
        x_selected_id,
        x_checked_ids,
        netLoad_khgl_query,
        netLoad_khgl_ghbz,
        onPageChange_khgl,
        onItemCheck,
        getCheckedList,
    } = useKhglCommon(TLogic.ghbzCodes["私有"])

    onMounted(async () => {

        x_query_xsy_id.value = TGlobal.userData["f_user_id"];
        x_query_xsy_id_s.value = TGlobal.userData["f_name"];

        if (TLogic.checkPermit("platform.user.dept")) {
            x_query_xsy.value = true;
        }

        // 初始化加载数据
        netLoad_khgl_query(-1)
    })

    onActivated(() => {
        netLoad_khgl_query(x_page_index.value - 1)
    })

    /** 简洁搜索 */
    const onSimpleSearch = () => {
        netLoad_khgl_query(-1)
    }

    /** 创建客户初始数据 */
    const createKehuData = () => {
        return {
            "f_khgl_id": 0,
            "f_xsy_id": TGlobal.userData["f_user_id"],
            "f_xsy_id_s": TGlobal.userData["f_name"],
            "f_khmc": "",
            "f_jyzt": 1,
            "f_qzyx": 1,
            "f_khlb": 1,
            "f_hzdj": 1,
            "f_khly": 1,
            "f_gsgm": 1,
            "f_jyfs": 1,
            "f_sshy": 1,
            "f_fzr": "",
            "f_gsdh": "",
            "f_lxr": "",
            "f_lxfs": "",
            "f_xzqh_s": "__",
            "f_xzsf": "",
            "f_xzds": "",
            "f_xzqx": "",
            "f_gsdz": "",
            "f_gswz": "",
            "f_jyfw": "",
            "f_zycp": "",
            "f_jdsj": "1970-01-01 00:00:00",
            "f_gtsj": "1970-01-01 00:00:00",
            "f_cjsj": "1970-01-01 00:00:00",
            "f_cjje": 0.0,
            "f_ghbz": 1,
            "f_beizhu": ""
        }
    }

    /** 卡片详情点击 */
    const onItemDetailClick = (item: any) => {
        x_selected_id.value = item.f_khgl_id;
        router.push({ name: 'app_xsgl_kehu_xx', state: { kehuData: JSON.parse(JSON.stringify(item)) } })
    }

    /** 新建客户 */
    const onButtonClick_Add_kh = async () => {
        let kehuData = createKehuData()
        router.push({ name: 'app_xsgl_kehu_xx', state: { kehuData: JSON.parse(JSON.stringify(kehuData)) } })
    }

    /** 修改客户 */
    const onButtonClick_Upd_kh = () => {
        const khData = x_data_list.value.find(d => d.f_khgl_id == x_selected_id.value)
        if (!khData) {
            eocore.show_info("请先选择客户")
            return
        }
        router.push({ name: 'app_xsgl_kehu_xx', state: { kehuData: JSON.parse(JSON.stringify(khData)) } })
    }

    /** 提交公海 */
    const onButtonClick_Upd_ghbz = async () => {
        let khList = getCheckedList()
        if (eocore.check_empty(khList)) return

        const dret = await eocore.show_confirm("确定要将 " + khList.length + " 客户提交到公海吗？")
        if (!dret) return

        netLoad_khgl_ghbz(khList, TLogic.ghbzCodes["公海"]);
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