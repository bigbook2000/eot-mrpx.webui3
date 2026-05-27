<template>
    <!-- 生产管理 -->
    <div class="eo_page" v-loading="x_show_loading">    
        <div class="eo_col">
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w200p">
                        <div class="label_n">生产状态</div>
                        <div class="input">
                            <el-select style="width:100%" v-model="x_query_yxbz">
                                <el-option label="所有" :value="-1"></el-option>
                                <el-option label="进行中" :value="0"></el-option>
                                <el-option label="已完成" :value="1"></el-option>
                            </el-select>
                        </div>
                    </div>
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
                                    <el-table-column prop="f_jhsj_s" label="计划时间" width="140" />
                                    <el-table-column prop="f_cpmc" label="名称" width="180" show-overflow-tooltip />
                                    <el-table-column prop="f_kcbh" label="批次" width="180" show-overflow-tooltip />
                                    <el-table-column prop="f_bzsl" label="单件数量" width="100" />
                                    <el-table-column prop="f_kcdj_s" label="单价" width="120" align="right" sortable />                                    
                                    <el-table-column prop="f_wcsj_s" label="完成时间" width="140" />                                    
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
                                    <el-table-column prop="f_kcsl" label="数量" width="100" />
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
    import vbuttonk from "@/components/web/vbuttonk.vue"
    import vtable from "@/components/web/vtable.vue"
    
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import scdcp_xx from "./scdcp_xx.vue";
    import scd_xx from "./scd_xx.vue";
    import scwl_list from "./scwl_list.vue";

    type t_table = InstanceType<typeof vtable>;
    const v_table_sccp = ref<t_table>();
    const v_table_cpbj = ref<t_table>();
    const v_scd_xx = ref<InstanceType<typeof scd_xx>>();
    const v_scwl_list = ref<InstanceType<typeof scwl_list>>();
    const v_scdcp_xx = ref<InstanceType<typeof scdcp_xx>>();

    let x_show_loading = ref(false);

    const x_query_yxbz = ref(0);
    const x_query_cpmc = ref("");
    const x_query_jhsj = ref<[string, string] | null>(null);

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    onMounted(async () => {
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
            "v_yxbz": x_query_yxbz.value,
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
        const list1 = eocore.check_net_array(ret);
        if (list1 == undefined) return;

        const ids = list1.filter(x => x["f_kcmx_id"] > 0).map(x => x["f_kcmx_id"]).join(",");
        if (ids.length > 0) {

            ret = await eocore.proc("p_kcmx_ids", {
                "v_kcmx_ids": ids
            });
        
            let list2 = eocore.check_net_array(ret);
            if (list2 == undefined) return;

            eolib.list_merge(list1, list2, "f_kcmx_id", "f_kcmx_id");
        }

        v_table_sccp.value?.load_list(list1);
        v_table_cpbj.value?.load_list([]);
    }

    const netLoad_scbj_list = async (sccpData: any): Promise<any[]|undefined> => {

        // 生产工艺
        x_show_loading.value = true;
        let ret = await eocore.proc("p_cpbj_list", {
            "v_cpdy_pid": sccpData["f_cpdy_id"] 
        });
        let list1 = eocore.check_net_array(ret);
        x_show_loading.value = false;
        if (list1 == undefined) return undefined;

        // 生产部件
        x_show_loading.value = true;
        ret = await eocore.proc("p_scbj_list", {
            "v_sccp_id": sccpData["f_sccp_id"] 
        });
        let list2 = eocore.check_net_array(ret);
        x_show_loading.value = false;
        if (list2 == undefined) return undefined;

        // 通过f_cpbj_id关联生产
        eolib.list_merge(list1, list2, "f_cpbj_id", "f_cpbj_id", {
            "f_sccp_id": sccpData["f_sccp_id"], 
            "f_scbj_id": 0, 
            "f_kcmx_id": 0
        });

        // 库存批次
        const ids = list2.filter(x => x["f_kcmx_id"] > 0).map(x => x["f_kcmx_id"]).join(",");
        if (ids.length <= 0) {            
            return v_table_cpbj.value?.load_list(list1);
        }

        x_show_loading.value = true;
        ret = await eocore.proc("p_kcmx_ids", {
            "v_kcmx_ids": ids 
        });
        let list3 = eocore.check_net_array(ret);
        x_show_loading.value = false;
        if (list3 == undefined) return undefined;

        // 关联库存
        eolib.list_merge(list1, list3, "f_kcmx_id", "f_kcmx_id", {
            "f_kcbh": "", 
            "f_cpsl": 0, 
            "f_cpdj": 0.0,
            "f_hwck": 0,
            "f_beizhu": ""
        });
        
        return v_table_cpbj.value?.load_list(list1);
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
        TLogic.updateDicUserData(data, ["f_scy_id"]);
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
        await v_table_sccp.value?.remove_data_proc_select("p_sccp_del", (data: any) => {
            return {
                "v_sccp_id": data["f_sccp_id"]
            };
        });
        v_table_cpbj.value?.load_list([]);
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
     * 生产加工
     * @param sccpData 
     */
    const netLoad_scjg = async (sccpData: any): Promise<any> => {

        // 更新生产部件
        const scwlList = await netLoad_scbj_list(sccpData);
        if (scwlList == undefined) return;

        let cpzj = 0;
        for (let d of scwlList) {
            if (!eocore.check_id(d, "f_kcmx_id")) {
                eocore.show_info("未指定生产物料");
                return undefined;
            }

            // 每个部件只能消耗一个批次
            // 如果需要的同样的部件数量大于单件数量，则添加多个相同部件，确保每个部件小于单件数量

            // 部件数量，生产所需要的数量
            const bjsl = d["f_bjsl"];

            // 实际库存数量
            const kcsl = d["f_kcsl"];
            if (kcsl < bjsl) {
                eocore.show_info("数量不足");
                return undefined;
            }

            // 计算实际单价
            const cpdj = eocore.to_float(d["f_kcdj"]);

            // 计算实际总价
            cpzj += bjsl * cpdj;
        }

        let scyId = TGlobal.userData["f_user_id"];

        let bzsl = sccpData["f_bzsl"];
        if (bzsl <= 0) bzsl = 1;

        // 创建一个新的批号的货物
        let kcbh = await TLogic.netLoad_RecordString_kcbh(
            sccpData["f_cpdy_id"], sccpData["f_cpbm"]);
        let dataNew = await TLogic.netLoad_kcmx_upd(
            0,
            0,
            sccpData["f_cpdy_id"],
            kcbh,
            "生产入库",
            sccpData["f_sccp_id"],
            0,
            cpzj / bzsl,
            bzsl,
            scyId,
            sccpData["f_beizhu"],
            TLogic.kcbzCodes["临时"]
        );
        if (dataNew == undefined) return undefined;

        // sccpData
        Object.assign(sccpData, sccpData, dataNew);

        let dt = new Date();
        
        // 修改生产任务批次
        let ret = await eocore.proc(
            "p_sccp_upd", {
                "v_sccp_id": sccpData["f_sccp_id"],
                "v_scy_id": scyId,
                "v_kcmx_id": dataNew["f_kcmx_id"], // 生产货物批次
                "v_cpdy_id": sccpData["f_cpdy_id"],                
                "v_jhsj": sccpData["f_jhsj"],
                "v_jhsl": sccpData["f_jhsl"],
                "v_dqsl": bzsl,
                "v_wcsj": eolib.datetime_2_string(dt),
                "v_yxdj": sccpData["f_yxdj"],
                "v_yxbz": 1, // 1:完成 0:未完成
                "v_beizhu": sccpData["f_beizhu"]
            });
        dataNew = eocore.check_net_object(ret);
        if (dataNew == undefined) return undefined;

        let data2: any;
        // 移除使用的部件物料
        for (let d of scwlList) {
            
            // 部件数量，生产所需要的数量
            const bjsl = d["f_bjsl"];
            // 单件数量
            const kcsl = d["f_kcsl"];
            const sysl = kcsl - bjsl;

            if (sysl > 0) {

                // 如果物料没有用完，先拆分，再出库
                // 用的是新批号，剩余的是旧批号
                const retData = await TLogic.netLoad_kcmx_cf(scyId, d, bjsl);
                if (retData == undefined) return undefined;

                const data1 = retData.dataNew1;

                // 借用状态保持
                ret = await eocore.proc(
                    "p_kcjy_upd", {
                        "v_kcjy_id": 0,
                        "v_kcmx_id": data1["f_kcmx_id"],
                        "v_cpdy_id": data1["f_cpdy_id"],
                        "v_jyyg_id": scyId,
                        "v_jyzt": 1, // 生产
                        "v_kgy_id": scyId,
                        "v_beizhu": ""
                    });
                eocore.check_net_object(ret);

                data2 = retData.dataNew2;

            } else {
                // 如果物料全部用完，直接出库

                data2 = d;
            }

            let dataNew = await TLogic.netLoad_kcmx_upd(
                data2["f_kcmx_id"],
                0, // 关联
                data2["f_cpdy_id"],
                data2["f_kcbh"],
                "生产出库",
                sccpData["f_sccp_id"],
                data2["f_hwck"],
                data2["f_kcdj"],
                data2["f_kcsl"],
                scyId,
                data2["f_beizhu"],
                TLogic.kcbzCodes["历史"]
            );
            if (dataNew == undefined) return undefined;

            // 由于使用的是新批号，所以这里需要更新批次
            ret = await eocore.proc("p_scbj_upd", {
                "v_scbj_id": d["f_scbj_id"],
                "v_sccp_id": d["f_sccp_id"],
                "v_cpbj_id": d["f_cpbj_id"],
                "v_kcmx_id": data2["f_kcmx_id"],
                "v_scbz": 1,
                "v_beizhu": "",
            });
            dataNew = eocore.check_net_object(ret);
            if (dataNew == undefined) return undefined;
        }

        return sccpData;
    }

    /**
     * 点击进行生产
     */
    const onButtonClick_New_scwl = async () => {

        let sccpData = v_table_sccp.value?.get_select_data(true);        
        if (sccpData == undefined) return;

        if (sccpData["f_kcmx_id"] > 0) {
            eocore.show_info("当前批次的生产已经完成，请勿重复生产");
            return;
        }

        let det = await eocore.show_confirm("确定要进行生产 " + sccpData["f_cpmc"] + " 吗？");
        if (!det) return;

        x_show_loading.value = true;
        const ret = await netLoad_scjg(sccpData);
        x_show_loading.value = false;
        if (ret == undefined) return;

        // 弹出显示生产结果
        v_scdcp_xx.value?.showDialog(sccpData);

        // 更新表格
        v_table_sccp.value?.update_data(sccpData, -1, false, false);
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
            "v_kcmx_id": data["f_kcmx_id"],
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

    const onDialogClose_scdcp_xx = async (cancel: boolean, data: any, cb: (result: boolean) => void) => {
        if (cancel) {
            cb(true); return;
        }

        // 生产成功，标识改为正常
        x_show_loading.value = true;                
        const ret = await eocore.proc("p_kcmx_kcbz", {
            "v_kcmx_ids": "" + data["f_kcmx_id"],
            "v_cpdy_ids": "" + data["f_cpdy_id"],
            "v_kcbz": TLogic.kcbzCodes["正常"]
        });
        eocore.check_net_object(ret);
        x_show_loading.value = false;

        cb(true);
    }

</script>

<style lang="scss" scoped>
</style>