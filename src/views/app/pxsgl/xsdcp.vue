<template>
    <!-- 销售订单明细 -->
    <div class="eo_col">
        <div class="eo_tool_bar">
            <div class="eo_form">
                <div class="cell">
                    <div class="label_n">产品清单</div>
                </div>
                <div class="cell">
                    <vbuttonk width="8rem" type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Add_xsdcp">添加清单</vbuttonk>
                    <vbuttonk width="8rem" type="default" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Del_xsdcp">移除清单</vbuttonk>
                    <vbuttonk width="8rem" type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Upd_xsdcp">修改清单</vbuttonk>
                    <vbuttonk width="8rem" type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==2"
                        @click="onButtonClick_Upd_xsdcp">变更清单</vbuttonk>
                    <vbuttonk width="8rem" type="default" class="input_w" permit="" 
                        v-show="x_edit_mode==0"
                        @click="onButtonClick_Get_xsdcp">查看清单</vbuttonk>
                </div>
            </div>
        </div>
        <!-- 产品明细 -->
        <div class="eo_col_f">
            <vtable ref="v_table_xsdcp" 
                name="产品明细"
                id-field="f_xsdcp_id"
                @loading="onTableLoading"
                :on-item="onTableItem_xsdcp"
                @row-click="onTableRowClick_xsdcp">
                <el-table-column prop="f_cpmc" label="产品名称" width="200" show-overflow-tooltip />
                <el-table-column prop="f_xssl" label="销售数量" width="100" />                
                <el-table-column prop="f_xsdj_s" label="销售单价" width="120" align="right" />
                <el-table-column prop="f_xszj_s" label="销售总价" width="120" align="right" />
                <el-table-column prop="f_cpjg_s" label="产品价格" width="120" align="right" />
                <el-table-column prop="f_cpbm" label="产品编码" width="160" />
                <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                <el-table-column />
            </vtable>
        </div>
        <xsdcp_xx ref="v_xsdcp_xx" @close="onDialogClose_xsdcp_xx" />
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

    import xsdcp_xx from "./xsdcp_xx.vue"
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    type t_table = InstanceType<typeof vtable>;
    const v_table_xsdcp = ref<t_table>();
    
    type t_xsdcp_xx = InstanceType<typeof xsdcp_xx>;
    const v_xsdcp_xx = ref<t_xsdcp_xx>();

    let m_xsd_id = 0;
    let m_xsdh = "";

    // 编辑模式，0只读，1新增，2修改，9出库
    const x_edit_mode = ref(0);
    let m_field_array: string[] = [];

    const emits = defineEmits<{
        (e: "row-click", data: any): void
        (e: "loading", show: boolean): void
    }>()

    onMounted(async () => {
    });

    const setEditFields = (mode: number, fieldArray: string[]) => {

        console.log("setEditFields", mode, fieldArray);
        x_edit_mode.value = mode;
        m_field_array = fieldArray;
    }

    const getList = (): any[]|undefined => { 
        return v_table_xsdcp.value?.get_list();
    }
    /**
     * 加载单据信息
     * @param ddId 
     * @param ddh 
     * @param reload 
     */
    const loadList = (xsdId: number, xsdh: string, reload: boolean) => {

        m_xsd_id = xsdId;
        m_xsdh = xsdh;

        if (reload) {
            v_table_xsdcp.value?.load_list_proc("p_xsdcp_list", { 
                "v_xsd_id": xsdId,
            });
        } else {
            v_table_xsdcp.value?.load_list([]);
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
    const onTableItem_xsdcp = (data: any) => {

        // 显示订单号
        data["f_xsdh"] = m_xsdh;

        // 价格格式化
        data["f_cpjg_s"] = eolib.fixed_num(data["f_cpjg"], 3);
        data["f_xsdj_s"] = eolib.fixed_num(data["f_xsdj"], 3);
        data["f_xszj_s"] = eolib.fixed_num(data["f_xsdj"] * data["f_xssl"], 3);
    }

    /**
     * 产品明细表格行点击事件
     * @param data 行数据
     */
    const onTableRowClick_xsdcp = (data: any) => {
        emits("row-click", data);
    }

    /**
     * 添加产品明细
     */
    const onButtonClick_Add_xsdcp = async () => {

        if (x_edit_mode.value != 1) {
            eocore.show_error("产品明细不可编辑");
            return;
        }

        if (m_xsd_id <= 0) {
            eocore.show_error("请先选择订单");
            return;
        }

        let xsdcpData = {
            f_xsdcp_id: 0,
            f_cpdy_id: 0, // 产品定义ID
            f_cpmc: "", // 产品名称
            f_cpbm: "", // 产品编码
            f_xsd_id: m_xsd_id, // 订单ID
            f_xsdh: m_xsdh,
            f_cpjg: 0.0, // 成本单价
            f_xssl: 1.0,// 数量
            f_xsdj: 0.0, // 单价 
            f_beizhu: "", // 备注
        };
        
        v_xsdcp_xx.value?.showDialog(xsdcpData, m_field_array);
    }

    /**
     * 删除产品明细
     */
    const onButtonClick_Del_xsdcp = async () => {

        if (x_edit_mode.value != 1) {
            eocore.show_error("产品明细不可编辑");
            return;
        }

        await v_table_xsdcp.value?.remove_data_proc_select("p_xsdcp_del", async (data: any) => {
            return {
                "v_xsdcp_id": data["f_xsdcp_id"]
            };
        });
    }

    /**
     * 修改产品明细
     */
    const onButtonClick_Upd_xsdcp = () => {

        if (x_edit_mode.value == 0) {
            eocore.show_error("产品明细不可编辑");
            return;
        }

        let ddmxData = v_table_xsdcp.value?.get_select_data(true);
        if (ddmxData == undefined) return;

        v_xsdcp_xx.value?.showDialog(ddmxData, m_field_array);
    }

    const onButtonClick_Get_xsdcp = () => {
        let ddmxData = v_table_xsdcp.value?.get_select_data(true);
        if (ddmxData == undefined) return;

        v_xsdcp_xx.value?.showDialog(ddmxData, []);
    }

    /**
     * 产品明细保存事件处理
     */
    const onDialogClose_xsdcp_xx = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        
        if (cancel) {
            cb(true); return;
        }
        v_table_xsdcp.value?.update_data(data, -1, data["_is_add"], true);

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