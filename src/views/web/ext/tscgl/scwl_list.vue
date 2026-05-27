<template>
    <!-- 生产物料选择列表 -->
    <vdialog ref="v_dialog"
        width="1200px" title="选择物料"
        @close="onDialogClose"
        @open="onDialogOpen">
        <div class="eo_col" style="height:500px;">
            <!-- 查询工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w240p">
                        <div class="label_n">批次</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_kcbh" placeholder="产品批次"></el-input>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_kcmx">查找</el-button>
                        </div>                        
                    </div>
                </div>
            </div>
            
            <div class="eo_col_sp"></div>
            
            <!-- 产品表格 -->
            <div class="eo_col_f">
                <vtable ref="v_table_kcjy" 
                    name="库存明细"
                    check="single" 
                    id-field="f_kcjy_id"
                    @loading="onTableLoading"
                    :on-item="onTableItem_kcjy"
                    :on-page="onTablePage_kcjy"
                    @row-click="onTableRowClick_kcjy">
                    <el-table-column prop="f_jysj_s" label="时间" width="140" />
                    <el-table-column prop="f_kcbh" label="批次" width="200" />
                    <el-table-column prop="f_cpmc" label="产品名称" width="180" show-overflow-tooltip />
                    <el-table-column prop="f_kcsl" label="数量" width="120" />
                    <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                    <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
                    <el-table-column prop="f_cpzl" label="重量" width="160" show-overflow-tooltip />
                    <el-table-column prop="f_cpdw" label="单位" width="100" show-overflow-tooltip />
                    <el-table-column prop="f_kgy_id_s" label="库管员" width="120" show-overflow-tooltip />
                    <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                    <el-table-column />
                </vtable>
            </div>
            
            <!-- 分页 -->
            <div class="eo_page_bar">
                <el-pagination
                    background
                    @current-change="onPageChange_kcjy"
                    :current-page="x_page_index"
                    :page-size="x_page_row_count"
                    layout="total, prev, pager, next, jumper"
                    :total="x_row_total">
                </el-pagination>
            </div>
        </div>
    </vdialog>
</template>


<script lang="ts" setup>
    import { ref } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import vdialog from "@/components/web/vdialog.vue"
    import vtable from "@/components/web/vtable.vue"

    import tcplb from "@/views/web/ext/comm/tcplb.vue"
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();
    
    type t_table = InstanceType<typeof vtable>;
    const v_table_kcjy = ref<t_table>();

    // 定义组件事件
    const emit = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 查询条件
    const x_query_kcbh = ref("");

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    let m_kcjy_data = {
        "f_cpbm": ""
    };

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const show_dialog = async (data: any) => {

        Object.assign(m_kcjy_data, m_kcjy_data, data);

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);
        v_table_kcjy.value?.load_list([]);
    }
    const onDialogOpen = (data: any) => {

        // 加载产品数据
        netLoad_kcmx_query(-1);
    }


    /**
     * 查询产品数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_kcmx_query = async (pageIndex: number = -1) => {

        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        v_table_kcjy.value?.load_list_proc("p_kcjy_query", { 
            "v_kcbz": TLogic.kcbzCodes["正常"],
            "v_kcbh": x_query_kcbh.value, 
            "v_kssj": "", 
            "v_jssj": "", 
            "v_jyzt": 1,  // 借用状态为1表示生产领料
            "v_jyyg_id": TGlobal.userData["f_user_id"], 
            "v_cpbm": m_kcjy_data["f_cpbm"], 
            "v_cpmc": "", 
            "v_order_by": " ORDER BY f_kcjy_id DESC",
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
    }

    
    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_kcjy = (data: any) => {
        data["f_cpzt_s"] = "";
        if (data["f_cpzt"] == 0) data["f_cpzt_s"] = "停产";
        else if (data["f_cpzt"] == 1) data["f_cpzt_s"] = "正常";
        
        // 格式化价格
        data["f_cpjg_s"] = eolib.fixed_num(data["f_cpjg"], 3);
        let kcsl = eocore.to_float(data["f_kcsl"]);
        let kcdj = eocore.to_float(data["f_kczj"]);
        if (kcsl > 0.0) kcdj = kcdj / kcsl;
        data["f_kcdj_s"] = eolib.fixed_num(kcdj, 3);
    }

    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_kcjy = (n: number): number => {
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
    const onTableRowClick_kcjy = (data: any) => {
        // 点击行后的操作，如选中高亮等
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_kcjy = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_kcmx_query(pageIndex - 1);
    }

    /**
     * 查找按钮点击
     */
    const onButtonClick_Load_kcmx = () => {
        netLoad_kcmx_query(-1);
    }

    /**
     * 对话框关闭事件
     */
    const onDialogClose = (cancel: boolean, tag: any, cb: cfunc_boolean) => {

        if (cancel) {
            emit('close', true, {}, cb);
            return;
        }
        
        // 获取选中的产品
        let selectedData = v_table_kcjy.value?.get_select_data(true);
        if (selectedData == undefined) {
            cb(false); return;
        }

        emit('close', false, selectedData, cb);
    }

    // 暴露方法给父组件使用
    defineExpose({
        show_dialog
    });
</script>

<style lang="scss" scoped>
</style>