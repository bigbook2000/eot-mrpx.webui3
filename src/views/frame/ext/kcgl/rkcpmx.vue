<template>
    <!-- 采购入库管理 -->
    <div class="eo_col">
        <div class="eo_tool_bar">
            <div class="eo_form">
                <div class="cell">
                    <vbuttonk type="primary" class="input_w" permit="" 
                        @click="onButtonClick_Load_kcmxrk">加载明细</vbuttonk>
                    <vbuttonk type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Add_kcmxrk">添加明细</vbuttonk>
                    <vbuttonk type="default" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Del_kcmxrk">移除明细</vbuttonk>
                    <vbuttonk type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Upd_kcmxrk">修改明细</vbuttonk>
                    <vbuttonk type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==2"
                        @click="onButtonClick_Upd_kcmxrk">变更明细</vbuttonk>
                    <vbuttonk type="default" class="input_w" permit="" 
                        v-show="x_edit_mode==0"
                        @click="onButtonClick_Get_kcmxrk">查看明细</vbuttonk>
                    <vbuttonk type="warning" class="input_w" permit="" 
                        v-show="x_edit_mode==9"
                        @click="onButtonClick_Add_kcmx">产品入库</vbuttonk>
                </div>
            </div>
        </div>
        <!-- 产品明细 -->
        <div class="eo_col_f">
            <vtable ref="v_table_kcmxrk" 
                name="产品明细"
                id-field="f_kcmxrk_id"
                @loading="onTableLoading"
                :on-item="onTableItem_kcmxrk"
                @row-click="onTableRowClick_kcmxrk">
                <el-table-column prop="f_kcbz_s" label="状态" width="70" />
                <el-table-column prop="f_kcbh" label="批次" width="200" />
                <el-table-column prop="f_cpmc" label="产品名称" width="200" show-overflow-tooltip />
                <el-table-column prop="f_kcdj_s" label="单价" width="120" align="right" />
                <el-table-column prop="f_kcsl" label="数量" width="100" />
                <el-table-column prop="f_hwck_s" label="仓库" width="120" />
                <el-table-column prop="f_rksj_s" label="入库时间" width="140" />
                <el-table-column prop="f_kgy_id_s" label="库管员" width="120" />
                <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                <el-table-column />
            </vtable>
        </div>
        <rkcpmx_xx ref="v_rkcpmx_xx" @close="onDialogClose_rkcp_xx" />
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

    import rkcpmx_xx from "./rkcpmx_xx.vue"
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    type t_table = InstanceType<typeof vtable>;
    const v_table_kcmxrk = ref<t_table>();
    
    type t_rkcpmx_xx = InstanceType<typeof rkcpmx_xx>;
    const v_rkcpmx_xx = ref<t_rkcpmx_xx>();

    let m_rkd_ids = "";
    let m_rklb = "";

    let m_user_dic: any = {};
    // 编辑模式，0只读，1新增，2修改，9入库
    const x_edit_mode = ref(0);
    let m_edit_fields: string[] = [];

    const emits = defineEmits<{
        (e: "row-click", data: any): void
        (e: "loading", show: boolean): void
    }>()

    onMounted(async () => {
        m_user_dic = await TLogic.netLoad_UserDic();
    });

    const setEditFields = (mode: number, editFields: string[]) => {

        x_edit_mode.value = mode;
        m_edit_fields = editFields;
    }    

    const updateUserDic = (userDic: any) => {
        m_user_dic = userDic;
    }

    const getList = (): any[]|undefined => { 
        return v_table_kcmxrk.value?.get_list();
    }

    const netLoad_kcmxrk_list = async (rklb: string, rkdIds: string) => { 

        if (rkdIds.length == 0) {
            v_table_kcmxrk.value?.load_list([]);
            return;
        }

        let ret = await eocore.proc("p_kcmxrk_list", {
            "v_rklb": rklb,
            "v_rkids": rkdIds            
        });
        let list = eocore.check_net_array(ret);
        if (list == undefined) return;

        v_table_kcmxrk.value?.load_list(list);
    }

    /**
     * 加载单据信息
     * @param rklb 
     * @param rkdId 
     * @param reload 
     */
    const loadList = async (rklb: string, rkdIds: string) => {

        m_rkd_ids = rkdIds;
        m_rklb = rklb;

        await netLoad_kcmxrk_list(rklb, rkdIds);        
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
    const onTableItem_kcmxrk = (data: any) => {

        // 入库状态显示
        data["f_kcbz_s"] = "";
        if (eocore.to_int(data["f_kcbz"]) != 0) data["f_kcbz_s"] = "已入库";
        
        // 日期格式化
        if (data["f_rksj"]) {
            data["f_rksj_s"] = eolib.datetime_2_short(data["f_rksj"], true);
        }

        // 价格格式化
        data["f_kcdj_s"] = eolib.fixed_num(data["f_kcdj"], 2);

        // 用户转换
        TLogic.updateDicUserData(data, m_user_dic, ["f_kgy_id"]);
    }

    /**
     * 产品明细表格行点击事件
     * @param data 行数据
     */
    const onTableRowClick_kcmxrk = (data: any) => {
    }

    /**
     * 点击刷新
     */
    const onButtonClick_Load_kcmxrk = () => {
        netLoad_kcmxrk_list(m_rklb, m_rkd_ids);
    }

    /**
     * 添加产品明细
     * ????
     */
    const onButtonClick_Add_kcmxrk = async () => {

        if (x_edit_mode.value != 1) {
            eocore.show_error("产品明细不可编辑");
            return;
        }

        if (m_rkd_ids.length == 0) {
            eocore.show_error("请先选择入库单");
            return;
        }

        let rkcpmxData = {
            f_rkcpmx_id: 0,
            f_cpdy_id: 0, // 产品定义ID
            f_cpmc: "", // 产品名称
            f_cpbm: "", // 产品编码
            f_rklb: m_rklb, // 入库单类别
            f_rkd_id: 0, // 入库单ID
            f_kcmx_id: 0, // 库存明细ID
            f_kgy_id: 0, // 库管员ID
            f_kgy_id_s: "", // 库管员姓名
            f_cpsl: 1.0,// 数量
            f_cpdj: 0.0, // 单价 
            f_cpzj: 0.0, // 总价
            f_wlgs_id: 0, // 物流公司
            f_wlgs_id_s: "", // 物流公司名称
            f_wldh: "", // 物流单号
            f_hwck: 0,
            f_rksj: "1970-01-01 00:00:00", // 入库时间
            f_rkzt: 0, // 入库状态（0:未入库，1:已入库）
            f_beizhu: "", // 备注
        };
        
        v_rkcpmx_xx.value?.showDialog(rkcpmxData, m_edit_fields);
    }

    /**
     * 删除产品明细
     */
    const onButtonClick_Del_kcmxrk = async () => {

        if (x_edit_mode.value != 1) {
            eocore.show_error("产品明细不可编辑");
            return;
        }

        await v_table_kcmxrk.value?.remove_data_proc_select("p_rkcpmx_del", async (data: any) => {
            return {
                "v_rkcpmx_id": data["f_rkcpmx_id"]
            };
        });
    }

    /**
     * 修改产品明细
     */
    const onButtonClick_Upd_kcmxrk = () => {

        if (x_edit_mode.value == 0) {
            eocore.show_error("产品明细不可编辑");
            return;
        }

        let kcmxrkData = v_table_kcmxrk.value?.get_select_data(true);
        if (kcmxrkData == undefined) return;

        v_rkcpmx_xx.value?.showDialog(kcmxrkData, m_edit_fields);
    }

    const onButtonClick_Get_kcmxrk = () => {
        let kcmxrkData = v_table_kcmxrk.value?.get_select_data(true);
        if (kcmxrkData == undefined) return;

        v_rkcpmx_xx.value?.showDialog(kcmxrkData, []);
    }

    /**
     * 入库
     */
    const onButtonClick_Add_kcmx = async () => {
        let kcmxrkData = v_table_kcmxrk.value?.get_select_data(true);
        if (kcmxrkData == undefined) return;

        //v_rkcp_rk.value?.showDialog(kcmxrkData);
    }

    /**
     * 产品明细保存事件处理
     */
    const onDialogClose_rkcp_xx = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        
        if (cancel) {
            cb(true); return;
        }
        v_table_kcmxrk.value?.update_data(data, -1, data["_is_add"], true);

        cb(true);
    }

    const onDialogClose_rkcp_rk = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
                
        if (cancel) {
            cb(true); return;
        }
        v_table_kcmxrk.value?.update_data(data, -1, data["_is_add"], false);
        eocore.show_success("产品入库成功");

        cb(true);
    }
    
    defineExpose({
        setEditFields,
        updateUserDic,
        getList,
        loadList
    })

</script>

<style lang="scss" scoped>
</style>