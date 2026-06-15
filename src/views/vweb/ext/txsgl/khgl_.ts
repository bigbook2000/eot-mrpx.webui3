/**
 * 客户管理公共逻辑模块
 */

import { ref, onMounted } from "vue"
import eocore from "@/inc/eocore"
import eolib from "@/inc/eolib"
import region from "@/inc/region"
import eodic from "@/inc/eodic"
import TLogic from "@/logic/TLogic"
import TGlobal from "@/logic/TGlobal"

import type { Ref } from "vue"

/**
 * 客户管理公共状态和逻辑
 */
export function useKhglCommon(v_table_khgl: Ref<any>, v_khgl_ex: Ref<any>, v_kehu_xx: Ref<any>, ghbz: number) {

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

    /**
     * 查询客户数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_khgl_query = (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value
        let rowIndex = pageIndex * pageRowCount
        if (pageIndex < 0) x_page_index.value = 1

        v_table_khgl.value?.load_list_proc("p_khgl_query", {             
            "v_xsy_id": x_query_xsy_id.value,
            "v_khmc": x_query_khmc.value,
            "v_lxxx": x_query_lxxx.value,
            "v_khlb": x_query_khlb.value,
            "v_khly": x_query_khly.value,
            "v_hzdj": x_query_hzdj.value,
            "v_qzyx": x_query_qzyx.value,
            "v_ghbz": m_ghbz,  // 公海标识：khgh为1，khgl为0
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        })

        v_khgl_ex.value?.loadData(undefined, false);
    }

    const netLoad_khgl_ghbz = async (khList: any[], ghbz: number) => {

        const khglIds = khList.map((item: any) => item["f_khgl_id"]).join(",")

        const ret = await eocore.proc("p_khgl_ghbz", {
            "v_khgl_ids": khglIds,
            "v_ghbz": ghbz,
            "v_xsy_id": TGlobal.userData["f_user_id"]
        })
        if (!eocore.check_net_object(ret)) return;

        // 只刷当前页
        netLoad_khgl_query(x_page_index.value - 1);
    }

    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_khgl = (data: any) => {
        // 经营状态
        data["f_jyzt_s"] = eodic.get_dic_label("经营状态", data["f_jyzt"])
        // 客户类别
        data["f_khlb_s"] = eodic.get_dic_label("客户类别", data["f_khlb"])        
        // 合作等级
        data["f_hzdj_s"] = eodic.get_dic_label("合作等级", data["f_hzdj"])        
        // 客户来源
        data["f_khly_s"] = eodic.get_dic_label("客户来源", data["f_khly"])        
        // 公司规模
        data["f_gsgm_s"] = eodic.get_dic_label("经营规模", data["f_gsgm"])        
        // 经营方式
        data["f_jyfs_s"] = eodic.get_dic_label("经营方式", data["f_jyfs"])
        // 客户意向
        data["f_qzyx_s"] = eodic.get_dic_label("客户意向", data["f_qzyx"])
        
        // 所属行业显示
        data["f_sshy_s"] = eodic.get_dic_label("行业类别", data["f_sshy"])
        
        // 日期格式化
        data["f_jdsj_s"] = eolib.datetime_2_short(data["f_jdsj"])
        data["f_gtsj_s"] = eolib.datetime_2_short(data["f_gtsj"])
        data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"])

        data["f_cjje_s"] = eolib.fixed_num(data["f_cjje"], 3)

        data["f_xzqh_s"] = region.set_region_info(
            data["f_xzsf"], data["f_xzds"], data["f_xzqx"])

        // 用户转换
        TLogic.updateDicUserData(data, ["f_xsy_id"])
    }

    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_khgl = (n: number): number => {
        x_row_total.value = n
        return n
    }

    /**
     * 加载状态处理
     * @param show 是否显示加载状态
     */
    const onTableLoading = (show: boolean) => {
        x_show_loading.value = show
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_khgl = (pageIndex: number) => {
        x_page_index.value = pageIndex
        netLoad_khgl_query(pageIndex - 1)
    }

    // ========== 工具栏操作 ==========
    
    /**
     * 重置查询条件
     */
    const onButtonClick_Clear_khgl = () => {
        x_query_xsy_id.value = -1
        x_query_khmc.value = ""
        x_query_lxxx.value = ""
            
        x_query_khlb.value = -1
        x_query_khly.value = -1
        x_query_hzdj.value = -1
        x_query_qzyx.value = -1
    }

    /**
     * 查找按钮点击
     */
    const onButtonClick_Load_khgl = () => {
        netLoad_khgl_query(-1)
    }



    // 返回所有公共的状态和方法
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
        // 方法

        netLoad_khgl_query,
        netLoad_khgl_ghbz,

        onTableItem_khgl,
        onTablePage_khgl,
        onTableLoading,
        onPageChange_khgl,
        onButtonClick_Clear_khgl,
        onButtonClick_Load_khgl
    }
}
