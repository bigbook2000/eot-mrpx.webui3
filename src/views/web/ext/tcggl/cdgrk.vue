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
                        @click="onButtonClick_Add_cgdrk">添加明细</vbuttonk>
                    <vbuttonk type="default" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Del_cgdrk">移除明细</vbuttonk>
                    <vbuttonk type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Upd_cgdrk">修改明细</vbuttonk>
                    <vbuttonk type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==2"
                        @click="onButtonClick_Upd_cgdrk">变更明细</vbuttonk>
                    <vbuttonk type="default" class="input_w" permit="" 
                        v-show="x_edit_mode==0"
                        @click="onButtonClick_Get_cgdrk">查看明细</vbuttonk>
                    <vbuttonk type="warning" class="input_w" permit="" 
                        v-show="x_edit_mode==9"
                        @click="onButtonClick_Add_kcmx">产品入库</vbuttonk>
                </div>
            </div>
        </div>
        <!-- 产品明细 -->
        <div class="eo_col_f">
            <vtable ref="v_table_cgdrk" 
                name="产品明细"
                id-field="f_kcmx_id"
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
        <cgdrk_xx ref="v_cgdrk_xx" @close="onDialogClose_cgdrk_xx" />
    </div>
</template>

<script lang="ts" setup>
    import { ref, nextTick, onMounted } from "vue"
    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import vbuttonk from "@/components/web/vbuttonk.vue"
    import vtable from "@/components/web/vtable.vue"
    import vdic from "@/components/web/vdic.vue"    
    import eodic from "@/inc/eodic";

    import cgdrk_xx from "./cgdrk_xx.vue"
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    type t_table = InstanceType<typeof vtable>;
    const v_table_cgdrk = ref<t_table>();
    
    type t_cgdrk_xx = InstanceType<typeof cgdrk_xx>;
    const v_cgdrk_xx = ref<t_cgdrk_xx>();

    let m_cgd_id = 0;
    let m_cgdcp_id = 0;

    // 编辑模式，0只读，1新增，2修改，9入库
    const x_edit_mode = ref(0);
    let m_edit_fields: string[] = [];

    const emits = defineEmits<{
        (e: "row-click", data: any): void
        (e: "loading", show: boolean): void
    }>()

    onMounted(async () => {
    });

    const setEditFields = (mode: number, editFields: string[]) => {

        x_edit_mode.value = mode;
        m_edit_fields = editFields;
    }    

    const getList = (): any[]|undefined => { 
        return v_table_cgdrk.value?.get_list();
    }

    const netLoad_cgdrk_list = async (cgdId: number, cgdcpId: number) => { 

        if (cgdId <= 0) {
            v_table_cgdrk.value?.load_list([]);
            return;
        }

        m_cgd_id = cgdId;
        m_cgdcp_id = cgdcpId;

        let ret = await eocore.proc("p_cgdrk_list", {
            "v_cgd_id": cgdId,
            "v_cgdcp_id": cgdcpId
        });
        let list = eocore.check_net_array(ret);
        if (list == undefined) return;

        v_table_cgdrk.value?.load_list(list);
    }

    /**
     * 加载单据信息
     * @param rklb 
     * @param rkdId 
     * @param reload 
     */
    const loadList = async (cgdId: number, cgdcpId: number) => {
        await netLoad_cgdrk_list(cgdId, cgdcpId);        
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
        data["f_kcdj_s"] = eolib.fixed_num(data["f_kcdj"], 3);

        // 用户转换
        TLogic.updateDicUserData(data, ["f_kgy_id"]);
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
        netLoad_cgdrk_list(m_cgd_id, m_cgdcp_id);
    }

    /**
     * 添加产品明细
     */
    const onButtonClick_Add_cgdrk = async () => {
    }

    /**
     * 删除产品明细
     */
    const onButtonClick_Del_cgdrk = async () => {
    }

    /**
     * 修改产品明细
     */
    const onButtonClick_Upd_cgdrk = () => {
    }

    const onButtonClick_Get_cgdrk = () => {
        let kcmxrkData = v_table_cgdrk.value?.get_select_data(true);
        if (kcmxrkData == undefined) return;

        v_cgdrk_xx.value?.showDialog(kcmxrkData, []);
    }

    /**
     * 入库
     */
    const onButtonClick_Add_kcmx = async () => {
        let kcmxrkData = v_table_cgdrk.value?.get_select_data(true);
        if (kcmxrkData == undefined) return;

        //v_rkcp_rk.value?.showDialog(kcmxrkData);
    }

    /**
     * 产品明细保存事件处理
     */
    const onDialogClose_cgdrk_xx = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        
        if (cancel) {
            cb(true); return;
        }
        v_table_cgdrk.value?.update_data(data, -1, data["_is_add"], true);

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