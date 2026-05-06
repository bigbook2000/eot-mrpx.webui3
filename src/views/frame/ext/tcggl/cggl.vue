<template>
    <!-- 采购入库管理 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <!-- 查询工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w200p">
                        <div class="label_n">入库单号</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_cgdh" placeholder="请输入入库单号"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_n">供应商</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_gysmc" placeholder="请输入供应商名称"></el-input>
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
                                value-format="YYYY-MM-DD">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_cgd">查找</el-button>
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
                                        <tflow_button ref="v_flow_button" 
                                            @on-new="onButtonClick_Flow_Add"
                                            @on-back="onButtonClick_Flow_Back"
                                            @on-edit="onButtonClick_Flow_Upd"
                                            @on-get="onButtonClick_Flow_Get"
                                            @on-cancel="onButtonClick_Flow_Cancel"
                                            @on-flow="onButtonClick_Flow" />                                        
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 采购入库表格 -->
                            <div class="eo_col_f">
                                <vtable ref="v_table_cgd" 
                                    name="采购入库"
                                    id-field="f_cgd_id"
                                    @loading="onTableLoading"
                                    :on-item="onTableItem_cgd"
                                    :on-page="onTablePage_cgd"
                                    @row-click="onTableRowClick_cgd">
                                    <el-table-column prop="f_yxbz_s" label="状态" width="60" />
                                    <el-table-column prop="f_flow_point_id_s" label="流程" width="80" />
                                    <el-table-column prop="f_cgdh" label="入库单号" width="160" />
                                    <el-table-column prop="f_cjsj_s" label="创建时间" width="140" />
                                    <el-table-column prop="f_gys_id_s" label="供应商" width="280" show-overflow-tooltip />
                                    <el-table-column prop="f_fklb_s" label="付款类别" width="120" />
                                    <el-table-column prop="f_zje_s" label="总金额" width="120" align="right" />
                                    <el-table-column prop="f_sfje_s" label="实付金额" width="120" align="right" />
                                    <el-table-column prop="f_cgy_id_s" label="采购员" width="120" />
                                    <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                                    <el-table-column />
                                </vtable>
                            </div>
                            
                            <!-- 分页 -->
                            <div class="eo_page_bar">
                                <el-pagination
                                    background
                                    @current-change="onPageChange_cgd"
                                    :current-page="x_page_index"
                                    :page-size="x_page_row_count"
                                    layout="total, prev, pager, next, jumper"
                                    :total="x_row_total">
                                </el-pagination>
                            </div>

                            <div class="eo_col_sp"></div>

                            <div class="eo_col_d" style="height:400px;">
                                <div class="eo_row">
                                    <div class="eo_row_d" style="width:60%;"> 
                                        <cgdcp ref="v_cgdcp" style="height:100%;"
                                            @row-click="onTableRowClick_cgdcp"></cgdcp>
                                    </div>
                                    <div class="eo_row_sp"></div>
                                    <div class="eo_row_f"> 
                                        <cdgrk ref="v_cdgrk" style="height:100%;"></cdgrk>
                                    </div>
                                </div>                            
                            </div>
                        </div>
                    </div>
                    <div class="eo_row_sp"></div>
                    <div class="eo_row_d">
                        <vflow ref="v_flow_cgd" type="采购入库"></vflow>
                    </div>
                </div>
            </div>
        </div>
        <!-- 采购入库编辑对话框 -->
        <cgd_xx ref="v_cgd_xx" @close="onDialogClose_cgd_xx"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_cggl_cggl" }
</script>

<script lang="ts" setup>
    import { ref, nextTick, onMounted } from "vue"
    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";
    import { type cflow_type, type cflow_point } from "@/inc/eoflow";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import vbuttonk from "@/logic/common/vbuttonk.vue"
    import vtable from "@/logic/common/vtable.vue"
    import vdic from "@/logic/common/vdic.vue"
    import vflow from "@/logic/common/vflow.vue"

    import eodic from "@/inc/eodic";
    import eoflow from "@/inc/eoflow";

    import cgd_xx from "./cgd_xx.vue"
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import user_input from "@/views/platform/user_input.vue"
    import tflow_button from "@/views/frame/ext/comm/tflow_button.vue";

    import cdgrk from "./cdgrk.vue"
    import cgdcp from "./cgdcp.vue"



    const v_cdgrk = ref<InstanceType<typeof cdgrk>>();
    const v_cgdcp = ref<InstanceType<typeof cgdcp>>();

    type t_table = InstanceType<typeof vtable>;
    const v_table_cgd = ref<t_table>();

    type t_flow = InstanceType<typeof vflow>;
    const v_flow_cgd = ref<t_flow>();
    
    type t_cgd_xx = InstanceType<typeof cgd_xx>;
    const v_cgd_xx = ref<t_cgd_xx>();

    const v_flow_button = ref<InstanceType<typeof tflow_button>>();

    // 查询条件
    const x_query_cgdh = ref("");
    const x_query_gysmc = ref("");
    const x_query_cjrq = ref<[string, string] | null>(null);

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    onMounted(async () => {
        
        v_flow_button.value?.init_flow(v_flow_cgd.value);

        // 初始化加载数据
        netLoad_cgd_query(-1);        
    });

    const updateFlowStatus = (cgdData: any) => { 

        v_cdgrk.value?.setEditFields(0, []);
        v_cgdcp.value?.setEditFields(0, []);

        //const sel = v_table_cgd.value?.get_select_data(false);
        //console.log("updateFlowStatus", cgdData, sel);

        if (cgdData == undefined) return;
        let yxbz = cgdData["f_yxbz"];
        if (yxbz == 0) return;

        const flowStatus = v_flow_button.value?.update_flow_status(cgdData);
        if (!flowStatus) return;

        // 核准之后无法退回
        v_flow_button.value?.set_flow_back("已核准");

        // 只允许编辑自己
        if (cgdData["f_xsy_id"] == TGlobal.userData["f_user_id"]) {
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
            case "已核准": // 填写单号
                editMode1 = 3;
                fields1 = ["f_wlgs_id", "f_wldh"];
                break;
            case "已发货": // 9表示入库
                editMode1 = 9;
                break;
        }

        v_cgdcp.value?.setEditFields(editMode1, fields1);
        v_cdgrk.value?.setEditFields(editMode2, fields2);
    };


    const onButtonClick_Flow = (point: cflow_point, data0: any) => {

        const pointName = point?.name;
        if (pointName == undefined) return;

        let cgdData = v_table_cgd.value?.get_select_data(true);
        if (cgdData == undefined) return;

        console.log("onButtonClick_Flow", point, cgdData);

        switch (pointName) {
            case "新建":
                onButtonClick_Flow_CGTJ(cgdData);
                break;
            case "待审核":
                v_flow_button.value?.show_flow_dialog(cgdData, (data1: any) => {
                    updateFlowStatus(data1);
                });
                break;
            case "已审核":
                v_flow_button.value?.show_flow_dialog(cgdData, (data1: any) => {
                    updateFlowStatus(data1);
                });
                break;
            case "已核准":
                onButtonClick_Flow_CGFH(cgdData);
                break;
            case "已发货":
                onButtonClick_Flow_CGRK(cgdData);
                break;
            case "完成":
                break;
        }
    };

    /**
     * 查询采购入库数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_cgd_query = (pageIndex: number = -1) => {
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

        v_table_cgd.value?.load_list_proc("p_cgd_query", { 
            "v_cgdh": x_query_cgdh.value,
            "v_cgy_id": -1,
            "v_shr_id": -1,
            "v_gysmc": x_query_gysmc.value,
            "v_lxr": "",
            "v_lxdh": "",
            "v_wlgs_id": -1,
            "v_wldh": "",
            "v_yxbz": -1,
            "v_sfje1": -0.01,
            "v_sfje2": -0.01,
            "v_cjsj1": "",
            "v_cjsj2": "",
            "v_shsj1": "",
            "v_shsj2": "",
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });

        v_cgdcp.value?.loadList(0, "", false);
        v_cdgrk.value?.loadList(0, 0);

        v_flow_cgd.value?.load_List(0);
        
        updateFlowStatus(undefined);
    }

    const netLoad_cgd_upd = async (data: any): Promise<any> => { 

        x_show_loading.value = true;
        const ret = await eocore.proc(
            "p_cgd_upd", {
                "v_cgd_id": data["f_cgd_id"],
                "v_cgdh": data["f_cgdh"],
                "v_gys_id": data["f_gys_id"],
                "v_gys_id_s": data["f_gys_id_s"],
                "v_cgy_id": data["f_cgy_id"],
                "v_cgy_id_s": data["f_cgy_id_s"],
                "v_cgjh_id": data["f_cgjh_id"],
                "v_cgjhdh": data["f_cgjhdh"],
                "v_lxr": data["f_lxr"],
                "v_lxdh": data["f_lxdh"],
                "v_wlgs_id": data["f_wlgs_id"],
                "v_wlgs_id_s": data["f_wlgs_id_s"],
                "v_wldh": data["f_wldh"],
                "v_shr_id": data["f_shr_id"],
                "v_shr_id_s": data["f_shr_id_s"],
                "v_fklb": data["f_fklb"],
                "v_zje": data["f_zje"],
                "v_sfje": data["f_sfje"],
                "v_shsj": data["f_shsj"],
                "v_yxbz": data["f_yxbz"],
                "v_beizhu": data["f_beizhu"]
            });
        x_show_loading.value = false;
        return eocore.check_net_object(ret);
    }

    /**
     * 统计采购入库数据
     */
    const netLoad_cgd_count = async (cgdData: any): Promise<any> => {
        
        // 统计采购明细
        let ret = await eocore.proc("p_cgdcp_count", {
            "v_cgd_id": cgdData["f_cgd_id"]
        });
        let data = eocore.check_net_object(ret);
        if (data == undefined) return undefined;

        if (eocore.to_int(data["f_count"]) <= 0) {
            eocore.show_info("没有采购明细");
            return undefined;
        }

        cgdData["f_zje"] = eocore.to_float(data["f_cgzj"]);

        // 暂时无须保存到数据库
        return await netLoad_cgd_upd(cgdData);
    }


    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_cgd = (data: any) => {

        // 有效标志显示
        data["f_yxbz_s"] = "";
        if (data["f_yxbz"] == 0) data["f_yxbz_s"] = "作废";
        
        // 付款类别显示
        data["f_fklb_s"] = eodic.get_dic_label("付款类别", data["f_fklb"]);
        
        // 日期格式化
        if (data["f_cjsj"]) {
            data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"]);
        }
        if (data["f_shsj"]) {
            data["f_shsj_s"] = eolib.datetime_2_short(data["f_shsj"], true);
        }

        // 金额格式化
        data["f_zje_s"] = eolib.fixed_num(data["f_zje"], 3);
        data["f_sfje_s"] = eolib.fixed_num(data["f_sfje"], 3);

        // 用户转换
        TLogic.updateDicUserData(data, ["f_shr_id", "f_cgy_id"]);

        // 流程
        data["f_flow_point_id_s"] = v_flow_cgd.value?.get_point_name_by_id(data["f_flow_point_id"]);
    }

    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_cgd = (n: number): number => {
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
    const onTableRowClick_cgd = async (data: any) => {

        x_show_loading.value = true;
        await v_cgdcp.value?.loadList(data["f_cgd_id"], data["f_cgdh"], true);
        await v_cdgrk.value?.loadList(data["f_cgd_id"], 0);
        x_show_loading.value = false;

        x_show_loading.value = true;
        await v_flow_cgd.value?.load_List(data["f_cgd_id"]);
        x_show_loading.value = false;

        updateFlowStatus(data);
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_cgd = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_cgd_query(pageIndex - 1);
    }
    
    /**
     * 查找按钮点击
     */
    const onButtonClick_Load_cgd = () => {
        netLoad_cgd_query(-1);
    }

    /**
     * 采购入库保存事件处理
     */
    const onDialogClose_cgd_xx = async (cancel: boolean, data: any, cb: cfunc_boolean) => {

        if (cancel) { 
            cb(true); return;
        }

        if (!eocore.check_id(data, "f_gys_id")) {
            eocore.show_info("请选择供应商");
            cb(false); return;
        }

        const isAdd = data["f_cgd_id"] == 0;

        let cgdh = data["f_cgdh"];
        if (isAdd) {

            cgdh = await TLogic.netLoad_RecordString("采购入库单号", "CG", "yyMMdd", 6);
            data["f_cgdh"] = cgdh;

        } else {
            
            if (v_flow_cgd.value?.check_point_order(data["f_flow_point_id"], "新建")) {
                eocore.show_info("采购单已提交，无法修改");
                return;
            }
        }

        if (eocore.check_empty(cgdh)) {
            eocore.show_info("错误的采购入库单号");
            cb(false); return;
        }

        // 创建单号
        data["f_cgdh"] = cgdh;

        // 回写数据库
        const dataNew = await netLoad_cgd_upd(data);
        if (dataNew == undefined) return;

        if (isAdd) {

            x_show_loading.value = true;
            v_flow_cgd.value?.clear_list(dataNew["f_cgd_id"]);
            
            // 添加一个流程
            let processData = await v_flow_cgd.value?.process_add_data(dataNew["f_cgd_id"], "-");

            if (processData != undefined) {
                dataNew["f_flow_point_id"] = processData["f_flow_point_id"];
                dataNew["f_flow_process_id"] = processData["f_flow_process_id"];
            }

            // 刷新明细
            v_cgdcp.value?.loadList(dataNew["f_cgd_id"], dataNew["f_cgdh"], false);
            v_cdgrk.value?.loadList(dataNew["f_cgd_id"], 0);

            x_show_loading.value = false;
        }

        // 更新表格        
        v_table_cgd.value?.update_data(dataNew, -1, isAdd, true);
        // 更新流程按钮
        updateFlowStatus(dataNew);

        cb(true);
    }

    /**
     * 流程操作：提交采购
     */
    const onButtonClick_Flow_CGTJ = async (data0: any) => {

        let dataNew = await netLoad_cgd_count(data0);
        if (dataNew == undefined) return;

        // 更新表格        
        const dataRow = v_table_cgd.value?.update_data(dataNew, -1, false, true);
        if (dataRow == undefined) return;
        
        v_flow_button.value?.show_flow_dialog(dataRow, async (data1: any) => {
            updateFlowStatus(data1);
        });
    }


    /**
     * 流程操作：商家发货
     */
    const onButtonClick_Flow_CGFH = (data0: any) => {

        // 判断物流公司和单号        
        const list = v_cgdcp.value?.getList() || [];
        if (eocore.check_empty(list)) {
            eocore.show_info("无产品清单");
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
        });
    }

    /**
     * 流程操作：收货入库
     */
    const onButtonClick_Flow_CGRK = async (data0: any) => {
       
        const cgdId = data0["f_cgd_id"];
        // 检查是否标记入库
        x_show_loading.value = true;
        let ret = await eocore.proc("p_cgdcp_list", { 
            "v_cgd_id": cgdId,
        });
        x_show_loading.value = false;
        const list1 = eocore.check_net_array(ret) || [];
        if (eocore.check_empty(list1)) {
            eocore.show_info("无产品清单");
            return;
        }

        x_show_loading.value = true;
        ret = await eocore.proc("p_cgdrk_list", {
            "v_cgd_id": cgdId,
            "v_cgdcp_id": 0            
        });
        x_show_loading.value = false;
        const list2 = eocore.check_net_array(ret) || [];
        if (eocore.check_empty(list2)) {
            eocore.show_info("无入库产品");
            return;
        }

        let bf;
        for (let d1 of list1) {
            bf = false;
            for (let d2 of list2) {
                if (d1["f_cgdcp_id"] == d2["f_cgdcp_id"]) {
                    bf = true;
                    break;
                }
            }
            if (!bf) {
                eocore.show_info("产品未标记入库");
                return;
            }
        }

        v_flow_button.value?.show_flow_dialog(data0, async (data1: any) => {
            updateFlowStatus(data1);
        });
    }

    const onButtonClick_Flow_Get = () => { 

        let cgdData = v_table_cgd.value?.get_select_data(true);
        if (cgdData == undefined) return;
        
        v_cgd_xx.value?.showDialog(cgdData, false);
    }

    /**
     * 添加采购单
     */
    const onButtonClick_Flow_Add = async (point: cflow_point, data0: any) => {
             
        let cgdData = {
            "f_cgd_id": 0,
            "f_cgdh": "",          // 采购入库单号
            "f_gys_id": 0,         // 供应商ID
            "f_gys_id_s": "",         // 供应商名称
            "f_cgy_id": TGlobal.userData['f_user_id'], // 采购员ID
            "f_cgy_id_s": TGlobal.userData['f_name'], // 采购员姓名
            "f_cgjh_id": 0, // 采购计划ID
            "f_cgjhdh": "", // 采购计划单号
            "f_lxr": "", // 联系人
            "f_lxdh": "", // 联系电话
            "f_wlgs_id": 0, // 物流公司ID
            "f_wlgs_id_s": "", // 物流公司名称
            "f_wldh": "", // 物流单号
            "f_shr_id": 0, // 收货人ID
            "f_shr_id_s": "", // 收货人姓名
            "f_fklb": 1, // 付款类别
            "f_zje": 0.0, // 总金额
            "f_sfje": 0.0, // 实付金额
            "f_cjsj": "", // 创建时间
            "f_shsj": "1970-01-01 00:00:00", // 收货时间
            "f_yxbz": 1, // 有效标志
            "f_flow_point_id": 0,
            "f_flow_process_id": 0,
            "f_beizhu": "" // 备注
        };
        
        v_cgd_xx.value?.showDialog(cgdData, true);
    }

    /**
     * 修改订单
     */
    const onButtonClick_Flow_Upd = (point: cflow_point, data0: any) => {
        let cgdData = v_table_cgd.value?.get_select_data(true);
        if (cgdData == undefined) return;
        
        v_cgd_xx.value?.showDialog(cgdData);
    }
    

    /**
     * 流程操作：订单作废
     */
    const onButtonClick_Flow_Cancel = async (point: cflow_point, data0: any) => {
               
        let cgdData = v_table_cgd.value?.get_select_data(true);
        if (cgdData == undefined) return;

        let ret = await eocore.show_confirm("采购单 " + cgdData["f_cgdh"] + " 是否作废？");
        if (!ret) return;

        cgdData["f_yxbz"] = 0;
        netLoad_cgd_upd(cgdData);
    }

    /**
     * 流程操作：订单退回
     */
    const onButtonClick_Flow_Back = (point: cflow_point, data0: any) => {
        
        let cgdData = v_table_cgd.value?.get_select_data(true);
        if (cgdData == undefined) return;

        v_flow_cgd.value?.process_back_dialog((cancel: boolean, data: any, cb: cfunc_boolean) => {

            if (cancel) { 
                cb(true); return;
            }

            cgdData["f_flow_point_id"] = data["f_flow_point_id"];
            cgdData["f_flow_point_id_s"] = data["f_flow_point_id_s"];

            // 更新表格流程状态
            v_table_cgd.value?.update_data(cgdData, -1, false, false);
            // 更新按钮状态
            updateFlowStatus(cgdData);

            cb(true);
        });
    }

    const onTableRowClick_cgdcp = (data: any) => {
        v_cdgrk.value?.loadList(data["f_cgd_id"], data["f_cgdcp_id"]);
    }
    
</script>

<style lang="scss" scoped>
</style>