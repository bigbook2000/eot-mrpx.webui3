<template>
    <!-- 销售订单管理 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <!-- 查询工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w200p">
                        <div class="label_n">订单号</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_xsdh" placeholder="请输入订单号"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_n">客户</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_khmc" placeholder="请输入客户名称"></el-input>
                        </div>
                    </div>
                    <div class="cell" style="width:320px;">
                        <div class="label_n">创建日期</div>
                        <div class="input">
                            <el-date-picker style="width:100%"
                                v-model="x_query_cjrq"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="YYYY-MM-XS">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_xsd">查找</el-button>
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
                                            @click="onButtonClick_Add_xsd">新建订单</vbuttonk>
                                        <vbuttonk type="primary" class="input_w" permit="" 
                                            v-show="x_edit_xsd"
                                            @click="onButtonClick_Upd_xsd">修改订单</vbuttonk>
                                        <vbuttonk type="default" class="input_w" permit="" 
                                            v-show="!x_edit_xsd"
                                            @click="onButtonClick_Get_xsd">订单详情</vbuttonk>
                                        <div class="split"></div>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['作废']"
                                            @click="onButtonClick_Flow_XSZF">订单作废</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['退回']"
                                            @click="onButtonClick_Flow_XSTH">订单退回</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['提交']"
                                            @click="onButtonClick_Flow_XSTJ">提交订单</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['审核']"
                                            @click="onButtonClick_Flow_XSSH">订单审核</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['核准']"
                                            @click="onButtonClick_Flow_XSHZ">财务核对</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['生产']"
                                            @click="onButtonClick_Flow_XSSC">生产备货</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['发货']"
                                            @click="onButtonClick_Flow_XSCK">产品发货</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['确认']"
                                            @click="onButtonClick_Flow_XSQR">收货确认</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['归档']"
                                            @click="onButtonClick_Flow_XSGD">订单归档</vbuttonk>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 销售订单表格 -->
                            <div class="eo_col_f">
                                <vtable ref="v_table_xsd" 
                                    name="销售订单"
                                    id-field="f_xsd_id"
                                    @loading="onTableLoading"
                                    :on-item="onTableItem_xsd"
                                    :on-page="onTablePage_xsd"
                                    @row-click="onTableRowClick_xsd">
                                    <el-table-column prop="f_yxbz_s" label="状态" width="60" />
                                    <el-table-column prop="f_flow_point_id_s" label="流程" width="80" />
                                    <el-table-column prop="f_xsdh" label="订单号" width="160" />
                                    <el-table-column prop="f_xsy_id_s" label="销售员" width="120" />
                                    <el-table-column prop="f_cjsj_s" label="创建时间" width="140" />
                                    <el-table-column prop="f_khgl_id_s" label="客户" width="280" show-overflow-tooltip />
                                    <el-table-column prop="f_fklb_s" label="付款类别" width="120" />
                                    <el-table-column prop="f_xsje_s" label="总金额" width="120" align="right" />
                                    <el-table-column prop="f_ssje_s" label="实收金额" width="120" align="right" />                                    
                                    <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                                    <el-table-column />
                                </vtable>
                            </div>
                            
                            <!-- 分页 -->
                            <div class="eo_page_bar">
                                <el-pagination
                                    background
                                    @current-change="onPageChange_xsd"
                                    :current-page="x_page_index"
                                    :page-size="x_page_row_count"
                                    layout="total, prev, pager, next, jumper"
                                    :total="x_row_total">
                                </el-pagination>
                            </div>
                            <div class="eo_col_sp"></div>
                            <div class="eo_col_d" style="height:400px;">
                                <div class="eo_row">
                                    <div class="eo_row_d" style="width:40%;"> 
                                        <xsdcp ref="v_xsdcp" style="height:100%;"
                                            @row-click="onTableRowClick_xsdcp" />
                                    </div>
                                    <div class="eo_row_sp"></div>
                                    <div class="eo_row_f"> 
                                        <xsdck ref="v_xsdck" style="height:100%;"></xsdck>
                                    </div>
                                </div>                            
                            </div>
                        </div>
                    </div>
                    <div class="eo_row_sp"></div>
                    <div class="eo_row_d">
                        <vflow ref="v_flow_xsd" type="销售订单"></vflow>
                    </div>
                </div>
            </div>
        </div>
        <!-- 销售订单编辑对话框 -->
        <xsd_xx ref="v_xsd_xx" @close="onDialogClose_xsd_xx"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_xsgl_ddgl" }
</script>

<script lang="ts" setup>
    import { ref, nextTick, onMounted } from "vue"
    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import vbuttonk from "@/logic/common/vbuttonk.vue"
    import vtable from "@/logic/common/vtable.vue"
    import vdic from "@/logic/common/vdic.vue"
    import vflow from "@/logic/common/vflow.vue"

    import eodic from "@/inc/eodic";
    import eoflow from "@/inc/eoflow";

    import xsd_xx from "./xsd_xx.vue"
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import xsdcp from "@/views/frame/ext/xsgl/xsdcp.vue"
    import xsdck from "@/views/frame/ext/xsgl/xsdck.vue"

    const v_xsdcp = ref<InstanceType<typeof xsdcp>>();
    const v_xsdck = ref<InstanceType<typeof xsdck>>();

    type t_table = InstanceType<typeof vtable>;
    const v_table_xsd = ref<t_table>();

    type t_flow = InstanceType<typeof vflow>;
    const v_flow_xsd = ref<t_flow>();
    
    type t_xsd_xx = InstanceType<typeof xsd_xx>;
    const v_xsd_xx = ref<t_xsd_xx>();

    // 按钮状态
    const x_flow_status_button = ref({
        "新建": false,
        "作废": false,
        "退回": false,
        "提交": false,
        "审核": false,
        "核准": false,
        "生产": false,
        "发货": false,
        "确认": false,
        "归档": false,
    });

    const x_edit_xsd = ref(false);
    // 查询条件
    const x_query_xsdh = ref("");
    const x_query_khmc = ref("");
    const x_query_cjrq = ref<[string, string] | null>(null);

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    onMounted(async () => {

        const point = v_flow_xsd.value?.get_point_by_name("新建");
        if (point != undefined) {
            x_flow_status_button.value["新建"] = TLogic.checkRoleString(point.role);
        }

        // 初始化加载数据
        netLoad_xsd_query(-1);        
    });

    const updateFlowStatusButton = (ddData: any) => { 

        let flowPointId = 0;
        let yxbz = 0;
        if (ddData != undefined) {
            flowPointId = ddData["f_flow_point_id"];
            yxbz = ddData["f_yxbz"];
        }

        const statusButton = x_flow_status_button.value;
        statusButton["作废"] = false;
        statusButton["退回"] = false;
        statusButton["提交"] = false;
        statusButton["审核"] = false;
        statusButton["核准"] = false;
        statusButton["生产"] = false;
        statusButton["发货"] = false;
        statusButton["归档"] = false;
        x_flow_status_button.value = statusButton;

        v_xsdcp.value?.setEditFields(0, []);

        if (flowPointId <= 0) return;
        if (yxbz == 0) return;
        
        let point = v_flow_xsd.value?.get_point_by_id(flowPointId);
        if (point == undefined) return;

        // 检查权限
        const role = TGlobal.userData["f_role"];
        const pointRole = point.role;
        if (!eolib.list_any_list(role, pointRole)) return;

        const pointName = point.name;

        // 需要作废权限
        //statusButton["XSZF"] = ret.first;

        // 核准之后无法退回
        let isXSTH = v_flow_xsd.value?.check_point_order(point.flow_point_id, "已审核") || false;
        statusButton["退回"] = !isXSTH;

        statusButton["提交"] = pointName == "新建";
        statusButton["审核"] = pointName == "待审核";
        statusButton["核准"] = pointName == "已审核";
        statusButton["生产"] = pointName == "已核准";
        statusButton["发货"] = pointName == "已生产";
        statusButton["确认"] = pointName == "已发货";
        statusButton["归档"] = pointName == "已收货";

        x_edit_xsd.value = false;

        let editMode1 = 0;
        let editMode2 = 0;
        let fields1: string[] = [];
        let fields2: string[] = [];

        switch (pointName) { 
            case "新建":
                editMode1 = 1;
                fields1 = ["*"];
                x_edit_xsd.value = true;
                statusButton["退回"] = false;
                break;
            case "待审核":
            case "已审核":
                editMode1 = 2;
                fields1 = ["*"];
                break;
            case "已核准":
                editMode2 = 1;
                fields2 = ["*"];
                break;
            case "已生产":
                editMode2 = 2;
                fields2 = ["f_wlgs_id","f_wldh"];
                break;
            case "已发货":
                break;
        }

        v_xsdcp.value?.setEditFields(editMode1, fields1);
        v_xsdck.value?.setEditFields(editMode2, fields2);
    };

    /**
     * 查询销售订单数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_xsd_query = (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        // 处理日期范围
        let startDate = "";
        let endDate = "";
        if (x_query_cjrq.value) {
            startDate = x_query_cjrq.value[0];
            endDate = x_query_cjrq.value[1];
        }

        v_table_xsd.value?.load_list_proc("p_xsd_query", { 
            "v_xsdh": x_query_xsdh.value,
            "v_xsy_id": -1,
            "v_khmc": x_query_khmc.value,
            "v_yxbz": -1,
            "v_sfje1": -0.01,
            "v_sfje2": -0.01,
            "v_cjsj1": "",
            "v_cjsj2": "",
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });

        v_xsdcp.value?.loadList(
            0, "", false);

        v_flow_xsd.value?.load_List(0);
        
        updateFlowStatusButton(undefined);
    }

    const netLoad_xsd_upd = async (data: any): Promise<any> => { 

        const ret = await eocore.proc(
            "p_xsd_upd", {
                "v_xsd_id": data["f_xsd_id"],
                "v_xsy_id": data["f_xsy_id"],
                "v_xsdh": data["f_xsdh"],
                "v_khgl_id": data["f_khgl_id"],
                "v_xsjh_id": data["f_xsjh_id"],
                "v_lxr": data["f_lxr"],
                "v_lxdh": data["f_lxdh"],
                "v_lxdz": data["f_lxdz"],
                "v_fklb": data["f_fklb"],
                "v_xsje": data["f_xsje"],
                "v_ssje": data["f_ssje"],
                "v_fhy_id": data["f_fhy_id"],
                "v_fhsj": data["f_fhsj"],
                "v_yxbz": data["f_yxbz"],
                "v_beizhu": data["f_beizhu"]
            });
        return eocore.check_net_object(ret);
    }

    /**
     * 统计销售订单数据
     */
    const netLoad_xsd_count = async (xsdData: any): Promise<any> => {
        
        // 统计订单明细
        let ret = await eocore.proc("p_xsdcp_count", {
            "v_xsd_id": xsdData["f_xsd_id"]
        });
        let data = eocore.check_net_object(ret);
        if (data == undefined) return undefined;

        if (eocore.to_int(data["f_count"]) <= 0) {
            eocore.show_info("没有订单明细");
            return undefined;
        }

        xsdData["f_xsje"] = eocore.to_float(data["f_xszj"]);

        // 暂时无须保存到数据库
        return await netLoad_xsd_upd(xsdData);
    }

    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_xsd = (data: any) => {

        // 有效标志显示
        data["f_yxbz_s"] = "";
        if (data["f_yxbz"] == 0) data["f_yxbz_s"] = "作废";
        
        // 付款类别显示
        data["f_fklb_s"] = eodic.get_dic_label("付款类别", data["f_fklb"]);
        
        // 日期格式化
        data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"]);

        // 金额格式化
        data["f_xsje_s"] = eolib.fixed_num(data["f_xsje"], 2);
        data["f_ssje_s"] = eolib.fixed_num(data["f_ssje"], 2);

        // 用户转换
        TLogic.updateDicUserData(data, ["f_xsy_id"]);

        // 流程
        data["f_flow_point_id_s"] = v_flow_xsd.value?.get_point_name_by_id(data["f_flow_point_id"]);
    }

    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_xsd = (n: number): number => {
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
    const onTableRowClick_xsd = async (data: any) => {

        x_show_loading.value = true;

        await v_xsdcp.value?.loadList(data["f_xsd_id"], data["f_xsdh"], true);                
        await v_xsdck.value?.loadList(data, undefined);
        await v_flow_xsd.value?.load_List(data["f_xsd_id"]);

        updateFlowStatusButton(data);

        x_show_loading.value = false;
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_xsd = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_xsd_query(pageIndex - 1);
    }

    const onTableRowClick_xsdcp = async (data: any) => {

        const xsdData = v_table_xsd.value?.get_select_data(true);
        if (xsdData == undefined) return;

        x_show_loading.value = true;        
        await v_xsdck.value?.loadList(xsdData, data);
        x_show_loading.value = false;
    }
    
    /**
     * 查找按钮点击
     */
    const onButtonClick_Load_xsd = () => {
        netLoad_xsd_query(-1);
    }

    const onButtonClick_Get_xsd = () => { 

        let ddData = v_table_xsd.value?.get_select_data(true);
        if (ddData == undefined) return;
        
        v_xsd_xx.value?.showDialog(ddData, false);
    }

    /**
     * 添加订单
     */
    const onButtonClick_Add_xsd = async () => {
        
        let ddData = {
            "f_xsd_id": 0,
            "f_xsdh": "",          // 销售订单号
            "f_khgl_id": 0,         // 客户ID
            "f_khgl_id_s": "",      // 客户名称
            "f_xsjh_id": 0, // 销售计划ID
            "f_xsy_id": TGlobal.userData['f_user_id'], // 销售员ID
            "f_xsy_id_s": TGlobal.userData['f_name'], // 销售员姓名
            "f_lxr": "", // 联系人
            "f_lxdh": "", // 联系电话
            "f_fklb": 1, // 付款类别
            "f_xsje": 0.0, // 销售金额
            "f_ssje": 0.0, // 实收金额
            "f_cjsj": "", // 创建时间
            "f_fhsj": "", // 发货时间
            "f_fhy_id": 0, // 发货员ID
            "f_fhy_id_s": "", // 发货员
            "f_yxbz": 1, // 有效标志
            "f_flow_point_id": 0,
            "f_flow_process_id": 0,
            "f_beizhu": "" // 备注
        };
        
        v_xsd_xx.value?.showDialog(ddData);
    }

    /**
     * 删除订单
     */
    const onButtonClick_Del_xsd = async () => {
        await v_table_xsd.value?.remove_data_proc_select("p_xsd_del", async (data: any) => {
            return {
                "v_xsd_id": data["f_xsd_id"],
                "v_cklb": "销售订单"
            };
        });
    }

    /**
     * 修改订单
     */
    const onButtonClick_Upd_xsd = () => {
        let ddData = v_table_xsd.value?.get_select_data(true);
        if (ddData == undefined) return;
        
        v_xsd_xx.value?.showDialog(ddData);
    }

    /**
     * 订单保存事件处理
     */
    const onDialogClose_xsd_xx = async (cancel: boolean, data: any, cb: cfunc_boolean) => {

        if (cancel) { 
            cb(true); return;
        }

        if (!eocore.check_id(data, "f_khgl_id")) {
            eocore.show_info("请选择客户");
            cb(false); return;
        }

        console.log("onDialogClose_xsd_xx", data);

        const isAdd = !eocore.check_id(data, "f_xsd_id");

        let xsdh = data["f_xsdh"];
        if (isAdd) {

            xsdh = await TLogic.netLoad_RecordString("销售出库单号", "XS", "yyMMdd", 6);
            data["f_xsdh"] = xsdh;

        } else {
            
            if (v_flow_xsd.value?.check_point_order(data["f_flow_point_id"], "新建")) {
                eocore.show_info("订单已提交，无法修改");
                return;
            }
        }

        if (eocore.check_empty(xsdh)) {
            eocore.show_info("错误的订单号");
            cb(false); return;
        }

        // 创建单号
        data["f_xsdh"] = xsdh;

        // 回写数据库
        x_show_loading.value = true;
        const dataNew = await netLoad_xsd_upd(data);
        x_show_loading.value = false;
        if (dataNew == undefined) return;

        x_show_loading.value = true;
        if (isAdd) {

            v_flow_xsd.value?.clear_list(dataNew["f_xsd_id"]);
            // 添加一个流程
            let processData = await v_flow_xsd.value?.add_process_data(
                "", "新建", "-", 
                eoflow.OP_FLAG_NORMAL,
                "txsd", "f_xsd_id", dataNew["f_xsd_id"]);

            if (processData != undefined) {
                dataNew["f_flow_point_id"] = processData["f_flow_point_id"];
                dataNew["f_flow_process_id"] = processData["f_flow_process_id"];
            }

            // 刷新明细
            await v_xsdcp.value?.loadList(dataNew["f_xsd_id"], dataNew["f_xsdh"],false);
            await v_xsdck.value?.loadList(dataNew, undefined);
        }

        // 更新表格        
        v_table_xsd.value?.update_data(dataNew, -1, isAdd, true);
        // 更新流程按钮
        updateFlowStatusButton(dataNew);

        x_show_loading.value = false;

        cb(true);
    }

    /**
     * 流程操作：订单作废
     */
    const onButtonClick_Flow_XSZF = async () => {
               
        let ddData = v_table_xsd.value?.get_select_data(true);
        if (ddData == undefined) return;

        let ret = await eocore.show_confirm("订单 " + ddData["f_xsdh"] + " 是否作废？");
        if (!ret) return;

        ddData["f_yxbz"] = 0;
        netLoad_xsd_upd(ddData);
    }

    /**
     * 流程操作：订单退回
     */
    const onButtonClick_Flow_XSTH = () => {
        
        let ddData = v_table_xsd.value?.get_select_data(true);
        if (ddData == undefined) return;

        v_flow_xsd.value?.back_process((cancel: boolean, data: any, cb: cfunc_boolean) => {

            if (cancel) { 
                cb(true); return;
            }

            ddData["f_flow_point_id"] = data["f_flow_point_id"];
            ddData["f_flow_point_id_s"] = data["f_flow_point_id_s"];

            // 更新表格流程状态
            v_table_xsd.value?.update_data(ddData, -1, false, false);
            // 更新按钮状态
            updateFlowStatusButton(ddData);

            cb(true);
        });
    }

    /**
     * 流程操作：提交订单
     */
    const onButtonClick_Flow_XSTJ = async () => {

        let xsdData = v_table_xsd.value?.get_select_data(true);
        if (xsdData == undefined) return;

        let dataNew = await netLoad_xsd_count(xsdData);
        if (dataNew == undefined) return;
        
        showFlowDialog(dataNew, "待审核");
    }

    /**
     * 流程操作：订单审核
     */
    const onButtonClick_Flow_XSSH = () => {
        
        let ddData = v_table_xsd.value?.get_select_data(true);
        if (ddData == undefined) return;

        showFlowDialog(ddData, "已审核");
    }

    /**
     * 流程操作：财务核对
     */
    const onButtonClick_Flow_XSHZ = () => {
        
        let ddData = v_table_xsd.value?.get_select_data(true);
        if (ddData == undefined) return;

        showFlowDialog(ddData, "已核准");
    }

    /**
     * 流程操作：安排生产
     */
    const onButtonClick_Flow_XSSC = () => {
        
        let ddData = v_table_xsd.value?.get_select_data(true);
        if (ddData == undefined) return;

        // 核对货物是否齐备
        const list1 = v_xsdcp.value?.getList() || [];
        if (eocore.check_empty(list1)) {
            eocore.show_info("无销售产品清单");
            return;
        }
        
        const list2 = v_xsdck.value?.getList() || [];
        if (eocore.check_empty(list2)) {
            eocore.show_info("无库存货物");
            return;
        }


        let pcount;
        for (let d1 of list1) {

            pcount = 0;
            for (let d2 of list2) {
                if (d1["f_cpdy_id"] == d2["f_cpdy_id"]) {
                    pcount += d2["f_kcsl"];
                }
            }
            if (pcount != d1["f_xssl"]) {
                eocore.show_info("货物 " + d1["f_cpmc"] + " 数量不匹配");
                return;
            }
        }

        showFlowDialog(ddData, "已生产");
    }

    /**
     * 流程操作：产品出库
     */
    const onButtonClick_Flow_XSCK = () => {
       
        let ddData = v_table_xsd.value?.get_select_data(true);
        if (ddData == undefined) return;

        // 检查是否标记出库
        const list = v_xsdck.value?.getList() || [];
        if (eocore.check_empty(list)) {
            eocore.show_info("无库存货物");
            return;
        }

        for (let d of list) {
            if (!eocore.check_id(d, "f_wlgs_id")) {
                eocore.show_info("物流公司填写不完整");
                return;
            }
            if (eocore.check_empty(d["f_wldh"])) {
                eocore.show_info("物流单号填写不完整");
                return;
            }
        }

        showFlowDialog(ddData, "已发货");
    }

    const onButtonClick_Flow_XSQR = () => {
        
        let ddData = v_table_xsd.value?.get_select_data(true);
        if (ddData == undefined) return;

        showFlowDialog(ddData, "已收货");
    }

    /**
     * 流程操作：订单归档
     */
    const onButtonClick_Flow_XSGD = () => {
        
        let ddData = v_table_xsd.value?.get_select_data(true);
        if (ddData == undefined) return;

        showFlowDialog(ddData, "完成");
    }

    /**
     * 将货物出库
     * @param xsdData 订单数据
     */
    const processFlow_XSCK = async (xsdData: any) => {

        x_show_loading.value = true;
        const ret = await eocore.proc("p_xsdck_list", { 
            "v_xsd_id": xsdData["f_xsd_id"],
            "v_xsdcp_id": 0
        });
        x_show_loading.value = false;
        const list = eocore.check_net_array(ret);
        if (list == undefined) return;

        // 出库
        for (let d of list) {
            const ret = await eocore.proc("p_kcmx_ck", { 
                "v_kcmx_id": d["f_kcmx_id"],
                "v_cpdy_id": d["f_cpdy_id"],
                "v_cklb": "销售订单",
                "v_ckid": d["f_xsdcp_id"],
                "v_kgy_id": TGlobal.userData["f_user_id"],                
            });
            const dataNew = eocore.check_net_object(ret);
            if (dataNew == undefined) return;
        }
    }

    /**
     * 显示流程操作对话框
     * @param xsdData 订单数据
     * @param pointName 流程节点名称
     */
    const showFlowDialog = (xsdData: any, pointName: string) => {
        
        v_flow_xsd.value?.add_process(pointName, async (cancel: boolean, data: any, cb: cfunc_boolean) => {

            if (cancel) { 
                cb(true); return;
            }

            xsdData["f_flow_point_id"] = data["f_flow_point_id"];
            xsdData["f_flow_point_id_s"] = data["f_flow_point_id_s"];

            // 更新表格流程状态
            v_table_xsd.value?.update_data(xsdData, -1, false, false);
            // 更新流程按钮
            updateFlowStatusButton(xsdData);

            if (pointName == "已发货") {
                await processFlow_XSCK(xsdData);
            }

            cb(true);
        });
    }
    
</script>

<style lang="scss" scoped>
</style>