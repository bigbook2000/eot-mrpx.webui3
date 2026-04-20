<template>
    <!-- 销售退货管理 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <!-- 查询工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w240p">
                        <div class="label_n">客户名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="50"
                                v-model="x_query_khmc" placeholder="请输入客户名称"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_n">批号</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="50"
                                v-model="x_query_ph" placeholder="请输入批号"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w240p">
                        <div class="label_n">产品名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="50"
                                v-model="x_query_cpmc" placeholder="请输入产品名称"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_n">销售单号</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="50"
                                v-model="x_query_xsdh" placeholder="请输入销售单号"></el-input>
                        </div>
                    </div>
                </div>
                <div class="eo_form">
                    <div class="cell eo_w200p">
                        <div class="label_n">销售员</div>
                        <div class="input">
                            <user_input v-model="x_query_xsy_id" 
                                :userName="x_query_xsy_id_s" 
                                style="width:100%"></user_input>
                        </div>
                    </div>
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
                            <el-button type="default" class="eo_w80p" @click="onButtonClick_Clear_xsth">重置</el-button>
                        </div>
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_xsth">查找</el-button>
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
                                        <vbuttonk type="primary" class="input_w" permit="" 
                                            v-show="x_flow_status_button['新建']"
                                            @click="onButtonClick_Add_xsth">新建退货</vbuttonk>
                                        <vbuttonk type="primary" class="input_w" permit="" 
                                            v-show="x_edit_xsth"
                                            @click="onButtonClick_Upd_xsth">修改退货</vbuttonk>
                                        <vbuttonk type="default" class="input_w" permit="" 
                                            v-show="!x_edit_xsth"
                                            @click="onButtonClick_Get_xsth">退货详情</vbuttonk>
                                        <div class="split"></div>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['作废']"
                                            @click="onButtonClick_Flow_THZF">退货作废</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['退回']"
                                            @click="onButtonClick_Flow_THTH">退货退回</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['提交']"
                                            @click="onButtonClick_Flow_THTJ">提交退货</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['审核']"
                                            @click="onButtonClick_Flow_THSH">退货审核</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['收货']"
                                            @click="onButtonClick_Flow_THRK">收货入库</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['退款']"
                                            @click="onButtonClick_Flow_THTK">财务退款</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['归档']"
                                            @click="onButtonClick_Flow_THGD">退货归档</vbuttonk>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 退货表格 -->
                            <div class="eo_col_f">
                                <vtable ref="v_table_xsth" 
                                    name="销售退货"
                                    id-field="f_xsth_id"
                                    @loading="onTableLoading"
                                    :on-item="onTableItem_xsth"
                                    :on-page="onTablePage_xsth"
                                    @row-click="onTableRowClick_xsth">
                                    <el-table-column prop="f_flow_point_id_s" label="流程" width="80" />
                                    <el-table-column prop="f_cjsj_s" label="创建时间" width="160" />
                                    <el-table-column prop="f_xsy_id_s" label="销售员" width="100" />
                                    <el-table-column prop="f_cpmc" label="产品名称" width="200" show-overflow-tooltip />
                                    <el-table-column prop="f_kcbh" label="批次" width="200" />
                                    <el-table-column prop="f_kcsl" label="数量" width="100" />
                                    <el-table-column prop="f_thje_s" label="退款金额" width="120" />
                                    <el-table-column prop="f_xsje_s" label="销售金额" width="120" />
                                    <el-table-column prop="f_khmc" label="客户名称" width="200" show-overflow-tooltip />
                                    <el-table-column prop="f_wlgs_id_s" label="物流公司" width="150" />
                                    <el-table-column prop="f_wldh" label="物流单号" width="150" />
                                    <el-table-column prop="f_thdz" label="退货地址" width="200" show-overflow-tooltip />
                                    <el-table-column prop="f_dffhrxm" label="发货人" width="100" />
                                    <el-table-column prop="f_dffhdh" label="电话" width="120" />
                                    <el-table-column prop="f_lxdz" label="发货地址" width="180" show-overflow-tooltip />                    
                                    <el-table-column prop="f_xsdh" label="销售单号" width="150" />
                                    <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                                    <el-table-column />
                                </vtable>
                            </div>
                            
                            <!-- 分页 -->
                            <div class="eo_page_bar">
                                <el-pagination
                                    background
                                    @current-change="onPageChange_xsth"
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
                        <vflow ref="v_flow_xsth" type="销售退货"></vflow>
                    </div>
                </div>
            </div>
        </div>
        <!-- 退货编辑对话框 -->
        <xsth_xx ref="v_xsth_xx" @close="onDialogClose_xsth_xx"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_xsgl_xsth" }
</script>

<script lang="ts" setup>
    import { ref, onMounted } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import eodic from "@/inc/eodic";
    import eoflow from "@/inc/eoflow";

    import vbuttonk from "@/logic/common/vbuttonk.vue"
    import vtable from "@/logic/common/vtable.vue"
    import vdic from "@/logic/common/vdic.vue"
    import vflow from "@/logic/common/vflow.vue"

    import xsth_xx from "./xsth_xx.vue"
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import user_input from "@/views/platform/user_input.vue"

    type t_table = InstanceType<typeof vtable>;
    const v_table_xsth = ref<t_table>();

    type t_flow = InstanceType<typeof vflow>;
    const v_flow_xsth = ref<t_flow>();

    type t_xsth_xx = InstanceType<typeof xsth_xx>;
    const v_xsth_xx = ref<t_xsth_xx>();

    // 按钮状态
    const x_flow_status_button = ref({
        "新建": false,
        "作废": false,
        "退回": false,
        "提交": false,
        "审核": false,
        "收货": false,
        "退款": false,
        "归档": false,
    });

    const x_edit_xsth = ref(false);

    // 查询条件
    const x_query_khmc = ref("");
    const x_query_ph = ref("");
    const x_query_cpmc = ref("");
    const x_query_xsdh = ref("");
    const x_query_xsy_id = ref(-1);
    const x_query_xsy_id_s = ref("");
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
        
        const point = v_flow_xsth.value?.get_point_by_name("新建");
        if (point != undefined) {
            x_flow_status_button.value["新建"] = TLogic.checkRoleString(point.role);
        }
        
        // 初始化加载数据
        netLoad_xsth_query(-1);
    });

    const updateFlowStatusButton = (xsthData: any) => { 

        let flowPointId = 0;
        let yxbz = 0;
        if (xsthData != undefined) {
            flowPointId = xsthData["f_flow_point_id"];
            yxbz = xsthData["f_yxbz"];
        }

        const statusButton = x_flow_status_button.value;
        statusButton["作废"] = false;
        statusButton["退回"] = false;
        statusButton["提交"] = false;
        statusButton["审核"] = false;
        statusButton["收货"] = false;
        statusButton["退款"] = false;
        statusButton["归档"] = false;
        x_flow_status_button.value = statusButton;

        if (flowPointId <= 0) return;
        if (yxbz == 0) return;
        
        let point = v_flow_xsth.value?.get_point_by_id(flowPointId);
        if (point == undefined) return;

        // 检查权限
        const role = TGlobal.userData["f_role"];
        const pointRole = point.role;
        if (!eolib.list_any_list(role, pointRole)) return;

        const pointName = point.name;

        // 审核之后无法退回
        let isXSTH = v_flow_xsth.value?.check_point_order(point.flow_point_id, "待审核") || false;
        statusButton["退回"] = !isXSTH;

        statusButton["提交"] = pointName == "新建";
        statusButton["审核"] = pointName == "待审核";
        statusButton["收货"] = pointName == "待收货";
        statusButton["退款"] = pointName == "待退款";
        statusButton["归档"] = pointName == "完成";

        x_edit_xsth.value = false;
                
        switch (pointName) { 
            case "新建":
                v_xsth_xx.value?.setEditFields(1, ["*"]);
                x_edit_xsth.value = true;
                statusButton["退回"] = false;
                break;
            case "待审核":
                v_xsth_xx.value?.setEditFields(1, [
                    "f_wlgs_id",
                    "f_wldh",
                    "f_thje",
                    "f_fhr",
                    "f_fhdh",
                    "f_fhdz",
                    "f_thyy",
                    "f_beizhu"
                ]);
                x_edit_xsth.value = true;
                break;
            case "已审核":
                v_xsth_xx.value?.setEditFields(1, [
                    "f_wlgs_id",
                    "f_wldh",
                    "f_beizhu"
                ]);
                x_edit_xsth.value = true;
                break;
            case "已收货":                
            case "已退款":                
            case "已完成":                
                v_xsth_xx.value?.setEditFields(1, [
                    "f_beizhu"
                ]);
                x_edit_xsth.value = false;
                break;
        }
    };

    /**
     * 查询退货数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_xsth_query = (pageIndex: number = -1) => {

        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        v_table_xsth.value?.load_list_proc("p_xsth_query", {
            "v_xsy_id": x_query_xsy_id.value,
            "v_khmc": x_query_khmc.value,
            "v_xsdh": x_query_xsdh.value,
            "v_cjsj1": x_query_start_time.value,
            "v_cjsj2": x_query_end_time.value,
            "v_kcbh": x_query_ph.value,
            "v_cpmc": x_query_cpmc.value,
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });

        v_flow_xsth.value?.load_List(0);
        
        updateFlowStatusButton(undefined);
    }

    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_xsth = (data: any) => {
        
        // 日期格式化
        data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"]);

        // 金额格式化
        data["f_thje_s"] = eolib.fixed_num(data["f_thje"], 2);
        data["f_xsje_s"] = eolib.fixed_num(data["f_xsje"], 2);

        // 用户转换
        TLogic.updateDicUserData(data, ["f_xsy_id"]);

        // 显示物流公司名称
        data["f_wlgs_id_s"] = TLogic.getLabel_wlgs(data["f_wlgs_id"]);

        // 流程
        data["f_flow_point_id_s"] = v_flow_xsth.value?.get_point_name_by_id(data["f_flow_point_id"]);
    }

    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_xsth = (n: number): number => {
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
    const onTableRowClick_xsth = async (data: any) => {

        x_show_loading.value = true;

        await v_flow_xsth.value?.load_List(data["f_xsth_id"]);

        updateFlowStatusButton(data);

        x_show_loading.value = false;
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_xsth = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_xsth_query(pageIndex - 1);
    }
    
    /**
     * 重置按钮点击
     */
    const onButtonClick_Clear_xsth = () => {
        x_query_khmc.value = "";
        x_query_ph.value = "";
        x_query_cpmc.value = "";
        x_query_xsdh.value = "";
        x_query_xsy_id.value = -1;
        x_query_xsy_id_s.value = "";
        x_query_start_time.value = "";
        x_query_end_time.value = "";
    }

    /**
     * 查找按钮点击
     */
    const onButtonClick_Load_xsth = () => {
        netLoad_xsth_query(-1);
    }

    /**
     * 添加退货
     */
    const onButtonClick_Add_xsth = async () => {
        
        let xsthData = {  

            "f_xsth_id": 0, // 退货ID
            "f_xsdh": "", // 销售单号
            "f_xsdck_id": 0, // 销售c产品出库编号
            "f_kcmx_id": 0,
            "f_cpdy_id": 0,
            "f_cpmc": "", // 产品名称
            "f_kcbh": "", // 货物批次
            "f_khgl_id": 0, // 客户ID
            "f_khmc": "", // 客户名称
            "f_xsy_id": TGlobal.userData["f_user_id"], // 销售员ID
            "f_xsy_id_s": TGlobal.userData["f_name"], // 销售员姓名
            "f_xsje": 0.0, // 销售金额
            "f_thje": 0.0, // 退货金额
            "f_wlgs_id": 0, // 物流公司ID
            "f_wlgs_id_s": "", // 物流公司名称
            "f_wldh": "", // 物流单号
            "f_fhr": "", // 对方发货人姓名
            "f_fhdh": "", // 对方发货人电话
            "f_fhdz": "", // 对方发货人地址
            "f_thyy": "", // 退货原因
            "f_thbz": 0,
            "f_cjsj": "", // 创建时间
            "f_beizhu": "", // 备注
            "f_flow_point_id": 0,
            "f_flow_process_id": 0
        };
        
        v_xsth_xx.value?.setEditFields(1, ["*"]);
        v_xsth_xx.value?.showDialog(xsthData);
    }

    /**
     * 删除退货
     */
    const onButtonClick_Del_xsth = async () => {
        // let xsthData = v_table_xsth.value?.get_select_data(true);
    }

    /**
     * 退货详情
     */
    const onButtonClick_Get_xsth = () => { 
        let xsthData = v_table_xsth.value?.get_select_data(true);
        if (xsthData == undefined) return;
        
        v_xsth_xx.value?.showDialog(xsthData);
    }

    /**
     * 修改退货
     */
    const onButtonClick_Upd_xsth = () => {
        let xsthData = v_table_xsth.value?.get_select_data(true);
        if (xsthData == undefined) return;
        
        v_xsth_xx.value?.showDialog(xsthData);
    }

    const addProcessData = async (data: any, tableName: string, idField: string) => {

        v_flow_xsth.value?.clear_list(data[idField]);
        // 添加一个流程
        let processData = await v_flow_xsth.value?.add_process_data(
            "", "新建", "-", 
            eoflow.OP_FLAG_NORMAL,
            tableName, idField, data[idField]);

        if (processData != undefined) {
            data["f_flow_point_id"] = processData["f_flow_point_id"];
            data["f_flow_process_id"] = processData["f_flow_process_id"];
        }
    }

    /**
     * 退货保存事件处理
     */
    const onDialogClose_xsth_xx = async (cancel: boolean, data: any, cb: cfunc_boolean) => {

        if (cancel) { 
            cb(true); return;
        }

        if (!x_edit_xsth.value) {
            cb(true); return;
        }

        if (!data["f_xsdck_id"]) {
            eocore.show_info("请选择销售货物");
            cb(false); return;
        }

        if (!data["f_thyy"]) {
            eocore.show_info("请输入退货原因");
            cb(false); return;
        }

        const isAdd = !eocore.check_id(data, "f_xsth_id");

        x_show_loading.value = true;
        let ret = await eocore.proc("p_xsth_upd", {
            "v_xsth_id": data["f_xsth_id"],
            "v_xsd_id": data["f_xsd_id"],
            "v_xsdck_id": data["f_xsdck_id"],
            "v_kcmx_id": data["f_kcmx_id"],
            "v_fhr": data["f_fhr"],
            "v_fhdh": data["f_fhdh"],
            "v_fhdz": data["f_fhdz"],
            "v_wlgs_id": data["f_wlgs_id"],
            "v_wldh": data["f_wldh"],
            "v_thje": data["f_thje"],
            "v_thyy": data["f_thyy"],
            "v_beizhu": data["f_beizhu"]
        });
        const dataNew = eocore.check_net_object(ret);
        x_show_loading.value = false;
        if (dataNew == undefined) return;

        x_show_loading.value = true;

        if (isAdd) {
            await addProcessData(dataNew, "txsth", "f_xsth_id");
        }

        // 更新表格        
        v_table_xsth.value?.update_data(dataNew, -1, isAdd, true);
        // 更新流程按钮
        updateFlowStatusButton(dataNew);

        x_show_loading.value = false;

        cb(true);
    }

    /**
     * 流程操作：退货作废
     */
    const onButtonClick_Flow_THZF = async () => {
               
        let xsthData = v_table_xsth.value?.get_select_data(true);
        if (xsthData == undefined) return;

        let ret = await eocore.show_confirm("退货记录是否作废？");
        if (!ret) return;

        xsthData["f_yxbz"] = 0;
        // TODO: 更新数据库
        // netLoad_xsth_upd(xsthData);
        console.log("退货作废", xsthData);
    }

    /**
     * 流程操作：退货退回
     */
    const onButtonClick_Flow_THTH = () => {
        
        let xsthData = v_table_xsth.value?.get_select_data(true);
        if (xsthData == undefined) return;

        v_flow_xsth.value?.back_process((cancel: boolean, data: any, cb: cfunc_boolean) => {

            if (cancel) { 
                cb(true); return;
            }

            xsthData["f_flow_point_id"] = data["f_flow_point_id"];
            xsthData["f_flow_point_id_s"] = data["f_flow_point_id_s"];

            // 更新表格流程状态
            v_table_xsth.value?.update_data(xsthData, -1, false, false);
            // 更新按钮状态
            updateFlowStatusButton(xsthData);

            cb(true);
        });
    }

    /**
     * 流程操作：提交退货
     */
    const onButtonClick_Flow_THTJ = () => {

        let xsthData = v_table_xsth.value?.get_select_data(true);
        if (xsthData == undefined) return;
        
        showFlowDialog(xsthData, "待审核");
    }

    /**
     * 流程操作：退货审核
     */
    const onButtonClick_Flow_THSH = () => {
        
        let xsthData = v_table_xsth.value?.get_select_data(true);
        if (xsthData == undefined) return;

        showFlowDialog(xsthData, "待发货");
    }

    /**
     * 流程操作：仓库收货
     */
    const onButtonClick_Flow_THRK = () => {
        
        let xsthData = v_table_xsth.value?.get_select_data(true);
        if (xsthData == undefined) return;

        if (!eocore.check_id(xsthData, "f_wlgs_id")) {
            eocore.show_info("请选择物流公司");
            return;
        }
        if (eocore.check_empty(xsthData["f_wldh"])) {
            eocore.show_info("请输入物流单号");
            return;
        }

        showFlowDialog(xsthData, "待退款");
    }

    /**
     * 流程操作：退款处理
     */
    const onButtonClick_Flow_THTK = () => {
        
        let xsthData = v_table_xsth.value?.get_select_data(true);
        if (xsthData == undefined) return;

        showFlowDialog(xsthData, "已退款");
    }

    /**
     * 流程操作：退货归档
     */
    const onButtonClick_Flow_THGD = () => {
        
        let xsthData = v_table_xsth.value?.get_select_data(true);
        if (xsthData == undefined) return;

        showFlowDialog(xsthData, "完成");
    }

    const processFlow_THRK = async (xsthData: any) => {

         x_show_loading.value = true;
        const ret = await eocore.proc("p_xsdck_ckbz", { 
            "v_xsdck_id": xsthData["f_xsdck_id"],
            "v_ckbz": 2 // 标记为退货
        });
        x_show_loading.value = false;
        eocore.check_net_object(ret)
    }

    /**
     * 显示流程操作对话框
     * @param xsthData 退货数据
     * @param pointName 流程节点名称
     */
    const showFlowDialog = (xsthData: any, pointName: string) => {
        
        v_flow_xsth.value?.add_process(pointName, async (cancel: boolean, data: any, cb: cfunc_boolean) => {

            if (cancel) { 
                cb(true); return;
            }

            xsthData["f_flow_point_id"] = data["f_flow_point_id"];
            xsthData["f_flow_point_id_s"] = data["f_flow_point_id_s"];

            // 更新表格流程状态
            v_table_xsth.value?.update_data(xsthData, -1, false, false);
            // 更新流程按钮
            updateFlowStatusButton(xsthData);

            if (pointName == "待退款") {
                await processFlow_THRK(xsthData);
            }

            cb(true);
        });
    }
</script>

<style lang="scss" scoped>
</style>
