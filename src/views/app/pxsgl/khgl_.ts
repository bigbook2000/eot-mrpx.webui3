/**
 * 客户管理公共逻辑模块（App卡片视图版）
 */

import { ref } from "vue"
import eocore from "@/inc/eocore"
import eolib from "@/inc/eolib"
import region from "@/inc/region"
import eodic from "@/inc/eodic"
import TLogic from "@/logic/TLogic"
import TGlobal from "@/logic/TGlobal"

/**
 * 客户管理公共状态和逻辑
 */
export function useKhglCommon(ghbz: number) {

    const m_ghbz = ghbz;

    // 查询条件
    const x_query_xsy_id = ref(-1)
    const x_query_xsy_id_s = ref("")
    const x_query_khmc = ref("")
    const x_query_lxxx = ref("")
    const x_query_khlb = ref(-1)
    const x_query_khly = ref(-1)
    const x_query_hzdj = ref(-1)
    const x_query_qzyx = ref(-1)

    // 分页变量
    const x_page_index = ref(1)
    const x_page_row_count = ref(20)
    const x_row_total = ref(0)

    // 加载状态
    const x_show_loading = ref(false)

    // 数据列表
    const x_data_list = ref<any[]>([])
    // 当前选中项
    const x_selected_id = ref(0)
    // 勾选项ID集合
    const x_checked_ids = ref(new Set<number>())

    /**
     * 查询客户数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_khgl_query = async (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value
        let rowIndex = pageIndex * pageRowCount
        if (pageIndex < 0) x_page_index.value = 1

        x_show_loading.value = true
        const ret = await eocore.proc("p_khgl_query", {
            "v_xsy_id": x_query_xsy_id.value,
            "v_khmc": x_query_khmc.value,
            "v_lxxx": x_query_lxxx.value,
            "v_khlb": x_query_khlb.value,
            "v_khly": x_query_khly.value,
            "v_hzdj": x_query_hzdj.value,
            "v_qzyx": x_query_qzyx.value,
            "v_ghbz": m_ghbz,
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        })
        let list = eocore.check_net_array(ret)
        x_show_loading.value = false
        if (list == undefined) list = []

        // 分页总数
        if (rowIndex < 0) {
            x_row_total.value = list.length > 0 ? eocore.to_int(list[0]["s_total_count"]) : 0
        }

        // 格式化每条数据
        for (let d of list) {
            formatItem(d)
        }
        x_data_list.value = list

        // 清除选择
        x_selected_id.value = 0
        x_checked_ids.value = new Set()
    }

    const netLoad_khgl_ghbz = async (khList: any[], ghbzNew: number) => {

        const khglIds = khList.map((item: any) => item["f_khgl_id"]).join(",")

        const ret = await eocore.proc("p_khgl_ghbz", {
            "v_khgl_ids": khglIds,
            "v_ghbz": ghbzNew,
            "v_xsy_id": TGlobal.userData["f_user_id"]
        })
        if (!eocore.check_net_object(ret)) return

        // 只刷当前页
        await netLoad_khgl_query(x_page_index.value - 1)
    }

    /**
     * 格式化单条数据（通用）
     */
    const formatItem = (data: any) => {
        data["f_jyzt_s"] = eodic.get_dic_label("经营状态", data["f_jyzt"])
        data["f_khlb_s"] = eodic.get_dic_label("客户类别", data["f_khlb"])
        data["f_hzdj_s"] = eodic.get_dic_label("合作等级", data["f_hzdj"])
        data["f_khly_s"] = eodic.get_dic_label("客户来源", data["f_khly"])
        data["f_gsgm_s"] = eodic.get_dic_label("经营规模", data["f_gsgm"])
        data["f_jyfs_s"] = eodic.get_dic_label("经营方式", data["f_jyfs"])
        data["f_qzyx_s"] = eodic.get_dic_label("客户意向", data["f_qzyx"])
        data["f_sshy_s"] = eodic.get_dic_label("行业类别", data["f_sshy"])
        data["f_jdsj_s"] = eolib.datetime_2_short(data["f_jdsj"])
        data["f_gtsj_s"] = eolib.datetime_2_short(data["f_gtsj"])
        data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"])
        data["f_cjje_s"] = eolib.fixed_num(data["f_cjje"], 3)
        data["f_xzqh_s"] = region.set_region_info(
            data["f_xzsf"], data["f_xzds"], data["f_xzqx"])
        TLogic.updateDicUserData(data, ["f_xsy_id"])
    }

    // ========== 工具栏操作 ==========

    const onButtonClick_Clear_khgl = () => {
        x_query_xsy_id.value = -1
        x_query_khmc.value = ""
        x_query_lxxx.value = ""
        x_query_khlb.value = -1
        x_query_khly.value = -1
        x_query_hzdj.value = -1
        x_query_qzyx.value = -1
    }

    const onButtonClick_Load_khgl = () => {
        netLoad_khgl_query(-1)
    }

    const onPageChange_khgl = (pageIndex: number) => {
        x_page_index.value = pageIndex
        netLoad_khgl_query(pageIndex - 1)
    }

    const onItemCheck = (item: any) => {
        const id = item.f_khgl_id
        const newSet = new Set(x_checked_ids.value)
        if (newSet.has(id)) {
            newSet.delete(id)
        } else {
            newSet.add(id)
        }
        x_checked_ids.value = newSet
    }

    const getCheckedList = (): any[] => {
        return x_data_list.value.filter(d => x_checked_ids.value.has(d.f_khgl_id))
    }

    return {
        // 状态
        x_query_xsy_id,
        x_query_xsy_id_s,
        x_query_khmc,
        x_query_lxxx,
        x_query_khlb,
        x_query_khly,
        x_query_hzdj,
        x_query_qzyx,
        x_page_index,
        x_page_row_count,
        x_row_total,
        x_show_loading,
        x_data_list,
        x_selected_id,
        x_checked_ids,
        // 方法
        netLoad_khgl_query,
        netLoad_khgl_ghbz,
        formatItem,
        onButtonClick_Clear_khgl,
        onButtonClick_Load_khgl,
        onPageChange_khgl,
        onItemCheck,
        getCheckedList,
    }
}
