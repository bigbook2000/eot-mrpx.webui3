<template>
    <!-- 销售出库管理 -->
    <div class="eo_col">
        <div class="eo_tool_bar">
            <div class="eo_form">
                <div class="cell">
                    <vbuttonk type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Add_kcmxck">添加货物</vbuttonk>
                    <vbuttonk type="default" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Del_kcmxck">移除货物</vbuttonk>
                    <vbuttonk type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Upd_kcmxck">修改货物</vbuttonk>
                    <vbuttonk type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==2"
                        @click="onButtonClick_Upd_kcmxck">变更货物</vbuttonk>
                    <vbuttonk type="default" class="input_w" permit="" 
                        v-show="x_edit_mode==0"
                        @click="onButtonClick_Get_kcmxck">查看货物</vbuttonk>
                    <vbuttonk type="warning" class="input_w" permit="" 
                        v-show="x_edit_mode==9"
                        @click="onButtonClick_Add_kcmx">货物出库</vbuttonk>
                </div>
            </div>
        </div>
        <!-- 产品明细 -->
        <div class="eo_col_f">
            <vtable ref="v_table_kcmxck" 
                name="产品明细"
                id-field="f_kcmxck_id"
                @loading="onTableLoading"
                :on-item="onTableItem_kcmxck"
                @row-click="onTableRowClick_kcmxck">
                <el-table-column prop="f_kcbh" label="批次" width="200" />
                <el-table-column prop="f_cpmc" label="产品名称" width="200" show-overflow-tooltip />
                <el-table-column prop="f_cpdj_s" label="库存单价" width="120" align="right" />
                <el-table-column prop="f_ckdj_s" label="销售单价" width="120" align="right" />
                <el-table-column prop="f_wlgs_id_s" label="物流公司" width="120" show-overflow-tooltip />
                <el-table-column prop="f_wldh" label="物流单号" width="160" />
                <el-table-column prop="f_cksj_s" label="出库时间" width="160" />
                <el-table-column prop="f_cpbm" label="产品编码" width="160" />
                <el-table-column prop="f_hwck_s" label="仓库" width="100" />
                <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                <el-table-column />
            </vtable>
        </div>
        <ckcp_xx ref="v_ckcp_xx" @close="onDialogClose_ckcp_xx" />
        <ckcp_ck ref="v_ckcp_ck" @close="onDialogClose_ckcp_ck" />
    </div>
</template>

<script lang="ts" setup>
    import { ref, nextTick, onMounted } from "vue"
    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import vbuttonk from "@/logic/common/vbuttonk.vue"
    import vtable from "@/logic/common/vtable.vue"
    import vdic from "@/logic/common/vdic.vue"    
    import eodic from "@/inc/eodic";

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import ckcp_xx from "./ckcp_xx.vue"
    import ckcp_ck from "./ckcp_ck.vue"

    type t_table = InstanceType<typeof vtable>;
    const v_table_kcmxck = ref<t_table>();
    
    type t_ckcp_xx = InstanceType<typeof ckcp_xx>;
    const v_ckcp_xx = ref<t_ckcp_xx>();

    type t_ckcp_ck = InstanceType<typeof ckcp_ck>;
    const v_ckcp_ck = ref<t_ckcp_ck>();

    let m_ckd_id = 0;
    let m_ckdh = "";
    let m_cklb = "";

    let m_user_dic: any = {};
    // 编辑模式，0只读，1新增，2修改，9入库
    const x_edit_mode = ref(0);
    let m_field_array: string[] = [];

    // 物流公司清单
    let m_wlgs_list: any[] = [];

    let m_ckdcp_data: any = undefined;

    const emits = defineEmits<{
        (e: "row-click", data: any): void
        (e: "loading", show: boolean): void
    }>()

    onMounted(async () => {
        m_user_dic = await TLogic.netLoad_UserDic();

        let ret = await eocore.proc("p_wlgs_list", {
            "v_wlgs_ids": ""
        })
        let list = eocore.check_net_array(ret);
        if (list != undefined) {
            m_wlgs_list = list;
        }
    });

    const setCurrentData = (data: any) => {
        m_ckdcp_data = data;
    }

    const setEditFields = (mode: number, fieldArray: string[]) => {

        x_edit_mode.value = mode;
        m_field_array = fieldArray;
    }    

    const updateUserDic = (userDic: any) => {
        m_user_dic = userDic;
    }

    const getList = (): any[]|undefined => { 
        return v_table_kcmxck.value?.get_list();
    }
    /**
     * 加载单据信息
     * @param rklb 
     * @param rkdId 
     * @param rkdh 
     * @param reload 
     */
    const loadList = (cklb: string, ckdId: number, ckdh: string, reload: boolean) => {

        m_ckd_id = ckdId;
        m_ckdh = ckdh;
        m_cklb = cklb;

        if (reload) {
            v_table_kcmxck.value?.load_list_proc("p_kcmxck_list", { 
                "v_ckd_id": ckdId,
                "v_cklb": cklb
            });
        } else {
            v_table_kcmxck.value?.load_list([]);
        }
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
    const onTableItem_kcmxck = (data: any) => {
        
        // 日期格式化
        if (data["f_cksj"]) {
            data["f_cksj_s"] = eolib.datetime_2_short(data["f_cksj"], true);
        }

        // 价格格式化
        data["f_cpdj_s"] = eolib.fixed_num(data["f_cpdj"], 2);
        data["f_ckdj_s"] = eolib.fixed_num(data["f_ckdj"], 2);

        // 仓库显示
        data["f_hwck_s"] = eodic.get_dic_label("产品仓库", data["f_hwck"]);

        // 用户转换
        TLogic.updateDicUserData(data, m_user_dic, ["f_kgy_id"]);

        // 显示物流公司名称
        data["f_wlgs_id_s"] = eolib.get_value2(
            m_wlgs_list, "f_wlgs_id", data["f_wlgs_id"], "f_gsmc");

        data["f_ckdh"] = m_ckdh;
    }

    /**
     * 产品明细表格行点击事件
     * @param data 行数据
     */
    const onTableRowClick_kcmxck = (data: any) => {
    }

    /**
     * 添加产品明细
     */
    const onButtonClick_Add_kcmxck = async () => {

        if (x_edit_mode.value != 1) {
            eocore.show_info("产品明细不可编辑");
            return;
        }

        if (m_ckd_id <= 0) {
            eocore.show_info("请选择出库单");
            return;
        }

        if (m_ckdcp_data == undefined) {
            eocore.show_info("请选择出库产品");
            return;
        }

        //console.log(m_ckdcp_data)

        let ckcpmxData = {
            f_ckcpmx_id: 0,
            f_cpdy_id: m_ckdcp_data["f_cpdy_id"], // 产品定义ID
            f_cpmc: m_ckdcp_data["f_cpmc"], // 产品名称
            f_cpbm: m_ckdcp_data["f_cpbm"], // 产品编码
            f_cklb: m_cklb, // 入库单类别
            f_ckd_id: m_ckd_id, // 入库单ID
            f_ckdh: m_ckdh,
            f_kcbh: "",
            f_kcmx_id: 0, // 库存明细ID
            f_kgy_id: 0, // 库管员ID
            f_kgy_id_s: "", // 库管员姓名
            f_cksl: 1.0,// 数量
            f_ckdj: m_ckdcp_data["f_xsdj"], // 出库单价 
            f_ckzj: m_ckdcp_data["f_xsdj"], // 出库总价
            f_wlgs_id: 0, // 物流公司
            f_wlgs_id_s: "", // 物流公司名称
            f_wldh: "", // 物流单号
            f_hwck: 0,
            f_cksj: "1970-01-01 00:00:00", // 入库时间
            f_ckzt: 0, // 入库状态（0:未入库，1:已入库）
            f_beizhu: "", // 备注
        };
        
        v_ckcp_xx.value?.showDialog(ckcpmxData, m_field_array);
    }

    /**
     * 删除产品明细
     */
    const onButtonClick_Del_kcmxck = async () => {

        if (x_edit_mode.value != 1) {
            eocore.show_error("出库货物不可编辑");
            return;
        }

        await v_table_kcmxck.value?.remove_data_proc_select("p_kcmxck_del", async (data: any) => {
            return {
                "v_kcmxck_id": data["f_kcmxck_id"],
                "v_kcmx_id": data["f_kcmx_id"],
            };
        });
    }

    /**
     * 修改产品明细
     */
    const onButtonClick_Upd_kcmxck = () => {

        if (x_edit_mode.value == 0) {
            eocore.show_error("产品明细不可编辑");
            return;
        }

        let kcmxckData = v_table_kcmxck.value?.get_select_data(true);
        if (kcmxckData == undefined) return;

        v_ckcp_xx.value?.showDialog(kcmxckData, m_field_array);
    }

    const onButtonClick_Get_kcmxck = () => {
        let kcmxckData = v_table_kcmxck.value?.get_select_data(true);
        if (kcmxckData == undefined) return;

        v_ckcp_xx.value?.showDialog(kcmxckData, []);
    }

    /**
     * 入库
     */
    const onButtonClick_Add_kcmx = async () => {
        let kcmxckData = v_table_kcmxck.value?.get_select_data(true);
        if (kcmxckData == undefined) return;

        v_ckcp_ck.value?.showDialog(kcmxckData);
    }

    /**
     * 产品明细保存事件处理
     */
    const onDialogClose_ckcp_xx = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        
        if (cancel) {
            cb(true); return;
        }
        v_table_kcmxck.value?.update_data(data, -1, data["_is_add"], true);

        cb(true);
    }

    const onDialogClose_ckcp_ck = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
                
        if (cancel) {
            cb(true); return;
        }
        v_table_kcmxck.value?.update_data(data, -1, data["_is_add"], false);
        eocore.show_success("产品入库成功");

        cb(true);
    }
    
    defineExpose({
        setCurrentData,
        setEditFields,
        updateUserDic,
        getList,
        loadList
    })

</script>

<style lang="scss" scoped>
</style>