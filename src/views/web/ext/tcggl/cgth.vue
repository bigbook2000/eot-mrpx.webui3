<template>
    <!-- 采购退货管理 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <!-- 查询工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w240p">
                        <div class="label_n">供应商</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="50"
                                v-model="x_query_gysmc" placeholder="请输入供应商名称"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_n">批号</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="50"
                                v-model="x_query_kcbh" placeholder="请输入批号"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w240p">
                        <div class="label_n">产品名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="50"
                                v-model="x_query_cpmc" placeholder="请输入产品名称"></el-input>
                        </div>
                    </div>
                </div>
                <div class="eo_form">
                    <div class="cell eo_w200p">
                        <div class="label_n">开始时间</div>
                        <div class="input">
                            <el-date-picker v-model="x_query_start_time" type="datetime"
                                placeholder="请选择开始时间" style="width:100%"
                                value-format="YYYY-MM-DD HH:mm:ss" />
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_n">结束时间</div>
                        <div class="input">
                            <el-date-picker v-model="x_query_end_time" type="datetime"
                                placeholder="请选择结束时间" style="width:100%"
                                value-format="YYYY-MM-DD HH:mm:ss" />
                        </div>
                    </div>
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="default" class="eo_w80p" @click="onButtonClick_Clear_cgth">重置</el-button>
                        </div>
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_cgth">查找</el-button>
                        </div>
                    </div>
                </div>                
            </div>
            
            <div class="eo_col_sp"></div>

            <div class="eo_col_f">
                <div class="eo_row">
                    <div class="eo_row_f">

                        <div class="eo_col">
                    
                            <!-- 操作工具栏 -->
                            <div class="eo_tool_bar">
                                <div class="eo_form">
                                    <div class="cell">
                                        <tflow_button :app="false" ref="v_flow_button"
                                            @on-new="onButtonClick_Flow_Add"
                                            @on-back="onButtonClick_Flow_Back"
                                            @on-edit="onButtonClick_Flow_Upd"
                                            @on-get="onButtonClick_Flow_Get"
                                            @on-cancel="onButtonClick_Flow_Cancel"
                                            @on-flow="onButtonClick_Flow" />
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 退货表格 -->
                            <div class="eo_col_f">
                                <vtable ref="v_table_cgth" 
                                    name="采购退货"
                                    id-field="f_cgth_id"
                                    @loading="onTableLoading"
                                    :on-item="onTableItem_cgth"
                                    :on-page="onTablePage_cgth"
                                    @row-click="onTableRowClick_cgth">
                                    <el-table-column prop="f_flow_point_id_s" label="流程" width="80" />
                                    <el-table-column prop="f_cjsj_s" label="创建时间" width="160" />
                                    <el-table-column prop="f_cpmc" label="产品名称" width="200" show-overflow-tooltip />
                                    <el-table-column prop="f_kcbh" label="批次" width="200" />
                                    <el-table-column prop="f_kcsl" label="数量" width="100" />
                                    <el-table-column prop="f_thje_s" label="退款金额" width="120" />
                                    <el-table-column prop="f_cgje_s" label="库存金额" width="120" />
                                    <el-table-column prop="f_gysmc" label="供应商" width="200" show-overflow-tooltip />
                                    <el-table-column prop="f_wlgs_id_s" label="物流公司" width="150" />
                                    <el-table-column prop="f_wldh" label="物流单号" width="150" />
                                    <el-table-column prop="f_shdz" label="收货地址" width="200" show-overflow-tooltip />
                                    <el-table-column prop="f_shr" label="收货人" width="100" />
                                    <el-table-column prop="f_shdh" label="电话" width="120" />
                                    <el-table-column prop="f_cgdh" label="采购单号" width="150" />
                                    <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                                    <el-table-column />
                                </vtable>
                            </div>
                            
                            <!-- 分页 -->
                            <div class="eo_page_bar">
                                <el-pagination
                                    background
                                    @current-change="onPageChange_cgth"
                                    :current-page="x_page_index"
                                    :page-size="x_page_row_count"
                                    layout="total, prev, pager, next, jumper"
                                    :total="x_row_total">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                    <div class="eo_row_sp"></div>
                    <div class="eo_row_d">
                        <vflow ref="v_flow_cgth" type="采购退货"></vflow>
                    </div>
                </div>
            </div>
        </div>
        <!-- 退货编辑对话框 -->
        <cgth_xx ref="v_cgth_xx" @close="onDialogClose_cgth_xx"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_cggl_cgth" }
</script>

<script lang="ts" setup>
    import { ref, nextTick, onMounted } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";
    import { type cflow_type, type cflow_point } from "@/inc/eoflow";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import eodic from "@/inc/eodic";
    import eoflow from "@/inc/eoflow";

    import vbuttonk from "@/components/vbuttonk.vue"
    import vtable from "@/components/web/vtable.vue"
    import vdic from "@/components/vdic.vue"
    import vflow from "@/components/web/vflow.vue"

    import cgth_xx from "./cgth_xx.vue"
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import user_input from "@/views/platform/user_input.vue"
    import tflow_button from "@/views/comm/web/tflow_button.vue";

    type t_table = InstanceType<typeof vtable>;
    const v_table_cgth = ref<t_table>();

    type t_flow = InstanceType<typeof vflow>;
    const v_flow_cgth = ref<t_flow>();

    type t_cgth_xx = InstanceType<typeof cgth_xx>;
    const v_cgth_xx = ref<t_cgth_xx>();

    const v_flow_button = ref<InstanceType<typeof tflow_button>>();

    // 查询条件
    const x_query_gysmc = ref("");
    const x_query_kcbh = ref("");
    const x_query_cpmc = ref("");
    const x_query_start_time = ref("");
    const x_query_end_time = ref("");

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    onMounted(async () => {

        await TLogic.netLoad_Wlgs_list();

        v_flow_button.value?.init_flow(v_flow_cgth.value);

        netLoad_cgth_query(-1);
    });

    const updateFlowStatus = (cgthData: any) => {

        if (cgthData == undefined) return;
        let yxbz = cgthData["f_yxbz"];
        if (yxbz == 0) return;

        const flowStatus = v_flow_button.value?.update_flow_status(cgthData);
        if (!flowStatus) return;

        v_flow_button.value?.set_flow_back("已审核");

        if (cgthData["f_kgy_id"] == TGlobal.userData["f_user_id"]) {
            v_flow_button.value?.set_flow_edit(["新建", "待发货"]);
        }
        const pointName = v_flow_button.value?.get_point_name();

        let editMode = 0;
        let fields: string[] = [];

        switch (pointName) {
            case "新建":
                editMode = 1;
                fields = ["*"];
                break;
            case "待审核":
                editMode = 1;
                fields = [
                    "f_wlgs_id",
                    "f_wldh",
                    "f_thje",
                    "f_fhr",
                    "f_fhdh",
                    "f_fhdz",
                    "f_thyy",
                    "f_beizhu"
                ];
                break;
            case "待发货":
                editMode = 1;
                fields = [
                    "f_wlgs_id",
                    "f_wldh",
                    "f_beizhu"
                ];
                break;
            case "已发货":
            case "待退款":
            case "完成":
                editMode = 1;
                fields = ["f_beizhu"];
                break;
        }

        v_cgth_xx.value?.setEditFields(editMode, fields);
    };

    const onButtonClick_Flow = (point: cflow_point, data0: any) => {

        const pointName = point?.name;
        if (pointName == undefined) return;

        let cgthData = v_table_cgth.value?.get_select_data(true);
        if (cgthData == undefined) return;

        console.log("onButtonClick_Flow", point, cgthData);

        switch (pointName) {
            case "新建":
                onButtonClick_Flow_THTJ(cgthData);
                break;
            case "待审核":
                v_flow_button.value?.show_flow_dialog(cgthData, (data1: any) => {
                    updateFlowStatus(data1);
                });
                break;
            case "待发货":
                onButtonClick_Flow_THCK(cgthData);
                break;
            case "已发货":
                v_flow_button.value?.show_flow_dialog(cgthData, (data1: any) => {
                    updateFlowStatus(data1);
                });
                break;
            case "待退款":
                v_flow_button.value?.show_flow_dialog(cgthData, (data1: any) => {
                    updateFlowStatus(data1);
                });
                break;
            case "完成":
                break;
        }
    };

    /**
     * 查询退货数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_cgth_query = (pageIndex: number = -1) => {

        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        v_table_cgth.value?.load_list_proc("p_cgth_query", {
            "v_gysmc": x_query_gysmc.value,
            "v_cjsj1": x_query_start_time.value,
            "v_cjsj2": x_query_end_time.value,
            "v_kcbh": x_query_kcbh.value,
            "v_cpmc": x_query_cpmc.value,
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });

        v_flow_cgth.value?.load_List(0);

        updateFlowStatus(undefined);
    }

    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_cgth = (data: any) => {
        
        // 日期格式化
        data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"]);

        // 金额格式化
        data["f_thje_s"] = eolib.fixed_num(data["f_thje"], 3);

        const cgje = data["f_kcdj"] * data["f_kcsl"];
        data["f_cgje_s"] = eolib.fixed_num(cgje, 3);

        // 用户转换
        TLogic.updateDicUserData(data, ["f_cgy_id"]);

        // 显示物流公司名称
        data["f_wlgs_id_s"] = TLogic.getLabel_wlgs(data["f_wlgs_id"]);

        // 流程
        data["f_flow_point_id_s"] = v_flow_cgth.value?.get_point_name_by_id(data["f_flow_point_id"]);
    }

    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_cgth = (n: number): number => {
        x_row_total.value = n;
        return n;
    }

    /**
     * 加载状态处理
     * @param show 是否显示加载状态
     */
    const onTableLoading = (show: boolean) => {
        x_show_loading.value = show;
    }

    /**
     * 表格行点击事件
     * @param data 行数据
     */
    const onTableRowClick_cgth = async (data: any) => {

        x_show_loading.value = true;

        await v_flow_cgth.value?.load_List(data["f_cgth_id"]);

        updateFlowStatus(data);

        x_show_loading.value = false;
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_cgth = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_cgth_query(pageIndex - 1);
    }
    
    /**
     * 重置按钮点击
     */
    const onButtonClick_Clear_cgth = () => {
        x_query_gysmc.value = "";
        x_query_kcbh.value = "";
        x_query_cpmc.value = "";
        x_query_start_time.value = "";
        x_query_end_time.value = "";
    }

    /**
     * 查找按钮点击
     */
    const onButtonClick_Load_cgth = () => {
        netLoad_cgth_query(-1);
    }

    /**
     * 添加退货
     */
    const onButtonClick_Flow_Add = async () => {

        let cgthData = {

            "f_cgth_id": 0,
            "f_cgdh": "",
            "f_cgdrk_id": 0,
            "f_kcmx_id": 0,
            "f_cpdy_id": 0,
            "f_cpmc": "",
            "f_kcbh": "",
            "f_gys_id": 0,
            "f_gysmc": "",
            "f_cgy_id": TGlobal.userData["f_user_id"],
            "f_cgy_id_s": TGlobal.userData["f_name"],
            "f_cgdj": 0.0,
            "f_kcsl": 0,
            "f_thje": 0.0,
            "f_wlgs_id": 0,
            "f_wlgs_id_s": "",
            "f_wldh": "",
            "f_shr": "",
            "f_shdh": "",
            "f_shdz": "",
            "f_thyy": "",
            "f_thbz": 0,
            "f_cjsj": "",
            "f_beizhu": "",
            "f_flow_point_id": 0,
            "f_flow_process_id": 0
        };

        v_cgth_xx.value?.setEditFields(1, ["*"]);
        v_cgth_xx.value?.showDialog(cgthData);
    }

    /**
     * 退货详情
     */
    const onButtonClick_Flow_Get = () => {
        let cgthData = v_table_cgth.value?.get_select_data(true);
        if (cgthData == undefined) return;

        v_cgth_xx.value?.setEditFields(0, [""]);
        v_cgth_xx.value?.showDialog(cgthData);
    }

    /**
     * 修改退货
     */
    const onButtonClick_Flow_Upd = () => {
        let cgthData = v_table_cgth.value?.get_select_data(true);
        if (cgthData == undefined) return;

        v_cgth_xx.value?.showDialog(cgthData);
    }

    const addProcessData = async (data: any, tableName: string, idField: string) => {

        v_flow_cgth.value?.clear_list(data[idField]);
        let processData = await v_flow_cgth.value?.process_add_data(
            data[idField], "-");

        if (processData != undefined) {
            data["f_flow_point_id"] = processData["f_flow_point_id"];
            data["f_flow_process_id"] = processData["f_flow_process_id"];
        }
    }

    /**
     * 退货保存事件处理
     */
    const onDialogClose_cgth_xx = async (cancel: boolean, data: any, cb: cfunc_boolean) => {

        if (cancel) {
            cb(true); return;
        }

        if (!eocore.check_id(data, "f_cgdrk_id")) {
            eocore.show_info("请选择采购货物");
            cb(false); return;
        }

        if (!data["f_thyy"]) {
            eocore.show_info("请输入退货原因");
            cb(false); return;
        }

        const isAdd = !eocore.check_id(data, "f_cgth_id");

        x_show_loading.value = true;
        let ret = await eocore.proc("p_cgth_upd", {
            "v_cgth_id": data["f_cgth_id"],
            "v_cgd_id": data["f_cgd_id"],
            "v_cgdrk_id": data["f_cgdrk_id"],
            "v_kcmx_id": data["f_kcmx_id"],
            "v_kgy_id": TGlobal.userData["f_user_id"],
            "v_shr": data["f_shr"],
            "v_shdh": data["f_shdh"],
            "v_shdz": data["f_shdz"],
            "v_wlgs_id": data["f_wlgs_id"],
            "v_wldh": data["f_wldh"],
            "v_thje": data["f_thje"],
            "v_thyy": data["f_thyy"],
            "v_beizhu": data["f_beizhu"]
        });
        const dataNew = eocore.check_net_object(ret);
        x_show_loading.value = false;
        if (dataNew == undefined) return;

        // 货物标记为临时
        // x_show_loading.value = true;
        // ret = await eocore.proc("p_kcmx_kcbz", {
        //     "v_kcmx_ids": "" + data["f_kcmx_id"],
        //     "v_kcbz": TLogic.kcbzCodes["临时"]
        // });
        // x_show_loading.value = false;
        // if (eocore.check_net_object(ret) == undefined) return;

        x_show_loading.value = true;

        if (isAdd) {
            await addProcessData(dataNew, "tcgth", "f_cgth_id");
        }

        // 更新表格
        v_table_cgth.value?.update_data(dataNew, -1, isAdd, true);
        // 更新流程按钮
        updateFlowStatus(dataNew);

        x_show_loading.value = false;

        cb(true);
    }

    /**
     * 流程操作：退货作废
     */
    const onButtonClick_Flow_Cancel = async () => {

        let cgthData = v_table_cgth.value?.get_select_data(true);
        if (cgthData == undefined) return;

        let ret = await eocore.show_confirm("退货记录是否作废？");
        if (!ret) return;

        cgthData["f_yxbz"] = 0;
        // TODO: 更新数据库
        // netLoad_cgth_upd(cgthData);
        console.log("退货作废", cgthData);
    }

    /**
     * 流程操作：退货退回
     */
    const onButtonClick_Flow_Back = () => {

        let cgthData = v_table_cgth.value?.get_select_data(true);
        if (cgthData == undefined) return;

        v_flow_cgth.value?.process_back_dialog((cancel: boolean, data: any, cb: cfunc_boolean) => {

            if (cancel) {
                cb(true); return;
            }

            cgthData["f_flow_point_id"] = data["f_flow_point_id"];
            cgthData["f_flow_point_id_s"] = data["f_flow_point_id_s"];

            // 更新表格流程状态
            v_table_cgth.value?.update_data(cgthData, -1, false, false);
            // 更新按钮状态
            updateFlowStatus(cgthData);

            cb(true);
        });
    }

    /**
     * 流程操作：提交退货
     */
    const onButtonClick_Flow_THTJ = (cgthData: any) => {

        v_flow_button.value?.show_flow_dialog(cgthData, (data1: any) => {
            updateFlowStatus(data1);
        });
    }

    /**
     * 流程操作：仓库出库
     */
    const onButtonClick_Flow_THCK = (cgthData: any) => {

        if (!eocore.check_id(cgthData, "f_wlgs_id")) {
            eocore.show_info("请选择物流公司");
            return;
        }
        if (eocore.check_empty(cgthData["f_wldh"])) {
            eocore.show_info("请输入物流单号");
            return;
        }

        v_flow_button.value?.show_flow_dialog(cgthData, async (data1: any) => {
            updateFlowStatus(data1);
            await processFlow_THCK(data1);
        });
    }

    const processFlow_THCK = async (cgthData: any) => {

        // 将货物出库
        x_show_loading.value = true;
        const dataNew = await TLogic.netLoad_kcmx_upd(
            cgthData["f_kcmx_id"],
            0, // 关联
            cgthData["f_cpdy_id"],
            cgthData["f_kcbh"],
            "采购退货",
            0,
            cgthData["f_hwck"],
            cgthData["f_kcdj"],
            cgthData["f_kcsl"],
            TGlobal.userData["f_user_id"],
            cgthData["f_beizhu"],
            TLogic.kcbzCodes["历史"]
        );
        x_show_loading.value = false;
        if (dataNew == undefined) return;
        
        x_show_loading.value = true;
        const ret = await eocore.proc("p_cgdrk_rkbz", {
            "v_cgdrk_id": cgthData["f_cgdrk_id"],
            "v_rkbz": 2
        });
        x_show_loading.value = false;
        eocore.check_net_object(ret)
    }
</script>

<style lang="scss" scoped>
</style>
