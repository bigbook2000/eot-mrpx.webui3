<template>
    <!-- 产品选择列表 -->
    <vdialog ref="v_dialog"
        width="1200px" title="选择产品"
        @close="onDialogClose"
        @open="onDialogOpen">
        <div class="eo_col" style="height:500px;">
            <!-- 查询工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell" style="width:400px;">
                        <div class="label_n">产品类别</div>
                        <div class="input">
                            <tcplb v-model="x_query_cplb_d" :cplb-list="x_cplb_list"></tcplb>
                        </div>
                    </div>
                    <div class="cell eo_w240p">
                        <div class="label_n">产品名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_cpmc" placeholder="产品名称"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w240p">
                        <div class="label_n">产品编码</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_cpbm" placeholder="产品编码"></el-input>
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
            
            <!-- 产品表格 -->
            <div class="eo_col_f">
                <vtable ref="v_table_cpdy" 
                    name="产品定义"
                    check="single" 
                    id-field="f_cpdy_id"
                    @loading="onTableLoading"
                    :on-item="onTableItem_cpdy"
                    :on-page="onTablePage_cpdy"
                    @row-click="onTableRowClick_cpdy">
                    <el-table-column prop="f_cpzt_s" label="状态" width="70" />
                    <el-table-column prop="f_cpbm" label="编码" width="160" />
                    <el-table-column prop="f_cpmc" label="名称" width="180" show-overflow-tooltip />
                    <el-table-column prop="f_cpjg_s" label="定价" width="120" align="right" />
                    <el-table-column prop="f_cpsl" label="库存数量" width="120" align="right" />
                    <el-table-column prop="f_cpdj_s" label="库存单价" width="120" align="right" />
                    <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                    <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
                    <el-table-column prop="f_cpzl" label="重量" width="160" show-overflow-tooltip />
                    <el-table-column prop="f_cpdw" label="单位" width="100" show-overflow-tooltip />

                    <el-table-column prop="f_dlmc" label="大类" width="120" show-overflow-tooltip />
                    <el-table-column prop="f_xlmc" label="小类" width="140" show-overflow-tooltip />
                    <el-table-column />
                </vtable>
            </div>
            
            <!-- 分页 -->
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
        </div>
    </vdialog>
</template>


<script lang="ts" setup>
    import { ref } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import vdialog from "@/logic/common/vdialog.vue"
    import vtable from "@/logic/common/vtable.vue"

    import tcplb from "@/views/frame/ext/comm/tcplb.vue"
    import TLogic from "@/logic/TLogic";

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();
    
    type t_table = InstanceType<typeof vtable>;
    const v_table_cpdy = ref<t_table>();

    // 定义组件事件
    const emit = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    const x_cplb_list = ref<any[]>([]);

    // 查询条件
    const x_query_cplb_d = ref([0, 0]);
    const x_query_cpmc = ref("");
    const x_query_cpbm = ref("");

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
        v_table_cpdy.value?.load_list([]);
        
        // 初始化查询条件
        x_query_cpmc.value = "";
        x_query_cpbm.value = "";

        x_cplb_list.value = await TLogic.netload_Tree_cplb(true);
    }
    const onDialogOpen = (data: any) => {

        // 加载产品数据
        netLoad_cpdy_query(-1);
    }

    /**
     * 查询产品数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_cpdy_query = async (pageIndex: number = -1) => {

        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        await v_table_cpdy.value?.load_list_proc("p_cpdy_query", {             
            "v_cpdl_id": -1,
            "v_cpxl_id": -1,
            "v_cpmc": x_query_cpmc.value,
            "v_cpbm": x_query_cpbm.value,
            "v_cpzt": 1, // 只显示启用的产品
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
    }

    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_cpdy = (data: any) => {
        data["f_cpzt_s"] = "";
        if (data["f_cpzt"] == 0) data["f_cpzt_s"] = "停产";
        else if (data["f_cpzt"] == 1) data["f_cpzt_s"] = "正常";
        
        // 格式化价格
        data["f_cpjg_s"] = eolib.fixed_num(data["f_cpjg"], 3);
        let cpsl = eocore.to_float(data["f_cpsl"]);
        let cpdj = eocore.to_float(data["f_cpzj"]);
        if (cpsl > 0.0) cpdj = cpdj / cpsl;
        data["f_cpdj_s"] = eolib.fixed_num(cpdj, 3);
    }

    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_cpdy = (n: number): number => {
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
    const onTableRowClick_cpdy = (data: any) => {
        // 点击行后的操作，如选中高亮等
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_cpdy = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_cpdy_query(pageIndex - 1);
    }

    /**
     * 查找按钮点击
     */
    const onButtonClick_Load_cpdy = () => {
        netLoad_cpdy_query(-1);
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
        let selectedData = v_table_cpdy.value?.get_select_data(true);
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