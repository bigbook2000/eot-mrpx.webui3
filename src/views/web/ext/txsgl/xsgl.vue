<template>
    <!-- 销售订单管理 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <!-- 查询工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w240p">
                        <div class="label_n">订单号</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_xsdh" placeholder="请输入订单号"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w240p">
                        <div class="label_n">销售员</div>
                        <div class="input">
                            <user_input v-model="x_query_xsy_id" 
                                :userName="x_query_xsy_id_s" 
                                :disabled="!x_query_xsy"
                                style="width:100%"></user_input>
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
                </div>
                <div class="eo_form">
                    <div class="cell eo_w240p">
                        <div class="label_n">客户</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_khmc" placeholder="请输入客户名称"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w240p">
                        <div class="label_n">流程</div>
                        <div class="input">
                            <el-select v-model="x_query_flow_point_id" style="width:100%">
                                <el-option v-for="d in x_flow_point_list" :key="d.value"
                                    :label="d.label" :value="d.value" />
                            </el-select>
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
                        <vflow ref="v_flow_xsd" type="销售出库" :app="false"></vflow>
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
    import { ref, computed, nextTick, onMounted } from "vue"
    import type { cform_options, cfunc_boolean, cfunc_data } from "@/inc/eotypes";
    import { type cflow_type, type cflow_point } from "@/inc/eoflow";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import vbuttonk from "@/components/vbuttonk.vue"
    import vtable from "@/components/web/vtable.vue"
    import vdic from "@/components/vdic.vue"
    import vflow from "@/components/web/vflow.vue"

    import eodic from "@/inc/eodic";
    import eoflow from "@/inc/eoflow";

    import xsd_xx from "./xsd_xx.vue"
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import user_input from "@/views/platform/user_input.vue"
    import tflow_button from "@/views/comm/web/tflow_button.vue";
    

    import xsdcp from "@/views/web/ext/txsgl/xsdcp.vue"
    import xsdck from "@/views/web/ext/txsgl/xsdck.vue"

    const v_xsdcp = ref<InstanceType<typeof xsdcp>>();
    const v_xsdck = ref<InstanceType<typeof xsdck>>();

    type t_table = InstanceType<typeof vtable>;
    const v_table_xsd = ref<t_table>();

    type t_flow = InstanceType<typeof vflow>;
    const v_flow_xsd = ref<t_flow>();
    
    type t_xsd_xx = InstanceType<typeof xsd_xx>;
    const v_xsd_xx = ref<t_xsd_xx>();

    const v_flow_button = ref<InstanceType<typeof tflow_button>>();

    // 查询条件
    const x_query_xsy_id = ref(99999999);
    const x_query_xsy_id_s = ref("");
    const x_query_xsy = ref(false);
    const x_query_xsdh = ref("");
    const x_query_khmc = ref("");
    const x_query_cjrq = ref<[string, string] | null>(null);
    const x_query_flow_point_id = ref(-1);

    const x_flow_point_list = computed(() => {
        const flowType = eoflow.get_type_by_name("销售出库");
        const list: { label: string; value: number }[] = [{ label: "全部", value: -1 }];
        if (flowType) {
            for (let d of flowType.points) {
                list.push({ label: d.name, value: d.flow_point_id });
            }
        }
        return list;
    });


    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    onMounted(async () => {

        x_query_xsy.value = TLogic.checkPermit("_xsgl.xsd.ckqb");
        if (x_query_xsy.value) {
            x_query_xsy_id.value = -1;
            x_query_xsy_id_s.value = "";
        } else {
            x_query_xsy_id.value = TGlobal.userData["f_user_id"];
            x_query_xsy_id_s.value = TGlobal.userData["f_name"];
        }        

        v_flow_button.value?.init_flow(v_flow_xsd.value);
        // 初始化加载数据
        netLoad_xsd_query(-1);        
    });

    const updateFlowStatus = (xsdData: any) => { 
        
        v_xsdcp.value?.setEditFields(0, []);
        v_xsdck.value?.setEditFields(0, []);

        if (xsdData == undefined) return;
        let yxbz = xsdData["f_yxbz"];
        if (yxbz == 0) return;

        const flowStatus = v_flow_button.value?.update_flow_status(xsdData);
        if (!flowStatus) return;

        // 核准之后无法退回
        v_flow_button.value?.set_flow_back("已核准");

        // 只允许编辑自己
        if (xsdData["f_xsy_id"] == TGlobal.userData["f_user_id"]) {
            v_flow_button.value?.set_flow_edit(["新建"]);
        }
        const pointName = v_flow_button.value?.get_point_name();
        
        let editMode1 = 0;
        let editMode2 = 0;
        let fields1: string[] = [];
        let fields2: string[] = [];

        switch (pointName) { 
            case "新建":
                editMode1 = 1;
                fields1 = ["*"];
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

    const onButtonClick_Flow = (point: cflow_point, data0: any) => {

        const pointName = point?.name;
        if (pointName == undefined) return;

        let xsdData = v_table_xsd.value?.get_select_data(true);
        if (xsdData == undefined) return;

        switch (pointName) {
            case "新建":
                onButtonClick_Flow_XSTJ(point, xsdData);
                break;
            case "待审核":
                v_flow_button.value?.show_flow_dialog(xsdData, (data1: any) => {
                    updateFlowStatus(data1);
                });
                break;
            case "已审核":
                v_flow_button.value?.show_flow_dialog(xsdData, (data1: any) => {
                    updateFlowStatus(data1);
                });
                break;
            case "已核准":
                onButtonClick_Flow_XSSC(xsdData);
                break;
            case "已生产":
                onButtonClick_Flow_XSCK(xsdData);
                break;
            case "已发货":
                v_flow_button.value?.show_flow_dialog(xsdData, (data1: any) => {
                    updateFlowStatus(data1);
                });
                break;
            case "已收货":
                v_flow_button.value?.show_flow_dialog(xsdData, (data1: any) => {
                    updateFlowStatus(data1);
                });
                break;
            case "完成":
                break;
        }
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
            "v_xsy_id": x_query_xsy_id.value,
            "v_khmc": x_query_khmc.value,
            "v_yxbz": -1,
            "v_sfje1": -0.01,
            "v_sfje2": -0.01,
            "v_cjsj1": "",
            "v_cjsj2": "",
            "v_flow_point_id": x_query_flow_point_id.value,
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });

        // 重置附带信息
        v_xsdcp.value?.loadList(0, "", false);
        v_xsdck.value?.loadList(undefined, undefined);
        v_flow_xsd.value?.load_List(0);
        
        updateFlowStatus(undefined);
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
        data["f_xsje_s"] = eolib.fixed_num(data["f_xsje"], 3);
        data["f_ssje_s"] = eolib.fixed_num(data["f_ssje"], 3);

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

        updateFlowStatus(data);

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

    const onButtonClick_Flow_Get = () => { 

        let xsdData = v_table_xsd.value?.get_select_data(true);
        if (xsdData == undefined) return;
        
        v_xsd_xx.value?.showDialog(xsdData, false);
    }

    /**
     * 添加订单
     */
    const onButtonClick_Flow_Add = async (point: cflow_point, data0: any) => {
        
        let xsdData = {
            "f_xsd_id": 0,
            "f_xsdh": "",          // 销售订单号
            "f_khgl_id": 0,         // 客户ID
            "f_khgl_id_s": "",      // 客户名称
            "f_xsjh_id": 0, // 销售计划ID
            "f_xsy_id": TGlobal.userData['f_user_id'], // 销售员ID
            "f_xsy_id_s": TGlobal.userData['f_name'], // 销售员姓名
            "f_lxr": "", // 联系人
            "f_lxfs": "", // 联系电话
            "f_lxdz": "", // 联系地址
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
        
        v_xsd_xx.value?.showDialog(xsdData);
    }

    /**
     * 修改订单
     */
    const onButtonClick_Flow_Upd = (point: cflow_point, data0: any) => {
        let xsdData = v_table_xsd.value?.get_select_data(true);
        if (xsdData == undefined) return;
        
        v_xsd_xx.value?.showDialog(xsdData);
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
            let processData = await v_flow_xsd.value?.process_add_data(dataNew["f_xsd_id"], "-");

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
        updateFlowStatus(dataNew);

        x_show_loading.value = false;

        cb(true);
    }

    /**
     * 流程操作：订单作废
     */
    const onButtonClick_Flow_Cancel = async (point: cflow_point, data0: any) => {
               
        let xsdData = v_table_xsd.value?.get_select_data(true);
        if (xsdData == undefined) return;

        let ret = await eocore.show_confirm("订单 " + xsdData["f_xsdh"] + " 是否作废？");
        if (!ret) return;

        xsdData["f_yxbz"] = 0;
        netLoad_xsd_upd(xsdData);
    }

    /**
     * 流程操作：订单退回
     */
    const onButtonClick_Flow_Back = (point: cflow_point, data0: any) => {
        
        let xsdData = v_table_xsd.value?.get_select_data(true);
        if (xsdData == undefined) return;

        v_flow_xsd.value?.process_back_dialog((cancel: boolean, data: any, cb: cfunc_boolean) => {

            if (cancel) { 
                cb(true); return;
            }

            xsdData["f_flow_point_id"] = data["f_flow_point_id"];
            xsdData["f_flow_point_id_s"] = data["f_flow_point_id_s"];

            // 更新表格流程状态
            v_table_xsd.value?.update_data(xsdData, -1, false, false);
            // 更新按钮状态
            updateFlowStatus(xsdData);

            cb(true);
        });
    }

    /**
     * 流程操作：提交订单
     */
    const onButtonClick_Flow_XSTJ = async (point: cflow_point, data0: any) => {
        let dataNew = await netLoad_xsd_count(data0);
        if (dataNew == undefined) return;
        
        // 更新表格        
        const dataRow = v_table_xsd.value?.update_data(dataNew, -1, false, true);
        if (dataRow == undefined) return;

        v_flow_button.value?.show_flow_dialog(dataRow, async (data1: any) => {
            updateFlowStatus(data1);
        });
    }

    /**
     * 流程操作：安排生产
     */
    const onButtonClick_Flow_XSSC = async (data0: any) => {

        // 核对货物是否齐备
        x_show_loading.value = true;
        let ret = await eocore.proc("p_xsdcp_list", { 
            "v_xsd_id": data0["f_xsd_id"],
        });
        x_show_loading.value = false;
        const list1 = eocore.check_net_array(ret) || [];
        if (eocore.check_empty(list1)) {
            eocore.show_info("无销售产品清单");
            return;
        }
        
        x_show_loading.value = true;
        ret = await eocore.proc("p_xsdck_list", { 
            "v_xsd_id": data0["f_xsd_id"],
            "v_xsdcp_id": -1
        });
        x_show_loading.value = false;
        const list2 = eocore.check_net_array(ret) || [];
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

        v_flow_button.value?.show_flow_dialog(data0, async (data1: any) => {
            updateFlowStatus(data1);
        });
    }

    /**
     * 流程操作：产品出库
     */
    const onButtonClick_Flow_XSCK = async (data0: any) => {
       
        // 检查是否标记出库
        x_show_loading.value = true;
        const ret = await eocore.proc("p_xsdck_list", { 
            "v_xsd_id": data0["f_xsd_id"],
            "v_xsdcp_id": -1
        });
        x_show_loading.value = false;
        const list = eocore.check_net_array(ret) || [];
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

        v_flow_button.value?.show_flow_dialog(data0, async (data1: any) => {
            updateFlowStatus(data1);
            await processFlow_XSCK(data1);
        });
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
            const dataNew = await TLogic.netLoad_kcmx_upd(
                d["f_kcmx_id"],
                0, // 关联
                d["f_cpdy_id"],
                d["f_kcbh"],
                "销售出库",
                d["f_xsd_id"],
                d["f_hwck"],
                d["f_kcdj"],
                d["f_kcsl"],
                TGlobal.userData["f_user_id"],
                d["f_beizhu"],
                TLogic.kcbzCodes["历史"]
            );
            if (dataNew == undefined) return;
        }
    }
    
</script>

<style lang="scss" scoped>
</style>