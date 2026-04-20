<template>
    <!-- 采购订单明细 -->
    <div class="eo_col">
        <div class="eo_tool_bar">
            <div class="eo_form">
                <div class="cell">
                    <div class="label_n">产品清单</div>
                </div>
                <div class="cell">
                    <vbuttonk type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Add_cgdcp">添加清单</vbuttonk>
                    <vbuttonk type="default" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Del_cgdcp">移除清单</vbuttonk>
                    <vbuttonk type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==1"
                        @click="onButtonClick_Upd_cgdcp">修改清单</vbuttonk>
                    <vbuttonk type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==2"
                        @click="onButtonClick_Upd_cgdcp">变更清单</vbuttonk>
                    <vbuttonk type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==3"
                        @click="onButtonClick_Upd_cgdcp">物流单号</vbuttonk>
                    <vbuttonk type="primary" class="input_w" permit="" 
                        v-show="x_edit_mode==9"
                        @click="onButtonClick_Upd_shrk">收货入库</vbuttonk>
                    <vbuttonk type="default" class="input_w" permit="" 
                        v-show="x_edit_mode==0"
                        @click="onButtonClick_Get_cgdcp">查看清单</vbuttonk>
                </div>
            </div>
        </div>
        <!-- 产品明细 -->
        <div class="eo_col_f">
            <vtable ref="v_table_cgdcp" 
                name="产品明细"
                id-field="f_cgdcp_id"
                @loading="onTableLoading"
                :on-item="onTableItem_cgdcp"
                @row-click="onTableRowClick_cgdcp">
                <el-table-column prop="f_cpmc" label="产品名称" width="200" show-overflow-tooltip />
                <el-table-column prop="f_cgsl" label="采购件数" width="90" align="right" />
                <el-table-column prop="f_bzsl" label="单件数量" width="90" align="right" />
                <el-table-column prop="f_cgdj_s" label="采购单价" width="120" align="right" />
                <el-table-column prop="f_cgzj_s" label="采购总价" width="120" align="right" />
                <el-table-column prop="f_wlgs_id_s" label="物流公司" width="120" show-overflow-tooltip />
                <el-table-column prop="f_wldh" label="物流单号" width="160" />
                <el-table-column prop="f_kcsl" label="库存数量" width="90" align="right" />
                <el-table-column prop="f_kcdj_s" label="库存成本" width="120" align="right" />
                <el-table-column prop="f_cpjg_s" label="销售定价" width="120" align="right" />
                <el-table-column prop="f_cpbm" label="产品编码" width="160" />
                <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                <el-table-column />
            </vtable>
        </div>
        <cgdcp_xx ref="v_cgdcp_xx" @close="onDialogClose_cgdcp_xx" />
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

    import cgdcp_xx from "./cgdcp_xx.vue"
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    type t_table = InstanceType<typeof vtable>;
    const v_table_cgdcp = ref<t_table>();
    
    type t_cgdcp_xx = InstanceType<typeof cgdcp_xx>;
    const v_cgdcp_xx = ref<t_cgdcp_xx>();

    let m_cgd_id = 0;
    let m_cgdh = "";

    // 编辑模式，0只读，1新增，2修改，9出库
    const x_edit_mode = ref(0);
    let m_field_array: string[] = [];

    const emits = defineEmits<{
        (e: "row-click", data: any): void
        (e: "loading", show: boolean): void
    }>()

    onMounted(async () => {
        await TLogic.netLoad_Wlgs_list();
    });

    const setEditFields = (mode: number, fieldArray: string[]) => {

        console.log("setEditFields", mode, fieldArray);
        x_edit_mode.value = mode;
        m_field_array = fieldArray;
    }    

    const getList = (): any[]|undefined => { 
        return v_table_cgdcp.value?.get_list();
    }
    /**
     * 加载单据信息
     * @param ddId 
     * @param ddh 
     * @param reload 
     */
    const loadList = async (cgdId: number, cgdh: string, reload: boolean): Promise<void> => {

        m_cgd_id = cgdId;
        m_cgdh = cgdh;

        if (reload) {
            await v_table_cgdcp.value?.load_list_proc("p_cgdcp_list", { 
                "v_cgd_id": cgdId,
            });
        } else {
            v_table_cgdcp.value?.load_list([]);
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
    const onTableItem_cgdcp = (data: any) => {

        // 显示订单号
        data["f_cgdh"] = m_cgdh;

        // 价格格式化
        data["f_cpjg_s"] = eolib.fixed_num(data["f_cpjg"], 3);
        data["f_cgdj_s"] = eolib.fixed_num(data["f_cgdj"], 3);
        data["f_cgzj_s"] = eolib.fixed_num(data["f_cgdj"] * data["f_cgsl"], 3);

        const kcdj = eolib.divide_num(data["f_kczj"], data["f_cgsl"])
        data["f_kcdj_s"] = eolib.fixed_num(kcdj, 3);

        // 显示物流公司名称
        data["f_wlgs_id_s"] = TLogic.getLabel_wlgs(data["f_wlgs_id"]);
    }

    /**
     * 产品明细表格行点击事件
     * @param data 行数据
     */
    const onTableRowClick_cgdcp = (data: any) => {
        emits("row-click", data);
    }

    /**
     * 添加产品明细
     */
    const onButtonClick_Add_cgdcp = async () => {

        if (x_edit_mode.value != 1) {
            eocore.show_error("产品明细不可编辑");
            return;
        }

        if (m_cgd_id <= 0) {
            eocore.show_error("请先选择订单");
            return;
        }

        let cgdcpData = {
            "f_cgdcp_id": 0,
            "f_cpdy_id": 0, // 产品定义ID
            "f_cpmc": "", // 产品名称
            "f_cpbm": "", // 产品编码
            "f_cgd_id": m_cgd_id, // 订单ID
            "f_cgdh": m_cgdh,
            "f_cpjg": 0.0, // 销售定价
            "f_kcsl": 0.0, // 库存数量
            "f_kcdj": 0.0, // 库存单价
            "f_cgsl": 1.0, // 件数
            "f_bzsl": 1.0, // 单件数量
            "f_cgdj": 0.0, // 单价 
            "f_cgzj": 0.0, // 总价
            "f_wlgs_id": 0, // 物流公司ID
            "f_wlgs_id_s": "", // 物流公司名称
            "f_wldh": "", // 物流单号
            "f_beizhu": "", // 备注
        };
        
        v_cgdcp_xx.value?.showDialog("产品信息", cgdcpData, m_field_array, true);
    }

    /**
     * 删除产品明细
     */
    const onButtonClick_Del_cgdcp = async () => {

        if (x_edit_mode.value != 1) {
            eocore.show_error("产品明细不可编辑");
            return;
        }

        await v_table_cgdcp.value?.remove_data_proc_select("p_cgdcp_del", async (data: any) => {
            return {
                "v_cgdcp_id": data["f_cgdcp_id"]
            };
        });
    }

    /**
     * 修改产品明细
     */
    const onButtonClick_Upd_cgdcp = () => {

        if (x_edit_mode.value == 0) {
            eocore.show_error("产品明细不可编辑");
            return;
        }

        let cgdcpData = v_table_cgdcp.value?.get_select_data(true);
        if (cgdcpData == undefined) return;

        v_cgdcp_xx.value?.showDialog("产品信息", cgdcpData, m_field_array, true);
    }

    /**
     * 产品入库，将清单拆分成单一商品明细
     */
    const onButtonClick_Upd_shrk = () => {

        if (x_edit_mode.value != 9) {
            eocore.show_error("产品明细无法出库");
            return;
        }

        let cgdcpData = v_table_cgdcp.value?.get_select_data(true);
        if (cgdcpData == undefined) return;

        v_cgdcp_xx.value?.showDialog("产品入库", cgdcpData, [], false);
    }

    const onButtonClick_Get_cgdcp = () => {
        let cgdcpData = v_table_cgdcp.value?.get_select_data(true);
        if (cgdcpData == undefined) return;

        v_cgdcp_xx.value?.showDialog("产品信息", cgdcpData, [], false);
    }

    /**
     * 产品明细保存事件处理
     */
    const onDialogClose_cgdcp_xx = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        
        if (cancel) {
            cb(true); return;
        }

        if (data != undefined) {
            v_table_cgdcp.value?.update_data(data, -1, data["_is_add"], true);
            emits("row-click", data);
        }

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