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
                                    <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                                    <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
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
                                    <el-table-column prop="f_bzsl" label="包装数量" width="100" />
                                    <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                                    <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
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

    import scd_xx from "@/views/frame/ext/scgl/scd_xx.vue";
    import scwl_list from "@/views/frame/ext/scgl/scwl_list.vue";

    type t_table = InstanceType<typeof vtable>;
    const v_table_sccp = ref<t_table>();
    const v_table_cpbj = ref<t_table>();
    const v_scd_xx = ref<InstanceType<typeof scd_xx>>();
    const v_scwl_list = ref<InstanceType<typeof scwl_list>>();

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

    const netLoad_sccp_query = (pageIndex: number = -1) => {
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

        v_table_sccp.value?.load_list_proc("p_sccp_query", { 
            "v_scy_id": -1,
            "v_cpbm": "",
            "v_cpmc": x_query_cpmc.value,
            "v_kssj": kssj,
            "v_jssj": jssj,
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
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

        x_show_loading.value = true;
        let ret = await eocore.proc("p_cpbj_list", {
            "v_cpdy_pid": data["f_cpdy_id"] 
        });
        let list1 = eocore.check_net_array(ret);
        x_show_loading.value = false;

        if (list1 == undefined) return;

        x_show_loading.value = true;
        ret = await eocore.proc("p_scbj_list", {
            "v_sccp_id": data["f_sccp_id"] 
        });
        let list2 = eocore.check_net_array(ret);
        x_show_loading.value = false;

        if (list2 == undefined) return;

        // 通过f_cpbj_id关联
        for (let d1 of list1) {    
            d1["f_scbj_id"] = 0;
            d1["f_kcmxrk_id"] = 0;
            d1["f_kcbh"] = "";
            d1["f_sccp_id"] = data["f_sccp_id"];

            for (let d2 of list2) {
                if (d1["f_cpbj_id"] == d2["f_cpbj_id"]) {
                    d1["f_scbj_id"] = d2["f_scbj_id"];
                    d1["f_kcmxrk_id"] = d2["f_kcmxrk_id"];
                    d1["f_kcbh"] = d2["f_kcbh"];
                }
            }
        }
        
        v_table_cpbj.value?.load_list(list1);
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
        // 获取当前选中的行数据
        let selectedData = v_table_cpbj.value?.get_select_data();
        
        if (!selectedData) {
            eocore.show_info("请先选择要删除的记录");
            return;
        }
        
        // 确认删除对话框
        let confirmed = await eocore.show_confirm(`确定要删除 "${selectedData.f_cpmc || '该记录'}" 吗？`);
        if(confirmed) {
            // 实际的删除操作应在这里调用后端API
            eocore.show_info("正在删除选中的生产管理信息");
            // 示例：调用删除API
            // eocore.proc("p_scgl_del", { id: selectedData.f_cpdy_id }).then((result) => {
            //     if(result.success) {
            //         eocore.show_success("删除成功");
            //         netLoad_cpbj_query(); // 刷新列表
            //     } else {
            //         eocore.show_error("删除失败：" + result.message);
            //     }
            // });
        }
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

    const onButtonClick_New_scwl = () => {
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

        cpbjData["f_scbj_id"] = dataNew["f_scbj_id"];
        cpbjData["f_kcmxrk_id"] = dataNew["f_kcmxrk_id"];
        cpbjData["f_kcbh"] = dataNew["f_kcbh"];

        console.log(cpbjData);
        v_table_cpbj.value?.update_data(cpbjData, -1, false, false);
        
        cb(true);
    }
</script>

<style lang="scss" scoped>
</style>