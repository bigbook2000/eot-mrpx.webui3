<template>
    <!-- 库存选择列表 -->
    <vdialog ref="v_dialog"
        width="1200px" title="选择库存"
        @close="onDialogClose"
        @open="onDialogOpen">
        <div class="eo_col" style="height:500px;">
            <!-- 查询工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell" style="width:400px;">
                        <div class="label_n">产品类别</div>
                        <div class="input">
                            <tcplb v-model="x_query_cplb_d" :cplb-list="x_cplb_list" 
                            :disabled="x_query_fixed"/>
                        </div>
                    </div>
                    <div class="cell eo_w240p">
                        <div class="label_n">库存信息</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_kcxx" placeholder="批次或名称"
                                :disabled="x_query_fixed"></el-input>
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
                <vtable ref="v_table_kcmx" 
                    name="库存明细"
                    check="single" 
                    id-field="f_kcmx_id"
                    @loading="onTableLoading"
                    :on-item="onTableItem_kcmx"
                    :on-page="onTablePage_kcmx"
                    @row-click="onTableRowClick_kcmx"
                    @sort-change="onTableSortChange">
                    <el-table-column prop="f_jyzt_s" label="状态" width="80" />
                    <el-table-column prop="f_kcxx" label="库存信息" width="240" show-overflow-tooltip>
                        <template #default="scope">
                            <span>{{ scope.row.f_kcbh }}</span>
                            <br />
                            <span>{{ scope.row.f_cpmc }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="f_kcdj_s" label="单价" width="120" align="right" sortable />
                    <el-table-column prop="f_kcsl_s" label="数量" width="120" align="right" sortable />
                    <el-table-column prop="f_rksj_s" label="入库时间" width="160" sortable />
                    <el-table-column prop="f_dlmc" label="大类" width="120" show-overflow-tooltip />
                    <el-table-column prop="f_xlmc" label="小类" width="140" show-overflow-tooltip />
                    <el-table-column prop="f_hwck_s" label="仓库" width="100" />
                    <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                    <el-table-column />
                </vtable>
            </div>
            
            <!-- 分页 -->
            <div class="eo_page_bar">
                <el-pagination
                    background
                    @current-change="onPageChange_kcmx"
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
    import eodic from "@/inc/eodic";
    
    import vdialog from "@/components/web/vdialog.vue"
    import vtable from "@/components/web/vtable.vue"

    import tcplb from "@/views/web/ext/comm/tcplb.vue"
    import TLogic from "@/logic/TLogic";

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();
    
    type t_table = InstanceType<typeof vtable>;
    const v_table_kcmx = ref<t_table>();

    // 定义组件事件
    const emit = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    const x_cplb_list = ref<any[]>([]);

    // 查询条件
    const x_query_cplb_d = ref([0, 0]);
    const x_query_kcxx = ref("");

    const x_query_fixed = ref(false);

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    // 排序数组
    const m_orderby = ref([{
        name: "f_kcmx_id",
        order: " DESC"
    }]);
    // 排序映射
    const m_orderby_list = [
        {
            name: "f_cpbm",
            field: "`f_cpbm`"
        },
        {
            name: "f_cpmc",
            field: "`f_cpmc`"
        },
        {
            name: "f_cpsl",
            field: "`f_cpsl`"
        },
        {
            name: "f_cpdj_s",
            field: "`f_cpdj`"
        },
        {
            name: "f_rksj_s",
            field: "`f_rksj`"
        }
    ];    

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const show_dialog = async (data: any) => {
        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);
        v_table_kcmx.value?.load_list([]);
        
        x_query_fixed.value = !eocore.check_empty(data["f_cpbm"]);
        // 初始化查询条件
        x_query_kcxx.value = data["f_cpbm"];

        x_cplb_list.value = await TLogic.netload_Tree_cplb(true);
    }
    const onDialogOpen = (data: any) => {

        // 加载产品数据
        netLoad_kcmx_query(-1);
    }


    /**
     * 获取排序字符串
     */
    const getOrderByString = () => {
        let s = "";
        let df;
        for (let d of m_orderby.value) {
            df = "";
            for (let d1 of m_orderby_list) {
                if (d.name == d1.name) df = d1.field;
            }

            if (df == "") continue;

            s += "," + df + d.order;
        }

        if (s.length > 0) {
            // ORDER BY 前面必须有空格
            s = " ORDER BY " + s.substring(1);
        }
        
        return s;
    }

    /**
     * 查询产品数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_kcmx_query = async (pageIndex: number = -1) => {

        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        let orderBy = getOrderByString();

        await v_table_kcmx.value?.load_list_proc("p_kcmx_query", { 
            "v_kcbz": TLogic.kcbzCodes["正常"],
            "v_cpdl_id": x_query_cplb_d.value[0],
            "v_cpxl_id": x_query_cplb_d.value[1],
            "v_kcxx": x_query_kcxx.value,
            "v_jyzt": -1,
            "v_rklb": "",
            "v_cklb": "",
            "v_rksj1": "",
            "v_rksj2": "",
            "v_cksj1": "",
            "v_cksj2": "",
            "v_order_by": orderBy,
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
    }

    
    /**
     * 表格排序变化处理
     * @param evt 排序事件参数
     */
    const onTableSortChange = (evt: any) => {
        // 排序
        console.log(evt.column, evt.prop, evt.order);

        let dn = evt.prop;

        let ds = "";
        if (evt.order == "descending") ds = " DESC";

        // 先移除以前的
        let i = 0;
        for (let d of m_orderby.value) {
            if (d.name == dn) break;
            ++i;
        }
        if (i < m_orderby.value.length) {
            m_orderby.value.splice(i, 1);
        }

        m_orderby.value.unshift({
            name: dn,
            order: ds
        })

        console.log(m_orderby.value);
        netLoad_kcmx_query(-1);
    }

    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_kcmx = (data: any) => {

        data["f_cpzt_s"] = "";
        if (data["f_cpzt"] == 0) data["f_cpzt_s"] = "停产";
        else if (data["f_cpzt"] == 1) data["f_cpzt_s"] = "正常";

        // 调拨状态显示
        data["f_jyzt_s"] = eodic.get_dic_label("调拨状态", data["f_jyzt"]);
        
        // 格式化价格
        data["f_cpjg_s"] = eolib.fixed_num(data["f_cpjg"], 3);

        data["f_kcsl_s"] = eolib.fixed_num(data["f_kcsl"], 3);
        data["f_kcdj_s"] = eolib.fixed_num(data["f_kcdj"], 3);

        data["f_rksj_s"] = eolib.date_2_string(data["f_rksj"]);

        // 仓库显示
        data["f_hwck_s"] = eodic.get_dic_label("产品仓库", data["f_hwck"]);
    }

    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_kcmx = (n: number): number => {
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
    const onTableRowClick_kcmx = (data: any) => {
        // 点击行后的操作，如选中高亮等
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_kcmx = (pageIndex: number) => {
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
        let selectedData = v_table_kcmx.value?.get_select_data(true);
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