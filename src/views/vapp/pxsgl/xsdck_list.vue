<template>
    <!-- 销售出库选择列表 -->
    <vdialog ref="v_dialog"
        width="1200px" title="选择销售出库"
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
                    <div class="cell eo_w240p">
                        <div class="label_n">名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_cpmc" placeholder="产品名称"></el-input>
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
                <vtable ref="v_table_xsdck" 
                    name="库存明细"
                    check="single" 
                    id-field="f_kcmx_id"
                    @loading="onTableLoading"
                    :on-item="onTableItem_xsdck"
                    :on-page="onTablePage_xsdck"
                    @row-click="onTableRowClick_xsdck">
                    <el-table-column prop="f_cjsj_s" label="时间" width="140" />
                    <el-table-column prop="f_kcbh" label="批次" width="200" />
                    <el-table-column prop="f_cpmc" label="产品名称" width="180" show-overflow-tooltip />                    
                    <el-table-column prop="f_xsje_s" label="金额" width="120" align="right" />
                    <el-table-column prop="f_kcsl" label="数量" width="120" />
                    <el-table-column prop="f_xsy_id_s" label="销售员" width="120" />
                    <el-table-column prop="f_khgl_id_s" label="客户" width="280" show-overflow-tooltip />
                    <el-table-column prop="f_xsdh" label="订单号" width="160" />
                    <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                    <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
                    <el-table-column prop="f_cpzl" label="重量" width="160" show-overflow-tooltip />
                    <el-table-column prop="f_cpdw" label="单位" width="100" show-overflow-tooltip />
                    <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                    <el-table-column />
                </vtable>
            </div>
            
            <!-- 分页 -->
            <div class="eo_page_bar">
                <el-pagination
                    background
                    @current-change="onPageChange_xsdck"
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

    import tcplb from "@/views/vweb/ext/comm/tcplb.vue"
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();
    
    type t_table = InstanceType<typeof vtable>;
    const v_table_xsdck = ref<t_table>();

    // 定义组件事件
    const emit = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 查询条件
    const x_query_kcbh = ref("");
    const x_query_cpmc = ref("");

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const show_dialog = async (data: any) => {

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);
        v_table_xsdck.value?.load_list([]);
    }
    const onDialogOpen = (data: any) => {

        // 加载产品数据
        netLoad_xsdck_query(-1);
    }


    /**
     * 查询产品数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_xsdck_query = async (pageIndex: number = -1) => {

        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        v_table_xsdck.value?.load_list_proc("p_xsdck_query", { 
            "v_xsy_id": TGlobal.userData["f_user_id"],
            "v_khgl_id": -1,
            "v_khmc": "",
            "v_xsdh": "", 
            "v_cjsj1": "", 
            "v_cjsj2": "", 
            "v_kcbh": x_query_kcbh.value, 
            "v_cpmc": x_query_cpmc.value, 
            "v_order_by": " ORDER BY f_xsdck_id DESC",
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
    }

    
    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_xsdck = (data: any) => {

        data["f_cjsj_s"] = eolib.date_2_string(data["f_cjsj"]);

        data["f_xsje_s"] = 
            eolib.fixed_num(eocore.to_float(data["f_xsdj"] * data["f_kcsl"]), 2);
    }

    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_xsdck = (n: number): number => {
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
    const onTableRowClick_xsdck = (data: any) => {
        // 点击行后的操作，如选中高亮等
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_xsdck = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_xsdck_query(pageIndex - 1);
    }

    /**
     * 查找按钮点击
     */
    const onButtonClick_Load_kcmx = () => {
        netLoad_xsdck_query(-1);
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
        let selectedData = v_table_xsdck.value?.get_select_data(true);
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