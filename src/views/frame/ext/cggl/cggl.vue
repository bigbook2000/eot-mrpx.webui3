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
                                        <vbuttonk type="primary" class="input_w" permit="" 
                                            v-show="x_flow_status_button['新建']"
                                            @click="onButtonClick_Add_cgd">新建采购</vbuttonk>
                                        <vbuttonk type="primary" class="input_w" permit="" 
                                            v-show="x_edit_cgd"
                                            @click="onButtonClick_Upd_cgd">修改采购</vbuttonk>
                                        <vbuttonk type="default" class="input_w" permit="" 
                                            v-show="!x_edit_cgd"
                                            @click="onButtonClick_Get_cgd">采购详情</vbuttonk>
                                        <div class="split"></div>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['作废']"
                                            @click="onButtonClick_Flow_CGZF">采购作废</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['退回']"
                                            @click="onButtonClick_Flow_CGTH">采购退回</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['提交']"
                                            @click="onButtonClick_Flow_CGTJ">提交采购</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['审核']"
                                            @click="onButtonClick_Flow_CGSH">采购审核</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['核准']"
                                            @click="onButtonClick_Flow_CGHZ">财务核对</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['发货']"
                                            @click="onButtonClick_Flow_CGFH">商家发货</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['入库']"
                                            @click="onButtonClick_Flow_CGRK">收货入库</vbuttonk>
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            v-show="x_flow_status_button['归档']"
                                            @click="onButtonClick_Flow_CGGD">采购归档</vbuttonk>
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
                                        <cgdcp ref="v_cgdcp" style="height:100%;"></cgdcp>
                                    </div>
                                    <div class="eo_row_sp"></div>
                                    <div class="eo_row_f"> 
                                        <rkcpmx ref="v_rkcpmx" style="height:100%;"></rkcpmx>
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

    import rkcpmx from "@/views/frame/ext/kcgl/rkcpmx.vue"
    import cgdcp from "@/views/frame/ext/cggl/cgdcp.vue"

    const v_rkcpmx = ref<InstanceType<typeof rkcpmx>>();
    const v_cgdcp = ref<InstanceType<typeof cgdcp>>();

    type t_table = InstanceType<typeof vtable>;
    const v_table_cgd = ref<t_table>();

    type t_flow = InstanceType<typeof vflow>;
    const v_flow_cgd = ref<t_flow>();
    
    type t_cgd_xx = InstanceType<typeof cgd_xx>;
    const v_cgd_xx = ref<t_cgd_xx>();

    // 按钮状态
    const x_flow_status_button = ref({
        "新建": false,
        "作废": false,
        "退回": false,
        "提交": false,
        "审核": false,
        "核准": false,
        "发货": false,
        "入库": false,
        "归档": false,
    });

    const x_edit_cgd = ref(false);

    let m_user_dic: any = {};

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
        
        m_user_dic = await TLogic.netLoad_UserDic();
        v_rkcpmx.value?.updateUserDic(m_user_dic);

        // 判断是否能够创建采购
        const role = TGlobal.userData["f_role"];
        const point = v_flow_cgd.value?.get_point_by_name("新建");
        if (point != undefined) {
            x_flow_status_button.value["新建"] = eolib.list_any_list(role, point.role);
        }

        // 初始化加载数据
        netLoad_cgd_query(-1);        
    });

    const updateFlowStatusButton = (cgdData: any) => { 

        let flowPointId = 0;
        let yxbz = 0;
        if (cgdData != undefined) {
            flowPointId = cgdData["f_flow_point_id"];
            yxbz = cgdData["f_yxbz"];
        }

        const statusButton = x_flow_status_button.value;
        statusButton["新建"] = false;
        statusButton["作废"] = false;
        statusButton["退回"] = false;
        statusButton["提交"] = false;
        statusButton["审核"] = false;
        statusButton["核准"] = false;
        statusButton["发货"] = false;
        statusButton["入库"] = false;
        statusButton["归档"] = false;
        x_flow_status_button.value = statusButton;

        v_rkcpmx.value?.setEditFields(0, []);
        v_cgdcp.value?.setEditFields(0, []);

        if (flowPointId <= 0) return;
        if (yxbz == 0) return;
        
        let point = v_flow_cgd.value?.get_point_by_id(flowPointId);
        if (point == undefined) return;

        // 检查角色
        const role = TGlobal.userData["f_role"];
        const pointRole = point.role;
        //console.log("updateFlowStatusButton", flowPointId, yxbz, point, role);
        // 判断角色是否满足条件
        if (!eolib.list_any_list(role, pointRole)) return;

        const pointName = point.name;
        //const ret = v_flow_cgd.value?.check_point_back(pointName);
        //console.log("point", point, role, pointRole, ret);

        // 需要作废权限
        //statusButton["CGZF"] = ret.first;

        // 核准之后无法退回
        let isCGTH = v_flow_cgd.value?.check_point_order(point.flow_point_id, "已审核") || false;
        statusButton["退回"] = !isCGTH;

        statusButton["提交"] = pointName == "新建";
        statusButton["审核"] = pointName == "待审核";
        statusButton["核准"] = pointName == "已审核";
        statusButton["发货"] = pointName == "已核准";
        statusButton["入库"] = pointName == "已发货";
        statusButton["归档"] = pointName == "已入库";

        x_edit_cgd.value = false;

        let editMode1 = 0;
        let editMode2 = 0;
        let fields1: string[] = [];
        let fields2: string[] = [];

        console.log("updateFlowStatusButton", pointName);

        switch (pointName) { 
            case "新建":
                editMode1 = 1;
                fields1 = ["*"];
                x_edit_cgd.value = true;
                statusButton["退回"] = false;
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
        v_rkcpmx.value?.setEditFields(editMode2, fields2);
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

        v_cgdcp.value?.loadList(
            0, "", false);
        v_rkcpmx.value?.loadList(
            TLogic.codeTypes["采购入库"],
            0, "", false);

        v_flow_cgd.value?.load_List(0);
        
        updateFlowStatusButton(undefined);
    }

    const netLoad_cgd_upd = async (data: any): Promise<any> => { 

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
     * 入库产品添加到库存表中
     * @param data 
     */
    const netLoad_kcmx_upd = async (list: any[]): Promise<any> => { 

        x_show_loading.value = true;
        for (let data of list) {

            console.log("入库产品添加到库存表中", data);
            const ret = await eocore.proc("p_kcmx_upd", {
                "v_kcbh": data["f_kcbh"],
                "v_kcmxrk_id": data["f_kcmxrk_id"],
                "v_cpdy_id": data["f_cpdy_id"],
                "v_jyzt": 0,
                "v_hwck": data["f_hwck"],
                "v_cpdj": data["f_cpdj"],
                "v_cpsl": data["f_cpsl"],
                "v_yxbz": 1,
                "v_kgy_id": data["f_kgy_id"],
                "v_beizhu": data["f_beizhu"]
            });
            eocore.check_net_object(ret);            
        }
        x_show_loading.value = false;
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
        TLogic.updateDicUserData(data, m_user_dic, ["f_shr_id", "f_cgy_id"]);

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

        v_cgdcp.value?.loadList(
            data["f_cgd_id"],
            data["f_cgdh"],
            true);
        v_rkcpmx.value?.loadList(
            TLogic.codeTypes["采购入库"],
            data["f_cgd_id"],
            data["f_cgdh"],
            true);

        await v_flow_cgd.value?.load_List(data["f_cgd_id"]);

        updateFlowStatusButton(data);
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

    const onButtonClick_Get_cgd = () => { 

        let cgdData = v_table_cgd.value?.get_select_data(true);
        if (cgdData == undefined) return;
        
        v_cgd_xx.value?.showDialog(cgdData, false);
    }

    /**
     * 添加采购单
     */
    const onButtonClick_Add_cgd = async () => {
        
        let cgdData = {
            f_cgd_id: 0,
            f_cgdh: "",          // 采购入库单号
            f_gys_id: 0,         // 供应商ID
            f_gys_id_s: "",         // 供应商名称
            f_cgy_id: TGlobal.userData['f_user_id'], // 采购员ID
            f_cgy_id_s: TGlobal.userData['f_name'], // 采购员姓名
            f_cgjh_id: 0, // 采购计划ID
            f_cgjhdh: "", // 采购计划单号
            f_lxr: "", // 联系人
            f_lxdh: "", // 联系电话
            f_wlgs_id: 0, // 物流公司ID
            f_wlgs_id_s: "", // 物流公司名称
            f_wldh: "", // 物流单号
            f_shr_id: 0, // 收货人ID
            f_shr_id_s: "", // 收货人姓名
            f_fklb: 1, // 付款类别
            f_zje: 0.0, // 总金额
            f_sfje: 0.0, // 实付金额
            f_cjsj: "", // 创建时间
            f_shsj: "1970-01-01 00:00:00", // 收货时间
            f_yxbz: 1, // 有效标志
            f_flow_point_id: 0,
            f_flow_process_id: 0,
            f_beizhu: "" // 备注
        };
        
        v_cgd_xx.value?.showDialog(cgdData);
    }

    /**
     * 删除采购单
     */
    const onButtonClick_Del_cgd = async () => {
        await v_table_cgd.value?.remove_data_proc_select("p_cgd_del", async (data: any) => {
            return {
                "v_cgd_id": data["f_cgd_id"],
                "v_rklb": TLogic.codeTypes["采购入库"]
            };
        });
    }

    /**
     * 修改采购单
     */
    const onButtonClick_Upd_cgd = () => {
        let cgdData = v_table_cgd.value?.get_select_data(true);
        if (cgdData == undefined) return;
        
        v_cgd_xx.value?.showDialog(cgdData);
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

            cgdh = await TLogic.netLoad_RecordString(
                "采购入库单号", TLogic.codeTypes["采购入库"], "yyMMdd", 6);
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

            v_flow_cgd.value?.clear_list(dataNew["f_cgd_id"]);
            // 添加一个流程
            let processData = await v_flow_cgd.value?.add_process_data(
                "", "新建", "-", 
                eoflow.OP_FLAG_NORMAL,
                "tcgd", "f_cgd_id", dataNew["f_cgd_id"]);

            if (processData != undefined) {
                dataNew["f_flow_point_id"] = processData["f_flow_point_id"];
                dataNew["f_flow_process_id"] = processData["f_flow_process_id"];
            }

            // 刷新明细
            v_cgdcp.value?.loadList(
                dataNew["f_cgd_id"],
                dataNew["f_cgdh"],
                false);
            v_rkcpmx.value?.loadList(
                TLogic.codeTypes["采购入库"],
                dataNew["f_cgd_id"],
                dataNew["f_cgdh"],
                false);
        }

        // 更新表格        
        v_table_cgd.value?.update_data(dataNew, -1, isAdd, true);
        // 更新流程按钮
        updateFlowStatusButton(dataNew);

        cb(true);
    }

    /**
     * 流程操作：采购作废
     */
    const onButtonClick_Flow_CGZF = async () => {
               
        let cgdData = v_table_cgd.value?.get_select_data(true);
        if (cgdData == undefined) return;

        let ret = await eocore.show_confirm("采购单 " + cgdData["f_cgdh"] + " 是否作废？");
        if (!ret) return;

        cgdData["f_yxbz"] = 0;
        netLoad_cgd_upd(cgdData);
    }

    /**
     * 流程操作：采购退回
     */
    const onButtonClick_Flow_CGTH = () => {
        
        let cgdData = v_table_cgd.value?.get_select_data(true);
        if (cgdData == undefined) return;

        v_flow_cgd.value?.back_process((cancel: boolean, data: any, cb: cfunc_boolean) => {

            if (cancel) { 
                cb(true); return;
            }

            cgdData["f_flow_point_id"] = data["f_flow_point_id"];
            cgdData["f_flow_point_id_s"] = data["f_flow_point_id_s"];

            // 更新表格流程状态
            v_table_cgd.value?.update_data(cgdData, -1, false, false);
            // 更新按钮状态
            updateFlowStatusButton(cgdData);

            cb(true);
        });
    }

    /**
     * 流程操作：提交采购
     */
    const onButtonClick_Flow_CGTJ = async () => {

        let cgdData = v_table_cgd.value?.get_select_data(true);
        if (cgdData == undefined) return;

        let dataNew = await netLoad_cgd_count(cgdData);
        if (dataNew == undefined) return;
        
        showFlowDialog(dataNew, "待审核");
    }

    /**
     * 流程操作：采购审核
     */
    const onButtonClick_Flow_CGSH = () => {
        
        let cgdData = v_table_cgd.value?.get_select_data(true);
        if (cgdData == undefined) return;

        showFlowDialog(cgdData, "已审核");
    }

    /**
     * 流程操作：财务核对
     */
    const onButtonClick_Flow_CGHZ = () => {
        
        let cgdData = v_table_cgd.value?.get_select_data(true);
        if (cgdData == undefined) return;

        showFlowDialog(cgdData, "已核准");
    }

    /**
     * 流程操作：商家发货
     */
    const onButtonClick_Flow_CGFH = () => {
        
        let cgdData = v_table_cgd.value?.get_select_data(true);
        if (cgdData == undefined) return;

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

        showFlowDialog(cgdData, "已发货");
    }

    /**
     * 流程操作：收货入库
     */
    const onButtonClick_Flow_CGRK = () => {
       
        let cgdData = v_table_cgd.value?.get_select_data(true);
        if (cgdData == undefined) return;

        // 检查是否标记入库
        const list1 = v_cgdcp.value?.getList() || [];
        if (eocore.check_empty(list1)) {
            eocore.show_info("无产品清单");
            return;
        }

        const list2 = v_rkcpmx.value?.getList() || [];
        if (eocore.check_empty(list2)) {
            eocore.show_info("无入库产品");
            return;
        }

        let bf;
        for (let d1 of list1) {
            bf = false;
            for (let d2 of list2) {
                if (d1["f_cgdcp_id"] == d2["f_rkcp_id"]) {
                    bf = true;
                    break;
                }
            }
            if (!bf) {
                eocore.show_info("产品未标记入库");
                return;
            }
        }

        showFlowDialog(cgdData, "已入库");
    }

    /**
     * 流程操作：采购归档
     */
    const onButtonClick_Flow_CGGD = () => {
        
        let cgdData = v_table_cgd.value?.get_select_data(true);
        if (cgdData == undefined) return;

        showFlowDialog(cgdData, "完成");
    }

    /**
     * 显示流程操作对话框
     * @param cgdData 采购单数据
     * @param pointName 流程节点名称
     */
    const showFlowDialog = (cgdData: any, pointName: string) => {
        
        v_flow_cgd.value?.add_process(pointName, (cancel: boolean, data: any, cb: cfunc_boolean) => {

            if (cancel) { 
                cb(true); return;
            }

            cgdData["f_flow_point_id"] = data["f_flow_point_id"];
            cgdData["f_flow_point_id_s"] = data["f_flow_point_id_s"];

            // 更新表格流程状态
            v_table_cgd.value?.update_data(cgdData, -1, false, false);
            // 更新流程按钮
            updateFlowStatusButton(cgdData);

            if (pointName == "已入库") {

                // 入库到库存
                let list = v_rkcpmx.value?.getList();
                list ??= [];
                netLoad_kcmx_upd(list);
            }

            eocore.show_success("操作成功");
            cb(true);
        });
    }
    
</script>

<style lang="scss" scoped>
</style>