<template>
    <!-- 销售出库管理 -->
    <div class="eo_col">
        <div class="eo_tool_bar">
            <div class="eo_form">
                <div class="cell">
                    <vbuttonk width="8rem" type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Add_xsdck">添加货物</vbuttonk>
                    <vbuttonk width="8rem" type="default" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Del_xsdck">移除货物</vbuttonk>
                    <vbuttonk width="8rem" type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Upd_xsdck">修改货物</vbuttonk>
                    <vbuttonk width="8rem" type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==2"
                        @click="onButtonClick_Upd_xsdck">变更货物</vbuttonk>
                    <vbuttonk width="8rem" type="default" class="input_w" permit="" 
                        v-show="x_edit_mode==0"
                        @click="onButtonClick_Get_xsdck">查看货物</vbuttonk>
                    <vbuttonk width="8rem" type="warning" class="input_w" permit="" 
                        v-show="x_edit_mode==9"
                        @click="onButtonClick_Add_xsdck">货物出库</vbuttonk>
                </div>
            </div>
        </div>
        <!-- 产品明细 -->
        <div class="eo_col_f">
            <vtable ref="v_table_xsdck" 
                name="产品明细"
                id-field="f_xsdck_id"
                @loading="onTableLoading"
                :on-item="onTableItem_xsdck"
                @row-click="onTableRowClick_xsdck">
                <el-table-column prop="f_ckbz_s" label="标识" width="80" />
                <el-table-column prop="f_kcbh" label="批次" width="200" />
                <el-table-column prop="f_cpmc" label="产品名称" width="200" show-overflow-tooltip />
                <el-table-column prop="f_kcdj_s" label="库存单价" width="120" align="right" />
                <el-table-column prop="f_wlgs_id_s" label="物流公司" width="120" show-overflow-tooltip />
                <el-table-column prop="f_wldh" label="物流单号" width="160" />
                <el-table-column prop="f_cksj_s" label="出库时间" width="160" />
                <el-table-column prop="f_cpbm" label="产品编码" width="160" />
                <el-table-column prop="f_hwck_s" label="仓库" width="100" />
                <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                <el-table-column />
            </vtable>
        </div>
        <xsdck_xx ref="v_xsdck_xx" @close="onDialogClose_xsdck_xx" />
    </div>
</template>

<script lang="ts" setup>
    import { ref, nextTick, onMounted } from "vue"
    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import vbuttonk from "@/components/vbuttonk.vue"
    import vtable from "@/components/web/vtable.vue"
    import vdic from "@/components/vdic.vue"    
    import eodic from "@/inc/eodic";

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import xsdck_xx from "./xsdck_xx.vue"

    type t_table = InstanceType<typeof vtable>;
    const v_table_xsdck = ref<t_table>();
    
    type t_xsdck_xx = InstanceType<typeof xsdck_xx>;
    const v_xsdck_xx = ref<t_xsdck_xx>();

    // 编辑模式，0只读，1新增，2修改，9入库
    const x_edit_mode = ref(0);
    let m_field_array: string[] = [];

    // 销售单
    let m_xsd_data: any = undefined;
    // 销售产品
    let m_xsdcp_data: any = undefined;  

    const emits = defineEmits<{
        (e: "row-click", data: any): void
        (e: "loading", show: boolean): void
    }>()

    onMounted(async () => {
        await TLogic.netLoad_Wlgs_list();
    });

    const setEditFields = (mode: number, fieldArray: string[]) => {

        x_edit_mode.value = mode;
        m_field_array = fieldArray;
    }

    const getList = (): any[]|undefined => { 
        return v_table_xsdck.value?.get_list();
    }
    /**
     * 加载单据信息
     * @param rklb 
     * @param ckIds
     */
    const loadList = async (xsdData: any, xsdcpData: any) => {

        if (xsdData == undefined) {
            v_table_xsdck.value?.load_list([]);
            return;
        }
        m_xsd_data = xsdData;
        m_xsdcp_data = xsdcpData;
        let xsdcpId = 0;
        if (xsdcpData != undefined) xsdcpId = xsdcpData["f_xsdcp_id"];
            
        await v_table_xsdck.value?.load_list_proc("p_xsdck_list", { 
            "v_xsd_id": xsdData["f_xsd_id"],
            "v_xsdcp_id": xsdcpId
        });
    }

    /**
     * 加载状态处理
     * @param show 是否显示加载状态
     */
    const onTableLoading = (show: boolean) => {
        emits("loading", show);
    }

    /**
     * 产品明细数据格式化
     * @param data 表格行数据
     */
    const onTableItem_xsdck = (data: any) => {
        
        // 日期格式化
        if (data["f_cksj"]) {
            data["f_cksj_s"] = eolib.datetime_2_short(data["f_cksj"], true);
        }

        data["f_ckbz_s"] = "";
        if (data["f_ckbz"] == 2) data["f_ckbz_s"] = "退货";

        // 价格格式化
        data["f_kcdj_s"] = eolib.fixed_num(data["f_kcdj"], 3);

        // 仓库显示
        data["f_hwck_s"] = eodic.get_dic_label("产品仓库", data["f_hwck"]);

        // 用户转换
        TLogic.updateDicUserData(data, ["f_kgy_id"]);

        // 显示物流公司名称
        data["f_wlgs_id_s"] = TLogic.getLabel_wlgs(data["f_wlgs_id"]);
    }

    /**
     * 产品明细表格行点击事件
     * @param data 行数据
     */
    const onTableRowClick_xsdck = (data: any) => {
    }

    /**
     * 添加销售出库明细
     */
    const onButtonClick_Add_xsdck = async () => {

        if (x_edit_mode.value != 1) {
            eocore.show_info("产品明细不可编辑");
            return;
        }

        if (m_xsdcp_data == undefined) {
            eocore.show_info("请选择出库产品");
            return;
        }

        //console.log(m_xsdcp_data);

        let xsdckData = {
            f_xsdck_id: 0,
            f_xsd_id: m_xsdcp_data["f_xsd_id"],
            f_xsdcp_id: m_xsdcp_data["f_xsdcp_id"],
            f_cpdy_id: m_xsdcp_data["f_cpdy_id"], // 产品定义ID
            f_cpmc: m_xsdcp_data["f_cpmc"], // 产品名称
            f_cpbm: m_xsdcp_data["f_cpbm"], // 产品编码
            f_xsdh: m_xsd_data["f_xsdh"],
            f_kcbh: "",
            f_kcmx_id: 0, // 库存明细ID
            f_kgy_id: TGlobal.userData["f_user_id"], // 库管员ID
            f_kgy_id_s: TGlobal.userData["f_name"], // 库管员姓名
            f_cksl: 0.0,// 数量
            f_ckdj: m_xsdcp_data["f_xsdj"], // 出库单价 
            f_wlgs_id: 0, // 物流公司
            f_wlgs_id_s: "", // 物流公司名称
            f_wldh: "", // 物流单号
            f_hwck: 0,
            f_ckbz: 0, // 出库标识
            f_xsdj: m_xsdcp_data["f_xsdj"], // 同步单价
            f_beizhu: "", // 备注
        };
        
        v_xsdck_xx.value?.showDialog(xsdckData, m_field_array);
    }

    /**
     * 删除产品明细
     */
    const onButtonClick_Del_xsdck = async () => {

        if (x_edit_mode.value != 1) {
            eocore.show_error("出库货物不可编辑");
            return;
        }

        let xsdckData = v_table_xsdck.value?.get_select_data(true);
        if (xsdckData == undefined) return;

        // 恢复标识
        let ret = await eocore.proc("p_kcmx_kcbz", {
            "v_kcmx_ids": "" + xsdckData["f_kcmx_id"],
            "v_cpdy_ids": "" + xsdckData["f_cpdy_id"],
            "v_kcbz": TLogic.kcbzCodes["正常"]
        });
        if (eocore.check_net_object(ret) == undefined) return;

        v_table_xsdck.value?.remove_data_proc(
            "p_xsdck_del", {
                "v_xsdck_id": xsdckData["f_xsdck_id"]
            });
    }

    /**
     * 修改产品明细
     */
    const onButtonClick_Upd_xsdck = () => {

        if (x_edit_mode.value == 0) {
            eocore.show_error("销售货物不可编辑");
            return;
        }

        let xsdckData = v_table_xsdck.value?.get_select_data(true);
        if (xsdckData == undefined) return;

        v_xsdck_xx.value?.showDialog(xsdckData, m_field_array);
    }

    const onButtonClick_Get_xsdck = () => {
        let xsdckData = v_table_xsdck.value?.get_select_data(true);
        if (xsdckData == undefined) return;
    }

    const onDialogClose_xsdck_xx = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
                
        if (cancel) {
            cb(true); return;
        }
        v_table_xsdck.value?.update_data(data, -1, data["_is_add"], false);
        eocore.show_success("产品入库成功");

        cb(true);
    }
    
    defineExpose({
        setEditFields,
        getList,
        loadList
    })

</script>

<style lang="scss" scoped>
</style>