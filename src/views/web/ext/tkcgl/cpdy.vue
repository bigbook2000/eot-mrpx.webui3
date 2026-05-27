<template>
    <!-- 产品管理 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_row">
            <!-- 左侧：产品类别树 -->
            <div class="eo_row_d eo_scroll_v" style="width:350px;">
                <el-tree ref="v_tree_cplb"
                    :highlight-current="true"
                    :default-expanded-keys="x_expanded_keys"
                    :expand-on-click-node="false"
                    node-key="value"
                    :data="x_tree_cplb" 
                    :props="x_tree_props" 
                    @node-click="onTreeNodeClick_cplb">
                    <template #default="{ node, data }">
                        <el-icon size="16" color="#409eff">
                            <FolderOpened />
                        </el-icon>
                        <span style="padding:2px 5px;">{{ node.label }}</span>
                    </template>
                </el-tree>
            </div>
            
            <!-- 分隔线 -->
            <div class="eo_line_v"></div>
            
            <!-- 右侧：产品表格 -->
            <div class="eo_row_f">
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
                            <div class="cell">
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_cpdy">查找</el-button>
                                </div>                        
                            </div>
                        </div>
                    </div>
                    <div class="eo_col_sp"></div>
                    <div class="eo_tool_bar">
                        <div class="eo_form">
                            <div class="cell">
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Add_cpdy">添加产品</vbuttonk>
                                <vbuttonk type="default" class="input_w" permit="" 
                                    @click="onButtonClick_Del_cpdy">删除产品</vbuttonk>
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Upd_cpdy">修改产品</vbuttonk>
                            </div>
                        </div>
                    </div>
                    
                    <div class="eo_col_f">
                        <vtable ref="v_table_cpdy" 
                            name="产品定义"
                            id-field="f_cpdy_id"
                            @loading="onTableLoading"
                            :on-item="onTableItem_cpdy"
                            :on-page="onTablePage_cpdy"
                            @row-click="onTableRowClick_cpdy">
                            <el-table-column prop="f_cpzt_s" label="状态" width="70" />
                            <el-table-column prop="f_cpbm" label="编码" width="160" />
                            <el-table-column prop="f_cpmc" label="名称" width="180" show-overflow-tooltip />
                            <el-table-column prop="f_cpjg_s" label="定价" width="120" align="right" />
                            <el-table-column prop="f_kcsl" label="库存数量" width="120" align="right" />
                            <el-table-column prop="f_kcdj_s" label="库存单价" width="120" align="right" />
                            <el-table-column prop="f_bzsl" label="单件数量" width="100" />
                            <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                            <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
                            <el-table-column prop="f_cpzl" label="重量" width="160" show-overflow-tooltip />
                            <el-table-column prop="f_cpdw" label="单位" width="100" show-overflow-tooltip />
                            <el-table-column prop="f_dlmc" label="大类" width="120" show-overflow-tooltip />
                            <el-table-column prop="f_xlmc" label="小类" width="140" show-overflow-tooltip />
                            <el-table-column prop="f_cjsj_s" label="上架时间" width="140" />
                            <el-table-column prop="f_cpms" label="描述" width="200" show-overflow-tooltip />
                            <el-table-column />
                        </vtable>
                    </div>
                    <div class="eo_page_bar">
                        <el-pagination
                            background
                            @current-change="onPageChange_cpdy"
                            :current-page="x_page_index"
                            :page-size="x_page_row_count"
                            layout="total, prev, pager, next, jumper"
                            :total="x_row_total">
                        </el-pagination>
                    </div>
                    <div class="eo_col_d" style="height:300px;">
                        <vtable ref="v_table_cpbj" 
                            name="产品部件"
                            id-field="f_cpbj_id"
                            @loading="onTableLoading"
                            :on-item="onTableItem_cpdy"
                            @row-click="onTableRowClick_cpbj">
                            <el-table-column prop="f_cpzt_s" label="状态" width="70" />
                            <el-table-column prop="f_cpbm" label="编码" width="160" />
                            <el-table-column prop="f_cpmc" label="名称" width="180" show-overflow-tooltip />
                            <el-table-column prop="f_bjsl" label="部件数量" width="100" />
                            <el-table-column prop="f_cpjg_s" label="定价" width="120" align="right" />
                            <el-table-column prop="f_kcsl" label="库存数量" width="120" align="right" />
                            <el-table-column prop="f_kcdj_s" label="库存单价" width="120" align="right" />
                            <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                            <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
                            <el-table-column prop="f_cpzl" label="重量" width="160" show-overflow-tooltip />
                            <el-table-column prop="f_cpdw" label="单位" width="100" show-overflow-tooltip />
                            <el-table-column prop="f_dlmc" label="大类" width="120" show-overflow-tooltip />
                            <el-table-column prop="f_xlmc" label="小类" width="140" show-overflow-tooltip />
                            <el-table-column prop="f_cjsj_s" label="上架时间" width="140" />
                            <el-table-column prop="f_cpms" label="描述" width="200" show-overflow-tooltip />
                            <el-table-column />
                        </vtable>
                    </div>
                    <div class="eo_tool_bar">
                        <div class="eo_form">
                            <div class="cell">
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Add_cpbj">添加部件</vbuttonk>
                                <vbuttonk type="default" class="input_w" permit="" 
                                    @click="onButtonClick_Del_cpbj">删除部件</vbuttonk>
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Upd_cpbj">修改部件</vbuttonk>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 产品编辑对话框 -->
        <cpdy_xx ref="v_cpdy_xx" @close="onFormdClose_cpdy"/>
        <!-- 产品部件编辑对话框 -->
        <cpdy_bj ref="v_cpdy_bj" @close="onDialogClose_cpbj"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_kcgl_cpdy" }
</script>

<script lang="ts" setup>
    import { ref, nextTick, onMounted, type Ref } from "vue"
    import type { cform_options, cfunc_boolean, cdic_item, ctree_node } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import { ElTree } from 'element-plus'
    import vbuttonk from "@/components/web/vbuttonk.vue"
    import vtable from "@/components/web/vtable.vue"
    import cpdy_xx from "./cpdy_xx.vue"
    import cpdy_bj from "./cpdy_bj.vue"
    import TLogic from "@/logic/TLogic";

    const v_tree_cplb = ref<InstanceType<typeof ElTree>>();

    type t_table = InstanceType<typeof vtable>;
    const v_table_cpdy = ref<t_table>();
    const v_table_cpbj = ref<t_table>();

    type t_cpdy_xx = InstanceType<typeof cpdy_xx>;
    const v_cpdy_xx = ref<t_cpdy_xx>();
    
    type t_cpdy_bj = InstanceType<typeof cpdy_bj>;
    const v_cpdy_bj = ref<t_cpdy_bj>();

    const x_tree_props = {
        children: "children",
        label: "label",
    }
    let x_tree_filter = ref("");
    let x_expanded_keys = ref<number[]>([]);

    let x_show_loading = ref(false);
    let x_tree_cplb = ref<any[]>([]);

    let m_cplb_list: any[] = [];

    const x_query_cpmc = ref("");

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    onMounted(async () => {

        // 加载产品类别树
        await loadTree_cplb();
        await netLoad_cpdy_query(-1);
    });

    const loadTree_cplb = async () => {
            
        m_cplb_list = await TLogic.netload_Tree_cplb(false);

        x_expanded_keys.value = [0];
        x_tree_cplb.value = [{
            "value": 0,
            "label": "全部",
            "level": 0,
            children: m_cplb_list
        }];

        await nextTick();
        v_tree_cplb.value?.setCurrentKey(0);
    }

    const netLoad_cpdy_query = (pageIndex: number = -1) => {

        let cpdlId = 0;
        let cpxlId = 0;
        
        let cplbData = v_tree_cplb.value?.getCurrentNode();
        if (cplbData != undefined) {
            cpdlId = eocore.to_int(cplbData["f_cpdl_id"]);
            cpxlId = eocore.to_int(cplbData["f_cpxl_id"]);
        }

        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        v_table_cpdy.value?.load_list_proc("p_cpdy_query", {             
            "v_cpdl_id": cpdlId,
            "v_cpxl_id": cpxlId,
            "v_cpmc": x_query_cpmc.value,
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
    }

    const getCode_cpbm = async (data: any): Promise<String> => { 

        let cpdlData = undefined;
        let cpxlData = undefined;

        for (let d1 of m_cplb_list) {
            if (d1["f_cpdl_id"] == data["f_cpdl_id"]) {
                cpdlData = d1;

                let list = d1.children;
                for (let d2 of list) {
                    if (d2["f_cpxl_id"] == data["f_cpxl_id"]) {
                        cpxlData = d2;
                        break;
                    }
                }
                break;
            }
        }

        console.log(cpdlData, cpxlData, m_cplb_list, data);

        if (cpdlData == undefined || cpxlData == undefined) return "";

        let recordId = await TLogic.netLoad_SeekID("tcpxl", "f_cpxl_id", cpxlData["f_cpxl_id"]);
        // 产品编码 = 2大类编码 + 4小类编码 + 6位产品编号
        return cpdlData["f_dlbm"] + cpxlData["f_xlbm"] + String(recordId).padStart(6, '0');
    }

    const onTableLoading = (show: boolean) => {
        x_show_loading.value = show;
    }
    const onTableItem_cpdy = (data: any) => {
        data["f_cpzt_s"] = "";
        if (data["f_cpzt"] == 0) data["f_cpzt_s"] = "停产";

        data["f_cpjg_s"] = eolib.fixed_num(data["f_cpjg"], 3);
                
        let cpsl = eocore.to_float(data["f_cpsl"]);
        let cpzj = eocore.to_float(data["f_cpzj"]);
        if (cpsl > 0.0) cpzj = cpzj / cpsl;
        data["f_kcdj_s"] = eolib.fixed_num(cpzj, 3);
    }

    const onTablePage_cpdy = (n: number): number => {
        x_row_total.value = n;
        return n;
    }

    const onTreeNodeClick_cplb = (data: any, node: any, event: any) => {
        netLoad_cpdy_query(-1);
    }

    const onTableRowClick_cpdy = (data: any) => {
         // 部件列表
        v_table_cpbj.value?.load_list_proc("p_cpbj_list", {             
            "v_cpdy_pid": data["f_cpdy_id"]
        });
    }

    const onTableRowClick_cpbj = (data: any) => {       
    }

    /**
     * 点击分页
     * @param pageIndex 
     */
    const onPageChange_cpdy = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_cpdy_query(pageIndex - 1);
    }

    // ========== 产品操作 ==========
    const onButtonClick_Add_cpdy = () => {

        let node = v_tree_cplb.value?.getCurrentNode();
        const cpdlId = eocore.to_int(node?.["f_cpdl_id"] || 0);
        const cpxlId = eocore.to_int(node?.["f_cpxl_id"] || 0);
 
        let cpdyData = {
            "f_cpdy_id": 0,
            "f_cpdl_id": cpdlId,
            "f_cpxl_id": cpxlId,
            "f_cpdl_id_s": "", // 大类名称
            "f_cplb_id_s": "", // 小类名称
            "f_cpbm": "",   // 产品编码
            "f_cpmc": "",     // 产品名称
            "f_cpgg": "",     // 产品规格
            "f_cpcc": "",     // 产品尺寸
            "f_cpzl": "",     // 产品重量
            "f_cpdw": "",     // 产品单位
            "f_bzsl": 1,      // 产品数量
            "f_cpjg": 0,      // 产品价格
            "f_cpzt": 1,      // 产品状态（1:启用，0:禁用）
            "f_cpms": "",      // 产品描述
            "f_cjsj": eolib.datetime_2_string(new Date()),
        };
        
        v_cpdy_xx.value?.show_dialog(cpdyData, m_cplb_list);
    }

    const onButtonClick_Del_cpdy = async () => {
        await v_table_cpdy.value?.remove_data_proc_select("p_cpdy_del", async (data: any) => {
            return {
                "v_cpdy_id": data["f_cpdy_id"]
            };
        });
    }

    const onButtonClick_Upd_cpdy = () => {
        let cpdyData = v_table_cpdy.value?.get_select_data(true);
        if (!cpdyData) return;
        
        v_cpdy_xx.value?.show_dialog(cpdyData, m_cplb_list);
    }

    const onButtonClick_Load_cpdy = () => {
        netLoad_cpdy_query(-1);
    }

    const onFormdClose_cpdy = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true);
            return;
        }
        
        // 验证数据
        if (!data["f_cpmc"]) {
            eocore.show_info("请填写完整的产品名称");
            cb(false);
            return;
        }

        if (!data["f_cpdl_id"] || !data["f_cpxl_id"]) {
            eocore.show_info("请选择产品大类和小类");
            cb(false);
            return;
        }

        let isAdd = data["f_cpdy_id"] == 0;
        if (isAdd) { 
            data["f_cpbm"] = await getCode_cpbm(data);
        }

        if (!data["f_cpbm"]) {
            eocore.show_info("请输入产品编码");
            cb(false);
            return;
        }

        await v_table_cpdy.value?.update_data_proc(
            "p_cpdy_upd", {
                "v_cpdy_id": data["f_cpdy_id"],
                "v_cpxl_id": data["f_cpxl_id"],
                "v_cpbm": data["f_cpbm"],
                "v_cpmc": data["f_cpmc"],
                "v_cpgg": data["f_cpgg"],
                "v_cpcc": data["f_cpcc"],
                "v_cpzl": data["f_cpzl"],                
                "v_cpdw": data["f_cpdw"],
                "v_bzsl": data["f_bzsl"],
                "v_cpjg": data["f_cpjg"],
                "v_cpzt": data["f_cpzt"],
                "v_cpms": data["f_cpms"]
            }, -1, isAdd, true);
        
        cb(true);
    }

    // ========== 部件操作 ==========
    const onButtonClick_Add_cpbj = () => {
        // 获取选中的产品数据
        let cpdyData = v_table_cpdy.value?.get_select_data(true);
        if (!cpdyData) {
            eocore.show_info("请先选择一个产品工艺");
            return;
        }
        
        // 准备部件数据
        let cpbjData = {
            f_cpbj_id: 0,
            f_cpdy_pid: cpdyData["f_cpdy_id"],
            f_cpbm_p: cpdyData["f_cpbm"],
            f_cpmc_p: cpdyData["f_cpmc"],            
            f_cpdy_id: 0,
            f_cpbm: "",   // 部件编码
            f_cpmc: "",   // 部件名称
            f_bjsl: 1.0,  // 部件数量
            f_beizhu: ""  // 备注
        };
        
        // 显示部件编辑对话框
        v_cpdy_bj.value?.showDialog(cpbjData, []);
    }
    const onButtonClick_Del_cpbj = async () => {
        await v_table_cpbj.value?.remove_data_proc_select("p_cpbj_del", async (data: any) => {
            return {
                "v_cpbj_id": data["f_cpbj_id"]
            };
        });
    }

    const onButtonClick_Upd_cpbj = () => {
        // 获取选中的产品数据
        let cpdyData = v_table_cpdy.value?.get_select_data(true);
        if (!cpdyData) {
            eocore.show_info("请先选择一个产品工艺");
            return;
        }

        let cpbjData = v_table_cpbj.value?.get_select_data(true);
        if (!cpbjData) return;

        cpbjData["f_cpdy_pid"] = cpdyData["f_cpdy_id"];
        cpbjData["f_cpbm_p"] = cpdyData["f_cpbm"];
        cpbjData["f_cpmc_p"] = cpdyData["f_cpmc"];

        v_cpdy_bj.value?.showDialog(cpbjData, []);
    }

    const onDialogClose_cpbj = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        
        if (cancel) {
            cb(true); return;
        }

        let list = v_table_cpbj.value?.get_list() || [];
        let isAdd = true;

        let cpbjId = data["f_cpbj_id"];
        for (let d of list) {
            if (d["f_cpbj_id"] == cpbjId) {
                isAdd = false;
                break;
            }
        }

        // 部件列表
        v_table_cpbj.value?.update_data(data, -1, isAdd, true);

        cb(true);
    }

</script>

<style lang="scss" scoped>
</style>