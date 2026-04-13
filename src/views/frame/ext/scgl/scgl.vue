<template>
    <!-- 生产管理 -->
    <div class="eo_page" v-loading="x_show_loading">    
        <div class="eo_col">
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w200p">
                        <div class="label_n">产品名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_cpmc"></el-input>
                        </div>
                    </div>
                    <div class="cell" style="width:320px;">
                        <div class="label_n">计划时间</div>
                        <div class="input">
                            <el-date-picker
                                v-model="x_query_jhsj"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD"
                                style="width: 100%">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_cpdy">查找</el-button>
                        </div>                        
                    </div>
                </div>
            </div>
            <div class="eo_col_sp"></div>
            <div class="eo_col_f">
                <div class="eo_row">
                    <!-- 生产任务 -->
                    <div class="eo_row_f">
                        <div class="eo_col">
                            <div class="eo_tool_bar">
                                <div class="eo_form">
                                    <div class="cell">
                                        <vbuttonk type="primary" class="input_w" permit="" 
                                            @click="onButtonClick_Add_scd">新增任务</vbuttonk>
                                    </div>
                                    <div class="cell">
                                        <vbuttonk type="default" class="input_w" permit="" 
                                            @click="onButtonClick_Del_scd">删除任务</vbuttonk>
                                    </div>
                                </div>
                            </div>             
                            <div class="eo_col_f">
                                <vtable ref="v_table_sccp" 
                                    name="生产任务"
                                    id-field="f_sccp_id"
                                    @loading="onTableLoading"
                                    :on-item="onTableItem_sccp"
                                    @row-click="onTableRowClick_sccp">
                                    <el-table-column prop="f_scy_id_s" label="生产员" width="120" />
                                    <el-table-column prop="f_cpmc" label="名称" width="180" show-overflow-tooltip />
                                    <el-table-column prop="f_jhsj_s" label="计划时间" width="140" />
                                    <el-table-column prop="f_wcsj_s" label="完成时间" width="140" />
                                    <el-table-column prop="f_kcbh" label="批次" width="180" show-overflow-tooltip />
                                    <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                                    <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
                                    <el-table-column prop="f_cpzl" label="重量" width="160" show-overflow-tooltip />
                                    <el-table-column prop="f_cpdw" label="单位" width="100" show-overflow-tooltip />
                                    <el-table-column prop="f_cjsj_s" label="创建时间" width="140" />
                                    <el-table-column prop="f_cpbm" label="编码" width="160" />
                                    <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                                    <el-table-column />
                                </vtable>
                            </div>

                                        
                            <!-- 分页 -->
                            <div class="eo_page_bar">
                                <el-pagination
                                    background
                                    @current-change="onPageChange_sccp"
                                    :current-page="x_page_index"
                                    :page-size="x_page_row_count"
                                    layout="total, prev, pager, next, jumper"
                                    :total="x_row_total">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                    <!-- 产品清单 -->
                     <div class="eo_row_d" style="width:50%">
                        <div class="eo_col">
                            <div class="eo_tool_bar">
                                <div class="eo_form">
                                    <div class="cell">
                                        <vbuttonk type="primary" class="input_w" permit="" 
                                            @click="onButtonClick_Upd_scwl">添加物料</vbuttonk>
                                    </div>
                                    <div class="cell">
                                        <vbuttonk type="warning" class="input_w" permit="" 
                                            @click="onButtonClick_New_scwl">进行生产</vbuttonk>
                                    </div>
                                </div>
                            </div>
                            <div class="eo_col_f">
                                <vtable ref="v_table_cpbj" 
                                    name="部件清单"
                                    id-field="f_cpbj_id"
                                    @loading="onTableLoading"
                                    :on-item="onTableItem_cpbj"
                                    @row-click="onTableRowClick_cpbj">
                                    <el-table-column prop="f_cpmc" label="部件名称" width="180" show-overflow-tooltip />
                                    <el-table-column prop="f_bjsl" label="部件数量" width="100" />
                                    <el-table-column prop="f_kcbh" label="批次" width="180" show-overflow-tooltip />
                                    <el-table-column prop="f_cpsl" label="单件数量" width="100" />
                                    <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                                    <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
                                    <el-table-column prop="f_cpzl" label="重量" width="160" show-overflow-tooltip />
                                    <el-table-column prop="f_cpdw" label="单位" width="100" show-overflow-tooltip />
                                    <el-table-column prop="f_cpbm" label="编码" width="160" />
                                    <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                                    <el-table-column />
                                </vtable>
                            </div>
                        </div>
                     </div>
                </div>
            </div>     
        </div>
    </div>
    
    <!-- 生产计划对话框 -->
    <scd_xx ref="v_scd_xx" @close="onDialogClose_sccp"></scd_xx>
    
    <!-- 生产物料选择对话框 -->
    <scwl_list ref="v_scwl_list" @close="onDialogClose_scwl"></scwl_list>

    <!-- 生产产品对话框 -->
    <scdcp_xx ref="v_scdcp_xx" @close="onDialogClose_scdcp_xx" />
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_scgl_scgl" }
</script>


<script lang="ts" setup>
    import { ref, nextTick, onMounted, type Ref } from "vue"
    import type { cform_options, cfunc_boolean, cdic_item, ctree_node } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import { ElTree } from 'element-plus'
    import vbuttonk from "@/logic/common/vbuttonk.vue"
    import vtable from "@/logic/common/vtable.vue"
    
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import scdcp_xx from "./scdcp_xx.vue";
    import scd_xx from "./scd_xx.vue";
    import scwl_list from "./scwl_list.vue";
import { da } from "element-plus/es/locales.mjs";

    type t_table = InstanceType<typeof vtable>;
    const v_table_sccp = ref<t_table>();
    const v_table_cpbj = ref<t_table>();
    const v_scd_xx = ref<InstanceType<typeof scd_xx>>();
    const v_scwl_list = ref<InstanceType<typeof scwl_list>>();
    const v_scdcp_xx = ref<InstanceType<typeof scdcp_xx>>();

    let x_show_loading = ref(false);

    const x_query_cpmc = ref("");
    const x_query_jhsj = ref<[string, string] | null>(null);

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    let m_user_dic: any = {};

    onMounted(async () => {

        m_user_dic = await TLogic.netLoad_UserDic();
        netLoad_sccp_query(-1);
    });

    const netLoad_sccp_query = async (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        // 处理日期范围
        let kssj = "";
        let jssj = "";
        if (x_query_jhsj.value) {
            kssj = x_query_jhsj.value[0];
            jssj = x_query_jhsj.value[1];
        }

        let ret = await eocore.proc("p_sccp_query", {
            "v_scy_id": -1,
            "v_cpbm": "",
            "v_cpmc": x_query_cpmc.value,
            "v_kssj": kssj,
            "v_jssj": jssj,
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
        const list1 = eocore.check_net_array(ret);
        if (list1 == undefined) return;

        const ids = list1.filter(x => x["f_kcmxrk_id"] > 0).map(x => x["f_kcmxrk_id"]).join(",");
        if (ids.length > 0) {

            ret = await eocore.proc("p_kcmxrk_ids", {
                "v_kcmxrk_ids": ids
            });
        
            let list2 = eocore.check_net_array(ret);
            if (list2 == undefined) return;

            eolib.list_merge(list1, list2, "f_kcmxrk_id", "f_kcmxrk_id");
        }

        v_table_sccp.value?.load_list(list1);
    }

    const netLoad_scbj_list = async (sccpData: any) => {

        // 生产工艺
        x_show_loading.value = true;
        let ret = await eocore.proc("p_cpbj_list", {
            "v_cpdy_pid": sccpData["f_cpdy_id"] 
        });
        let list1 = eocore.check_net_array(ret);
        x_show_loading.value = false;
        if (list1 == undefined) return;

        // 生产部件
        x_show_loading.value = true;
        ret = await eocore.proc("p_scbj_list", {
            "v_sccp_id": sccpData["f_sccp_id"] 
        });
        let list2 = eocore.check_net_array(ret);
        x_show_loading.value = false;
        if (list2 == undefined) return;

        // 通过f_cpbj_id关联生产
        eolib.list_merge(list1, list2, "f_cpbj_id", "f_cpbj_id", {
            "f_sccp_id": sccpData["f_sccp_id"], 
            "f_scbj_id": 0, 
            "f_kcmxrk_id": 0
        });

        // 库存批次
        const ids = list2.filter(x => x["f_kcmxrk_id"] > 0).map(x => x["f_kcmxrk_id"]).join(",");
        if (ids.length <= 0) {
            v_table_cpbj.value?.load_list(list1);
            return;
        }

        x_show_loading.value = true;
        ret = await eocore.proc("p_kcmxrk_ids", {
            "v_kcmxrk_ids": ids 
        });
        let list3 = eocore.check_net_array(ret);
        x_show_loading.value = false;
        if (list3 == undefined) return;

        // 关联库存
        eolib.list_merge(list1, list3, "f_kcmxrk_id", "f_kcmxrk_id", {
            "f_kcbh": "", 
            "f_cpsl": 0, 
            "f_cpdj": 0.0,
            "f_hwck": 0,
            "f_beizhu": ""
        });
        
        v_table_cpbj.value?.load_list(list1);
    }

    const onTableLoading = (show: boolean) => {
        x_show_loading.value = show;
    }

    const onTableItem_sccp = (data: any) => {
        //console.log(data);
        data["f_jhsj_s"] = eolib.datetime_2_short(data["f_jhsj"]);
        data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"]);

        data["f_wcsj_s"] = eolib.datetime_2_short(data["f_wcsj"]);
        if (data["f_wcsj_s"] > "50/01/01 00:00") {
            data["f_wcsj_s"] = "-";
        }

        // 用户转换
        TLogic.updateDicUserData(data, m_user_dic, ["f_scy_id"]);
    }

    const onTableRowClick_sccp = async (data: any) => {
        netLoad_scbj_list(data);        
    }

    const onTableItem_cpbj = (data: any) => {
        //console.log(data);

    }

    const onTableRowClick_cpbj = (data: any) => {
    }

    const onButtonClick_Add_scd = () => {

        let dt = new Date();
        dt.setDate(dt.getDate() + 3);

        // 弹出scd_xx.vue对话框
        const scdData = {
            "f_sccp_id": 0,
            "f_cpdy_id": 0,
            "f_cpbm": "",
            "f_cpmc": "",
            "f_scy_id": TGlobal.userData["f_user_id"],
            "f_jhsj": eolib.datetime_2_string(dt),
            "f_jhsl": 1,
            "f_dqsl": 0,
            "f_wcsj": "2099-01-01 00:00:00",
            "f_yxdj": 3,
            "f_yxbz": 0,
            "f_beizhu": ""
        };
        
        v_scd_xx.value?.showDialog(scdData);
    }

    const onButtonClick_Del_scd = async () => {        
        v_table_sccp.value?.remove_data_proc_select("p_sccp_del", (data: any) => {
            return {
                "v_sccp_id": data["f_sccp_id"]
            };
        });
    }

    const onButtonClick_Load_cpdy = () => {
        netLoad_sccp_query(-1);
    }

    const onButtonClick_Upd_scwl = () => {

        const cpbjData = v_table_cpbj.value?.get_select_data();
        if (!cpbjData) return;
        // 弹出scwl_list.vue对话框
        v_scwl_list.value?.show_dialog(cpbjData);
    }

    /**
     * 点击进行生产
     */
    const onButtonClick_New_scwl = async () => {

        let scdData = v_table_sccp.value?.get_select_data(true);        
        if (scdData == undefined) return;

        // if (scdData["f_kcmxrk_id"] > 0) {
        //     eocore.show_info("当前批次的生产已经完成，请勿重复生产");
        //     return;
        // }

        const scwlList = v_table_cpbj.value?.get_list();
        if (scwlList == undefined) return;

        let cpzj = 0;
        for (let d of scwlList) {
            if (!eocore.check_id(d, "f_kcmxrk_id")) {
                eocore.show_info("未指定生产物料");
                return;
            }

            // 每个部件只能消耗一个批次
            // 如果需要的同样的部件数量大于单件数量，则添加多个相同部件，确保每个部件小于单件数量

            // 部件数量，生产所需要的数量
            const bjsl = d["f_bjsl"];
            // 单件数量
            const cpsl = d["f_cpsl"];
            if (bjsl > cpsl) {
                eocore.show_info("部件数量不能大于单件数量");
                return;
            }

            // 实际库存数量
            const kcsl = d["f_kcsl"];
            if (kcsl < bjsl) {
                eocore.show_info("库存数量不足");
                return;
            }

            // 计算实际单价
            const cpdj = d["f_kczj"] / kcsl;

            // 计算实际总价
            cpzj += bjsl * cpdj;
        }

        let rklb = "生产加工";
        let scyId = TGlobal.userData["f_user_id"];

        console.log(scdData, scwlList, rklb, cpzj);

        const bzsl = scdData["f_bzsl"];

        x_show_loading.value = true;
        let dataNew = scdData;
        // 创建一个新的批号的货物
        // let dataNew = await TLogic.netLoad_kcmxrk_upd(scyId, rklb, {
        //     "f_cpdy_id": scdData["f_cpdy_id"],
        //     "f_cpbm": scdData["f_cpbm"],
        //     "f_cpsl": bzsl, // 定义的单件数量即实际货物单件数量
        //     "f_cpdj": cpzj / bzsl,
        //     "f_hwck": 0,
        //     "f_beizhu": scdData["f_beizhu"]
        // });
        x_show_loading.value = false;
        if (dataNew == undefined) return;

        console.log("创建新货物批次", dataNew);

        // 添加信息到scdData
        Object.assign(scdData, scdData, dataNew);

        console.log("更新生产任务", scdData);

        let dt = new Date();
        
        // 修改生产任务批次
        x_show_loading.value = true;
        let ret = await eocore.proc(
            "p_sccp_upd", {
                "v_sccp_id": scdData["f_sccp_id"],
                "v_scy_id": scyId,
                "v_kcmxrk_id": dataNew["f_kcmxrk_id"], // 生产货物批次
                "v_cpdy_id": scdData["f_cpdy_id"],                
                "v_jhsj": scdData["f_jhsj"],
                "v_jhsl": scdData["f_jhsl"],
                "v_dqsl": bzsl,
                "v_wcsj": eolib.datetime_2_string(dt),
                "v_yxdj": scdData["f_yxdj"],
                "v_yxbz": scdData["f_yxbz"],
                "v_beizhu": scdData["f_beizhu"]
            });
        x_show_loading.value = false;
        dataNew = eocore.check_net_object(ret);
        if (dataNew == undefined) return;


        let data2: any;
        // 移除使用的部件物料
        for (let d of scwlList) {
            
            // 部件数量，生产所需要的数量
            const bjsl = d["f_bjsl"];
            // 单件数量
            const cpsl = d["f_cpsl"];
            const sysl = cpsl - bjsl;

            if (sysl > 0) {

                // 如果物料没有用完，先拆分，再出库
                x_show_loading.value = true;
                const retData = await TLogic.netLoad_kcmx_cf(scyId, d, bjsl);
                x_show_loading.value = false;

                console.log("库存拆分", retData);

                data2 = retData.dataNew2;

            } else {
                // 如果物料全部用完，直接出库

                data2 = d;
            }

            console.log("部件出库", sysl, data2);

            x_show_loading.value = true;
            ret = await eocore.proc(
                "p_kcmxck_upd", {
                    "v_kcmxck_id": 0,
                    "v_kcmxrk_id": data2["f_kcmxrk_id"], // 入库编号
                    "v_cklb": rklb,
                    "v_ckd_id": 0, // 直接盘库新增
                    "v_kgy_id": scyId,
                    "v_cksl": data2["f_cpsl"],
                    "v_ckdj": data2["f_cpdj"],
                    "v_wlgs_id": 0,
                    "v_wldh": "",
                    "v_beizhu": data2["f_beizhu"]
            });
            x_show_loading.value = false;
        }

        // 弹出显示生产结果
        v_scdcp_xx.value?.showDialog(scdData);

        // 更新表格
        v_table_sccp.value?.update_data(scdData, -1, false, false);
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_sccp = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_sccp_query(pageIndex - 1);
    }

    const onDialogClose_sccp = (cancel: boolean, data: any, cb: (result: boolean) => void) => {
        if (cancel) {
            cb(true); return;
        }
        
        netLoad_sccp_query(-1);
        
        cb(true);
    }

    const onDialogClose_scwl = async (cancel: boolean, data: any, cb: (result: boolean) => void) => {
        if (cancel) {
            cb(true); return;
        }

        const cpbjData = v_table_cpbj.value?.get_select_data();
        if (!cpbjData) return;

        let ret = await eocore.proc("p_scbj_upd", {
            "v_scbj_id": cpbjData["f_scbj_id"],
            "v_sccp_id": cpbjData["f_sccp_id"],
            "v_cpbj_id": cpbjData["f_cpbj_id"],
            "v_kcmxrk_id": data["f_kcmxrk_id"],
            "v_scbz": 0,
            "v_beizhu": "",
        });
        let dataNew = eocore.check_net_object(ret);
        if (dataNew == undefined) {
            cb(false); return;
        }

        Object.assign(cpbjData, cpbjData, dataNew);

        console.log(cpbjData);
        v_table_cpbj.value?.update_data(cpbjData, -1, false, false);
        
        cb(true);
    }

    const onDialogClose_scdcp_xx = (cancel: boolean, data: any, cb: (result: boolean) => void) => {
        if (cancel) {
            cb(true); return;
        }
        cb(true);
    }

</script>

<style lang="scss" scoped>
</style>